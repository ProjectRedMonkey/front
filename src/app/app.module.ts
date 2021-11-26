import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {RouterModule, Routes} from "@angular/router";
import { BookComponent } from './book/book.component';
import { BooksComponent } from './books/books.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import { BookViewComponent } from './book-view/book-view.component';

const appRoutes: Routes= [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path : 'home', component: HomeComponent },
  { path : 'books', component: BooksComponent },
  { path : 'books/:id', component: BookViewComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BookComponent,
    BooksComponent,
    PageNotFoundComponent,
    BookViewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
