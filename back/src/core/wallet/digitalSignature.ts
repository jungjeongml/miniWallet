import { randomBytes } from "crypto"
// npm install elliptic 개인키를 공개키로 바꾸기 위함
import elliptic, { SignatureInput } from "elliptic"
import { Receipt } from './wallet.interface'
import CryptoModule from '@core/crypto/crypto.module'

//elliptic라이브러리는 node.js 및 브라우저에서 사용할 수 있는 암호화 라이브러리, 타원 곡선 암호화 알고리즘 구현
new elliptic.ec('secp256k1')

// 서명,검증 둘다 인자값으로 평문이 필요함.
class DigitalSignature {
  // 개인키,공개키 만들기
  private readonly ec = new elliptic.ec("secp256k1")

  constructor(private readonly crypto: CryptoModule){}
  
  createPrivateKey(){
    return randomBytes(32).toString('hex')
  }

  createPublicKey(privateKey: string){
    const keyPair = this.ec.keyFromPrivate(privateKey) //privatekey를 객체화 시켰다.
    const publicKey = keyPair.getPublic().encode('hex',true) // 32byte + 1byte(암호화를 사용했다는 의미정도.. 서명할때에 필요하기 떄문에 남겨둠.)
    return publicKey //66글자
  }

  //13byte줄여야함
  createAccount(publicKey: string){
    const buffer = Buffer.from(publicKey)
    const account = buffer.slice(26).toString()
    return account
  }

  //서명 평문이 필요함. 데이터와 개인키를 가지고..=영수증
  //영수증이 필요하기 때문에 영수증에 대한 인터페이스가 필요하다.
  sign(privateKey:string, receipt:Receipt): Receipt{
    const keyPair = this.ec.keyFromPrivate(privateKey) //객체로 만들어줌,keyPair객체를 반환
    const receiptHash = this.crypto.createReceiptHash(receipt)
    const signature = keyPair.sign(receiptHash,'hex').toDER('hex') //hex값으로 서명데이터가만들어짐. type:string receipt 평문 제작해야함.
    receipt.signature = signature
    return receipt
  }
  
  //검증 receipt는 객체인데 값들을 뽑아서 string으로 만들어야한다.
  verify(receipt: Receipt): boolean{
    //공개키 서명 평문
    const {sender:{publicKey}, signature} = receipt
    if(!publicKey || !signature) throw new Error('receipt 내용이 옳바르지 않습니다.')
    const receiptHash = this.crypto.createReceiptHash(receipt) //평문만들기
    return this.ec.verify(receiptHash, signature, this.ec.keyFromPublic(publicKey, 'hex'))
  }
}

export default DigitalSignature