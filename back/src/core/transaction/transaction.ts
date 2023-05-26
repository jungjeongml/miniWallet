//bitcoin은 총 발행량이 지정되어있다.
// 50btc
// 4년마다 반감기 50/2 => 25 12.5 6.25 => 언젠가 0에 가까운 숫자로 가는데.. 그럼 누가 채굴하고 노드를 돌리고?
// 50btc + transaction수수료도 받게 되어있음. 이더리움은 transaction수수료가 꽤 된다.

import { IBlock } from '@core/block/block.interface'
import {TransactionData, TransactionRow, TxIn, TxOut, UnspentTxOut } from './transaction.interface'
import { Receipt } from '@core/wallet/wallet.interface'
import CryptoModule from '@core/crypto/crypto.module'
import { SignatureInput } from 'elliptic'
import { TransactionPool } from './transaction.interface'

//비트코인은 소숫점으로 거래가 되고 있는데
// 1btc는 10^18 으로 처리 // 1이라는 값은 0.0*18+1로 표현될 수 있고 단위 이름은 사토시라고 불린다.
class Transaction {
  //반감기 기능은 안넣을꺼임. 어려움 그냥 채굴시 50btc받는걸로 구현
  private readonly REWARD = 50
  private readonly transactionPool: TransactionPool = []
  constructor(private readonly crypto: CryptoModule){}

  getPool(){
    return this.transactionPool
  }

  addPool(transaction: TransactionRow){
    this.transactionPool.push(transaction)
  }

  create(receipt: Receipt, myUnspantTxOuts: UnspentTxOut[]){
    if(!receipt.signature) throw new Error('서명이 존재하지 않습니다.')

    const [txIns, balance] = this.createInput(myUnspantTxOuts, receipt.amount, receipt.signature) 
    const txOuts = this.createOutput(receipt.received, receipt.amount, receipt.sender.account, balance)
    const transaction: TransactionRow = {
      txIns,
      txOuts,
    }

    transaction.hash = this.serializeRow(transaction)
    this.transactionPool.push(transaction)
    return transaction
  }

  //내가 가지고 있는 금액에서 보낼금액을뺐을때 0이상이경우 잔돈
  //보내는사람주소,보내금액,나의주소,나의금액
  createOutput(received:string, amount:number, sender:string,balance:number){
    const txouts:TxOut[] = []
    txouts.push({account: received, amount})
    if(balance - amount > 0){
      txouts.push({account:sender, amount:balance - amount})
    }

    const outAmount = txouts.reduce((acc, txout:TxOut)=> acc + txout.amount, 0)
    if(balance !== outAmount) throw new Error('금액 오류')
    return txouts

    // const {
    //   sender:{account},
    //   received,
    //   amount} = receipt
    //   const txOuts = []
    // 받는 사람에 대한 txout
    // const totalAmount = this.getAmount(this.me(account)) //미사용객체에서 총 잔액을 구해온 것.
    // const received_txout = this.transaction.createTxOut(received, amount)
    // txOuts.push(received_txout)
    //50 30
    // if(totalAmount - amount > 0){
      //잔액이 발생이 되었을 때
      // const sender_txout = this.transaction.createTxOut(account, totalAmount - amount)
      // txOuts.push(sender_txout)
    }
    // return txOuts

  //transaction을 만들기 위해 미사용객체에서 txinput을 구하는과정.
  //앞으로 사용할 input을 뽑는과정?
  createInput(myUnspantTxOuts:UnspentTxOut[],
    receiptAmount:number, signature: SignatureInput
  ):[TxIn[], number]{
    let targetAmount = 0

    const txins =  myUnspantTxOuts.reduce((acc,unspentTxOut: UnspentTxOut)=>{
      const {amount, txOutId, txOutIndex} = unspentTxOut
      if(targetAmount >= receiptAmount) return acc
      targetAmount += amount
      acc.push({
        txOutIndex,
        txOutId,
        signature
      })
      return acc
    },[] as TxIn[])
    return [txins, targetAmount]
  // const {
  //   sender: {account},
  //   amount //30
  // } = receipt
  // const myUnspantTxOuts = this.me(account)
  //나와 관련된 미사용객체에서 receipt.amount를 뽑아와야함
  //[{amount:10},{amount:10},{amount:10},{amount:10}]

  // let targetAmount = 0
  // let txins = []
  // for(const unspentTxOut of myUnspantTxOuts){
  //   targetAmount += unspentTxOut.amount
  //   const txin = this.transaction.createTxIn(unspentTxOut.txOutIndex, unspentTxOut.txOutId)
  //   txins.push(txin)
  //   if(targetAmount >= amount) break
  // }
  //
}

