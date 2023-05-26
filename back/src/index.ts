import Block from '@core/block/block'
import ProofOfWork from '@core/block/workproof/proofOfWork'
import WorkProof from '@core/block/workproof/workproof'
import CryptoModule from '@core/crypto/crypto.module'
import DigitalSignature from '@core/wallet/digitalSignature'
import Transaction from '@core/transaction/transaction'
import Unspent from '@core/transaction/unspentPool'
import Wallet from '@core/wallet/wallet'
import Ingchain from '@core/ingchain'
import Chain from '@core/chain/chain'
import App from '@serve/app'
import P2PNetwork from '@serve/p2p'
import Message from '@serve/message'

const chain = new Chain()

const crypto = new CryptoModule()
const proofOfWork = new ProofOfWork(crypto)
const workproof = new WorkProof(proofOfWork)
const transaction = new Transaction(crypto)

const block = new Block(crypto, workproof)
const unspent = new Unspent()

const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)
const web7722 = new Ingchain(chain, block, transaction, unspent, accounts)


const {account} = accounts.create()

web7722.mineBlock(account)
web7722.mineBlock(account)
web7722.mineBlock(account)

const message = new Message(web7722)
const p2p = new P2PNetwork(message)
const app = App(web7722, p2p)

app.listen(8545, ()=>{
  console.log(`server`);
  p2p.listen(8555)
})

// const sender = accounts.create()
// const received = accounts.create()

// const receipt = web7722.accounts.receipt(received.account, 30) //Ingchain 의존성주입받은 accounts public으로수정

// web7722.mineBlock(sender.account)
// // web7722.mineBlock(sender.account)
// // web7722.mineBlock(received.account)

// web7722.sendTransaction(receipt) //lock

// web7722.mineBlock(sender.account)
// //트랜잭션 만든다음에 pool에 저장하기


// const balance1 = web7722.getBalance(sender.account) //20
// const balance2 = web7722.getBalance(received.account) //80
// console.log(balance1);
// console.log(balance2);




//a94bed34e231b0c1b19d545066b04f1283e1f00c4580379404f18c8093d7fd9e
//d8b8374e263b120bb3d1b6270cd4e438cc6120f5c5fc61b31b2a15e361d81047































