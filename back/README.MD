# Bitcoin
비트코인을 배우는 이유는 블록체인생태계를 이해하기 위함.
백서 ?? 를 읽으면 도움이 될  수 있음.
비트코인을 구현

1. TCP
2. 비트단위의 연산
3. 시간이 부족함.. 코어개발을 하기에는

개인대 개인이 금융기관을 거치지 않고 온라인 결제를 실현
> 전자 서명
> 이중지불을 막음
  막기위한 솔루션이 작업증명

거래 <-- 흐름을 잘 알아야함. transaction>
## 암호화
`asdf` -> 대칭키 비대칭키 복호화 등등 용어에 대해서 잘 알아야함. -> sha256 -> 32byte
byte, bit, 16진수, 2진수s 

1. typescript 설정
```sh
npm init -y
npm install -D typescript tsc-alias ts-node tsconfig/paths nodemon
```


2. jest 설정 // 소스코드가 엄청 길기 때문에 흐름을 읽는게 중요하고 테스트코드를 작성할 것이다. 
  jest 는 프레임워크 테스트코드를 작성하기위한 라이브러리를 모아놓은것. fb애들이 만듬.
  기본설정이 브라우저이기 떄문에 nodejs 환경으로 바꿔줘야함.
  ```sh
  npm i -D jest @types/jest(인터페이스에 대한 타입들을 모아놓음.) ts-jest
  ```
  ex: const exporess: application = require('express') 얘네를 모아놓은거임. @types/jest
  sample.test.ts 는 npx jest로 실행해야하는데 이 파일을 실행할때에는 앞에 jest를 붙여서 실행해야한다.
  -> package.json에서 script부분에 "test":"jest"


2교시
tdd를 하기 위해서 Jest를 쓰지만 막상 연관이없어보인다 그래서 jest가 어떻게 구성되어있는지를 먼저 파악해보자.
sample.test.ts를 실행하기 위해선 npx jest
jest는 어떤 프레임워크이긴 하지만 실행기이다.
sample.test.ts를 어떻게 알고 jest가 얘를 실행시켜줄까
tsc명령어가 너무 많으니까 tsconfig.json을 파일로 따로 만든것처럼.. 
jest옵션중에 디폴트값이 [filename].test.확장자를 찾아서 실행시켜준다.
  첫번째로 확장자를 체크 -> directory를 검사 -> 해당하는 파일들을 전부 다 실행
  즉 jest는 파일목록들을 다 체크한다음 파일들에게 다 node를 붙여서 실행시키고 있다.

jest는 기본적으로 js를 실행시키는 nodejs런타임?이라서 ts파일을 실행시키려면 @types/jest는 타입스크립트 문법작성시 빨간줄 해결
ts-jest를 설치하면 가능
?? 안되는데.. 설치만 받았기 때문이다.
npx ts-jest 를 쳐야함.
```
npx jest --preset ts-jest --testEnvironment node
```
위와 같이 설정하는데 매번 저렇게 치기 힘드니까 packjage.json에 설정만져주자.
--testEnvironment node
jest는 기본이 브라우저환경을 지원하기때문에 nodejs환경으로 해줘야한다.
설정하다보니까 점점 내용이 길어진다.. 파일을 새로 파자
jest.config.json
package.json에는 test: jest만 남겨주자.
global이라는 속성이 있는데 알아만두자.

근데 굳이 파일을 따로 뺴지 않고 package.json 에도 넣을 수 있다..
jest.config.json 삭제해도가능..

jest문법에대해서 알아보자.
describe()
마우스를 올려놓으면 어떤타입의 인자를 받고 리턴을 하는지 알수가 있다.
describe("block test", ()=>{})
npm run jest를 했을떄 위의 코드가 실행된다.
describe를 콜스택에넣고 안에 콜백함수도 콜스택에 넣고..
```js
describe("block test", ()=>{
  console.log('hello world1');
})
console.log(
  'hello world2'
);
```
hello world1이 먼저 찍혔다. describe를 먼저 실행시킴.
it이라는 메서드가 있는데 test로 치환가능..
```ts
describe("block class", ()=>{
  it("block height속성 test", ()=> {})
  test("block create method 존재여부확인,", ()=>{})
})
```
block class를 확인하고 싶은데 안에있는 것들에 대하여 테스트 하고 싶을 때

