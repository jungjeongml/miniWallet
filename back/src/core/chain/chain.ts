import { DIFFICULTY_ADJUSTMENT_INTERVAL, GENESIS } from '@constants/block.constants'
import { IBlock } from '@core/block/block.interface'

class Chain {
  private readonly INTERVAL:number = DIFFICULTY_ADJUSTMENT_INTERVAL //10번째 블록을 기준으로 난이도를 조절하는 변수
  private readonly chain: IBlock[] = [GENESIS]
  constructor(){}

  get(){
    return this.chain
  }

  //많이 쓰는 요소중 하나. 사용하고싶은것만 따로 구하기 위해서.
  // chain이 private이기도하고
  length(){
    return this.chain.length
  }

  public clearChain(){
    this.chain.splice(1)
  }

  latestBlock(){
    return this.chain[this.length() - 1]
  }


  addToChain(receivedBlock: IBlock){
    this.chain.push(receivedBlock)
    return this.latestBlock()
  }

  //순서대로 담겨야한다. 1,2,3,5안돼..
  isValid(){}

  //네트워크를 구현했을떄 구현
  replaceChain(){}

  getBlock(callbackFn:(block:IBlock) => boolean){
    const findBlock = this.chain.find(callbackFn)
    if (!findBlock) throw new Error("블럭을 찾을수 없습니다~")
    return findBlock
  }

  //해쉬기준으로 블럭을 찾고싶다.
  getBlockByHash(hash: string): IBlock {
    return this.getBlock((block:IBlock) => 
      block.hash === hash)
  }

  //높이를 기준으로 블럭을 가져오겠따.
  getBlockByHeight(height:number): IBlock {
    return this.getBlock((block:IBlock) =>
      block.height === height)
  }

  //10번쨰 블럭을 구하가 위함.
  // 15번이면 10번, 26번이면 20번
  getAdjustmentBlock(){
    // 17이라고 가정하고 구현
    // 10
    // 232번쨰 /10 = 23.2 = 23 * 10 = 230
    // Math.floor(height/interval) * interval
    const {height} = this.latestBlock()
    const findHeight = height < this.INTERVAL ? 1 : Math.floor(height/this.INTERVAL)*this.INTERVAL
    return this.getBlockByHeight(findHeight)
  }

  //네트워크를 구현했을떄 네트워크안에서는 객체를 스트링으로 바꾸는 형변환. 스트링을 객체로 바꾸는 형변환.
  serialize(){
    return JSON.stringify(this.chain)
  }

  deserialize(chunk: string){
    return JSON.parse(chunk)
  }
  
  public isValidChain(newBlock: IBlock, previousBlock: IBlock):boolean{
    if( newBlock.height !== previousBlock.height + 1) return false
    //0f8184413cf1edb8fb3880e7a56125bea96c05e355db29e8696a21d2e8195fd2
    //cb4471b4d6dff13bc4f4ae3ba7b41c89f2c32175d540450b790e5aa2ef19488b
    if( newBlock.previousHash !== previousBlock.hash) return false
    return true
  }

  public isValidAllChain(chain: IBlock[]){
    //제네시스블럭은 굳이 조회안할꺼임.
    for(let i = 1; i < chain.length; i++){
      const currentBlock = chain[i]
      const previousBlock = chain[i - 1]
      const isValidBlock = this.isValidChain(currentBlock, previousBlock)
      console.log('isValidBlock:', isValidBlock );
      if(!isValidBlock) return false
    }
    return true
  }
}

export default Chain

