import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Bell, Calendar, TriangleAlert as AlertTriangle, MessageCircle } from 'lucide-react-native';

const notifications = [
  {
    id: '1',
    type: 'message',
    title: 'Mensaje del Administrador',
    description: 'Reunión de emergencia mañana a las 19:00',
    time: 'Hace 30 minutos',
    priority: 'high',
  },
  {
    id: '2',
    type: 'event',
    title: 'Mantenimiento de Piscina',
    description: 'Se realizará mantenimiento el día 15 de marzo',
    time: 'Hace 1 hora',
    priority: 'normal',
  },
  {
    id: '3',
    type: 'incident',
    title: 'Reporte de Ruido',
    description: 'Se ha reportado ruido excesivo en el bloque A',
    time: 'Hace 2 horas',
    priority: 'high',
  },
  {
    id: '4',
    type: 'event',
    title: 'Asamblea General',
    description: 'Reunión de propietarios este sábado',
    time: 'Hace 1 día',
    priority: 'normal',
  },
];

export default function NotificationsScreen() {
  const renderNotification = ({ item }) => {
    const getIcon = () => {
      switch (item.type) {
        case 'event':
          return <Calendar size={24} color="#007AFF" />;
        case 'incident':
          return <AlertTriangle size={24} color="#FF3B30" />;
        case 'message':
          return <MessageCircle size={24} color="#34C759" />;
        default:
          return <Bell size={24} color="#007AFF" />;
      }
    };

    const getBackgroundColor = () => {
      switch (item.priority) {
        case 'high':
          return '#FFF5F5';
        default:
          return '#fff';
      }
    };

    const getTitleColor = () => {
      switch (item.type) {
        case 'incident':
          return '#FF3B30';
        case 'message':
          return '#34C759';
        default:
          return '#000';
      }
    };

    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem,
          { backgroundColor: getBackgroundColor() }
        ]}
      >
        {getIcon()}
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            { color: getTitleColor() }
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationDescription}>{item.description}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Text style={styles.headerSubtitle}>Mantente informado de todo</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
  list: {
    padding: 20,
    gap: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
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
  notificationContent: {
    flex: 1,
    marginLeft: 15,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
});