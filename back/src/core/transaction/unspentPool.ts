import { SignatureInput } from 'elliptic'
import Transaction from './transaction'
import { TransactionData, TransactionRow, TxIn, TxOut, UnspentTxOut, UnspentTxOutPool } from './transaction.interface'
import { Receipt } from '@core/wallet/wallet.interface'

//
//Unspent의 배열을 건드리고 싶지 않기때문에 unspentTxOuts를 readonly로 냅두고싶다. 단 푸쉬는 가능.
class Unspent {
  private readonly unspentTxOuts: UnspentTxOutPool = [] //얘를 readonly안쓰면 쉽게 가능한데 바꾸고싶지않다.
  constructor(){}
  
  //getter
  getUnspentTxPool(){
    return this.unspentTxOuts
  } // 미사용객체를 불러오고싶을떄 이거쓰면돼.

  // delete(txin: TxIn){
  //   // txout, txoutindex
  //   //배열인덱스찾기
  //   const index = this.unspentTxOuts.findIndex((utxo)=>{
  //     return utxo.txOutId === txin.txOutId && utxo.txOutIndex === txin.txOutIndex
  //   })
  //   this.unspentTxOuts.splice(index)
  // }

  //utxo를 최신화 txin은 어디서 가져와? 새로생긴 블럭에 있는 트랜잭션에서
  delete(txin: TxIn){
    const {txOutId, txOutIndex} = txin
    const index = this.unspentTxOuts.findIndex((unspentTxOut)=>{
      return unspentTxOut.txOutId === txOutId && unspentTxOut.txOutIndex === txOutIndex
    })
    if(index !== -1) this.unspentTxOuts.splice(index, 1)
  }

  create(hash: string){
    return(txout:TxOut, txOutIndex:number) => {
      const {amount, account} = txout
      this.unspentTxOuts.push({
        txOutId: hash,
        txOutIndex,
        account,
        amount,
      })
    }
  }

  //transaction하나에 대한 처리를 해결해주는
  sync(transactions: TransactionData){
    //d419d6889ad886f75051386ddcaf7e2ae53a1636b7ec3e28ec63c4d4fdd88a1f
    //a7e927c10504a252f4351d6830b2a8bc723385c55d2988027c36ab3e5f9465b2
    if(typeof transactions === 'string') return
    transactions.forEach(this.update.bind(this))
  }

  update(transaction: TransactionRow):void {
    const {txIns, txOuts, hash} = transaction
    if(!hash) throw new Error('hash가 존재하지 않습니다.')
    txOuts.forEach(this.create(hash))
    txIns.forEach(this.delete.bind(this)) //foreach에 의해서 실행되는 method이기 때문에 delete안에서의 this는 class를 바라보지않음 따라서 class를 바라보게끔 bind해주어야함.
  }

  // createUTXO(transaction: TransactionRow):void {
  //   const {hash, txOuts} = transaction
  //   if(!hash) throw new Error('hash is undefined')
  //   // TxOuts을 가지고 미사용 트랜잭션 객체를 만드는데 account,amount,txountindex가필요

  //   //미사용객체를 생성하게되면 트랜잭션의 input으로 들어온내용은삭제, output내용생성.
  //   //transaction. txin 삭제하는거
  //   transaction.txIns.forEach((v)=>this.delete(v))
  //   //transaction. txout 생성하는거

  //   const newUnspentTxOut = txOuts.map((txout:TxOut, index)=>{
  //     const unspentTxOut = new UnspentTxOut()
  //     unspentTxOut.txOutId = hash
  //     unspentTxOut.txOutIndex = index
  //     unspentTxOut.account = txout.account
  //     unspentTxOut.amount = txout.amount
  //     return unspentTxOut
  //   })

  //   this.unspentTxOuts.push(...newUnspentTxOut)
  //   // return newUnspentTxOut return필요없음(transaction이 있기 때문에 여기에 리턴이 있다면 매우낭비.. 그냥 애초에 실행할때마다 하나씩 배열에 쌓는것이 좋다.)

  //   // const index = 0
  //   // const utxo = new UnspentTxOut()
  //   // utxo.txOutId = hash
  //   // utxo.txOutIndex = index
  //   // utxo.account = txOuts[index].account
  //   // utxo.amount = txOuts[index].amount
  //   // return utxo
  // }

  //미사용객체에서 account기준으로 내껏만 뽑아오기
  me(account:string){
    console.log('this',this.unspentTxOuts);
    const myUnspantTxOuts = this.unspentTxOuts.filter((utxo) => utxo.account === account)
    console.log('myUnspantTxOuts', myUnspantTxOuts);
    return myUnspantTxOuts
  }

  getAmount(myUnspantTxOuts:UnspentTxOut[]){
    return myUnspantTxOuts.reduce((acc, utxo) => acc + utxo.amount, 0)
  }

  //미사용객체와 영수증을 비교해서 잔고를 확인하는 메서드
  isAmount(account:string, sendAmount:number){
    const myUnspantTxOuts = this.me(account)
    const totalAmount = this.getAmount(myUnspantTxOuts)
    if(totalAmount < sendAmount) return true
    return false
  }
  }


export default Unspent