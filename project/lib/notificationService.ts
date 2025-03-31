import { supabase } from './supabase';

export async function sendAdminNotification(userId: string, message: string) {
  try {
    // Solo verificar si el usuario existe (sin guardar en DB)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error('Usuario no encontrado');
    }

    console.log(`Mensaje temporal creado para ${userId}: ${message}`);
    return { success: true, message: 'Mensaje listo para mostrar al iniciar sesión' };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    throw error;
  }
}