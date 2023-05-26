import DigitalSignature from './digitalSignature'
import { Accounts, Receipt } from './wallet.interface'

//영수증을 만들어주는 곳
//개인을 기준으로 관리.
class Wallet {
  public readonly accounts: Accounts[] = [] //저장하는 형태 잘 기억해두자.
  constructor(private readonly digitalSignature: DigitalSignature){}
  createOnlyAccount(){
    const privateKey = this.digitalSignature.createPrivateKey()
    const publicKey = this.digitalSignature.createPublicKey(privateKey)
    const account = this.digitalSignature.createAccount(publicKey)
    const accounts: Accounts = {
      account,
      publicKey,
      privateKey
    }
    this.accounts.push(accounts)
    return accounts
  }

  //wallet을 만드는 메서드
  create():Accounts {
    const privateKey = this.digitalSignature.createPrivateKey()
    const publicKey = this.digitalSignature.createPublicKey(privateKey)
    const account = this.digitalSignature.createAccount(publicKey)

    const accounts: Accounts = {
      account,
      publicKey,
      privateKey
    }
    this.accounts.push(accounts)
    return accounts
  } 


  //기존에 갖고 있던 privateKey가 있늗네 acccount값을 가지고 오고 싶을 때 
  set(privateKey:string){
    const publicKey = this.digitalSignature.createPublicKey(privateKey)
    const account = this.digitalSignature.createAccount(publicKey)
    const accounts: Accounts = {
      account,
      publicKey,
      privateKey
    }
    this.accounts.push(accounts)
    return accounts
  }

  //민감한정보는 빼고 보여주기, privatekey,publickey제외.
  getAccounts(){
    const accounts = this.accounts.map(v => v.account)
    return accounts
  }

  get(account: string): Accounts {
    return this.accounts.filter((v) => v.account === account)[0]
  }
  //private이기 때문에 인스턴스에서 접근불가. 사용자에게 쉽게 보여주지 않겠다..account가지고privatekey구하기
  private getPrivate(account:string):string{
    return this.accounts.filter(v=> v.account === account)[0].account
  } 

  //내가 누구에게 얼마를 줄건가 써야함.
  //receipt 메서드를 사용할떄에는 보내는 사람의 계정이 이미 있을거다.
  //private키가 있을 때와 없을 떄도 해줄 수 있다.
  receipt(received:string, amount:number){
    const {account, publicKey, privateKey} = this.accounts[0] //0번을 뽑은 이유는 그냥 default값정도의 의미.
    const sender = {
      // account: this.accounts[0].account,
      // publicKey:this.accounts[0].publicKey,
      account,
      publicKey
    }
    // const receipt:Receipt = {
    //   sender,
    //   received,
    //   amount,
    // }


    //영수증의 서명이 없을수도 있어서 처리해줘야함.
    const receipt = this.digitalSignature.sign(privateKey, {sender,
      received,
      amount,})
      return receipt
  }

  sign(receipt: Receipt, privateKey: string){
    return this.digitalSignature.sign(privateKey, receipt)
  }
  
  verify(receipt: Receipt): boolean{
    return this.digitalSignature.verify(receipt)
  }
}


export default Wallet