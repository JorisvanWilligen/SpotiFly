// source hhttps://developer.spotify.com/documentation/general/guides/authorization/code-flow/

export class AccessToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}
