import CryptoModule from '@core/crypto/crypto.module'
import DigitalSignature from '@core/wallet/digitalSignature'
// import { Receipt } from '@core/transaction/transaction.interface'
import { Receipt } from '@core/wallet/wallet.interface'

describe('디지털서명 이해하기', ()=>{
  let digitalSignature: DigitalSignature

  beforeEach(()=>{
    const crypto = new CryptoModule()
    digitalSignature = new DigitalSignature(crypto)
  })

  describe('createPrivateKey', ()=>{
    it('개인키 생성하기',()=>{
      const privateKey = digitalSignature.createPrivateKey()
      for(let i = 0; i < 101; i++){
        console.log(digitalSignature.createPrivateKey());
      }
      console.log(privateKey);
      expect(privateKey).toHaveLength(64)
    })
  })
  describe('createPublicKey', ()=>{
    it('공개키 생성하기', ()=>{
      const privateKey = digitalSignature.createPrivateKey()
      const publicKey = digitalSignature.createPublicKey(privateKey)
      console.log('publickey', publicKey);
      console.log(digitalSignature.createPublicKey(privateKey));
      expect(publicKey).toHaveLength(66) //1byte가 붙어서 66임.
    })
  })

  describe('createAccount', ()=>{
    it('계정 생성하기',()=>{
      const privateKey = digitalSignature.createPrivateKey()
      const publicKey = digitalSignature.createPublicKey(privateKey)
      const account = digitalSignature.createAccount(publicKey)
      console.log(account, publicKey);
      //226b38b281924b808076efbc35e653e0e45b1c14
      //03429c030c5e6eeee656a2a78e226b38b281924b808076efbc35e653e0e45b1c14
      expect(account).toHaveLength(40)
    })
  })

  describe('서명',()=>{
    let sender_privateKey :string
    let sender_publicKey : string
    let sender_account : string
    let received_privateKey : string
    let received_publicKey : string
    let received_account : string
    let receipt: Receipt

    beforeEach(()=>{
      sender_privateKey = digitalSignature.createPrivateKey()
      sender_publicKey = digitalSignature.createPublicKey(sender_privateKey)
      sender_account = digitalSignature.createAccount(sender_publicKey)
  
      received_privateKey = digitalSignature.createPrivateKey()
      received_publicKey = digitalSignature.createPublicKey(received_privateKey)
      received_account = digitalSignature.createAccount(received_publicKey)

      receipt = {
        sender: {
          account: sender_account,
          publicKey: sender_publicKey,
        },
        received: received_account,
        amount: 30
      }
    })

    // const receipt: Receipt = {
    //   sender: {
    //     account: 'sender_account',
    //     publicKey: 'sender_publicKey'
    //   },
    //   received: received_account,
    //   amount: 30,
    // }
    it('sign만들기', ()=>{
      const signature = digitalSignature.sign(sender_privateKey, receipt)
      console.log('sign', signature);
      // 30440220 DER
      // 0x30 DER형
      // 0x44 전체 바이트
      // 0x02 R값을 시작하는 바이트
      // 0x20 R값의 길이를 나타내는 바이트
      expect(typeof signature).toBe('object')
      expect(typeof signature.signature).not.toBe(undefined)
    })
    //서명은 스트링이 될 수도 객체가 될 수도 있다.
    it('검증', ()=>{
      const receipt2 = digitalSignature.sign(sender_privateKey, receipt)
      // 블록체인에게 receipt2를 넘겨준거임.
      // receipt2.signature = receipt2.signature + 'asdf' //하면 false
      receipt2.amount = 50
      const bool = digitalSignature.verify(receipt2)
      console.log(bool);
    })
  })
})