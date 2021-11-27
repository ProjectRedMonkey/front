import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Book} from "../types/book.type";
import {filter} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.css']
})
export class BookViewComponent implements OnInit {
  private _book:any;
  id:string;

  constructor(private _http:HttpClient, private _route: ActivatedRoute) {
    this.id = "0";
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params['id'];
    });
    this._http.get<Book>("http://localhost:3000/books/"+this.id)
      .pipe(
        filter((book: Book) => !!book)
      )
      .subscribe({ next: (book: Book) => this._book = book});
  }

  get book(): any {
    return this._book;
  }

  set book(value: any) {
    this._book = value;
  }

  click() {
    var text = window.getSelection();
    if (text != null) {
      if (!text.isCollapsed) {
        console.log(text.toString());
      } else {
        console.log("Aucune donnée");
      }
    }
  }
}
