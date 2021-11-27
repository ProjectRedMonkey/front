import { Component, OnInit } from '@angular/core';
import {Book} from "../types/book.type";
import {HttpClient} from "@angular/common/http";
import {defaultIfEmpty, filter} from "rxjs";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  private _books: Book[];

  constructor(private _http: HttpClient) {
    this._books = []
  }

  ngOnInit(): void {
    this._http.get<Book[]>("http://localhost:3000/books")
      .pipe(
        filter((books: Book[]) => !!books),
        defaultIfEmpty([])
      )
      .subscribe({ next: (books: Book[]) => this._books = books});
  }

  delete(id:string) {
    this._http.delete("http://localhost:3000/books/"+id)
      .subscribe({ next: () => this._books = this._books.filter((b: Book) => b.id !== id) });
  }

  get books(): Book[] {
    return this._books;
  }
}
