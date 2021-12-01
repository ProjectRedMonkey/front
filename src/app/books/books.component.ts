import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Book} from "../types/book.type";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {defaultIfEmpty, filter, mergeMap, Observable} from "rxjs";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  private _books: Book[];
  private _bookDialog:MatDialogRef<DialogComponent> | undefined;
  private _dialogStatus:string;
  //String tapé dans la barre de recherche
  private _searchWord:string;
  //Affiche les livres filtrés par la recherche
  private _content:Book[];

  constructor(private _http: HttpClient, private _dialog: MatDialog, private _router:Router) {
    this._books = [];
    this._content = [];
    this._searchWord = "";
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
          this._content = books
        }});
  }

  /**
   * Delete un livre
   * @param id du livre à supprimer
   */
  delete(id:string) {
    this._http.delete("http://localhost:3000/books/"+id)
      .subscribe({ next: () => {this._books = this._books.filter((b: Book) => b.id !== id)
          this._content = this._books} });
  }

  get books(): Book[] {
    return this._books;
  }

  /**
   * Remplit content en fonction du terme recherché
   */
  searchThis() {
    let data = this._searchWord;
    this._content = this._books;
    let authors = this._books;
    if (data) {
      this._content = this._books.filter(function (ele, i, array) {
        let arrayelement = ele.title.toLowerCase()
        return arrayelement.includes(data.toLowerCase())
      })
      authors = this._books.filter(function (ele, i, array) {
        let arrayelement = ele.author.toLowerCase()
        return arrayelement.includes(data.toLowerCase())
      })
      authors.forEach(element => this._content.indexOf(element) === -1 ? this._content.push(element) : !!authors);

    }
  }

  /**
   * Affiche le dialog d'ajout de livre
   */
  showDialog() {
    this._dialogStatus = 'active';
    this._bookDialog = this._dialog.open(DialogComponent);

    this._bookDialog.afterClosed().pipe(
      filter((book: Book | undefined) => !!book),
      mergeMap((book: Book | undefined) => this._add(book))
    )
      .subscribe({
        error: () => this._dialogStatus = 'inactive',
        complete: () => {
          this._dialogStatus = 'inactive'
        }
      });
  }

  get dialogStatus(): string {
    return this._dialogStatus;
  }

  /**
   * Ajoute un livre dans l'API
   * @param book à ajouter
   * @private
   */
  private _add(book: Book | undefined): Observable<Book> {
    this._setUp(book);
    return this._http.post<Book>("http://localhost:3000/books", book,  { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  /**
   * Met une photo par défaut si aucune n'a été donnée
   */
  private _setUp(book: Book | undefined) {
    if(book != undefined && book.photo == ""){
      book.photo = "https://islandpress.org/sites/default/files/default_book_cover_2015.jpg";
    }
  }

  /**
   * Renvoie vers la page d'un livre au hasard
   */
  randomBook() {
    let b:Book;
    b=this._books[Math.round(Math.random() * this._books.length)];
    this._router.navigate(['/books/'+b.id]);
  }

  get content(): Book[] {
    return this._content;
  }

  get searchWord(): string {
    return this._searchWord;
  }

  set searchWord(value: string) {
    this._searchWord = value;
  }
}