//user.controller 검증
tdd를 잘하는 것은 코드를 애초에 잘 작성하는것..
```ts
describe("user controller 검증", ()=>{
  it("create()함수가 잘 실행되는가..", ()=> {
    //req.body
    // service method 잘 작동하는지
    // res.send res.json내가 원하는 객체가 잘 들어가는지
  })
  test("create()method 예외처리가 잘 되는가", ()=>{
    //req.body 강제로 다른값으로 바꾼다음에
    //service 메서드호출을 강제로 터트림
    // catch문으로 잘 빠지는지
    // next함수가 잘 작동하는지..
  })
})
```
3교시.
expect, matcher
expect(1) 1이라는값이 .toBe(1)과 같냐

  beforeEach(()=>{})
  it함수를 실행하기전에 항상 먼저 실행.
  백그라운드에 들어갔다고 생각하자
  ```ts
  class UserController {
  public num: number = 0
  constructor(){}
  create(){
    
  }
}

describe("user controller 검증", ()=>{
  let user: UserController
  afterEach(()=>{}) //각 테스트 케이스가 완료된 후에 실행되는 함수, 테스트 케이스에서 생성한 리소스를 해제하거나 다음 테스트케이스에서 사용될 수 있는 초기상태로 돌려놓는등의 작업을 수행.
  afterAll(()=>{}) // 모든 테스트케이스가 완료된 후에 실행되는 함수, 테스트 실행 후 리소스를 해제하거나, 실행결과를 로깅하는등의 작업을 수행

  beforeAll(()=>{}) //모든 테스트케이스가 실행되기 전에 실행되는 함수, 테스트실행전에 필요한 리소스를 생성하거나 실행환경을 설정하는 등의 작업 수행
  beforeEach(()=>{
    user = new UserController();
  }) //각 테스트가 실행되기전에 실행되는 함수, 각 테스트케이스에서 필요한 초기화 작업을 수행할 수 있음. 각 테스트케이스에서 사용할 객체를 생성하거나 초기상태설정작업수행.
  it("create()함수가 잘 실행되는가..", ()=> {
    // const user = new UserController()
    user.num = 10
    expect(0).toBe(user.num)
    //matcher expect()하고 .찍었을 때 나오는 함수들이 모두 matcher함수 toBe toEquel이 많이 쓰인다. 성공인지 실패인지 검증하는 단계
  })
  test("create()method 예외처리가 잘 되는가", ()=>{
    // const user = new UserController()
    expect(0).toBe(user.num)
  })
  ```
  변수가 어떤타입을 받을지 지정한다음에 
  new UserController의 인스턴스가 각 테스트코드에서 필요한경우 beforeEach를 사용하면 각 테스트코드가 실행될때마다 새로운 인스턴스가 생성되어 적용된다. 
  beforeeach가 it함수 실행전에 it함수가 있을때마다 무조건 실행하니까
  2번이상 인스턴스를 생성해야할경우를 한번만 해도 가능하게 해준다.
  beforeall 은 it함수가 실행되기 전에 딱 한번만 실행..
  let result: {name: string} = {name: ''}
  beforeAll에다가 넣어주면 it에서 뽑아쓸수있다..
  
단일체계원칙을 따르고 있다.
서비스를 테스트한다고 했을 때에는 로직을 체크하는거지 디비에 연결이 잘 됬는지 이런걸 체크하는게 아님
그래서 
```ts
class UserController {
  public num: number = 0
  constructor(){}
  create(){
    
  }
}
interface BoardRepository{
  getUserById: ()=> void
}
interface boardWriteDTO {
  email:string 
  subject: string 
  content: string 
  hashtag:string  
  category: string 
  images: string 
  thumbnail:string
}

class BoardService {
  constructor(private readonly boardRepository: BoardRepository){
    //의존성주입.
  }
  public postWrite(data: boardWriteDTO){}
}

class BoardController{
  constructor(private readonly boardService: BoardService){}
  public write (){
    const data: boardWriteDTO = {
      email:"",
      subject:"",
      content:"",
      hashtag:"",
      category:"",
      images:"",
      thumbnail:"",
    }
    this.boardService.postWrite(data)
  }
  
}

describe("user controller 검증", ()=>{
  let result: {name: string} = {name: ''}
  let user: UserController
  afterEach(()=>{})
  afterAll(()=>{})

  beforeAll(()=>{
    console.log("beforeAll");
    result = {name: "hello world"}
  })
  beforeEach(()=>{
    user = new UserController();
  })
  it("create()함수가 잘 실행되는가..", ()=> {
    user.num = 10
    expect(0).toBe(user.num)
  })
  test("create()method 예외처리가 잘 되는가", ()=>{
    expect(0).toBe(user.num)
  })
})
```

