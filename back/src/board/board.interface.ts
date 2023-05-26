export interface BoardModel {
  email?: string
  username?: string
  subject?: string
}

export interface BoardRepository{
  getUserById: (email: string)=> Promise<BoardModel>
}

export interface boardWriteDTO {
  email:string 
  subject: string 
  content: string 
  hashtag:string  
  category: string 
  images: string 
  thumbnail:string
  tel1? : number
  tel2? : number
  tel3? : number
}