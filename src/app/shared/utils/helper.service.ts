import { Injectable } from '@angular/core';
import * as CryptoJS from "crypto-js";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HelperService { //maybe this does not have to be a service due to statics

  constructor() { }

  // helper function to generate a random number
  static getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Helper function to generate a random string where parameter is length
  static getRandomString(length){
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  // Helper function to generate a code challenge used in PKCE
  static generateCodeChallenge(codeVerifier : string){
    return CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  // Helper function to get a parameter from the URL
  static getParamValueQueryString( paramName ) { // could be static
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
    }
    return paramValue;
  }
}
