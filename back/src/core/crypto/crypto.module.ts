import { Hash } from 'types/block';
import cryptojs from 'crypto-js'
import merkle from 'merkle'
import { TransactionData, TransactionRow } from '@core/transaction/transaction.interface';
import { BlockData, BlockInfo, IBlock } from '@core/block/block.interface';
import { Receipt } from '@core/wallet/wallet.interface';

class CryptoModule {
  // SHA256
  
  //블록인포의 값이 매번 다를 수 있기때문에 항상 같은 인자를 받아서 해쉬화해야함.
  createBlockHash(data: BlockData | IBlock){
    //data -> object -> sort -> string -> SHA256
    const {
      version, height, timestamp, merkleRoot, previousHash, difficulty, nonce
    } = data

    // const value = Object.values(data).sort().join('') // 하나의 평문
    const value = `${version}${height}${timestamp}${merkleRoot}${previousHash}${difficulty}${nonce}`
    return this.SHA256(value)
  }

  createReceiptHash(receipt:Receipt){
    const {
      sender: {account, publicKey},
      received,
      amount
    } = receipt
    const message = [publicKey, received, amount].join('')
    return this.SHA256(message)
  }

  SHA256(data: string): Hash{
    const hash = cryptojs.SHA256(data).toString()
    return hash
  }
  // 00 -> 16진수(변환하기 쉬워서)
  // 0*8 0000 0000

  // hash: 'a' 해쉬가 한자리면 4비트 
  hashToBinary(hash: Hash): string{
    let binary = ''
    for(let i = 0; i<hash.length; i += 2){
      const hexByte = hash.substr(i, 2) // i를 기준으로 2글자 뽑는다. 1byte씩 가져오기위함.
      const demical = parseInt(hexByte, 16) //16진수로 했을떄 숫자가 뭘로 나오냐..
      const binaryByte = demical.toString(2).padStart(8, '0')// 무조건 8자리를 채울것이고 앞에 빈칸이 있으면 0으로 채워넣겠다.
      binary += binaryByte
    }
    return binary
  }

  merkleRoot(data: TransactionData){
    if(typeof data === 'string'){
      return merkle('sha256').sync([data]).root()
    } else if(Array.isArray(data)){
      //data -> [{hash},{hash},{hash}] -> [hash,hash,hash] 이렇게 바꾸고 싶다.
        const sync = data.filter((v: TransactionRow) => {
        if(!v.hash) return false 
        else this.isValidHash(v.hash)
        return true
        }).map(v => v.hash) as string[]
      return merkle('sha256').sync(sync).root()
    }
    // const merkledata = [] 나중에하자.
    // if(data instanceof TransactionRow){
    //   //data: transactionRow
      
    // } else {
    //   // data:string
    //   return merkle('sha256').sync([data]).root() //sha256으로 머클을 만들겠다 sync는 데이터를 동기적으로 추가하는 메서드, root() 루트 노드를 반환
    // }
  }

  isValidHash(hash: Hash): void{
    // 0~9 a~f A-F
    const hexRegExp = /^[0-9a-fA-F]{64}$/
    if(!hexRegExp.test(hash)){
      throw new Error(`hash값이 올바르지 않습니다 hash: ${hash}`)
    }
    // const hex = new RegExp('/^[0-9a-fA-F]{64}$/')
    // if(!hex.test(hash)){
    //   throw new Error(`hash값이 올바르지 않습니다 hash: ${hash}`)
    // }
  }
}

export default CryptoModule