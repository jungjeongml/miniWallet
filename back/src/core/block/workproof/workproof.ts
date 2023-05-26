import { BlockData, IBlock } from '../block.interface';
import ProofOfStake from './proofOfStake';
import ProofOfWork from './proofOfWork';
import { Proof, ProofProps } from './workproof.interface';


class WorkProof {
  constructor(private readonly proof: Proof){}
  run(blockData: BlockData, adjustmentBlock: IBlock){
    const props: ProofProps = {
      blockData,
      adjustmentBlock
    }
    return this.proof.execute(props)
  }
}

//const proof = new ProofOfWork()
// const work = new ProofOfStake
//new WorkProof(proof) //pow pos 어떤거든 필요한걸로 증명할 수 있음.

export default WorkProof