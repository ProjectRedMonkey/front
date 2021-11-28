import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Book} from "../../types/book.type";
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {
  form:FormGroup;

  constructor(private _dialogRef: MatDialogRef<AddCommentComponent>, private _http: HttpClient) {
    this.form = new FormGroup({
      author: new FormControl('',Validators.required),
      text: new FormControl('',Validators.required),
    })
  }

  ngOnInit(): void {
  }


  cancel() {
    this._dialogRef.close();
  }

  save(comment: Comment) {
    this._http.post("http://localhost:3000/comments", comment);
    this._dialogRef.close();
  }
}
