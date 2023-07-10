export interface RefreshTokenRequestBody {
  grant_type: string;
  refresh_token: string;
  client_id: string;
}
