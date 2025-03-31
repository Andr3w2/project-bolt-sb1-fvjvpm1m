import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { router } from 'expo-router';
import { Session } from '@supabase/supabase-js';

type UserProfile = Database['public']['Tables']['users']['Row'];

export function useAuth() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchPublicProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .limit(1);
          
        if (!mounted) return;
        
        if (error) throw error;
        
        if (data) {
          setUserProfile(data[0]);
        }
      } catch (error) {
        console.error('Error fetching public profile:', error);
      } finally {
        if (mounted) setIsLoading(false);
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
          
          // Solo navegar si no estamos ya en la ruta de la app
          if (!window.location.pathname.includes('/(app)')) {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(app)/(tabs)');
            }
          }
        } else {
          // Solo limpiar y redirigir si no estamos ya en la ruta de auth
          if (!window.location.pathname.includes('/(auth)')) {
            setSession(null);
            setUserProfile(null);
            setIsLoading(false);
            router.replace('/(auth)/login');
          }
        }
      }
    );

supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
  if (error) {
    console.error('Error checking session:', error);
  } else {
    setSession(initialSession);
    if (initialSession?.user) {
      fetchUserProfile(initialSession.user.id).catch(error => {
        console.error('Error fetching initial user profile:', error);
      });
    }
  }
});

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
        password
      });

      if (error) throw error;

      if (data.session) {
        await fetchUserProfile(data.session.user.id);
router.replace('/(app)/(tabs)');
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
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
    if (!session) return false;
    return userProfile?.role === 'admin' && session.user.email === 'cesar1818@gmail.com';
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