import {Component, Inject, OnInit, Optional} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Book} from "../../types/book.type";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(private _dialogRef: MatDialogRef<DialogComponent>, @Optional() @Inject(MAT_DIALOG_DATA) private _book: Book) {
  }

  ngOnInit(): void {
  }

  onCancel(): void {
    this._dialogRef.close();
  }

  onSave(book:Book): void {
    this._dialogRef.close(book);
  }

  get book(): Book{
    return this._book;
  }

}
