import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Comment} from "../../types/comment.type";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  form:FormGroup;
  start:number;
  end:number;

  constructor(private _dialogRef: MatDialogRef<AddCommentComponent>, private _http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: string) {
    this.form = new FormGroup({
      author: new FormControl('',Validators.required),
      text: new FormControl('',Validators.required),
    })
    this.start = 0;
    this.end = 0;

    var select = window.getSelection();
    if (select != null) {
      if (!select.isCollapsed) {
        this.start = select.getRangeAt(0).startOffset;
        this.end = select.getRangeAt(0).endOffset;
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
    this._dialogRef.close();
  }

  private setUp(comment: Comment) {
    comment.id = this.data;
    var today = new Date();
    comment.date = Number(today.getDate());
    comment.start = this.start;
    comment.end = this.end;
  }
}
