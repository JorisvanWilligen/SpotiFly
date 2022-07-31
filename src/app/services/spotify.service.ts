import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AccessToken} from '../models/access-token';
import {stringify} from "query-string";
import {BODY_TYPE} from '../models/enums/header-type';


@Injectable()
export class SpotifyService {
  private queryUrl: string;
  private authUrl = 'https://accounts.spotify.com/authorize?'; // used to retrieve auth token
  private accessUrl = 'https://accounts.spotify.com/api/token'; // used to retrieve access token
  private spotifyBaseURL = 'https://api.spotify.com/v1/';
  private clientId = '734a678bd1e9423c960a4270245a626e';
  private clientSecret = '7a0a567bb34c4aa08e5dafda1f4969f5'; // client secret safe??
  private redirectUrl = 'http://localhost:4200/'; // I should store this in environment map for test/prod cases //
  private authToken: string;
  private refreshToken: string;
  public accessToken: string;

  @Output() searchResultsEmitted: EventEmitter<any> = new EventEmitter<any>();

  private accessHeader = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: 'Basic ' + (btoa(this.clientId + ':' + this.clientSecret))
  };
  private accessRequestOptions = {
    headers: new HttpHeaders(this.accessHeader),
  };

  constructor(private http: HttpClient) {
  }
  authUser() {
    // Maybe at state later? ( let state = random(16); )
    window.location.href = (this.authUrl +
      stringify({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUrl
      }));
  }

  getBody(type: BODY_TYPE) {
    if (type === BODY_TYPE.ACCESS_TOKEN) { // can be switch if more types will be added
      return new HttpParams({
        fromObject: {
          code: this.authToken,
          redirect_uri: this.redirectUrl,
          grant_type: 'authorization_code'
        }
      });
    } else {
      return new HttpParams({
        fromObject: {
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }
      });
    }
  }

  requestAccessToken(token: string) {
    this.authToken = token;
    this.http.post<AccessToken>(this.accessUrl, this.getBody(BODY_TYPE.ACCESS_TOKEN) , this.accessRequestOptions).subscribe( tokenData => {
      this.refreshToken = tokenData.refresh_token;
      this.accessToken = tokenData.access_token;
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    });
  }

  setTokensFromLocal(accessToken: any, refreshToken: any) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  refreshAccessToken() {
    this.http.post<AccessToken>(this.accessUrl, this.getBody(BODY_TYPE.REFRESH_TOKEN) , this.accessRequestOptions).subscribe( tokenData => {
      this.refreshToken = tokenData.refresh_token;
      this.accessToken = tokenData.access_token;
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
    });
  }

  searchContent(query: string): any {
    this.queryUrl = this.spotifyBaseURL + 'search?q=' + query + '&type=track,artist,album&include_external=audio&limit=12';
    return this.http.get<any>(this.queryUrl);
  }
}
