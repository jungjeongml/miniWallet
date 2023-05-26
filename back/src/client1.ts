import Block from '@core/block/block';
import ProofOfWork from '@core/block/workproof/proofOfWork';
import WorkProof from '@core/block/workproof/workproof';
import Chain from '@core/chain/chain';
import CryptoModule from '@core/crypto/crypto.module';
import Ingchain from '@core/ingchain';
import Transaction from '@core/transaction/transaction';
import Unspent from '@core/transaction/unspentPool';
import DigitalSignature from '@core/wallet/digitalSignature';
import Wallet from '@core/wallet/wallet';
import Message1 from '@serve/message1';
import P2PNetwork1 from '@serve/p2p1';

const crypto = new CryptoModule()
const proofOfWork = new ProofOfWork(crypto)
const workProof = new WorkProof(proofOfWork)
const transaction = new Transaction(crypto)
const unspent = new Unspent()

const digitalSignature = new DigitalSignature(crypto)
const accounts = new Wallet(digitalSignature)

const block = new Block(crypto, workProof)
const chain = new Chain()
const justin522 = new Ingchain(chain, block, transaction, unspent, accounts)
const message1 = new Message1(justin522)
const p2p1 = new P2PNetwork1(message1)
p2p1.listen(8556)
p2p1.connect(8555, '127.0.0.1')
