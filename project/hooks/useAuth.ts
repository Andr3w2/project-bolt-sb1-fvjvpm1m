import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['users']['Row'];

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // 1. Verificar sesión existente
    const checkSession = async () => {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      
      if (session) {
        setSession(session);
        await fetchUserProfile(session.user.id);
        setIsLoading(false);
      }
    };

    // 2. Configurar listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event);
        
        if (session) {
          setSession(session);
          await fetchUserProfile(session.user.id);
          setIsLoading(false);
        } else {
          setSession(null);
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    );

    checkSession();
    
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        setSession(data.session);
        await fetchUserProfile(data.session.user.id);
        router.replace('/(app)/(tabs)');
        console.log('Session established:', data.session);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, pin: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          full_name: fullName,
          pin,
          role: 'user',
        });

        if (profileError) throw profileError;

        router.replace('/(auth)/login');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setSession(null);
      setUserProfile(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  return {
    session,
    userProfile,
    isLoading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };
}
setIsLoading(false);