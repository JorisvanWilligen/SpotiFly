import {Component, OnInit} from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import {ActivatedRoute} from '@angular/router';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SpotiFly';
  searchText = '';

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication() {
    const code = this.getParamValueQueryString('code');
    const error = this.getParamValueQueryString('test');
    if (!code && !error) {
      this.spotifyService.authUser();
    } else if (code) { // happy flow
      this.spotifyService.requestAccessToken(code);
    } else if (error) { // not so happy flow
      // display error
    }
  }

  onKey($event: KeyboardEvent) {
    this.spotifyService.searchContent(this.searchText)
      .subscribe(result => {
        console.log(result);
      });
  }

  getParamValueQueryString( paramName: string ) { // could be static
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }


}
