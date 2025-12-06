import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { PlanType } from '@/types/plans';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string | null;
  businessId?: string | null;
  plan?: PlanType;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  business_id: string | null;
  plan: PlanType;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: { token: string; expiresAt: string } | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: any }>;
  updatePlan: (plan: PlanType) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ token: string; expiresAt: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get<{ user: User }>('/auth/me');
      setUser(response.user);
      setSession({ token, expiresAt: '' });
      
      if (response.user) {
        setProfile({
          id: response.user.id,
          full_name: response.user.fullName || '',
          avatar_url: response.user.avatarUrl || null,
          business_id: response.user.businessId || null,
          plan: response.user.plan || 'free',
          created_at: '',
          updated_at: '',
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      api.clearToken();
      setUser(null);
      setSession(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{
        success: boolean;
        user: User;
        token: string;
        expiresAt: string;
      }>('/auth/signin', { email, password });

      if (response.success) {
        api.setToken(response.token);
        setUser(response.user);
        setSession({ token: response.token, expiresAt: response.expiresAt });
        setProfile({
          id: response.user.id,
          full_name: response.user.fullName || '',
          avatar_url: response.user.avatarUrl || null,
          business_id: response.user.businessId || null,
          plan: response.user.plan || 'free',
          created_at: '',
          updated_at: '',
        });
        navigate('/dashboard');
        return { error: null };
      }
      return { error: new Error('Login failed') };
    } catch (error) {
      return { error };
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const response = await api.post<{
        success: boolean;
        user: User;
        token: string;
        expiresAt: string;
      }>('/auth/signup', { email, password, fullName });

      if (response.success) {
        api.setToken(response.token);
        setUser(response.user);
        setSession({ token: response.token, expiresAt: response.expiresAt });
        setProfile({
          id: response.user.id,
          full_name: fullName,
          avatar_url: null,
          business_id: null,
          plan: 'free',
          created_at: '',
          updated_at: '',
        });
        navigate('/dashboard');
        return { error: null };
      }
      return { error: new Error('Signup failed') };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/signout');
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      api.clearToken();
      setUser(null);
      setSession(null);
      setProfile(null);
      navigate('/login');
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      await api.patch('/auth/profile', data);
      if (profile) {
        setProfile({ ...profile, ...data });
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePlan = async (plan: PlanType) => {
    return updateProfile({ plan });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        updatePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
