import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {SpotifyService} from '../services/spotify.service';


@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private spotifyService: SpotifyService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if ( this.spotifyService.accessToken ) { // if our token is known we should use it to look up content
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.spotifyService.accessToken}`,
          'Content-Type': 'application/json'
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.spotifyService.refreshAccessToken();
        }
        if (err.status === 401) {
          localStorage.clear();
          this.spotifyService.authUser();
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
