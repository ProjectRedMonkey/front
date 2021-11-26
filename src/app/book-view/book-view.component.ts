import { Component, OnInit } from '@angular/core';
import {BOOKS} from "../static/books";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-book-view',
  templateUrl: './book-view.component.html',
  styleUrls: ['./book-view.component.css']
})
export class BookViewComponent implements OnInit {
  private _book:any;
  id:string;

  constructor(private _route: ActivatedRoute) {
    this.id = "0";
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params['id'];
    });
    this._book = BOOKS.find(element => element.id == this.id);
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
