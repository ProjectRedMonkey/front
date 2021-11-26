import {Component, EventEmitter, Output} from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {DialogComponent} from "./shared/dialog/dialog.component";
import {Book} from "./types/book.type";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _bookDialog:MatDialogRef<DialogComponent> | undefined;
  private _dialogStatus:string;

  constructor(private _dialog: MatDialog) {
    this._dialogStatus = "inactive";
  }

  showDialog() {
    this._dialogStatus = 'active';
    this._bookDialog = this._dialog.open(DialogComponent);
    this._bookDialog.afterClosed().subscribe({complete: () => this._dialogStatus = 'inactive'});
  }

  get dialogStatus(): string {
    return this._dialogStatus;
  }
}
