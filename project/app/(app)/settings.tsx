import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { router } from 'expo-router';
import { Bell, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsScreen() {
  const { userProfile, updateProfile, isLoading } = useAuth();
const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [error, setError] = useState('');

  const handleSaveSettings = async () => {
    try {
      await updateProfile({
        // Remove notifications property as it's not part of the user profile type
      });
      Alert.alert('Éxito', 'Configuración guardada correctamente');
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuración</Text>
        <Text style={styles.subtitle}>Personaliza tu experiencia</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.form}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color="#666" />
            <Text style={styles.settingLabel}>Notificaciones</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSaveSettings}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    gap: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
});