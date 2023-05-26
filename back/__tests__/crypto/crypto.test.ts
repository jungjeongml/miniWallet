import { GENESIS } from '@constants/block.constants'
import { BlockData, BlockInfo } from '@core/block/block.interface'
import CryptoModule from '@core/crypto/crypto.module'

describe('CryptoModule', ()=>{
  let cryptoModule : CryptoModule
  beforeEach(()=>{
    cryptoModule = new CryptoModule()
  })
  describe('SHA256', ()=>{
    it('SHA256에 인자값을 평문으로 해서 암호화가 되는가',()=>{
      const data = 'hello world'
      const result = cryptoModule.SHA256(data)
      expect(result.length).toBe(64)
    })
  })

  describe("createBlockHash", () => {
    it('SHA256에서 blockinfo데이터로 암호화가 진행되는가?', ()=>{
      //blockinfo를 넣기 전에 data속성을 빼기
      const blockinfo: BlockData = {
        version: GENESIS.version,
        height: GENESIS.height,
        timestamp: GENESIS.timestamp,
        previousHash: GENESIS.previousHash,
        merkleRoot: GENESIS.merkleRoot,
        nonce: GENESIS.nonce,
        difficulty: GENESIS.difficulty,
        data:'',
      }
      //hash화 할때 속성의 순서도 중요하다. 값이 같아도 객체의순서가 다르면 해쉬가 달라짐.
      const hash = cryptoModule.createBlockHash(blockinfo)
      //63f276c89f94976122ea51f5826d8d45e336e332bd5259f6deedbc2c01be62a8
      //84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8370
      expect(hash).toHaveLength(64)
    })
  })

  describe('HashtoBinary', () => {
    it('이진데이터로 잘 변경되는가', ()=>{
      const data = 'hash'
      const hash = cryptoModule.SHA256(data)
      //0abf
      const binary = cryptoModule.hashToBinary(hash) //64
      expect(binary.length).toBe(256) //4*64
    })
  })

  describe('merkleroot', ()=>{
    it('genesis 블럭에 있는 data값에서 merkleroot값구하기', ()=>{
      const merkleroot = cryptoModule.merkleRoot(GENESIS.data)
      expect(merkleroot).toHaveLength(64)
    })

    it('data값이 TransactionRow[]형태일경우 잘 생성되는가', ()=>{
      const data = [
        {hash:'84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8370'},
        {hash:'84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7de8371'}]
      const merkleroot = cryptoModule.merkleRoot(data)
      expect(merkleroot).toHaveLength(64)
    })

    it('data값이 올바르지 않을 경우 에러가 발생하는가..', ()=>{
      const data = [
        {hash:'84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7df8'},
        {hash:'84ffab55c48e36cc480e2fd4c4bb0dc5ee1bb2d41a4f2a78a1533a8bb7dw2321'}]
      expect(()=>{
        cryptoModule.merkleRoot(data)
      }).toThrowError()
    })
  })

  describe('isValidHash', ()=>{
    it('hash값이 64미만일경우', ()=>{
      const hash = '000000'
      expect(()=>{
        cryptoModule.isValidHash(hash) //callback으로 감싼이유는 에러를 터뜨리기위해서
      }).toThrowError()
    })
    it('hash값이 올바르지 않을경우', ()=>{
      const hash = '000000'
      expect(()=>{
        cryptoModule.isValidHash(hash) //callback으로 감싼이유는 에러를 터뜨리기위해서
      }).toThrowError()
    })
  })
})