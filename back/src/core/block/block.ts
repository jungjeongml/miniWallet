import { VERSION } from '@constants/block.constants';
import { BlockData, BlockInfo, IBlock } from './block.interface';
import CryptoModule from '@core/crypto/crypto.module';
import { TransactionData, TransactionRow } from '@core/transaction/transaction.interface';
import WorkProof from './workproof/workproof';

class Block {
  //09:45
  constructor(private readonly crypto: CryptoModule, private readonly workProof: WorkProof){}

    //0427일createBlock()
    //adjustmentBlock는 이미 해쉬를 들고있음 따라서 type은 IBlock
  //10번째 블럭의 정보가 필요한데 10번쨰 블럭과 현재블럭과 시간차이를 계산해서 빠르게 만들고 있으면 난이도를 높이는 방식
  mine(previousBlock: IBlock, data: TransactionData, adjustmentBlock: IBlock){ 
    const blockData = this.createBlockData(previousBlock, data) //데이터를 받아옴
    //로직(작업증명) 최근에 이더리움이 작업방식을 바꿈, 블럭을 만들 수 있는 사람인지..판단하는것이 작업증명, POW, POS, POA .. POW로 할꺼임.
    //OOP 전략패턴 passport라이브러리가 예시..
    //block hash만드는 것이 블럭생성
    // block hash를 만들 때 조건 hex -> binary 앞에 0 몇개 붙었는가?
    // 블록생성시간 기준으로 하나당 10분 , 몇번째 블록이랑 비교할 것 인가? 10번쨰 블록으로 할꺼임. 11번째 블록에서 난이도를 조정할 것임.(up or down)
    const newBlock = this.workProof.run(blockData, adjustmentBlock)
    return newBlock
  }

  isValidBlock(block: IBlock){
    this.crypto.isValidHash(block.hash)
    const validHash = this.crypto.createBlockHash(block)
    if(validHash !== block.hash) throw new Error(`블럭 해시값이 옳바르지 않습니다 hash: ${validHash}, ${block.hash}`)
  }

  //blockdata얻으려면 createBlockInfo실행 createBlockData()실행
  createBlockData(previousBlock:IBlock, data: TransactionData): BlockData{
    //block데이터를 만들기 위해선 info가 필요하다.
    // if(data instanceof String){
    // } else if(Array.isArray(data)){} transactiondata는 머클루트를 만드는데 필요해서 여기에다가 분기처리하기는 좀 그럼
    const blockinfo = this.createBlockInfo(previousBlock)
    return {
      ...blockinfo,
      merkleRoot:this.crypto.merkleRoot(data),
      data,
    } as BlockData
  }

  //블럭검증이라 함은 해쉬에 대한 검증.
  //2번쨰 블럭을 만들기 위한 함수, previousBlock hash값이 유효한값인지 체크해야한다. merkleRoot도 체크해야함. 머클루트가 다르면 데이터가 조작되었다는뜻..
  //머클루트가 바뀌면 해쉬도 바뀌었다는 뜻이라.. 딱 해쉬만 검사해주면됨.
  createBlockInfo(previousBlock: IBlock): BlockInfo{
    // const blockInfo: BlockInfo = {
    //   version: VERSION,
    //   height: previousBlock.height + 1,
    //   timestamp: new Date().getTime(),
    //   previousHash: previousBlock.hash,
    //   nonce: 0,
    //   difficulty: 0
    // }
    this.isValidBlock(previousBlock) //이전블록이 정확한지 확인하고..
    const blockInfo = new BlockInfo() // 메서드가 들어가 있거나 할떄 이런방법도 나쁘지 않음. 가독성에 있어서, 객체의 순서가 바뀌지 않는다. default값을 넣어줄 수 있다.
    blockInfo.version = VERSION
    blockInfo.height = previousBlock.height + 1
    blockInfo.timestamp = new Date().getTime()
    blockInfo.previousHash = previousBlock.hash
    return blockInfo
  } //이전블럭에 대한 정보를 알아여한다.
}

export default Block