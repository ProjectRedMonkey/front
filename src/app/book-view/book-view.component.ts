import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Book} from "../types/book.type";
import {defaultIfEmpty, filter} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DialogPosition, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddCommentComponent} from "../shared/add-comment/add-comment.component";
import {Comment} from "../types/comment.type";

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.css']
})
export class BookViewComponent implements OnInit {
  private _book:Book;
  private _dialogRef:MatDialogRef<AddCommentComponent> | undefined;
  private _comments:Comment[];
  id:string;
  highlighted:boolean;

  constructor(private _http:HttpClient, private _route: ActivatedRoute, private _dialog: MatDialog) {
    this.id = "0";
    this._book = {} as Book;
    this._comments = [];
    this.highlighted = false;
  }

  //Récupère le livre à afficher
  ngOnInit(): void {
    //Récupère l'id
    this._route.params.subscribe(params => {
      this.id = params['id'];
    });

    //Récupère le livre
    this._http.get<Book>("http://localhost:3000/books/"+this.id)
      .pipe(
        filter((book: Book) => !!book)
      )
      .subscribe({ next: (book: Book) => this._book = book});

    //Récupère les commentaires associés au livre
    this._http.get<Comment[]>("http://localhost:3000/comments")
      .pipe(
        filter((comments: Comment[]) => !!comments),
        defaultIfEmpty([])
      )
      .subscribe({ next: (comments: Comment[]) => {
          this._comments = comments.filter(obj => obj.idBook === this.id)
          comments.forEach(ele => this.hightlightComments(ele.start, ele.end))}});
  }

  get book(): any {
    return this._book;
  }

  set book(value: any) {
    this._book = value;
  }

  showDialog(event: MouseEvent) {
    var select = window.getSelection();
    if (!!select && !!select.anchorNode && !!select.anchorNode.parentNode && !select.isCollapsed) {
        if(select.anchorNode.parentNode.nodeName == 'LABEL') {

          this._dialogRef?.close();
          this.highlighted = true;
          const dialogPosition: DialogPosition = {
            top: event.y + 'px',
            left: event.x + 'px'
          };

          this._dialogRef = this._dialog.open(AddCommentComponent, {
            width: '400px',
            position: dialogPosition,
            data:this.id
          });

          this._dialogRef.afterClosed().subscribe(comment => {
            if(!!comment) this._comments.push(comment);
          });
        }
      }
  }

  closeDialog() {
    this.highlighted = false;
  }

  get comments(): Comment[] {
    return this._comments;
  }

  private hightlightComments(start:number, end:number) {
    //Surligne les passages commentés
    let inputText = document.getElementById("extract");
    let innerHTML = this._book.extract;
    if (start >= 0) {
      // @ts-ignore
      inputText.innerHTML = innerHTML.substring(0, start) + "<span id='comment' class='highlight'>" + innerHTML.substring(start, end) + "</span>" + innerHTML.substring(end);
    }
    console.log(document.getElementById("comment"))
  }
}