4교시
//mock함수를 배우기 위함.

서비스를 기준으로 할 때 의존성주입이 필요하다. repository에서의 결과물이 필요하기 때문..
service를 테스트하기위해서는
    const boardRepository: BoardRepository = {
      getUserById(){
      } //함수축약형 문법 1.인자값, 
    }
    email을통해서 닉네임을 가져오고 싶은데 db와 연결이 안되어있을경우..
    우리가 테스트를 진행할수 있는 걸로 집어넣어준다.
    그게 목함수다. interface만 잘 지킨다면 

    expect(getUserByID)
    를해서 한번 실행이 되었는가를 테스트하고싶은데
    가져올 수 없기 때문에..
  let boardRepository: BoardRepository
    expect(boardRepository.getUserById).toBeCalled()
  단일체계..
  하나의 메소드에는 하나만 잘 테스트하자.

  5교시
  통합테스트 컨트롤러부터 모델까지 쭉 한번에 하는 것.

  "jest": {
      "preset": "ts-jest",
      "testEnvironment": "node",
      "moduleNameMapper": { //import문 @를 쓰기위함.
        "^@(board|core)/(.+)$":"<rootDir>/src/$1/$2"
        //@board/asdf/dff/asdf
        //@core/df/eff/sdf
      }
  }

  댓글서비스를 만든다 write할때
  describe('Comment Service', ()=> {
  describe('Comment 글쓰기', () => {
    it('write method ishere?', ()=>{})
  })
})
서비스가 필요하기 때문에 comment.service.ts 만들기

  it('commentService 인스턴스 확인하기', ()=>{
    console.log(commentService);
    expect(typeof commentService).toBe("object")
    expect(commentService instanceof CommentService).toBeTruthy() // 제일 정확한 방법 toBe(true)도 가능
  })

  6교시
  class CommentService {
  constructor(){}

  write(data: CommentWriteDTO){
    //data
    //repository(data)
    //return repository(data)
  }
}
우리는 의존성주입이 필요함..레파지토리
repository class 생성

  beforeEach(()=>{
    commentService = new CommentService()
  })
인자가 없기때문에 에러가 난다.

      expect(commentRepository.create).toBeCalled()
      commentRepository.create가 호출되었니>?
      expect(commentRepository.create).toBeCalledWith(data)
       인자값 여부도 테스트하는거임.
```js
  class CommentService {
  constructor(private readonly commentRepository: CommentRepository,
    private readonly userRepository //추가..){}

  async write(data: CommentWriteDTO){
    const result = await this.commentRepository.create(data)
    const a:CommentModel = {
      id: result.id,
      writer: 'userRepository에 의해서 바뀐값을',
      comment: result.comment,
      boardid: result.boardid
    }
    return {

    }
  }
}

export default CommentService
```
  
0425
## 블록체인

최초의 블럭 제네시스블럭
은 이전블럭이 있지 않기 때문에 임의로 이전블록값을 넣어줌
block.constants.ts설정 => block.d.ts
-> dir cor/block/block.interface.ts
-> dir cor/transaction
-> test파일..

interface는 instanceof가 안된다.
class는 당연히 가능..

2번째 블럭을 만들 때는 이전해쉬값으로 1번블럭의 정보가 있어야한다..
data는 transaction의 내용이 저장

1020분

// hello world => hex => binary(0101010101) 

1125분
머클루트를 구현하기위해 라이브러리 사용
npm i merkle
1148분

block에 대힌 정보의 핵심은 transaction이다.
UTXO

  16진수는 2진수와 직접적인 연관이 있기 때문에 컴퓨터의 2진수 데이터를 16진수로 표현하는것이 편리하다.
  
// 4월 26일

