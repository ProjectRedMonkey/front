import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Book} from "../../types/book.type";
import {HttpClient} from "@angular/common/http";
import {defaultIfEmpty, filter} from "rxjs";
import {DatePipe} from "@angular/common";
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  private readonly _cancel$: EventEmitter<void>;
  private readonly _save$: EventEmitter<Book>;
  private _form: FormGroup;
  private _model: Book;
  books: Book[];

  constructor(private _http: HttpClient, private dateAdapter: DateAdapter<Date>) {
    this.books = [];
    this._cancel$ = new EventEmitter<void>();
    this._save$ = new EventEmitter<Book>();
    this._model = {} as Book;
    this.dateAdapter.setLocale('en-GB');
    this._form = this.buildForm();
  }

  ngOnInit(): void {
    this._http.get<Book[]>("http://localhost:3000/books")
      .pipe(
        filter((books: Book[]) => !!books),
        defaultIfEmpty([])
      )
      .subscribe({
        next: (books: Book[]) => {
          this.books = books
        }
      });
    this._form = this.buildForm();
    this._form.patchValue(this._model);
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

  save(form: Book) {
    this._save$.emit(form);
  }

  get model(): Book {
    return this._model;
  }

  @Input()
  set model(value: Book) {
    this._model = value;
  }

  get form(): FormGroup {
    return this._form;
  }

  titleAlreadyExists(books:Book[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let res = false;
      this.books.forEach(ele => {if(ele.title == control.value)
      res = true})
      // @ts-ignore
      return !res ? null : {
        titleAlreadyExists: true
      }
    };
  }

  private buildForm() {
    return new FormGroup({
      title: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2),
        Validators.maxLength(40), this.titleAlreadyExists(this.books)])),
      author: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2),
        Validators.maxLength(40)])),
      category: new FormControl('', Validators.compose([Validators.required, Validators.minLength(2),
        Validators.maxLength(40)])),
      page: new FormControl('', Validators.required),
      date: new FormControl(''),
      extract: new FormControl('', Validators.compose([Validators.required, Validators.minLength(50),
        Validators.maxLength(2000)])),
      photo: new FormControl('', Validators.pattern(/\S+\.(jpg|jpeg|gif|png)$/)),
    });
  }
}
