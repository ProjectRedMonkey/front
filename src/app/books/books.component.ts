import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Book} from "../types/book.type";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {defaultIfEmpty, filter, mergeMap, Observable} from "rxjs";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  private _books: Book[];
  private _bookDialog:MatDialogRef<DialogComponent> | undefined;
  private _dialogStatus:string;
  searchword:string;
  //Affiche les livres filtrés par la recherche
  content:Book[];

  constructor(private _http: HttpClient, private _dialog: MatDialog) {
    this._books = [];
    this.content = [];
    this.searchword = "";
    this._dialogStatus = "inactive";
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

  showDialog() {
    this._dialogStatus = 'active';
    this._bookDialog = this._dialog.open(DialogComponent);

    this._bookDialog.afterClosed().pipe(
      filter((book: Book | undefined) => !!book),
      mergeMap((book: Book | undefined) => this._add(book))
    )
      .subscribe({
        error: () => this._dialogStatus = 'inactive',
        complete: () => this._dialogStatus = 'inactive'
      });
  }

  get dialogStatus(): string {
    return this._dialogStatus;
  }

  private _add(book: Book | undefined): Observable<Book> {
    if(!!book) {
      book.date = 20;
      if(book.photo == ""){
        book.photo = "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg";
      }
    }
    return this._http.post<Book>("http://localhost:3000/books", book,  { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
}
