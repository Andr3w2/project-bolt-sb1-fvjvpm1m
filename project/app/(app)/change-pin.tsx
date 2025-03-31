import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Key } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function ChangePinScreen() {
  const { updatePin, isLoading } = useAuth();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleChangePin = async () => {
    try {
      if (!currentPin || !newPin || !confirmPin) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (newPin !== confirmPin) {
        throw new Error('Los PINs nuevos no coinciden');
      }

      if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
        throw new Error('El PIN debe tener exactamente 4 dígitos');
      }

      await updatePin(newPin);
      Alert.alert('Éxito', 'PIN actualizado correctamente');
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cambiar PIN</Text>
        <Text style={styles.subtitle}>Ingresa tu PIN actual y el nuevo PIN</Text>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Key size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="PIN actual"
            value={currentPin}
            onChangeText={setCurrentPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Key size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Nuevo PIN"
            value={newPin}
            onChangeText={setNewPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Key size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Confirmar nuevo PIN"
            value={confirmPin}
            onChangeText={setConfirmPin}
            secureTextEntry
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleChangePin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Actualizando...' : 'Actualizar PIN'}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f8f8',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  button: {
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