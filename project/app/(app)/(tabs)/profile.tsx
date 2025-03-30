import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Settings, LogOut, Bell, Key } from 'lucide-react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { session, isLoading } = useAuth();
  
  const getFirstNameLastName = (fullName: string) => {
    const names = fullName.split(' ');
    return `${names[0]} ${names[names.length - 1]}`;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>No hay sesión activa</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{getFirstNameLastName(session.user?.user_metadata?.full_name || session.user?.email || '')}</Text>
        <Text style={styles.email}>{session.user?.email}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Bell size={24} color="#007AFF" />
          <Text style={styles.menuText}>Notificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Key size={24} color="#007AFF" />
          <Text style={styles.menuText}>Cambiar PIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Settings size={24} color="#007AFF" />
          <Text style={styles.menuText}>Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]}
          onPress={async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) {
              router.replace('/(auth)/login');
            }
          }}
        >
          <LogOut size={24} color="#FF3B30" />
          <Text style={[styles.menuText, styles.logoutText]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#FF3B30',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});