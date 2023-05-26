import ProofOfStake from '@core/block/workproof/proofOfStake'
import ProofOfWork from '@core/block/workproof/proofOfWork'
import WorkProof from '@core/block/workproof/workproof'
import { Proof } from '@core/block/workproof/workproof.interface'
import CryptoModule from '@core/crypto/crypto.module'

describe('WorkProof', ()=>{
  let workProof: WorkProof
  let proof: Proof
  const crypto = new CryptoModule()
  beforeEach(()=>{
    //Proof인터페이스에게 의존성주입을 받는다.
    proof = new ProofOfWork(crypto)
    workProof = new WorkProof(proof)
  })

  describe('ProofOfWork', ()=>{
    beforeEach(()=>{
      //Proof인터페이스에게 의존성주입을 받는다.
      proof = new ProofOfWork(crypto)
      workProof = new WorkProof(proof)
    })
    it('console.log찍히는가',()=>{
      workProof.run()
    })
  })

  describe('ProofOfStake', ()=>{
    beforeEach(()=>{
      //Proof인터페이스에게 의존성주입을 받는다.
      proof = new ProofOfStake()
      workProof = new WorkProof(proof)
    })
    it('console.log찍히는가', ()=>{
      workProof.run()
    })
  })
})