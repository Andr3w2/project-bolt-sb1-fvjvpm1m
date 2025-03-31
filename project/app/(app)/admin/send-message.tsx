import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { sendAdminNotification } from '@/lib/notificationService';
import { useAuth } from '@/hooks/useAuth';

export default function SendMessageScreen() {
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { userProfile } = useAuth();

  const handleSendMessage = async () => {
    if (!message.trim() || !userId.trim()) {
      Alert.alert('Error', 'Por favor ingresa un mensaje y un ID de usuario');
      return;
    }

    try {
      setIsSending(true);  // This sets the loading state to true
      const result = await sendAdminNotification(userId, message);
      Alert.alert('Éxito', result.message);
      setMessage('');
      setUserId('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el mensaje');
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Mensaje</Text>
      
      <TextInput
        style={styles.input}
        placeholder="ID del Usuario"
        value={userId}
        onChangeText={setUserId}
      />
      
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Escribe tu mensaje aquí"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSendMessage}
        disabled={isSending}
      >
        <Text style={styles.buttonText}>
          {isSending ? 'Enviando...' : 'Enviar Mensaje'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});