import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SwapRequest, Rating, AdminMessage } from '../types';

interface DataContextType {
  users: User[];
  swapRequests: SwapRequest[];
  ratings: Rating[];
  adminMessages: AdminMessage[];
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  deleteSwapRequest: (id: string) => void;
  addRating: (rating: Omit<Rating, 'id' | 'createdAt'>) => void;
  banUser: (userId: string) => void;
  addAdminMessage: (message: Omit<AdminMessage, 'id' | 'createdAt'>) => void;
  searchUsers: (query: string) => User[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);

  useEffect(() => {
    // Initialize with sample data if empty
    const savedUsers = localStorage.getItem('users');
    if (!savedUsers) {
      const sampleUsers: User[] = [
        {
          id: '1',
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          location: 'Mumbai',
          skillsOffered: ['React', 'JavaScript', 'Node.js'],
          skillsWanted: ['Python', 'Machine Learning'],
          availability: ['Weekends', 'Evenings'],
          isProfilePublic: true,
          rating: 4.5,
          totalRatings: 12,
          isAdmin: false,
          isBanned: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Priya Patel',
          email: 'priya@example.com',
          location: 'Delhi',
          skillsOffered: ['Photoshop', 'UI/UX Design', 'Figma'],
          skillsWanted: ['React', 'Frontend Development'],
          availability: ['Weekdays', 'Mornings'],
          isProfilePublic: true,
          rating: 4.8,
          totalRatings: 8,
          isAdmin: false,
          isBanned: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'admin',
          name: 'Admin User',
          email: 'admin@skillswap.com',
          skillsOffered: [],
          skillsWanted: [],
          availability: [],
          isProfilePublic: false,
          rating: 0,
          totalRatings: 0,
          isAdmin: true,
          isBanned: false,
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
      setUsers(sampleUsers);
    } else {
      setUsers(JSON.parse(savedUsers));
    }

    // Load other data
    setSwapRequests(JSON.parse(localStorage.getItem('swapRequests') || '[]'));
    setRatings(JSON.parse(localStorage.getItem('ratings') || '[]'));
    setAdminMessages(JSON.parse(localStorage.getItem('adminMessages') || '[]'));
  }, []);

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedRequests = [...swapRequests, newRequest];
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    const updatedRequests = swapRequests.map(req =>
      req.id === id ? { ...req, ...updates, updatedAt: new Date().toISOString() } : req
    );
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const deleteSwapRequest = (id: string) => {
    const updatedRequests = swapRequests.filter(req => req.id !== id);
    setSwapRequests(updatedRequests);
    localStorage.setItem('swapRequests', JSON.stringify(updatedRequests));
  };

  const addRating = (rating: Omit<Rating, 'id' | 'createdAt'>) => {
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedRatings = [...ratings, newRating];
    setRatings(updatedRatings);
    localStorage.setItem('ratings', JSON.stringify(updatedRatings));

    // Update user rating
    const updatedUsers = users.map(user => {
      if (user.id === rating.toUserId) {
        const userRatings = updatedRatings.filter(r => r.toUserId === user.id);
        const avgRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
        return { ...user, rating: avgRating, totalRatings: userRatings.length };
      }
      return user;
    });
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const banUser = (userId: string) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, isBanned: true } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addAdminMessage = (message: Omit<AdminMessage, 'id' | 'createdAt'>) => {
    const newMessage: AdminMessage = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...adminMessages, newMessage];
    setAdminMessages(updatedMessages);
    localStorage.setItem('adminMessages', JSON.stringify(updatedMessages));
  };

  const searchUsers = (query: string): User[] => {
    if (!query.trim()) return users.filter(u => u.isProfilePublic && !u.isBanned);
    
    const lowercaseQuery = query.toLowerCase();
    return users.filter(user => 
      user.isProfilePublic && 
      !user.isBanned && 
      (user.name.toLowerCase().includes(lowercaseQuery) ||
       user.skillsOffered.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
       user.skillsWanted.some(skill => skill.toLowerCase().includes(lowercaseQuery)))
    );
  };

  return (
    <DataContext.Provider
      value={{
        users,
        swapRequests,
        ratings,
        adminMessages,
        createSwapRequest,
        updateSwapRequest,
        deleteSwapRequest,
        addRating,
        banUser,
        addAdminMessage,
        searchUsers,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};