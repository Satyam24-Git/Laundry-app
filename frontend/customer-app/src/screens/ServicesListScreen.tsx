import React from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppStore } from '../store/useAppStore';

import { useTheme, IconButton } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function ServicesListScreen() {
  const { services } = useAppStore();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {services.map((service, index) => {
            let imageUrl = service.icon_url;
            if (!imageUrl) {
              const n = service.name.toLowerCase();
              if (n.includes('fold')) imageUrl = "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=600&auto=format&fit=crop";
              else if (n.includes('iron') || n.includes('press')) imageUrl = "https://images.unsplash.com/photo-1517677129300-07b130802f46?q=80&w=600&auto=format&fit=crop";
              else if (n.includes('dry clean')) imageUrl = "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop";
              else if (n.includes('shoe')) imageUrl = "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop";
              else if (n.includes('blazer') || n.includes('suit')) imageUrl = "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop";
              else if (n.includes('blanket') || n.includes('household')) imageUrl = "https://images.unsplash.com/photo-1583847268964-b28e515d9cc0?q=80&w=600&auto=format&fit=crop";
              else imageUrl = "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=600&auto=format&fit=crop";
            }
            return (
              <View key={service.id || index} style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.serviceCardImage} resizeMode="cover" />
                ) : (
                  <View style={[styles.serviceCardImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant }]}>
                    <IconButton icon="washing-machine" size={48} iconColor="#0093D9" style={{ margin: 0 }} />
                  </View>
                )}
                <View style={styles.serviceCardContent}>
                  <Text variant="titleSmall" style={{ fontWeight: 'bold', textAlign: 'center', color: theme.colors.onSurface }} numberOfLines={1}>
                    {service.name}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: {
    width: (width - 48) / 2, // 2 cols with 16 padding on sides and 16 middle gap
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceCardImage: {
    width: '100%',
    height: 120,
  },
  serviceCardContent: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
