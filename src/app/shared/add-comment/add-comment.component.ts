import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Book} from "../../types/book.type";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})
export class AddCommentComponent implements OnInit {

  constructor(private _dialogRef: MatDialogRef<AddCommentComponent>) {
  }

  ngOnInit(): void {
  }


  cancel() {
    this._dialogRef.close();
  }
}
