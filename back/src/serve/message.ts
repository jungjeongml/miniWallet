import Ingchain from '@core/ingchain';
import {Socket} from 'net'
import { MessageData, Payload } from './network.interface';
import { TransactionRow } from '@core/transaction/transaction.interface';
import { IBlock } from '@core/block/block.interface';
class Message {
  constructor(private readonly blockchain: Ingchain){}

  //중앙처리 같은 느낌 latestBlock,allBlock에서는 로직만 구현
  handler(type: string, payload: Payload){
    try{
      const message = (this as any)[type](payload) //;을 앞에 붙여야한다. if문보다 효과적.
      
      return message
      // if(!message) return
      // console.log(this.blockchain.chain.get());
      // socket.write(message)
    }catch(e){
      return
    }
  }

  //메세지를 받은 사람이 호출,  얘를 구현하려면 chain을 가져와야함.
  private latestBlock(payload:Payload): string | undefined{
    console.log('latestBLock');
    // const message: MessageData = {
    //   type: 'allBlock', //latest블록으로 하면 무한루프에 빠짐.. 잘 생각해봐
    //   payload: this.blockchain.chain.latestBlock()
    // }
    return this.getAllBlockMessage()
  } 

  private allBlock(payload: Payload): string | undefined{
    console.log('allBlock');
    //payload에서 받는 블럭에서 내체인과 검증  
    console.log('payload:', payload);
    if(Array.isArray(payload)) return
    console.log('end2');

    if(payload instanceof TransactionRow) return

    const result = this.blockchain.addBlock(payload)

    if(result) return //addblock을 했으면 이대로 끝내고
    return this.getReceivedChainMessage() //addblock을 하지 못했으면 요청하는거임.
    
    // //블럭이 올바른가?
    // this.blockchain.block.isValidBlock(payload)

    // //체인에 넣을 수 있는가?
    // const isValid = this.blockchain.chain.isValidChain(payload)
    // if(!isValid) {
    //   //블럭 추가하고 끝내면 됨.
    //   this.blockchain.chain.addToChain(payload)
    //   console.log(isValid);
    // }
  }

  //얘는 최후의 단계, return이 필요없음, 
  //블럭의 sync를 맞추기 위해선 3단계 1.latestblock던지고 2.allblock던지고 3.receivedChain던지고.

  private receivedChain(payload: Payload){
    // IBlock[] payload는 chain
    console.log('receivedChain');

    //우리는 chain을 받아야 하니 배열 형태를 받아야 하기 때문에 배열이 아닐경우 return
    if(!Array.isArray(payload)) return

    this.blockchain.replaceChain(payload)
  }

  private receivedTransaction(payload:Payload){
    if(Array.isArray(payload)) return
    if(payload instanceof IBlock) return

    console.log('업데이트: 트랜잭션 내용이 추가되었습니다. peer들에게 전달합니다.');
    this.blockchain.replaceTransaction(payload)

    return this.getReceivedTransactionMessage(payload)
  }

  getLatestBlockMessage(){
    return JSON.stringify({
      type:'latestBlock',
      payload:{},
    } as MessageData)
  }

  getAllBlockMessage(){
    console.log('afterLatestBlock');
    return JSON.stringify({
      type:"allBlock",
      payload:this.blockchain.chain.latestBlock(),
    } as MessageData)
  }

  getReceivedChainMessage(){
    return JSON.stringify({
      type:"receivedChain",
      payload: this.blockchain.chain.get(), // 모든 체인을 가져옴..
    } as MessageData)
  }

  getReceivedTransactionMessage(receivedTransaction: TransactionRow){
    return JSON.stringify({
      type: "receivedTransaction",
      payload: {}
    } as MessageData)
  }
}
export default Message