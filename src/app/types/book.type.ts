export type Book = {
  id?: string;
  photo?: string;
  title: string;
  author: string;
  category:string;
  page:number;
  date?:Date;
  extract: string;
};
