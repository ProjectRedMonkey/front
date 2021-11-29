import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Book} from "../types/book.type";
import {defaultIfEmpty, filter, map, mergeMap, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
  commentToPrint:Comment;
  id:string;
  highlighted:boolean;
  printComment:boolean;
  // @ts-ignore
  span:Element;

  constructor(private _http:HttpClient, private _route: ActivatedRoute, private _dialog: MatDialog) {
    this.id = "0";
    this._book = {} as Book;
    this._comments = [];
    this.highlighted = false;
    this.printComment = false;
    this.commentToPrint = {} as Comment;
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
          this._comments = comments.filter(obj => obj.idOfBook === this.id)
          this._comments.forEach(ele => this.hightlightComments(ele.start, ele.end))}});
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
            data:this._book
          });

          this._dialogRef.afterClosed().subscribe(comment => {
            if(!!comment){
              this._comments.push(comment);
              location.reload();}
          });
        }
      }
  }

  closeDialog() {
    this.printComment = false;
  }

  get comments(): Comment[] {
    return this._comments;
  }

  //Surligne les passages commentés
  hightlightComments(start:number, end:number) {
    let extract = this._book.extract;
    let text = extract.substring(start, end);
    let inputText = document.getElementById("comment");
    // @ts-ignore
    let innerHTML = inputText.innerHTML;
    var index = innerHTML.indexOf(text);
    if (index >= 0) {
      // @ts-ignore
      inputText.innerHTML = innerHTML.substring(0, index) + "<span id='cm' style='background-color: yellow;'>" + innerHTML.substring(index, index+text.length) + "</span>" + innerHTML.substring(index+text.length);
    }
  }

  modify(comment: Comment) {
    let bookDialog = this._dialog.open(AddCommentComponent, {
      data:comment
    });
    bookDialog.afterClosed().pipe(
      filter((comment: Comment | undefined) => !!comment),
      mergeMap((comment: Comment | undefined) => this.edit(comment))).subscribe({
      complete: () => this.commentToPrint = comment
    });
  }

  delete(comment: Comment) {
    this._http.delete("http://localhost:3000/comments/"+comment.id)
      .subscribe({ next: () =>this._comments = this._comments.filter((c: Comment) => c.id !== comment.id)});
  }

  edit(comment: Comment | undefined):Observable<Comment>{
    // @ts-ignore
    return this._http.put<Comment>("http://localhost:3000/comments/"+comment.id, comment);
  }


  //Affiche le commentaire quand la souris passe dessus
  showComment(event: MouseEvent){
    let x = event.clientX, y = event.clientY;
    let mouseSpan = document.elementFromPoint(x, y);
    if(mouseSpan != null) {
      if (this.span != undefined) {
        if (this.span.id == "cm" && this.span.textContent != mouseSpan.textContent && mouseSpan.id == "cm")
          this.span.setAttribute("style", 'background-color: yellow;')
      }

      if (mouseSpan.id == "cm") {
        this.span = mouseSpan;
        if (this.span != null) {
          if (this.span.id == 'cm') {
            this.span.setAttribute("style", 'background-color: red;')
            this._comments.forEach(ele => {
              // @ts-ignore
              if (ele.start == this._book.extract.indexOf(this.span.textContent))
                this.commentToPrint = ele
            })
            this.printComment = true;
          }
        }
      }
    }
  }
}