## Block 생성
제네시스 블럭을 제외한 나머지블럭을 생성하는것을 할 건데,
블럭 생성은 이전 블럭에 대한 정보를 알고있어야함. 해쉬, 트랜잭션내용들
애초에 블럭을 생성한다는 것은 머클루트가 이미 완성되어있다.
생성하기 전 생성준비과정이 있다.. 우리는 어떤 트랜잭션을 가지고 어떤 블럭을 만들것인지..
hash값을 제외한 모든 값들이 완성되어있어야한다. hash는 블럭해쉬
mercle hash prehash nonce 
previoushash가 먼저 완성된다.
다음 머클루트가 생성되고 해쉬 논스가 결정되면서 마이닝을 시작하게 된다.? 0914
//block.ts
```ts

```
BLockinfo에 대한 정보
이전블록해쉬에 대한정보가 있어야 블럭을 만들 수 있다.

//4월 27일
  createBlock(){}
  POW 누가 더 연산처리빠르게하는가.. 비용이 많이 듬..전기세
  POS(proof of stake) 지분증명, 빈익빈 부익부
  POA (proof of authority) 권한증명, 선택받은 사람만 증명가능.. 탈중앙화에 어울리지않음, 
    public, 누구나 참여 가능하지만
    private,누구나 참여하지 못함. 블록체인.. 코로나접종프로그램에 사용됐었음. node갯수가 적음, 속도가 빠름, 보안성이 취약함. 
      하이퍼레저 라는 프로젝트가 있는데 private네트워크를 사용함.
  workproof dir생성 -> workproof.ts
  기능이 추가되면 ..?클래스를 추가하자 
  pow pos에 대한 기능을 만들건데 클래스로 각각 관리하자.
  이렇게 하면 생성자 workproof 로 인스턴스를 생성할건데  pow든 pos든 두개의 클래스의 인스턴스를 생성해서 원하는걸로 넣어서 생성할 수 있다.
  이렇게히면 workproof클래스에서 의존성주입을 받을 때 pow의타입과 pos타입이 다르기 때문에 문제가 발생하는데 공통적인 메서드를 사용할수 있게 인터페이스를 만들어주자.
  -> test코드작성.

# Class 설계
Database를 설계할ㄷ 때 erd를 그렸던 것 처럼

class 설계를 할때는 UML이 있다.

//04월28일
블록 -> 트랜잭선 -> 체인 -> p2p

# Transaction
서명 - 자신을 증명하는 수단.
어떻게 증명할 것인가..

암호학
개인키, 공개키
대칭 암호화, 비대칭 암호화

비밀키와 공개키는 키페어다. 쌍으로 이루어져있음 // 비대칭키 로직에 ㅣ있음
평문을 암호화 할때는 비밀키 복호화 할떄는 공개키
복호화가 진행되면 양방향 안되면 단방향 단, 단방향에서 공개키로 복호화하려했을떄 true/false정도는 할 수 있다.
블록체인은 비대칭키를 사용하고 있으면서 단방향을 사용하고 있다.

a가 b에게 amount:2btc 주겠다. 작성을 하고 a가 서명을하고 이 데이터를 bitcoin한테 보냄.
bitcoin은 서명 확인을 진행함. 맞으면 2btc로직을 처리함
서명부분이 개인키로 암호화진행된부분, bitcoin은 공개키로 이 서명을 확인함. true인지 false인지 판단 가능.
트랜잭션은 bitcoin에게 보내는 데이터임.

개인키를 가지고 서명한 데이터를 비트코인에게 보냄
블럭이 생성되어야 하는데 시간이 걸림
데이터를 일단 검증부터 하고 검증이 완료되면 트랜잭션에 들어감. 트랜잭션은 마치 잠시 머무르는 보관소같은것.
마이닝을 할 때 트랜잭션들을 가지고 와서 처리를 하고 블록이 생성됨.
잔액을 계산하는것도 통신을 통해서 가능한 것임.
digitalSignature.ts파일생성
개인키는 공인인증서
공개키는 계좌비밀번호같은느낌
account를 알면 공개키를 알수 있고
public과 account를 원래 따로 진행해야하는데 너무 복잡해져서 간단하게 같이구현..

받는사람의 주소를 잘못입력하면
돈날라간다. 블록체인은 책임져주지 않음.
https://brunch.co.kr/@nujabes403/13


//0501

