import Block from './block/block';
import { IBlock } from './block/block.interface';
import Chain from './chain/chain';
import Transaction from './transaction/transaction';
import { TransactionRow } from './transaction/transaction.interface';
import Unspent from './transaction/unspentPool';
import Wallet from './wallet/wallet';
import { Receipt } from './wallet/wallet.interface';

class Ingchain {
  constructor(
    public readonly chain: Chain,
    public readonly block: Block,
    private readonly transaction: Transaction,
    private readonly unspent: Unspent,
    public readonly accounts: Wallet
  ){}

  //블록을 만들때 필요한건 코인베이스를 만들 때 필요한 account가 아닐까
  mineBlock(account:string){
    //
    const latestBlock = this.chain.latestBlock()
    const adjustmentBlock = this.chain.getAdjustmentBlock()

    const transactions = this.transaction.getPool() //트랜잭션내용에서 풀내용을 반환해주는 메서드
    
    const coinbase = this.transaction.createCoinbase(account, latestBlock.height)
    
    const newBlock = this.block.mine(latestBlock, [coinbase, ...transactions], adjustmentBlock)
    
    this.chain.addToChain(newBlock)

    //Block생성이되었다는건 block.data transactionData 가 있다는것.
    
    this.unspent.sync(newBlock.data)
    this.transaction.sync(newBlock.data)
    return this.chain.latestBlock()
  }

  //영수증 검증을 해야함
  //클라이언트가 노드에게 영수증을 줬을때 실행되는 함수
  sendTransaction(receipt: Receipt){
    const isVerify = this.accounts.verify(receipt)
    if(!isVerify) throw Error('옳바르지 않은 영수증입니다.')

    const myUnspantTxOuts = this.unspent.me(receipt.sender.account)
    const balance = this.getBalance(receipt.sender.account)
    if(balance < receipt.amount) throw Error('잔액이 부족합니다.')

    //ing체인을통해서 넘겨주자.
    const tx = this.transaction.create(receipt, myUnspantTxOuts)
    // this.unspent.update(tx)
    // this.transaction.update(tx)
    return tx
  }
  getAccountnBalance(account: string){
    const balance = this.getBalance(account)
    // const myUnspantTxOuts = this.unspent.me(account)
    // const balance = this.unspent.getAmount(myUnspantTxOuts)
    return {account, balance}
  }
  getSignAndTransaction({sender, received, amount}:{ sender: string; received: string; amount: number }){
    const {publicKey, privateKey} = this.accounts.get(sender)
    console.log('p',publicKey, 'r',privateKey);
    const receipt = this.accounts.sign({
      sender:{
        account:sender,
        publicKey,
      },
      received,
      amount,
    }, privateKey)
    console.log('receipt:',receipt);
    const tx = this.sendTransaction(receipt)
    console.log('tx',tx);
    return tx
  }
  //12:30
  getBalance(account: string){
    console.log('account:',account);
    const myUnspantTxOuts = this.unspent.me(account)
    
    const balance = this.unspent.getAmount(myUnspantTxOuts)
    return balance //utxo에서 한사람에대한 정보만 가져와서 총 잔액을 가져온 것.
  }

  //다른사람의 블럭을 받았다. 이것을 체인에 낄지 말지..
  public addBlock(receivedBlock: IBlock){
    //받은 블럭 데이터 자체가 올바른건지..
    this.block.isValidBlock(receivedBlock)

    //내 마지막 블럭과 받은 블럭의 내용이 올바르게 되어있는지
    const isValid = this.chain.isValidChain(receivedBlock, this.chain.latestBlock())
    console.log('isValid:', isValid);
    //내 체인에 넣을 수 있는 상황이면 추가하고 아니면 말고
    if(!isValid) return false
    this.chain.addToChain(receivedBlock)
    console.log('block내용이 추가되었습니다.');
    
    this.unspent.sync(receivedBlock.data)
    return true
  }


  public replaceChain(receivedChain: IBlock[]): void{
    if(receivedChain.length === 1) return //전체체인을 검증하기전에 먼저 해야할일: 제네시스만 있을 때

    //전체 체인을 검증, 체인의 높이가 블럭의 갯수랑 잘 맞는지,이전해쉬랑 다음블럭해쉬랑 같은지, 해쉬값들이 변한것이 없는지.
    const isvalidChain = this.chain.isValidAllChain(receivedChain)
    if(!isvalidChain) return

    const cclb = this.chain.latestBlock() //current
    const rclb = receivedChain[receivedChain.length - 1] //receive

    if(rclb.height <= cclb.height){
      console.log('자신의 블록이 길거나 같습니다');
      return
    }

    // 체인 교체, 체인의 높이가 작은 쪽에서 제네시스 블럭만 남기고 다 제거
    this.chain.clearChain()

    //제네시스블럭 없애고 돌리기.
    receivedChain.shift()

    //receivedChain.forEach(this.chain.addToChain.bind(this.chain))

    receivedChain.forEach((block) => {
      this.chain.addToChain(block)
      this.unspent.sync(block.data)
    })
    console.log('체인이 변경되었씁니다.');
  }

  public replaceTransaction(receivedTransaction: TransactionRow){
    //받은 트랜잭션 구현하지않을꺼임..txout과 in을 뽑아서 새롭게 만든 해쉬값과 기존의 해쉬값을 비교하는 과정 생략

    //이 트랜잭션 내용이 나의 풀에 있는 것인가? 검증할 수 있는 메소드를 구현하자(transaction.ts)
    const withTransaction = this.transaction.containTransaction(receivedTransaction)
    if(withTransaction) return

    this.transaction.addPool(receivedTransaction)
    console.log(`transaction : ${receivedTransaction.hash} 내용이 추가되었습니다.`);
    
    //만약에 없다면 풀에 푸쉬하고
    //없으면 return
  }
}

export default Ingchain