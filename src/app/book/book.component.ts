import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Book} from "../types/book.type";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {DialogComponent} from "../shared/dialog/dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {filter, map, mergeMap, Observable} from "rxjs";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  private _book:Book;
  private readonly _delete$: EventEmitter<string>;
  private _bookDialog: MatDialogRef<DialogComponent> | undefined;
  //Pour afficher le bon format de date
  private _dateToPrint:Date;

  constructor(private _http: HttpClient, private _router:Router, private _dialog: MatDialog, public datepipe: DatePipe) {
    this._book = {} as Book;
    this._delete$ = new EventEmitter<string>();
    this._dateToPrint = new Date();
  }

  ngOnInit(): void {
  }

  @Output('delete') get delete$(): EventEmitter<string> {
    return this._delete$;
  }

  delete(id:string) {
    this._delete$.emit(id);
  }

  get book(): any {
    return this._book;
  }

  get dateToPrint(): Date {
    return this._dateToPrint;
  }

  @Input()
  set book(value: Book) {
    // @ts-ignore
    this._dateToPrint = this.datepipe.transform(value.date, 'dd/MM/yyyy');
    this._book = value;
  }

  /**
   * Renvoie vers la page du livre choisi
   * @param id du livre
   */
  navigate(id:string) {
    this._router.navigate(["/books/"+id]);
  }

  /**
   * Affiche le dialog permettant de modifier un livre, applique la modification après fermeture
   */
  modify() {
    this._bookDialog = this._dialog.open(DialogComponent,{
      data:this._book
    });

    this._bookDialog.afterClosed().pipe(
      filter((book: Book | undefined) => !!book),
      map((book: Book | undefined) => {
        return book;
      }),
      mergeMap((book: Book | undefined) => this._edit(book))).subscribe({
      error: () => this._router.navigate(['/books']),
      // @ts-ignore
      complete: () => this._dateToPrint = this.datepipe.transform(this.book.date, 'dd/MM/yyyy')
    });

  }

  /**
   * Modifie un livre dans l'API
   * @param book le nouveau livre
   * @private
   */
  private _edit(book: Book | undefined):Observable<Book> {
    if(!!book) {
      //Bricolage pour Charles
      let extract = this._book.extract;
      this.updateBook(book);
      book.extract += "//"+extract;
    }
    return this._http.put<Book>("http://localhost:3000/books/"+this._book.id, book,  { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  /**
   * Met à jour le livre
   * @param b
   * @private
   */
  private updateBook(b:Book) {
    this._book.title = b.title;
    this._book.author = b.author;
    this._book.category = b.category;
    this._book.photo = b.photo;
    this._book.extract = b.extract;
    this._book.date = b.date;
  }
}
