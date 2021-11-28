import { Component, OnInit } from '@angular/core';
import {DialogComponent} from "../shared/dialog/dialog.component";
import {filter, mergeMap, Observable} from "rxjs";
import {Book} from "../types/book.type";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  private _bookDialog:MatDialogRef<DialogComponent> | undefined;
  private _dialogStatus:string;

  constructor(private _http: HttpClient, private _dialog: MatDialog) {
    this._dialogStatus = "inactive";
  }

  ngOnInit(): void {
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
        book.photo = "http://www.petites-curiosites.com/sites/default/files/images/petites-curiosites-com-faux-livre-steampunk-01.jpg";
      }
    }
    return this._http.post<Book>("http://localhost:3000/books", book,  { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

}
