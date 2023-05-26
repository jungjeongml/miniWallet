import Wallet from '@core/wallet/wallet'
import Ingchain from '@core/ingchain'
import App from '@serve/app1'
import DigitalSignature from '@core/wallet/digitalSignature'
import CryptoModule from '@core/crypto/crypto.module'
import Unspent from '@core/transaction/unspentPool'
import Block from '@core/block/block'
import WorkProof from '@core/block/workproof/workproof'
import ProofOfWork from '@core/block/workproof/proofOfWork'
import Chain from '@core/chain/chain'
import Transaction from '@core/transaction/transaction'
import P2PNetwork1 from '@serve/p2p1'
import Message1 from '@serve/message1'

const chain = new Chain 
const crypto = new CryptoModule()
const proofOfWork = new ProofOfWork(crypto)
const workProof = new WorkProof(proofOfWork)
const block = new Block(crypto, workProof)
const unspent = new Unspent()
const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)
const transaction = new Transaction(crypto)

const justin522 = new Ingchain(chain, block, transaction, unspent, accounts)

const app = App(justin522)
// app.listen(8540, ()=>{
//   console.log(`server start 8540`);
// })
const {account} = accounts.create()
justin522.mineBlock(account)
const message1 = new Message1(justin522)
const p2p1 = new P2PNetwork1(message1)
p2p1.listen(8555)
