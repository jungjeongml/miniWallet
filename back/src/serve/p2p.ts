import net,{Socket} from "net"
import { MessageData, Payload } from './network.interface';
import { IBlock } from '@core/block/block.interface';
import Message from './message';

class P2PNetwork {
  public readonly sockets: Socket[] = []
  constructor(public readonly message: Message){}

  //서버측으로 대기모드를 만들 때 server측코드
  public listen(port: number){
    //상대방에대한 정보가 socket에 담겨져있고
    console.log('hi');
    const connection = (socket: Socket) => this.handleConnection(socket)
    const server = net.createServer(connection)
    server.listen(port) //대기를 하겠다.
  }

  //대기하는 서버에게 요청을 날리는 메서드 client측 코드
  public connect(port:number, host: string){
    const socket = new net.Socket()
    console.log('hello');
    //여기서 소켓에 대한 정보가 채워지는것임.
    const connection = ()=> this.handleConnection(socket)
    socket.connect(port, host, connection)
  }

  private messageHandler(socket:Socket){
    const datacallback = (data:Buffer) => {
      try{
        const {type, payload} = JSON.parse(data.toString('utf8'))
        console.log('type:', type);
        const message = this.message.handler(type, payload)
        console.log('message:', message);
        if(!message) return
        
        if(type === 'receivedTransacion'){
          this.broadcast(message)
        } else {
          //socket.write의 타입은 boolean이다. true면 buffer가 가득참, false면 널널함.
          if(socket.write(message)){
            console.log('소켓 버퍼가 가득차서 드레인 이벤트를 기다리고 있습니다');
            //버퍼가 가득차면('drain') 한번만 발동되는 함수 once
            socket.once('drain', () => {
              console.log(`소켓 버퍼가 고갈되어 매세지를 다시 보냅니다.`);
              datacallback(data)
            })
            console.log('last');
          }
        }
      } catch(e){
        let regex = /\{"type":"(.*?)","payload":(\{(.*?)\})?\}/g
        let matches = [] as MessageData[]
        let match

        while ((match = regex.exec(data.toString("utf8"))) !== null) {
            let type = match[1]
            let payload: Payload = match[3] ? JSON.parse(match[3]) : {}
            matches.push({ type, payload } as MessageData)
        }
        console.log(`result : ${matches[0]}`)
        datacallback(Buffer.from(JSON.stringify(matches[0])))
      }
    }
    socket.on('data',datacallback)
    console.log(2);         
  }        

  public broadcast(message:string){
    return this.sockets.forEach(socket => socket.write(message))
  }

  //필수적으로 사용해야하는 변수 Socket
  private handleConnection(socket: Socket){
    console.log(`[+] New Connection from ${socket.remoteAddress}:${socket.remotePort}`);
    //broadcast
    this.sockets.push(socket)
    
    //하드코딩, 코드 빠질꺼임 나중에 이부분수정
    console.log(1);
    this.messageHandler(socket) //2
    console.log(3);

    const message:MessageData = {
      type: 'latestBlock', //얘는 그냥 요청데이터 처음에 데이터를 가져올 때 뿐만 아니라 수시로 주고 받을 수 있는 데이터
      payload: {} as IBlock
    }
    console.log(4);
    socket.write(JSON.stringify(message)) //서로에게 보낸것
    console.log(5);
    const disconnect = () => this.handleDisconnect(socket)
    socket.on('close', disconnect)
    socket.on('error', disconnect)
  }

  private handleDisconnect(socket: Socket){
    const index = this.sockets.indexOf(socket)
    if(index === -1) return
    this.sockets.splice(index, 1)
    console.log(`[-] Connection from ${socket.remoteAddress}:${socket.remotePort} closed`);
  }
}

export default P2PNetwork