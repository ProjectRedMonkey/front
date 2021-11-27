import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Book} from "../types/book.type";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  private _book:Book;
  private readonly _delete$: EventEmitter<string>;

  constructor(private _http: HttpClient) {
    this._book = {} as Book;
    this._delete$ = new EventEmitter<string>();
  }

  ngOnInit(): void {

  }

  @Output('delete') get delete$(): EventEmitter<string> {
    return this._delete$;
  }

  delete(id:string) {
    this._delete$.emit(id);
  }

  get book(): any {
    return this._book;
  }

  @Input()
  set book(value: any) {
    this._book = value;
  }
}
