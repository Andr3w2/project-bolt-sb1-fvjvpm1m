import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Key, UserPlus, Users } from 'lucide-react-native';
import AdminMessage from '@/components/AdminMessage';

export default function AdminScreen() {
  const [newPin, setNewPin] = useState('');

  const generatePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setNewPin(pin);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Administración</Text>
        <Text style={styles.headerSubtitle}>Gestiona usuarios y notificaciones</Text>
      </View>

      <AdminMessage />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generar PIN</Text>
        <View style={styles.pinContainer}>
          <TextInput
            style={styles.pinInput}
            value={newPin}
            placeholder="PIN generado"
            editable={false}
          />
          <TouchableOpacity style={styles.generateButton} onPress={generatePin}>
            <Key size={20} color="#fff" />
            <Text style={styles.buttonText}>Generar PIN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usuarios Pendientes</Text>
        <View style={styles.usersList}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.userItem}>
              <UserPlus size={24} color="#007AFF" />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>María González</Text>
                <Text style={styles.userEmail}>maria@example.com</Text>
              </View>
              <TouchableOpacity style={styles.approveButton}>
                <Text style={styles.approveText}>Aprobar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Usuarios Activos</Text>
        <View style={styles.usersList}>
          {[1, 2].map((item) => (
            <View key={item} style={styles.userItem}>
              <Users size={24} color="#007AFF" />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Juan Pérez</Text>
                <Text style={styles.userEmail}>juan@example.com</Text>
              </View>
              <TouchableOpacity style={styles.blockButton}>
                <Text style={styles.blockText}>Bloquear</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 15,
  },
  pinContainer: {
    gap: 15,
  },
  pinInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Inter_600SemiBold',
    backgroundColor: '#f8f8f8',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  usersList: {
    gap: 15,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  approveButton: {
    backgroundColor: '#34C759',
    padding: 8,
    borderRadius: 6,
  },
  approveText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  blockButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  blockText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});