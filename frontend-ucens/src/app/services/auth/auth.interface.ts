export interface LoginResponse {
  token: string;
}

export interface DecodedToken {
  id: string; 
  username: string;   
  sub: string;
  nbf: number;
  exp: number;
  iat: number;
}