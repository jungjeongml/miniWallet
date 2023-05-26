import { BoardModel, BoardRepository, boardWriteDTO } from './board.interface'

class BoardService {
  constructor(private readonly boardRepository: BoardRepository){}

  public async postWrite(data: boardWriteDTO): Promise<BoardModel>{
    const {email, tel1, tel2, tel3} = data //asdf
    const {username} =await this.boardRepository.getUserById(email) // promise(web7722)
    return {username}
  }
}

export default BoardService