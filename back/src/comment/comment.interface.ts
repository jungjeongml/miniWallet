export interface CommentWriteDTO{
  writer:string
  comment:string
  boardid:number
}

export interface CommentModel extends CommentWriteDTO {
  id:number,
}