영수증을 보면 트랜잭션 풀이라는 공간에 보내짐.
블록속성안에 데이터안에 tx의 내용들이 들어감.
우리가 채굴,마이닝을 한다는것은 보상을 주어야함.
data에 트랜잭션을 담을 때 보상도 끼워넣어주는데 입금내역만 넣어줌.
이게 무슨말이냐면 너 채굴했으니까 코인줄게 그게 아니라 새로운 트랜잭션을 만드는 것과 같음 이것이 코인베이스
채굴을 하기 전에 트랜잭션 풀에서 처리할 거래내용을 가지고 마이닝을 하는데 이 떄 마이닝을 하는 사람은 지갑이 있어야만 가능하다.
지갑이 있어야 보상을 받을 수 있으니까.. 이 떄 개인키까지 필요없다. account만 필요. 개인키는 트랜잭션 생성시에만 필요
마이닝을 하기전에 코인베이스를 먼저하고 마이닝을 진행(논스값찾기) 문제를 풀면 해당 account에게 코인 지급.
영수증을 가지고 트랜잭션 객체모양??

트랜잭션 객체모양
a가 b에게 돈을 준다고 가정했을 떄 출금이 먼저 진행이 되고 입금이 진행되어야한다.
출금과 입금의 데이터를 하나로 표현하는 것이 편할 것 같다.
txinput 입금
txout 출금
{
  txinput:50,
  txout:0
}
txout이0이면 코인베이스
누가 누구한테 주는건가 에 대한 내용이 빠져있다.
a의 입장에서는 입금이지만 누군가에게는 출금이다.
필기한 거 참조

0502
## 미사용 트랜잭션

이더리에서 사용하는 방법론이아님
utxo
사용자의 잔액을 구하는 것
TxIn에 대한 부분 구현

txout의 객체들에서 txin에 사용되지 않은 객체들이 바로 총 잔액,미사용 트랜잭션개념, 스샷참고.

unspentpool.ts

export class UnspentTxOut {
  txOutId!: string
  txOutIndex!:number
  account!: string
  amount!: number
} //미사용객체
얘네 값을 어디서 받아올것인가..
txoutid:transaction.hash
txoutindex:transaction.txout
account:transaction.txout
amount:transaction.txout
을 가지고 만든다.

0503
```js
const privateKey = digitalSignature.createPrivateKey()
const publicKey = digitalSignature.createPublicKey(privateKey)
const account = digitalSignature.createAccount(publicKey)
```
이친구를 관리해보도록 하겠다. -> wallet.ts

우리는 db까지는 구현하기가 어려워서 chain을 구현해서 배열에다가 담아 구현
key value형태로 db에 저장함. indexdb라는게 있음(몽고랑 비슷)
비트코인이나 이더리움같은경우에는

chais.ts

```js
  //해쉬기준으로 블럭을 찾고싶다.
  getBlockByHash(){}

  //높이를 기준으로 블럭을 가져오겠따.
  getBlockByHeight(height:number): IBlock {
    const findBlock = this.chain.find((block:IBlock)=>{
      return block.height === height
    }) // 
    if(!findBlock) throw new Error('블럭을 찾을 수 없습니다.')
    return findBlock
  }
```
두메서드를 구현하려고하니 중복되는 부분이 너무많아서 이걸 처리해줄거다/
getBlock()에서 중복부분을 구현해서 확장성을 높이자.

```js
getBlock(callbackFn:(block:IBlock) => boolean){
  const findBlock = this.chain.find(callbackFn)
  if(!findBlock) throw new Error('블럭을 찾을 수 없습니다')
  return findBlock
}
```

```js
uptate(transaction: TransactionRow):void {
    const {txIns, txOuts, hash} = transaction
    if(!hash) throw new Error('hash가 존재하지 않습니다.')
    txOuts.forEach((txout: TxOut, index:number)=>{
      this.unspentTxOuts.push({
        txOutId: hash,
        txOutIndex: index,
        account: txout.account,
        amount: txout.amount,
      })
    })
  }
```
foreach문 이기능만 따로 뺴서 고차함수로 만들고싶다. 
```js
create(txout:TxOut, index:number){
    const {amount, account} = txout
    this.unspentTxOuts.push({
      txOutId: '',
      txOutIndex: 0,
      account: '',
      amount: 0
    })
  }
```

