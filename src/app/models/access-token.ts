// source https://developer.spotify.com/documentation/general/guides/authorization/code-flow/

export class AccessToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
