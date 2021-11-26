import { Component, OnInit } from '@angular/core';
import {Book} from "../types/book.type";
import {BOOKS} from "../static/books";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: any;

  constructor() { }

  ngOnInit(): void {
    this.books = BOOKS;
  }

}
