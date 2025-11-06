export interface User {
  id: number;
  userName: string; // Corresponde ao 'Nome' no UserDTO.cs
  email: string;
}

export interface UserCreate {
  userName: string; // Corresponde ao 'Nome' no UserCreateDTO.cs
  email: string;
  senha?: string;
}

export interface UserUpdate {
  userName?: string; // Corresponde ao 'Nome' no UserUpdateDTO.cs
  email?: string;
  senha?: string; // Opcional
}