```js
  create(hash: string){
    return(txout:TxOut, txOutIndex:number) => {
      const {amount, account} = txout
      this.unspentTxOuts.push({
        txOutId: hash,
        txOutIndex,
        account,
        amount,
      })
    }
  }

  uptate(transaction: TransactionRow):void {
    const {txIns, txOuts, hash} = transaction
    if(!hash) throw new Error('hash가 존재하지 않습니다.')
    txOuts.forEach(this.create(hash))
  }
```

  this binding
  ```js
  uptate(transaction: TransactionRow):void {
    const {txIns, txOuts, hash} = transaction
    if(!hash) throw new Error('hash가 존재하지 않습니다.')
    txOuts.forEach(this.create(hash))
    txIns.forEach(this.delete()) //foreach에 의해서 실행되는 method이기 때문에 delete안에서의 this는 class를 바라보지않음
  }

    delete(txin: TxIn){
    const {txOutId, txOutIndex} = txin
    const index = this.unspentTxOuts.findIndex((unspentTxOut)=>{
      return unspentTxOut.txOutId === txOutId && unspentTxOut.txOutIndex === txOutIndex
    })
    if(index !== -1) this.unspentTxOuts.splice(index, 1)
  }
``` 

sync 
```js
```

```js
mineBlock(account:string){
    //
    const latestBlock = this.chain.latestBlock()//제네시스 블럭
    const adjustmentBlock = this.chain.getAdjustmentBlock() //제네시스 블럭

    const coinbase = this.transaction.createCoinbase(account, latestBlock.height)
    

    //Block생성이되었다는건 block.data transactionData 가 있다는것.
    this.unspent.sync(newBlock.data)
    console.log((this.unspent.getUnspentTxPool()));
    return this.chain.latestBlock()
  }
```

0504
코인은 노드들이 연결되어서 분산원장
메인디쉬가 있고 없고의 차이가 코인과 토큰의 차이
우리가 하는 것은 토이 비트코인이다.

우리의 목적은 스트ㄴ트랙트 메인넷에 대한 이해도가 있어야
왜 private로 의존주입을 받을 까
의존주입을 받았다는것은 반대로 사용도 가능하다.
public으로하면 web7722.wallet. 이런식으로 접근이 가능하기떄문
인스턴스에서 사용할수 있냐 없냐에 퍼블릭 프라이빗

```js
  sendTransaction(receipt: Receipt){
    const isVerify = this.accounts.verify(receipt)
    if(!isVerify) throw Error('옳바르지 않은 영수증입니다.')
    const balance = this.getBalance(receipt.sender.account)
    if(balance < receipt.amount) throw Error('잔액이 부족합니다.') 
  }
```
트랜잭션을 만들어야 하는데 지금껀 햇던건 가라형태의 코드이다 새롭게 구현하자.
```js
  create(receipt: Receipt){
    const totalAmount = 50 //잔액
    const txin1 = this.createTxIn(1, '', receipt.signature)
    const txout_sender = this.createTxOut(receipt.sender.account, totalAmount - receipt.amount)
    const txout_receiver = this.createTxOut(receipt.received, receipt.amount)
    return this.createRow([txin1], [txout_sender, txout_receiver])

    // txin은 영수증에 있는 sender에 잔액을 확인을 먼저해야함.
    // const txin1 = transaction.createTxIn(1, '', receipt.signature)
    
    //보내는 사람 50 받는사람 30 남는잔액 20
    //sender총수량 - amount 총수량 구현을 아직 못했기 때문에...hard코딩
    // const txout_sender = transaction.createTxOut(receipt.sender.account, 50 - receipt.amount)
    // const txout_receiver = transaction.createTxOut(receipt.received, receipt.amount)
    // const tx1 = transaction.createRow([txin1], [txout_sender, txout_receiver]) // 무엇을 가지고 만들건데?? txin txout인데 메서드가 없다..
  }
  // TxOut 부터 먼저 구현해보자.
```
위의 코드 수정
이제 txin을 구해와야하느데 우리는 이미 했었다. unspentPool.에서 getInput으로..
createInput으로 수정. 
```js

```
output 수정
우리는 영수증을 가지고 트랜잭션 풀에 넣는걸 하고있는것이다!
```js
create(receipt: Receipt, myUnspantTxOuts: UnspentTxOut[]){
    if(!receipt.signature) throw new Error('서명이 존재하지 않습니다.')

    const [txIns, balance] = this.createInput(myUnspantTxOuts, receipt.amount, receipt.signature) 
    const txOuts = this.createOutput(receipt.received, receipt.amount, receipt.sender.account, balance)
    const transaction: TransactionRow = {
      txIns,
      txOuts,
    }

    transaction.hash = this.serializeRow(transaction)
    this.transactionPool.push(transaction) //!!!
    return transaction
  }
```
이제 미사용객체에 대해서 업데이트를 해주어야함.


