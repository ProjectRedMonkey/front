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
  private readonly _form:FormGroup;
  private readonly _start:number;
  private readonly _end:number;
  private _updateMode:boolean;

  constructor(private _dialogRef: MatDialogRef<AddCommentComponent>, private _http: HttpClient,@Optional() @Inject(MAT_DIALOG_DATA) public book: Book,
             @Optional() @Inject(MAT_DIALOG_DATA) public comment:Comment) {
    this._form = new FormGroup({
      author: new FormControl('',Validators.required),
      text: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(10), Validators.maxLength(500)
      ])),
    })
    this._start = 0;
    this._end = 0;
    this._updateMode = false;

    var select = document.getSelection();
    if (select != null) {
      if (!select.isCollapsed) {
        let text = select.toString()
        this._start = this.book.extract.indexOf(select.toString());
        this._end = this._start + text.length;
      }
    }
  }

  ngOnInit(): void {
    if(this.comment.text != undefined) {
      this._form.patchValue(this.comment);
      this._updateMode = true;
    }
  }

  cancel() {
    this._dialogRef.close();
  }

  /**
   * Ajoute le commentaire dans l'API
   * @param comment commentaire à ajouter
   */
  save(comment: Comment) {
    if(!this._updateMode) {
      this.setUp(comment);
      this._http.post("http://localhost:3000/comments", comment).subscribe();
    }else{
      comment.date = new Date();
      //Problème de fuseau horaire
      comment.date.setHours(comment.date .getHours()+1)
    }
    this._dialogRef.close(comment);
  }

  /**
   * On récupère les infos que l'on souhaite enregistrer
   * @param comment
   * @private
   */
  private setUp(comment: Comment) {
    // @ts-ignore
    comment.idOfBook = this.book.id;
    comment.date = new Date();
    comment.date.setHours(comment.date .getHours()+1)
    comment.start = this._start;
    comment.end = this._end;
  }

  get updateMode(): boolean {
    return this._updateMode;
  }

  get form(): FormGroup {
    return this._form;
  }
}
