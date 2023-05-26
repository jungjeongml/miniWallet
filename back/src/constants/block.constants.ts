import { IBlock } from 'core/block/block.interface';

export const VERSION = '1.0.0'

export const BLOCK_GENERATIO_INTERVAL = 10 * 60 // 하나의 블록을 만드는데 걸리는 시간을 기준값, 개발자 마음이기 때문에 변수로처리
export const DIFFICULTY_ADJUSTMENT_INTERVAL = 10 // 몇개의 블록사이를 기준으로 난이도를 조정할건지, 여기선 10개.

export const GENESIS: IBlock = {
  version: '1.0.0', //블록체인에 스트링값으로 박혀있는것.. 블록체인 소프트웨어의 버전을 나타냄
  height: 1, //블록의 높이, 제네시스블록의경우 항상 1
  timestamp: 1231006506, //블록이 생성된 시간을 나타냄, Unix 시간 형식
  previousHash: "0".repeat(64), //이전 블록의 해시 값, 제네시스블록은 이전 블록이 없으므로 모든 비트가 0으로 설정된 값으로 사용
  merkleRoot: "DC24B19FB7508611ACD8AD17F401753670CFD8DD1BEBEF9C875125E98D82E3D8", // transaction 들이 모인 값, 데이터 타입은 스트리이지만 해쉬값 64비트 , 머클 트리의 루트 해시 값 트랜잭션 데이터의 ㅜ무결성을 검증
  nonce: 0, //작업증명할때 필요한 값, 채굴 과정에서 사용되는 난수
  difficulty:0, // 작업증명할 때 필요한 값 , 채굴 난이도 
  hash: "84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8370", // 블록의 해시 값, 제네시스블록의 경우 블록 데이터를 모두 0으로 설정하고 해시를 계산한 값이 사용
  data: '2009년 1월 3일 더 타임스, 은행들의 두번째 구제금융을 앞두고 있는 U.K 재무장관' // string이긴한데 배열형태로 들어갈 가능성 높음, 블록에 포함되는 데이터
}
//hash merkleroot previousHash: 모두 해쉬값이다. 64bit