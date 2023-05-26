import { SignatureInput } from 'elliptic'

export class Sender {
  publicKey?: string
  account!: string
}

export class Receipt {
  sender!: Sender
  received!: string
  amount!: number
  signature?: SignatureInput //암호화 진행 라이브러리안에있다. //타입떄문에 맞춘거임.
}

export class Accounts {
  privateKey!: string
  publicKey!: string
  account!: string
}