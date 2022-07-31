import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { SpotifyContent } from '../models/spotify-content';
import {AccessToken} from '../models/access-token';
import {BODY_TYPE} from '../models/enums/header-type';
import {stringify} from "query-string";

@Injectable()
export class SpotifyService {
  private queryUrl = '';
  private authUrl = 'https://accounts.spotify.com/authorize?'; // used to retrieve auth token
  private accessUrl = 'https://accounts.spotify.com/api/token'; // used to retrieve access token
  private spotifyBaseURL = 'https://api.spotify.com/v1/';
  private clientId = '734a678bd1e9423c960a4270245a626e';
  private clientSecret = '7a0a567bb34c4aa08e5dafda1f4969f5'; // client secret safe??
  private redirectUrl = 'http://localhost:4200/'; // I should store this in environment map for test/prod cases //
  private authToken: string = '';
  private refreshToken: string = '';
  public accessToken: string = '';

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
    window.location.href =(this.authUrl +
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
    });
  }

  refreshAccessToken() {
    this.http.post<AccessToken>(this.accessUrl, this.getBody(BODY_TYPE.REFRESH_TOKEN) , this.accessRequestOptions).subscribe( tokenData => {
      this.refreshToken = tokenData.refresh_token;
      this.accessToken = tokenData.access_token;
    });
  }

  searchContent(query: string): Observable<SpotifyContent> {
    this.queryUrl = this.spotifyBaseURL + 'search?q=' + query + '&type=track&include_external=audio';
    return this.http.get<SpotifyContent>(this.queryUrl);
  }
}
