import {Component, EventEmitter, Inject, OnInit, Optional, Output} from '@angular/core';
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
  updateMode:boolean;

  constructor(private _dialogRef: MatDialogRef<AddCommentComponent>, private _http: HttpClient,@Optional() @Inject(MAT_DIALOG_DATA) public book: Book,
             @Optional() @Inject(MAT_DIALOG_DATA) public comment:Comment) {
    this.form = new FormGroup({
      author: new FormControl('',Validators.required),
      text: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(10), Validators.maxLength(500)
      ])),
    })
    this.start = 0;
    this.end = 0;
    this.updateMode = false;

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
    if(this.comment.text != undefined) {
      this.form.patchValue(this.comment);
      this.updateMode = true;
    }
  }

  cancel() {
    this._dialogRef.close();
  }

  save(comment: Comment) {
    if(!this.updateMode) {
      this.setUp(comment);
      console.log(comment);
      this._http.post("http://localhost:3000/comments", comment).subscribe();
    }else{
      comment.date = new Date();
      comment.date.setHours(comment.date .getHours()+1)
    }
    this._dialogRef.close(comment);
  }

  private setUp(comment: Comment) {
    // @ts-ignore
    comment.idOfBook = this.book.id;
    comment.date = new Date();
    comment.date.setHours(comment.date .getHours()+1)
    comment.start = this.start;
    comment.end = this.end;
  }
}
