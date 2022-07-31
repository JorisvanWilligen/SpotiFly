import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptorService} from "./interceptors/token-interceptor.service";
import {SpotifyService} from "./services/spotify.service";
import {SearchBoxComponent} from "./components/search-box/search-box.component";
import {ResultBoxComponent} from "./components/result-box/result-box.component";

@NgModule({
  declarations: [
    AppComponent,
    SearchBoxComponent,
    ResultBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    SpotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
