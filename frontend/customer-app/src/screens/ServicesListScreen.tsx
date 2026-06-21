import React from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

export default function ServicesListScreen() {
  const { services } = useAppStore();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {services.map((service, index) => (
            <View key={service.id || index} style={styles.serviceItemContainer}>
              <View style={styles.serviceIconCircle}>
                <Image source={{ uri: service.image_url || 'https://cdn-icons-png.flaticon.com/512/3003/3003984.png' }} style={styles.serviceImage} />
              </View>
              <Text style={styles.serviceText}>{service.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceItemContainer: {
    alignItems: 'center',
    width: (width - 48) / 3, // 3 columns
    marginBottom: 24,
  },
  serviceIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceImage: {
    width: 32,
    height: 32,
  },
  serviceText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});
