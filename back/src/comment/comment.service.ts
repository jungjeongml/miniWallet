import { CommentModel, CommentWriteDTO } from './comment.interface';
import CommentRepository from './comment.repository';

class CommentService {
  constructor(private readonly commentRepository: CommentRepository){}

  async write(data: CommentWriteDTO){
    try{
    const result = await this.commentRepository.create(data)
    const response:CommentModel = {
      id: result.id,
      writer: 'userRepository에 의해서 바뀐값을',
      comment: result.comment,
      boardid: result.boardid
    }
    return {
      response
    }
  }catch(e: unknown){
    if(e instanceof Error) throw new Error(e.message)
  }
  }
}

export default CommentService