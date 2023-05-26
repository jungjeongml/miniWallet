import { GENESIS } from '@constants/block.constants'
import Block from '@core/block/block'
import { IBlock } from '@core/block/block.interface'
import WorkProof from '@core/block/workproof/workproof'
import CryptoModule from '@core/crypto/crypto.module'

describe('Block', ()=>{
  let block: Block
  let crypto: CryptoModule
  let proof: WorkProof

  beforeEach(()=>{
    crypto = new CryptoModule()
    block = new Block(crypto, proof)
  })

  describe('isValidBlock', ()=>{
    // const previousBlock = GENESIS
    let previousBlock: IBlock
    beforeEach(()=>{
      previousBlock = {...GENESIS}
    })
    it('매개변수에 넘겨받은 블럭해시값이 올바른가', ()=>{
      expect(()=>{block.isValidBlock(previousBlock)}).not.toThrowError() //반대입장을 검사하는거임
    })

    it('매개변수에 넘겨받은 블록해시값이 옳바르지 않을 경우 에러가 나오는가',()=>{
      previousBlock.hash = '0000'
      expect(()=>{
        block.isValidBlock(previousBlock)
      }).toThrowError()
    })

    it('블록해시값이 변경된적이 있는가', ()=>{
      expect(()=>{
        block.isValidBlock(previousBlock)
      }).not.toThrowError()
    })

    it('블록해시값이 올바르지 않을 때 에러가 발생이 되는가',()=>{
      previousBlock.hash = '84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8371'
      expect(()=>{
        block.isValidBlock(previousBlock)
      }).toThrowError()
    })
  })

  describe('createBlockInfo', ()=>{
    const previousBlock = GENESIS //제네시스블럭을 이전블럭이라고 생각하고 테스트
    it('createBlock 메서드가 존재하는가', ()=>{
      expect(typeof block.createBlockInfo).toBe('function')
    })

    it('createBlock BlockInfo가 잘 만들어지는가', ()=>{
      const newBlock = block.createBlockInfo(previousBlock)
      expect(typeof newBlock).toBe('object')
    })

    it('createBlock에서 BlockInfo 내용이 올바른가', ()=>{
      const newBlock = block.createBlockInfo(previousBlock)
      expect(newBlock.previousHash).toBe(previousBlock.hash)
      expect(newBlock.height).toBe(previousBlock.height + 1)
    })
  })
})