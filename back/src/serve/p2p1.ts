import net, {Socket} from 'net'
import { MessageData } from './network.interface';
import { IBlock } from '@core/block/block.interface';
import Message1 from './message1';

class P2PNetwork1 {
  private readonly sockets: Socket[] = []
  constructor(private readonly message1:Message1){}
  listen(port: number){
    const connection = (socket: Socket) => this.handleConnection(socket)
    const server = net.createServer(connection)
    server.listen(port)
  }

  connect(port:number, host:string){
    const socket = new net.Socket()
    const connection = () => this.handleConnection(socket)
    socket.connect(port, host, connection)
  }

  private handleConnection(socket: Socket){
    console.log(`[+] New Connection from ${socket.remoteAddress}:${socket.remotePort}`);
    this.sockets.push(socket)
    const dataCallback = (data:Buffer) => this.message1.handler(socket, data)
    socket.on('data', dataCallback)
    
    const message:MessageData = {
      type: 'latestBlock',
      payload: {} as IBlock
    }
    socket.write(JSON.stringify(message))

    const disconnect = () => this.handleDisconnect(socket) 
    socket.on('close', disconnect)
    socket.on('error', disconnect)
  }

  private handleDisconnect(socket:Socket){
    const index = this.sockets.indexOf(socket)
    if(index === -1) return
    this.sockets.splice(index, 1)
    console.log(`[-] Connection from ${socket.remoteAddress}:${socket.remotePort} closed`);
  }
}

export default P2PNetwork1