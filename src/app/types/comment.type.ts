export type Comment = {
  id:string;
  idOfBook: string;
  author: string;
  date?: Date; // can use the actual date
  start: number;
  end: number;
  text: string;
  upVote?: number; // see if use
}
