import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Book} from "../types/book.type";
import {filter} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DialogPosition, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddCommentComponent} from "../shared/add-comment/add-comment.component";

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.css']
})
export class BookViewComponent implements OnInit {
  private _book:Book;
  private _dialogRef:MatDialogRef<AddCommentComponent> | undefined;
  id:string;
  highlighted:boolean;

  constructor(private _http:HttpClient, private _route: ActivatedRoute, private _dialog: MatDialog) {
    this.id = "0";
    this._book = {} as Book;
    this.highlighted = false;
  }

  //Récupère le livre à afficher
  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params['id'];
    });
    this._http.get<Book>("http://localhost:3000/books/"+this.id)
      .pipe(
        filter((book: Book) => !!book)
      )
      .subscribe({ next: (book: Book) => this._book = book});
  }

  get book(): any {
    return this._book;
  }

  set book(value: any) {
    this._book = value;
  }

  click() {
    var text = window.getSelection();
    if (text != null) {
      if (!text.isCollapsed) {
        console.log(text.toString());
      } else {
        console.log("Aucune donnée");
      }
    }
  }

  showDialog(event: MouseEvent) {
    this._dialogRef?.close();
    this.highlighted = true;
    const dialogPosition: DialogPosition = {
      top: event.y + 'px',
      left: event.x + 'px'
    };

    this._dialogRef = this._dialog.open(AddCommentComponent, {
      width: '400px',
      position: dialogPosition
    });

    this._dialogRef.afterClosed().subscribe(result => {
    });
  }

  closeDialog() {
    this.highlighted = false;
  }
}
