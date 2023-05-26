import {Socket} from 'net'
import { MessageData, Payload } from './network.interface';
import { IBlock } from '@core/block/block.interface';
import Ingchain from '@core/ingchain';
class Message1 {
  constructor(private readonly blockchain:Ingchain){
    
  }

  handler(socket:Socket, data:Buffer){
    console.log('헨들러 실행..')
    const {type, payload} = JSON.parse(data.toString('utf8'))
    const message = (this as any)[type](socket, payload)
    if(!message) return
    console.log(this.blockchain.chain.get());
    socket.write(message)
  }
  
  private latestBlock(payload: Payload): string | undefined{
    const message:MessageData = {
      type: 'allBlock',
      payload: this.blockchain.chain.latestBlock() 
    }
    console.log('latest실행');
    return JSON.stringify(message) 
  }
  
  private allBlock(payload: Payload):string | undefined{
    if(Array.isArray(payload)) return

    this.blockchain.block.isValidBlock(payload)
    const isValid = this.blockchain.chain.isValidChain(payload)
    if(isValid)this.blockchain.chain.addToChain(payload)
  }

}

export default Message1