wallet에서 영수증을만들어서 노드에게 보내고 트랜잭션풀에 담은다음에 이것이 월렛이 하는 역활.
블럭을 샹성할떄는 트랜잭션풀에있는 걸 닥 가지고 블록을 새성하고 그때 utxo가 생성된다.

0508
# Network
블록체인에서는 p2p키워드를 뺄수없다.
 `net`라이브러리 사용해서 client와 server코드를 작성한 적이 있는데 요청이 들어온다면 이렇게 응답을 줘야지 
이런식으로 작성했었다.
`p2p`라는건 `client` 와 `server` 측 코드가 모두 작동되는 서버
하나의 노드에는 한파일에 클라이언트와 서버코드를 작성한다.
요청을 할 수도 받을수도 있다.
우리는 ws으로 대체를 해서 구현할 것이다.
http 사용해서 요청응답을 줄 것이다.
왜 블록체인 네트워크는 p2p를 해야하는것인가. 납득을 해야함.

# Ethereum Bitcoin
TCP 기반으로 Node들과 통신을 진행함.
node들끼리의 통신은 p2p인데
브라우저가 노드들에게 어떻게 데이터를 가져올 수 있을까?
당연히 통신을 해야 한다. 
브라우저가 노드한테 요청을 보내야하는데 어떤 요청을 하는 것인가.
노드들은 브라우저와 통신하기 위해 포트를 열어둔다.
  HTTP 로 통신할 수 있고
  WS 로 통신해서 쌍방향으로 진행할 수 있다.
  또 node들끼리 통신하기 위해 다른 포트를 열어서 통신할 수 있따.
ip가 브라우저와 노드가 다르기 때문에 cors에 대한 것도 생각해야한다.

`Node`들은 3가지의 `Port`를 가질 수 있다.

웹브라우저 또는 '클라이언트'(쿠구같은거) 관련된 포트가 2개(http, ws), `Node`들 끼리 상호작용 할 수 있는 `port`가 1개있다.

클라이언트소켓을 이용하면 비용부담이 있기 때문에 api를 사용한다.
인프라 infura: api를 통해서 요청,응답을 받는다.

우리가 만든 것도 하나의 노드인데
포트를 2개만 열꺼임, http와 ws두개
브라우저에서 동작하는 wallet을 만들고 이에 대한 front서버를 만들 것이다. front서버는 화면 그리는 용도로만..
데이터는 node와 통신해서 받아올것임.16

app과 dapp의 차이.. 중앙화냐 탈중앙이냐
여지껏 게시글을 가져오기 위해서는 백엔드에게 요청을 떄리고 db에 가지고 와서 응답을 받고 화면에 뿌리는 구성이였다면
백엔드서버가 분산되어 있냐 아니냐의 차이다. 
요청을 보내는 쪽이 중앙화냐 탈중앙화냐? 검색해보기.

2교시
- http
  -rpc
  1990년 대 쯤 나옴. revoot process call? 하나의 프로토콜이고 7계층임.
  클라이언트와 서버가 있늗네 서버에 메서드가 구현되어있다면 클라이언트 입장에서 서버한테 메서드 실행해 라고 하는 것이 rpc다.
  http와 별 다를 것이 없다. rpc는 http와 거의 똑같다. 실제로는 http개념안에 rpc가 있는 것이다.
  만약에 메서드가 10분이 걸린다면 응답을 받는데 실행을 시켰다는 것 자체에 대한것만 응답을 받음. 결과를 받는 것이 아님.
  메서드가 실행을 했는지 안했는지 여부에 대한 체크라고 봐야한다. 이것이 rpc다. http포트를 이용함.

## 앞으로 만들것들

## node
- http 서버가 필요하다 -> express
- ws -> node들간의 peer 서로 데이터를 주고 받을 수 있게

## client
지갑에 대한 느낌으로 
내가 가지고 있는 돈은 얼마나 있는지, 이 돈을 상대방에게 주고 싶다거나, 
아주 심플하게 `wallet`을 구현할 꺼임. 메타마스크 같이
이걸 할 줄 알면 explore도 구현 가능함.

