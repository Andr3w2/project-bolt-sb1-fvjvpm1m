import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';

export default function AdminMessage() {
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');

  const handleSendMessage = () => {
    // TODO: Implement message sending logic with Supabase
    console.log('Sending message:', { title, message });
    setTitle('');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enviar Mensaje</Text>
      <TextInput
        style={styles.titleInput}
        placeholder="Título del mensaje"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.messageInput}
        placeholder="Escribe tu mensaje aquí..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        <Send size={20} color="#fff" />
        <Text style={styles.sendButtonText}>Enviar a todos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 15,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontFamily: 'Inter_400Regular',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 15,
    fontFamily: 'Inter_400Regular',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});