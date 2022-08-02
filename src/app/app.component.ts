import {Component, OnInit, ViewChild} from '@angular/core';
import { SpotifyService } from './services/spotify.service';
import {ActivatedRoute} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {ResultBoxComponent} from './components/result-box/result-box.component';
import {HelperService} from "./shared/utils/helper.service";

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
      const code = HelperService.getParamValueQueryString('code');
      const error = HelperService.getParamValueQueryString('error');
      const state = HelperService.getParamValueQueryString('state');
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
}
