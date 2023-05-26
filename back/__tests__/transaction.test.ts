import CryptoModule from '@core/crypto/crypto.module'
import Transaction from '@core/transaction/transaction'

describe('Transaction', ()=>{
  let transaction: Transaction
  let crypto: CryptoModule

  beforeEach(()=>{
    crypto = new CryptoModule()
    transaction = new Transaction(crypto)
  })
  
  describe('createTxOut', ()=>{
    const account = '0'.repeat(40)

    it('TxOut 생성하기', ()=>{
      const amount = 50
      const txout = transaction.createTxOut(account, 50)
      expect (txout.account).toBe(account)
      expect(txout.amount).toBe(amount)
    })

    it('TxOut account 값이 이상할 경우', ()=>{
      const account = '0'.repeat(39)
      const amount = 59
      expect(()=>{
        transaction.createTxOut(account, amount)
      }).toThrowError()
    }) //에러가 나야 성공하는 거임.

  })

  describe('createTxIn',()=>{
    const txOutIndex = 2
    it('txIn 생성하기', ()=>{
      const txin = transaction.createTxIn(txOutIndex)
      console.log(txin);
      expect(txin.txOutIndex).toBe(txOutIndex)
    })
  })

  describe('createRow', ()=>{
    it('transactionRow 만들기', ()=>{
      const txOutIndex = 2
      const txin = transaction.createTxIn(txOutIndex)
      const account = '0'.repeat(40)
      const amount = 50
      const txout = transaction.createTxOut(account, amount)
      const row = transaction.createRow([txin,txin,txin],[txout])
      console.log(row);
      expect(row.txIns).toStrictEqual([txin, txin, txin]) //값은 같아도 참조하는 주소가 다르기때문에 false로 판단을 하게 된다. 따라서 string값으로 바꾸고 값자체만을 비교하는 로직.
      expect(row.txOuts).toStrictEqual([txout])
      transaction.serializeRow(row)
    })
    it('매개변수내용이 옳바르지 않을 때 ', ()=>{
      const row = transaction.createRow([],[]) //txin, txout이 빈배열일 때 에러처리를 하면서 테스트코드를 작성해나가자.
    })
  })
})