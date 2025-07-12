export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isProfilePublic: boolean;
  rating: number;
  totalRatings: number;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  offeredSkill: string;
  wantedSkill: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'update';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}