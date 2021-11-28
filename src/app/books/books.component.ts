import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  searchword:string;
  //Affiche les livres filtrés par la recherche
  content:Book[];

  constructor(private _http: HttpClient) {
    this._books = [];
    this.content = [];
    this.searchword = "";
  }

  ngOnInit(): void {
    this._http.get<Book[]>("http://localhost:3000/books")
      .pipe(
        filter((books: Book[]) => !!books),
        defaultIfEmpty([])
      )
      .subscribe({ next: (books: Book[]) => {
        this._books = books
          this.content = books
        }});
  }

  delete(id:string) {
    this._http.delete("http://localhost:3000/books/"+id)
      .subscribe({ next: () => {this._books = this._books.filter((b: Book) => b.id !== id)
          this.content = this._books} });
  }

  get books(): Book[] {
    return this._books;
  }

  searchThis() {
    let data = this.searchword;
    this.content = this._books;
    let authors = this._books;
    if (data) {
      this.content = this._books.filter(function (ele, i, array) {
        let arrayelement = ele.title.toLowerCase()
        return arrayelement.includes(data.toLowerCase())
      })
      authors = this._books.filter(function (ele, i, array) {
        let arrayelement = ele.author.toLowerCase()
        return arrayelement.includes(data.toLowerCase())
      })
      authors.forEach(element => this.content.indexOf(element) === -1 ? this.content.push(element) : !!authors);

    }
  }
}
