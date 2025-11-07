export interface LoginResponse {
  token: string;
}

export interface DecodedToken {
  id: string; // User ID (de ClaimTypes.NameIdentifier)
  username: string;   // User Name (de ClaimTypes.Name)
  sub: string;
  nbf: number;
  exp: number;
  iat: number;
}