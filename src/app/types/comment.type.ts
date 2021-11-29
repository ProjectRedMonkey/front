export type Comment = {
  idOfBook: string;
  author: string;
  date?: number; // can use the actual date
  start: number;
  end: number;
  text: string;
  upVote?: number; // see if use
}
