import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type User = Database['public']['Tables']['users']['Row'];

type Session = {
  email: any;
  full_name: any;
  id: any;
  user: {
    id: string;
    email: string;
    user_metadata: {
      full_name: string;
    };
  };
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export function useAuth() {
  const [user, setUser] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setLoading(false);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.replace('/(app)/(tabs)');
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, pin: string) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      const { error: profileError } = await supabase.from('users').insert({
        email,
        full_name: fullName,
        pin,
        role: 'user',
      });

      if (profileError) throw profileError;

      router.replace('/(auth)/login');
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    session: user ? {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.full_name
        }
      },
      access_token: '',
      refresh_token: '',
      expires_in: 0,
      token_type: 'bearer'
    } : null,
    isLoading: loading,
    signIn,
    signUp,
    signOut,
  };
}