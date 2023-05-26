
import { IBlock } from '../block.interface';
import { Proof } from './workproof.interface';

class ProofOfStake implements Proof{
  execute(): IBlock {
    // throw new Error('Method not implemented.');
    console.log('pos');
    return {} as IBlock
  }
}

export default ProofOfStake