  createTxOut(account: string, amount: number): TxOut{
    // publicKey = 32byte 64글자,
    // account = publicKey의해서 생성 앞에 12byte날림. = 20byte, hex로표현하면 40글자.
    if(account.length !== 40) throw new Error('Account의 length가 맞지 않습니다.')
    const txout = new TxOut()
    txout.account = account
    txout.amount = amount
    return txout
  }

  //트랜잭션의 고유식별자를 만들기 위해 해쉬화
  serializeTxOut(txOut:TxOut): string{
    const {account, amount} = txOut
    const text = [account, amount].join('')
    return this.crypto.SHA256(text)
    //이떄의 this는 class를 가르켜야 하는데 serializeTx로 불리면 this는 undefined이다. 따라서 불러올 수 없다.해결해야함.
    //고차함수로 만들거나, 인자로 arrow함수를 넣어준다.
  }

  createTxIn(txOutIndex: number, txOutId?: string, signature?: SignatureInput): TxIn{
    const txIn = new TxIn()
    txIn.txOutIndex = txOutIndex
    txIn.txOutId = txOutId
    txIn.signature = signature
    return txIn
  }

  //트랜잭션의 고유식별자를 만들기 위해 해쉬화
  serializeTxIn(txIn:TxIn): string{
    const {txOutIndex} = txIn
    const text = [txOutIndex].join('')
    return this.crypto.SHA256(text)
  }

  //serializeRow의 reduce로직이 많이 곂치기 때문에 하나의 함수로 뺐다.
  serializeTx<T>(data: T[], callback:(item: T)=>string){
    return data.reduce((acc: string, item: T)=>{
      return acc + callback(item)
    },'') // 
  }

  serializeRow(row:TransactionRow){
    const {txIns, txOuts} = row
    // TxOut[] => TxOut을 꺼내올 수 있어야함.
    const text1 = this.serializeTx<TxOut>(txOuts, (item)=> this.serializeTxOut(item)) //this.serializeTxout은 호출이 아니라 함수 값만 사용하는거임.
    const text2 = this.serializeTx<TxIn>(txIns, (item) => this.serializeTxIn(item)) //함수값으로 넘겨 버리면 this가 달라진다.. 콜백함수로 묶어줘야 this가 class를 가르킴.
    // const txoutText = txOuts.reduce((acc: string, v:TxOut)=>{
    //   return acc + this.serializeTxOut(v)
    // }, '')
    // const txinTest = txIns.reduce((acc: string, v: TxIn)=>{
    //   return acc + this.serializeTxIn(v)
    // },'')
    return this.crypto.SHA256(text1 + text2)
  }

  createRow(txins:TxIn[], txOuts: TxOut[]){
    const transactionRow = new TransactionRow()
    transactionRow.txIns = txins
    transactionRow.txOuts = txOuts
    transactionRow.hash = this.serializeRow(transactionRow)
    return transactionRow
  }

  //코인베이스의 상위 객체 TransactionRow에 맞춰진 모양. 하위
  createCoinbase(account: string, latestBlockHeight: number){
    //화폐를 찍어내는 트랜잭션, 무조건 알아야 할 값: account
    // 마이닝
    const txin = this.createTxIn(latestBlockHeight + 1) // 높이가 3인시점에서 4인 블록을 생성할꺼니까 가장 최근꺼인 3을 넣겠다.
    const txout = this.createTxOut(account, this.REWARD)
    return this.createRow([txin], [txout]) // tx를 만드는것..
    //TransactionRow
  }

  update(transaction: TransactionRow){
    (transaction: TransactionRow)=>{
      //만약에 내 블럭data속성안에 있는 트랜잭션 해쉬값이랑 트랜잭션풀에있는 해쉬값이랑 같은 것이 존재한다면 중복값
      const findCallback = (tx:TransactionRow)=>{
        return transaction.hash === tx.hash
      }
      const index = this.transactionPool.findIndex(findCallback)
      if(index !== -1) this.transactionPool.splice(index, 1)
    }
  }

  sync(transactions:TransactionData){
    if(typeof transactions === 'string') return
    transactions.forEach(this.update.bind(this))
  }

  containTransaction(transaction:TransactionRow){
    return this.transactionPool.some((tx: TransactionRow) => tx.hash === transaction.hash)
  }
}
export default Transaction

//txout coinbase createTxin 

