import { SignatureInput } from 'elliptic'

export class TxIn {
  txOutId?: string
  txOutIndex!:number
  signature?: SignatureInput
}

export class TxOut {
  account!: string 
  amount!: number
}

/**
 * 영수증을 가지고 처음만들수 있는것은 txOut
 * txinput을 만들때 고민이 되는 부분이 있다.
 */
export class UnspentTxOut {
  txOutId!: string
  txOutIndex!:number
  account!: string
  amount!: number
} //미사용 객체

export class TransactionRow { //트랜잭션임
  txIns!: TxIn[] //객체가 여러개 담길 수 있어서
  txOuts!:TxOut[] //객체가 여러개 담길 수 있어서
  hash?: string // Transaction 에 대한 고유 식별자인데 어떤 기준으로 만드는 것이 좋을까? txins와 txout으로 해쉬를 만들면 안에 내용들이 바뀌었는지 체크도 할 수 있다.
} //얘가 트랜잭션임 인풋과 아웃풋에 대한 인터페이스 설계부터 진행하자
export type TransactionData = string | TransactionRow[] //트랜잭션은 여러개이기 떄문에 배열로 표현하는 것이 좋다.
export type UnspentTxOutPool = UnspentTxOut[] //미사용객체들
export type TransactionPool = TransactionRow[] //트랜잭션들

/* 내가 50btc를 들고있고 만수에게 20btc를 준다고 했을 때
TxOut {
  account:만수,
  amount:20
} 으로 TxOut을 설정할 수 있고
TransactionRow{
  txins:[]
  txouts:[{
    account:만수,
    amount:20
  }],
  hash:0x....
} 으로 트랜잭션에 담길 수 있겠다. 여기서 내가 50btc를 들고있다는 정보는 어디서 가져올까?
- 어딘가의 트랜잭션에 내가 50btc를 가지고 있다는 것이 기록되어 있을 것이고 그것은 TransactionRow의 txouts속성에 담겨있을 것이다.
someWhereTransactionRow{
  txins:[],
  txouts:[{
    account:정민,
    amount:50,
    txOutIndex:1
  }],
  hash:00001
}
라는 객체가 있을 것이다.
txins는 결국 txouts을 가지고 만든것이다. 그러면 저 someWhereTransactionRow를 어떻게 찾아와서 가져올까? 고유한식별자가 있는데 예시로 index를 참조한다.
TransactionRow{
  txins:[{
    txOutIndex: 1 {정민:50btc}
  }]
  txouts:[{
    account:만수,
    amount:20btc
  },{
    account:정민,
    amount:30btc
  }],
  hash:0x....
}
  {
    account:정민,
    amount:30btc
  } 라는 나의 btc가 얼마나 남았는지에 대한 객체생성
  그렇다면 여기서 txins는 하나의 객체로만 존재할까? 아니다. 여러개 있을 수 있따. 왜냐하면
  내가 150btc가 있을 때 이 150btc는 한번에 150btc를 받은게 아닌 50btc로 3번의 마이닝을 통해 받았다면 3개의 txouts가 존재한다는 것이고
  여기서 70btc를 만수에게 줄떄 150btc에서 처리하는게 아니라 50btc,50btc 2개를 사용해서 70btc를 주는 처리를 해야한다. 이렇게 되면 txins에는 2개의 객체가 필요할 것이다.
  따라서 txinputs는 여러개일수있음. 따라서 txins txouts는 배열이여야 한다.
*/
