import CryptoModule from '@core/crypto/crypto.module';
import { IBlock } from '../block.interface';
import { DifficultyProps, Proof, ProofOfWorkProps } from './workproof.interface';
import { BLOCK_GENERATIO_INTERVAL, DIFFICULTY_ADJUSTMENT_INTERVAL } from '@constants/block.constants';

class ProofOfWork implements Proof{
  constructor(private readonly crypto:CryptoModule){}
  //props로 ProofOfWorkProps 그려보기.
  execute(props: ProofOfWorkProps): IBlock {
    //{blockdata, adjustmentBlock} 해쉬값이 없는 데이터와 해쉬값이 있는 데이터
    const {blockData, adjustmentBlock} = props
    let block: IBlock = {...blockData, hash: ""}

    do {
      block.nonce += 1
      block.timestamp = new Date().getTime()
      const difficultyProps = this.getDifficultyProps(block, adjustmentBlock)
      block.difficulty = this.getDifficulty(difficultyProps) // 일단 0 집어넣고 이따가 method집어넣을거임.
      block.hash = this.crypto.createBlockHash(block)
    } while(!this.crypto.hashToBinary(block.hash).startsWith("0".repeat(block.difficulty)))
    //while문이 true가 될 때 까지 반복..6

     //우린 string값으로 뽑았다.
    // 연산
    // blockData.nonce= blockData.nonce + 1
    // blockData.timestamp = new Date().getTime()
    // blockData.difficulty = ? 연산이 필요.. 10번쨰블럭과 비교하는
      // 로직
    // blockData.hash = SHA256 <-- crypto hex
    // hex -> binary blockData.difficulty비교
    // binary 0이 몇개니? blockData.difficulty 값이랑 같니?
    // return blockData + hash as Iblock

    return block as IBlock
  }

  getDifficultyProps(block:IBlock, adjustmentBlock: IBlock): DifficultyProps{
    const {height, timestamp:currentTime} = block
    const {difficulty, timestamp: adjTime} = adjustmentBlock
    return {
      height,
      currentTime,
      adjTime,
      difficulty
    }
  }

  // 난이도를 생성하는..
  // 매개변수로는 블록높이
  // 이전블록의 난이도
  // 현재블록 timestamp
  // 10번째 전 timestamp
  // 매개변수가 너무 많아지니까.. 따로 빼버리자.
  getDifficulty(props: DifficultyProps): number{
    const {height, currentTime, adjTime, difficulty} = props
    if(height <= 0) throw new Error('height is 0')
    if(height < 10) return 0
    if(height < 20) return 1

    //10개의 블록을 기준, 블록생성시간 10분을 상수로 빼는것이 좋지 않을까
    if(height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0)
    return difficulty

    const timeTaken = currentTime - adjTime // 총 걸린 시간(timestamp) 3000 ~ 12000
    const timeExpected = BLOCK_GENERATIO_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL // 6000
    if(timeTaken < timeExpected/2) return difficulty +1
    if(timeTaken > timeExpected*2) return difficulty -1   
    return difficulty

    // Block 높이가 20이하일경우 체크하고싶지 않음.
    // 만들려고 하는 블럭 높이가 10의 배수가 아닐경우에는 그냥 이전블록 난이도로 설정
    // 현재 블록 생성시간과 - 10번째 블록의 생성시간 = 총 걸린시간..
    // 목표시간 1블럭당 10분이라고 쳤을 때 100분
    // 생성시간이 빨랐다 => 총걸린시간이 목표시간보다 빨랐다 -> 이전블록난이도  + 1 아니면 이전블록난이도 -1, 비슷하면? 그 기준은 어떻게 잡아 난이도 그대로..
  }
}

export default ProofOfWork