app.ts
npm i express
npm i --save-dev @types/express
여기서 getbalancef를 사용하고 싶은데 어떻게 사용해야 할까?
의존주입을 함수형 처럼 사용할것이다?

```js
export default (web3: Ingchain) => {
  console.log(web3);
}
```
얘를 콘솔확인 하려면 어캐? 
다른파일에서 임포트 해오고 Ingchain 인스턴스를 생성해서 의존주입해준다.

```js
export default (web3: Ingchain) => {
  console.log(web3);
  const app = express()
  
  app.use(express.json())
  
  app.get('/', (req, res)=>{
    res.send('hello blockchain')
  })
  
  app.get('/getbalance', (req,res)=>{
    res.send('balance')
  })

  return app
}
```
라고 가정하면
```js
const app = App(web7722)
app.listen(8545, ()=>{
  console.log(`server start`)
})
```
3교시
```js
import Ingchain from '@core/ingchain'
import express from 'express'

export default (blockchain: Ingchain) => {
  const app = express()
  
  app.use(express.json())
  
  app.get('/', (req, res)=>{
    res.send('hello blockchain')
  })
  
  app.get('/getbalance', (req,res)=>{
    const { account } = req.body
    const balance = blockchain.getBalance(account)
    res.json({
      balance
    })
  })

  return app
}
```
post요청 포스트맨으로 확인해보자.
응답이 왔다.
라우터 안에서 인스턴스의 메소드 getBalance를 사용 할 수 있게 됐따.

마이닝을 하려면 계정을 생성해야한다.
```js
  app.put('/accounts', (req, res)=>{
    const account = blockchain.accounts.create()
    res.json({...account})
  })
```
class안에서 account배열에 추가되고 있다는 것을 인지하자.
```js
  app.put('/accounts', (req, res)=>{
    const account = blockchain.accounts.create()
    res.json({...account})
  })
```

```js
  app.post('mineBlock', (req, res)=>{
    const {account} = req.body
    const newBlock = blockchain.mineBlock(account)
    res.json(newBlock)
  })
```

트랜잭션을 만들 때 영수증이 완성이 되어있는채로 들어와야함.
```js
  app.post('/transaction', (req, res)=>{
    const {receipt} = req.body

    const transaction = blockchain.sendTransaction(receipt)
    res.json({
      transaction
    })
  })
```

블록에 트랜잭션들이 담겨져있따
얘네를 가져와서 브라우저에게 뿌려줄 수 있따.
블록데이터는 메모리에도 저장하지만 db에도 저장한다.

wallet 구현하기..
wallet은 아에 다른 서버에서 구현하는거임. 포트가 다름
우리가 여지껏 했던 것은 노드의 역활
월렛은 클라이언트
node는 8545포트
wallet은 3000포트 

# cliwallet
라이브러리들 다 설치하기.
import axios from 'axios'
import express from 'express'
import nunjucks from 'nunjucks'

tsconfig 추가
 "@wallet/*":["wallet/*"]

```js
import Wallet from '@wallet/app'

const app = Wallet()

app.listen(3000, ()=>{
  console.log(`server start`);
})
```

4교시
```package.json
  "scripts": {
    "test": "jest",
    "dev": "nodemon",
    "build": "tsc && tsc-alias",
    "exec": "ts-node -r tsconfig-paths/register src/index.ts",
    "wallet": "ts-node -r tsconfig-paths/register src/index.ts"
  },
```

import path
const viewDIr

html 작성.

지갑생성은 노드에서 생성하는 것이 아니다.
balance는 노드에서 가져오는것이고
지갑은 월렛에서 생성하는 것이다.
월렛에 프라이빗키가 있으니까 서명까지 만들 수 있고
노드에게 영수증 던지면
노드는 검증처리하고 응답해줄 수 있따.

5교시
원하는 요청이 있으면 백에다가 보내고 받아와서 처리

0309시간

지갑은 요청해서 응답만 받아오는것뿐
코인은 노드에 있다.

지갑이 하는 역활은 내 privateKey보관
이것은 즉 서명을 편하게 만들기 위해
그리고 영수증을 던짐.

밸런스는 프론트에서 받아 올 수 없는 데이터여서
바로 백에 요청하거나 프론트가 백에서 요청하거나 둘 중 하나 해야하는데


















































                                                         
