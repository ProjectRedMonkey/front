import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Book} from "../../types/book.type";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  private readonly _cancel$: EventEmitter<void>;
  private readonly _save$: EventEmitter<Book>;
  form:FormGroup;

  constructor() {
    this._cancel$ = new EventEmitter<void>();
    this._save$ = new EventEmitter<Book>();
    this.form = new FormGroup({
      title: new FormControl('',Validators.required),
      author: new FormControl('',Validators.required),
      category: new FormControl('',Validators.required),
      date: new FormControl(''),
      extract: new FormControl('',Validators.required),
      photo: new FormControl('', Validators.pattern(/^\w+\.jpg$/)),
    })
  }

  ngOnInit(): void {
  }

  @Output('cancel') get cancel$(): EventEmitter<any> {
    return this._cancel$;
  }

  @Output('addBook') get save$(): EventEmitter<Book> {
    return this._save$;
  }

  cancel(): void {
    this._cancel$.emit();
  }

  save(form:Book) {
    this._save$.emit(form);
  }

}
