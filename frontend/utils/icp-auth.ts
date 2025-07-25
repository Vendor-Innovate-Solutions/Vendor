import { Principal } from '@dfinity/principal';
import actor from './icp-service';

/**
 * ICP Authentication Utilities
 * 
 * This file contains utility functions for:
 * - User authentication using ICP Principals
 * - User registration and management
 * - Session management with ICP backend
 */

// Define types for API responses
interface AuthResponse {
  success: boolean;
  message: string;
  user?: any[];
  principal?: Principal[];
}

interface ICPResult<T> {
  ok?: T;
  err?: string;
}

// Store current user session
interface UserSession {
  principal: Principal;
  user: any;
  isAuthenticated: boolean;
}

let currentSession: UserSession | null = null;

// Get current authenticated principal
const getCurrentPrincipal = (): Principal | null => {
  return currentSession?.principal || null;
};

// Get current user
const getCurrentUser = (): any | null => {
  return currentSession?.user || null;
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return currentSession?.isAuthenticated || false;
};

// Login function - authenticate with username/password and get ICP Principal
const login = async (username: string, password: string): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    const response = await actor.authenticate(username, password) as AuthResponse;
    
    if (response.success) {
      // Store session information
      currentSession = {
        principal: response.principal![0], // Extract from optional
        user: response.user![0], // Extract from optional
        isAuthenticated: true,
      };
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('icp_session', JSON.stringify({
          principal: response.principal![0].toString(),
          user: response.user![0],
          isAuthenticated: true,
        }));
      }
      
      return {
        success: true,
        message: response.message,
        user: response.user![0],
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please check your connection and try again.',
    };
  }
};

// Register function
const register = async (
  username: string, 
  email: string, 
  password: string, 
  userType: 'admin' | 'employee' | 'manufacturer' | 'retailer',
  companyId?: number
): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    // Convert userType to ICP variant format
    const userTypeVariant = { [userType]: null };
    const companyIdOpt = companyId ? [companyId] : [];
    
    const response = await actor.register(username, email, password, userTypeVariant, companyIdOpt) as AuthResponse;
    
    if (response.success) {
      // Store session information
      currentSession = {
        principal: response.principal![0], // Extract from optional
        user: response.user![0], // Extract from optional
        isAuthenticated: true,
      };
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('icp_session', JSON.stringify({
          principal: response.principal![0].toString(),
          user: response.user![0],
          isAuthenticated: true,
        }));
      }
      
      return {
        success: true,
        message: response.message,
        user: response.user![0],
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please check your connection and try again.',
    };
  }
};

// Logout function
const logout = (): void => {
  currentSession = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('icp_session');
  }
};

// Restore session from localStorage
const restoreSession = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  
  try {
    const sessionData = localStorage.getItem('icp_session');
    if (!sessionData) return false;
    
    const session = JSON.parse(sessionData);
    const principal = Principal.fromText(session.principal);
    
    // Verify session is still valid by calling backend
    const userResult = await actor.getUserByPrincipal(principal) as ICPResult<any>;
    
    if (userResult.ok) {
      currentSession = {
        principal,
        user: userResult.ok,
        isAuthenticated: true,
      };
      return true;
    } else {
      // Session invalid, clear it
      localStorage.removeItem('icp_session');
      return false;
    }
  } catch (error) {
    console.error('Session restoration error:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('icp_session');
    }
    return false;
  }
};

// Get user by ID
const getUserById = async (userId: number): Promise<any | null> => {
  try {
    const result = await actor.getUserById(userId) as ICPResult<any>;
    if (result.ok) {
      return result.ok;
    } else {
      console.error('Get user error:', result.err);
      return null;
    }
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

// Update user
const updateUser = async (userId: number, userData: any): Promise<{ success: boolean; message: string; user?: any }> => {
  try {
    const result = await actor.updateUser(userId, userData) as ICPResult<any>;
    if (result.ok) {
      // Update current session if updating current user
      if (currentSession && currentSession.user.id === userId) {
        currentSession.user = result.ok;
        if (typeof window !== 'undefined') {
          localStorage.setItem('icp_session', JSON.stringify({
            principal: currentSession.principal.toString(),
            user: result.ok,
            isAuthenticated: true,
          }));
        }
      }
      return {
        success: true,
        message: 'User updated successfully',
        user: result.ok,
      };
    } else {
      return {
        success: false,
        message: result.err || 'Update failed',
      };
    }
  } catch (error) {
    console.error('Update user error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.',
    };
  }
};

// Password reset functions (these would need to be implemented in the backend)
const forgotPassword = async (username: string, email: string): Promise<{ message?: string; error?: string }> => {
  // For now, return a placeholder response
  return { error: 'Password reset functionality is not yet implemented with ICP backend.' };
};

const verifyOTP = async (username: string, otp: string): Promise<{ message?: string; error?: string }> => {
  // For now, return a placeholder response
  return { error: 'OTP verification functionality is not yet implemented with ICP backend.' };
};

const resetPassword = async (
  username: string, 
  otp: string, 
  newPassword: string, 
  confirmPassword: string
): Promise<{ message?: string; error?: string }> => {
  // For now, return a placeholder response
  return { error: 'Password reset functionality is not yet implemented with ICP backend.' };
};

const resendOTP = async (username: string): Promise<{ message?: string; error?: string }> => {
  // For now, return a placeholder response
  return { error: 'OTP resend functionality is not yet implemented with ICP backend.' };
};

export { 
  login,
  register,
  logout,
  getCurrentPrincipal,
  getCurrentUser,
  isAuthenticated,
  restoreSession,
  getUserById,
  updateUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP
};
