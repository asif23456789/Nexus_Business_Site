import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole, AuthContextType, Entrepreneur, Investor } from '../types';
import { users as demoUsers } from '../data/users';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = 'business_nexus_user';
const USERS_STORAGE_KEY = 'business_nexus_users';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';

// Helpers for persistent users
const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [...demoUsers]; // fallback to demo users
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // LOGIN
  const login = async (email: string, _password: string, role: UserRole): Promise<void> => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const allUsers = getStoredUsers();
      const foundUser = allUsers.find(
        u => u.email === email && u.role === role
      );

      if (!foundUser) {
        throw new Error('Invalid credentials or user not found');
      }

      setUser(foundUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (
    name: string,
    email: string,
    _password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const allUsers = getStoredUsers();

      if (allUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }

      let newUser: User;

      if (role === 'investor') {
        newUser = {
          id: `i${allUsers.length + 1}`,
          name,
          email,
          role: 'investor',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
          investmentInterests: [],
          investmentStage: [],
          portfolioCompanies: [],
          totalInvestments: 0,
          minimumInvestment: '$10,000',
          maximumInvestment: '$1,000,000'
        } as Investor;
      } else {
        newUser = {
          id: `e${allUsers.length + 1}`,
          name,
          email,
          role: 'entrepreneur',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
          startupName: '',
          pitchSummary: '',
          fundingNeeded: '',
          industry: '',
          location: '',
          foundedYear: new Date().getFullYear(),
          teamSize: 1
        } as Entrepreneur;
      }

      allUsers.push(newUser);
      saveUsers(allUsers);

      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const allUsers = getStoredUsers();
      const found = allUsers.find(u => u.email === email);

      if (!found) {
        throw new Error('No account found with this email');
      }

      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);

      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (token: string, _newPassword: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) {
        throw new Error('Invalid or expired reset token');
      }

      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Logout
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const allUsers = getStoredUsers();
      const index = allUsers.findIndex(u => u.id === userId);

      if (index === -1) {
        throw new Error('User not found');
      }

      const updatedUser = { ...allUsers[index], ...updates };
      allUsers[index] = updatedUser;
      saveUsers(allUsers);

      if (user?.id === userId) {
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
