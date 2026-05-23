// Matches UserDto from backend
export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  profilePicture?: string;
  createdAt: Date;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
  city?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  phoneNumber?: string;
  city?: string;
}
