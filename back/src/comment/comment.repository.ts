import { CommentModel, CommentWriteDTO } from './comment.interface';

class CommentRepository{
  
  async create(data: CommentWriteDTO): Promise<CommentModel>{
    return {} as CommentModel
  }
}

export default CommentRepository