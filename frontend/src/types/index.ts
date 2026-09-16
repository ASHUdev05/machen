export interface UserProfile {
  id: string; // uuid
  userName: string; // varchar(12)
  role: 'Admin' | 'User' | string;
}

export interface ToDoItem {
  id: string; // uuid
  title: string; // varchar(50)
  isComplete: boolean; // bool ("IsComplete" column)
  createdAt?: string; // timestamp with time zone ("CreatedAt")
  modifiedAt?: string; // timestamp with time zone ("ModifiedAt")
  userId: string; // uuid ("UserId" foreign key)
  userName?: string; // Populated directly from API projection
  user?: {
    id?: string;
    userName: string;
  };
}

export interface AuthResponse {
  token: string;
  accessToken?: string;
  refreshToken?: string;
  user?: UserProfile;
}