import P2PNetwork from '@serve/p2p';
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

const message = new Message(web7722)
const p2p = new P2PNetwork(message)
const app = App(web7722, p2p)
p2p.listen(8556) //서버측에서 필요한 포트임.

const {account} = accounts.create()
web7722.mineBlock(account)
p2p.connect(8555, '127.0.0.1') //상대방의 포트번호를 적어야함.