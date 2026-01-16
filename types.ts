
export type UserRole = 'user' | 'admin' | 'senior_admin' | 'finance_admin' | 'super_admin';
export type PremiumTier = 'none' | 'basic' | 'standard' | 'elite';

export type AdminPermission = 
  | 'canBlockUsers' 
  | 'canEditFunds' 
  | 'canApproveWithdrawals' 
  | 'canManageStaff' 
  | 'canViewAnalytics'
  | 'canViewRevenue';

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  balance: number;
  dailyCount: number;
  role: UserRole;
  isPremium: boolean;
  premiumTier?: PremiumTier;
  isBlocked: boolean;
  completedSurveys: string[];
  activationCode?: string; // M-Pesa code used for registration
  premiumCode?: string;    // M-Pesa code used for premium upgrade
  notes?: string;          // Internal admin notes
  permissions?: AdminPermission[]; // For admin roles
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface Survey {
  id: string;
  title: string;
  category: string;
  questions: Question[];
}

export interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning';
}

export enum Page {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  PAYMENT = 'PAYMENT',
  MENU = 'MENU',
  DASHBOARD = 'DASHBOARD',
  SURVEYS = 'SURVEYS',
  WITHDRAW = 'WITHDRAW',
  PROFILE = 'PROFILE',
  HELP = 'HELP',
  ADMIN = 'ADMIN',
  SENIOR_ADMIN = 'SENIOR_ADMIN',
  FINANCE_ADMIN = 'FINANCE_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  RULES = 'RULES',
  PRIVACY = 'PRIVACY',
  SETTINGS = 'SETTINGS',
  AI_SUPPORT = 'AI_SUPPORT'
}
