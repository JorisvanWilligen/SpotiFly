import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AccessToken} from '../models/access-token';
import {stringify} from "query-string";
import {BODY_TYPE} from '../models/enums/header-type';
import {environment} from "../../environments/environment";
import {sha256} from "js-sha256";
import { encode } from 'js-base64';
import * as CryptoJS from 'crypto-js';


@Injectable()
export class SpotifyService {
  private authUrl = environment.authUrl;
  private accessUrl = environment.accessUrl;
  private spotifyBaseURL = environment.spotifyBaseURL;
  private clientId = environment.clientId;
  private baseUrl = environment.baseUrl;
  private queryUrl: string;
  private authToken: string;
  private refreshToken: string;
  public accessToken: string;

  @Output() searchResultsEmitted: EventEmitter<any> = new EventEmitter<any>();

  private accessHeader = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;'
  };
  private accessRequestOptions = {
    headers: new HttpHeaders(this.accessHeader),
  };

  constructor(private http: HttpClient) {
  }

  getRandomString(length){
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // helper function to generate a random number
  getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  authUser() {
    const codeVerifier = this.getRandomString(this.getRandomInt(43, 128));
    const state = this.getRandomString(12);

    // Set the code verifier and state in local storage so we can check it later
    localStorage.setItem('code-verifier', codeVerifier);
    localStorage.setItem('state', state);

    const codeVerifierHash = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64);
    const codeChallenge = codeVerifierHash
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // open constructed authentication url
    window.location.href = (this.authUrl +
      stringify({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.baseUrl,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
      }));
  };



  getBody(type: BODY_TYPE) {
    if (type === BODY_TYPE.ACCESS_TOKEN) { // can be switch if more types will be added
      return new HttpParams({
        fromObject: {
          code: this.authToken,
          redirect_uri: this.baseUrl,
          grant_type: 'authorization_code',
          client_id: environment.clientId,
          code_verifier: localStorage.getItem('code-verifier')!,
        }
      });
    } else {
      return new HttpParams({
        fromObject: {
          client_id: environment.clientId,
          code_verifier: localStorage.getItem('code-verifier')!,
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }
      });
    }
  }

  requestAccessToken(token: string) {
    this.authToken = token;
    this.http.post<AccessToken>(this.accessUrl, this.getBody(BODY_TYPE.ACCESS_TOKEN) , this.accessRequestOptions).subscribe( tokenData => {
      this.setTokenData(tokenData);
    });
  }

  setTokensFromLocal(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  refreshAccessToken() {
    this.http.post<AccessToken>(this.accessUrl, this.getBody(BODY_TYPE.REFRESH_TOKEN) , this.accessRequestOptions).subscribe( tokenData => {
      this.setTokenData(tokenData);
    });
  }

  setTokenData(tokenData: AccessToken) {
    this.refreshToken = tokenData.refresh_token;
    this.accessToken = tokenData.access_token;
    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('refreshToken', this.refreshToken);
  }

  searchContent(query: string): any {
    this.queryUrl = this.spotifyBaseURL + 'search?q=' + query + '&type=track,artist,album&include_external=audio&limit=12';
    return this.http.get<any>(this.queryUrl);
  }
}
