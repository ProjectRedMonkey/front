import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Book} from "../../types/book.type";
import {HttpClient} from "@angular/common/http";
import {defaultIfEmpty, filter} from "rxjs";

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

  constructor(private _http: HttpClient) {
    this.books = [];
    this._cancel$ = new EventEmitter<void>();
    this._save$ = new EventEmitter<Book>();
    this._model = {} as Book;
    this._form = this.buildForm();
  }

  ngOnInit(): void {
    this._form.patchValue(this._model);
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
      title: new FormControl('', Validators.compose([Validators.required, this.titleAlreadyExists(this.books)])),
      author: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      date: new FormControl(''),
      extract: new FormControl('', Validators.required),
      photo: new FormControl('', Validators.pattern(/\S+\.(jpg|jpeg|gif|png)$/)),
    });
  }
}
