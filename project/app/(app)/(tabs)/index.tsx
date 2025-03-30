import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, DoorOpen } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accesos Recientes</Text>
        <View style={styles.accessList}>
          {[1, 2, 3].map((item) => (
            <View key={item} style={styles.accessItem}>
              <DoorOpen size={24} color="#007AFF" />
              <View style={styles.accessInfo}>
                <Text style={styles.accessName}>Juan Pérez</Text>
                <Text style={styles.accessTime}>Hoy, 14:30</Text>
              </View>
              <Text style={styles.accessType}>Entrada</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reportes Activos</Text>
        <View style={styles.reportList}>
          {[1, 2].map((item) => (
            <TouchableOpacity key={item} style={styles.reportItem}>
              <AlertTriangle size={24} color="#FF3B30" />
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>Falla en iluminación</Text>
                <Text style={styles.reportDescription}>
                  Área de estacionamiento, sector B
                </Text>
                <Text style={styles.reportTime}>Hace 2 horas</Text>
              </View>
            </TouchableOpacity>
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
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 15,
  },
  accessList: {
    gap: 15,
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
  },
  accessInfo: {
    flex: 1,
    marginLeft: 15,
  },
  accessName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  accessTime: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_400Regular',
  },
  accessType: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'Inter_600SemiBold',
  },
  reportList: {
    gap: 15,
  },
  reportItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 8,
  },
  reportInfo: {
    flex: 1,
    marginLeft: 15,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FF3B30',
  },
  reportDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  reportTime: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
});