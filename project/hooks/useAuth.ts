import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import { router } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { Alert } from 'react-native';

type UserProfile = Database['public']['Tables']['users']['Row'];

// Función auxiliar para manejar errores
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) return String(error.message);
  return 'Error desconocido';
}

export function useAuth() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      console.log('Perfil obtenido:', data); // Debug
      setUserProfile(data);
      return data;
    } catch (err) {
      console.error('Detalles del error:', err); // Más detalle
      const errorMessage = getErrorMessage(err);
      setError('Error al cargar el perfil');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (sessionError) throw sessionError;

        console.log('Sesión inicial:', initialSession); // Debug
        
        if (initialSession?.user) {
          setSession(initialSession);
          const profile = await fetchUserProfile(initialSession.user.id);
          if (!profile) {
            setError('No se encontró el perfil');
          }
        } else {
          console.log('No hay sesión activa'); // Debug
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error de inicialización:', err); // Debug detallado
        const errorMessage = getErrorMessage(err);
        setError('Error al verificar sesión');
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event);
        setSession(session);
        
        try {
          if (session?.user) {
            await fetchUserProfile(session.user.id);
          } else {
            setUserProfile(null);
          }
        } catch (err) {
          const errorMessage = getErrorMessage(err);
          console.error('Error handling auth state change:', errorMessage);
          setError('Error al actualizar el estado de autenticación');
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (data.session) {
        await fetchUserProfile(data.session.user.id);
        router.replace('/(app)/(tabs)');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Login error:', errorMessage);
      setError('Credenciales incorrectas o error de conexión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, pin: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Validación básica del PIN (4 dígitos)
      if (!/^\d{4}$/.test(pin)) {
        throw new Error('El PIN debe tener exactamente 4 dígitos');
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: profileError } = await supabase.from('users').upsert({
          id: data.user.id,
          email,
          full_name: fullName,
          pin,
          role: 'resident',
          apartment_number: null,
        });

        if (profileError) throw profileError;

        // Enviar email de verificación
        await supabase.auth.resend({
          type: 'signup',
          email,
        });

        router.replace('/(auth)/verify-email' as `${string}:verify-email`);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Signup error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = async (userId: string, darkMode: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ preferences: { dark_mode: darkMode } })
        .eq('id', userId);
      
      if (error) throw error;
      
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) setUserProfile(data);
    } catch (err) {
      console.error('Error al cambiar el modo oscuro:', err);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      setSession(null);
      setUserProfile(null);
      router.replace('/(auth)/login');
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error signing out:', errorMessage);
      setError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };



  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setUserProfile(data);
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error updating profile:', errorMessage);
      setError('Error al actualizar el perfil');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const isResident = () => {
    return userProfile?.role === 'user';
  };

  const updatePin = async (newPin: string) => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error: updateError } = await supabase
        .from('users')
        .update({ pin: newPin })
        .eq('id', session.user.id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setUserProfile(data);
      return data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      console.error('Error updating PIN:', errorMessage);
      setError('Error al actualizar el PIN');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    userProfile,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePin,
    isAdmin,
    isResident,
    fetchUserProfile,
  };
}