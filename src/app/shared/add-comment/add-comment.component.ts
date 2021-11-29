import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Comment} from "../../types/comment.type";
import {Book} from "../../types/book.type";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  form:FormGroup;
  start:number;
  end:number;

  constructor(private _dialogRef: MatDialogRef<AddCommentComponent>, private _http: HttpClient, @Inject(MAT_DIALOG_DATA) public book: Book) {
    this.form = new FormGroup({
      author: new FormControl('',Validators.required),
      text: new FormControl('',Validators.required),
    })
    this.start = 0;
    this.end = 0;

    var select = document.getSelection();
    if (select != null) {
      if (!select.isCollapsed) {
        let text = select.toString()
        this.start = this.book.extract.indexOf(select.toString());
        this.end = this.start + text.length;
      }
    }
  }

  ngOnInit(): void {
  }


  cancel() {
    this._dialogRef.close();
  }

  save(comment: Comment) {
    this.setUp(comment);
    this._http.post("http://localhost:3000/comments", comment).subscribe();
    this._dialogRef.close(comment);
  }

  private setUp(comment: Comment) {
    // @ts-ignore
    comment.idOfBook = this.book.id;
    var today = new Date();
    comment.date = 20;
    comment.start = this.start;
    comment.end = this.end;
  }
}
