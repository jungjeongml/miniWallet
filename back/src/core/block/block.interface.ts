import { TransactionData } from 'core/transaction/transaction.interface'
import { Difficulty, Hash, Height, Timestamp } from 'types/block'

//먼저완성
export class BlockInfo {
  public version!: string //그냥 타입만 지정해놓고 싶어서 .. !를 붙였다. 
  public height!: Height
  public timestamp!: Timestamp
  public previousHash!: Hash
  public nonce: number = 0
  public difficulty: Difficulty = 0
 //string이 될수도 있고 객체가 될수도있고..
}

//2번쨰
export class BlockData extends BlockInfo{
  public data!: TransactionData
  public merkleRoot!: Hash
}

//3번쨰
export class IBlock extends BlockData {
  public hash!: Hash //blockinfo에서 data를 제외한 나머지로 해쉬를 만들어낼꺼임.
}