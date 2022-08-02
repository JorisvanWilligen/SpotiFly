import {Component, OnInit, ViewChild} from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import {ActivatedRoute} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {ResultBoxComponent} from './components/result-box/result-box.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'SpotiFly';
  @ViewChild(ResultBoxComponent) resultBox: ResultBoxComponent;

  constructor(private route: ActivatedRoute, private spotifyService: SpotifyService) {
  }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication() {
    if (localStorage.hasOwnProperty('accessToken')) { // check if tokens are in local storage
      this.spotifyService.setTokensFromLocal(localStorage.getItem('accessToken'), localStorage.getItem('refreshToken'));
    } else {
      const code = this.getParamValueQueryString('code');
      const error = this.getParamValueQueryString('error');
      const state = this.getParamValueQueryString('state');
      if (state !== localStorage.getItem("state")) {
        this.spotifyService.authUser();
      } else if (code && state == localStorage.getItem("state")) { // happy flow
        this.spotifyService.requestAccessToken(code);
      }
      if (error) { // not so happy flow
        // display error
      }
    }
  }

  sendToResultBox(results: any) {
    this.resultBox.setResult(results);
  }

  getParamValueQueryString( paramName ) { // could be static
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }


}
