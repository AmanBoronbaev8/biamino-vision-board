
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { User } from '../types';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      // Since we don't have actual auth, we'll simulate with localStorage
      const savedUser = localStorage.getItem('biamino_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !users) {
        return false;
      }

      // Simple password check (in real app, this would be handled by Supabase Auth)
      const passwordMap: Record<string, string> = {
        'admin@biamino.com': 'admin123',
        'user@biamino.com': 'user123',
        'team@biamino.com': 'team123'
      };

      if (passwordMap[email] === password) {
        setUser(users);
        localStorage.setItem('biamino_user', JSON.stringify(users));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('biamino_user');
  };

  return { user, login, logout, loading };
};
