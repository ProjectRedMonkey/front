import {Component, Input, OnInit} from '@angular/core';
import {Book} from "../types/book.type";
import {BOOKS} from "../static/books";

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  private _book:any;

  constructor() {
    this._book = BOOKS[0];
  }

  ngOnInit(): void {

  }

  get book(): any {
    return this._book;
  }

  @Input()
  set book(value: any) {
    this._book = value;
  }
}
