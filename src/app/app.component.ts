import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "./shared/dialog/dialog.component";
import {Book} from "./types/book.type";
import {filter, mergeMap, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _bookDialog:MatDialogRef<DialogComponent> | undefined;
  private _dialogStatus:string;

  constructor(private _http: HttpClient, private _dialog: MatDialog) {
    this._dialogStatus = "inactive";
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
    return this._http.post<Book>("http://localhost:3000/books", book,  { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
}
