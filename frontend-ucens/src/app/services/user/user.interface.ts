export interface User {
  id: number;
  userName: string; 
  email: string;
}

export interface UserCreate {
  userName: string; 
  email: string;
  senha?: string;
}

export interface UserUpdate {
  userName?: string; 
  email?: string;
  senha?: string; 
}