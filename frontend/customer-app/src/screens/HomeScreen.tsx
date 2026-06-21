import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Button, Avatar, IconButton, useTheme, Chip, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const { 
    user, addresses, services, packages, orders, coupons,
    fetchUser, fetchAddresses, fetchServices, fetchPackages, fetchOrders, fetchCoupons, loading 
  } = useAppStore();

  useEffect(() => {
    fetchUser();
    fetchAddresses();
    fetchServices();
    fetchPackages();
    fetchOrders();
    fetchCoupons();
  }, []);

  const defaultAddress = addresses.find(a => a.is_default) || addresses[0];
  const userInitials = user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'U';
  
  const activeOrder = orders.find(o => !['delivered', 'cancelled'].includes(o.status));
  const topCoupon = coupons[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar.Text size={40} label={userInitials} style={{ backgroundColor: theme.colors.primary }} />
            <View style={styles.headerTextContainer}>
              <Text variant="labelMedium" style={{ color: 'gray' }}>Good Morning,</Text>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{user?.full_name || 'Guest User'}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.locationContainer}>
              <IconButton icon="map-marker" size={16} iconColor={theme.colors.primary} style={styles.iconMargin} />
              <Text variant="labelSmall" numberOfLines={1} style={styles.locationText}>
                {defaultAddress ? `${defaultAddress.flat_number}, ${defaultAddress.building_name}` : 'No Address Set'}
              </Text>
            </View>
            <IconButton icon="bell-outline" size={24} onPress={() => {}} />
          </View>
        </View>

        {/* Promotional Banner */}
        {topCoupon ? (
          <Card style={styles.bannerCard} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={styles.bannerTitle}>{topCoupon.discount_percentage}% OFF</Text>
              <Text variant="bodyMedium" style={styles.bannerSubtitle}>Use code {topCoupon.code} up to ₹{topCoupon.max_discount_amount} off!</Text>
              <Button mode="contained" compact style={styles.bannerButton} labelStyle={{ fontSize: 12 }}>
                Claim Now
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.bannerCard} mode="elevated">
            <Card.Content>
              <Text variant="titleLarge" style={styles.bannerTitle}>Welcome!</Text>
              <Text variant="bodyMedium" style={styles.bannerSubtitle}>We pick up, clean, and deliver.</Text>
            </Card.Content>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Button 
            mode="contained" 
            icon="truck-delivery" 
            style={styles.bookButton}
            contentStyle={{ paddingVertical: 8 }}
            onPress={() => navigation.navigate('Schedule')}
          >
            Schedule Pickup Now
          </Button>
        </View>

        {/* Active Order Widget */}
        {activeOrder && (
          <View>
            <Text variant="titleMedium" style={styles.sectionTitle}>Active Order</Text>
            <Card style={styles.activeOrderCard}>
              <Card.Content>
                <View style={styles.orderHeader}>
                  <Text variant="labelLarge" style={{ fontWeight: 'bold' }}>Order #{activeOrder.id.substring(0, 8).toUpperCase()}</Text>
                  <Chip icon="progress-clock" textStyle={{ fontSize: 10 }} style={{ backgroundColor: '#FFF3E0' }}>
                    {activeOrder.status.replace('_', ' ').toUpperCase()}
                  </Chip>
                </View>
                <Text variant="bodySmall" style={{ color: 'gray', marginTop: 4 }}>
                  Total: ₹{activeOrder.total_amount} | Pickup: {activeOrder.pickup_date}
                </Text>
                <Button mode="outlined" style={styles.trackButton} compact onPress={() => navigation.navigate('Orders')}>
                  Track Order
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Services Section */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>Our Services</Text>
        </View>
        {loading && services.length === 0 ? (
           <ActivityIndicator style={{ margin: 16 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScroll}>
            {services.map((service, index) => (
              <Surface key={service.id || index} style={styles.serviceItem} elevation={1}>
                {/* Fallback to tshirt icon since dynamic icons from DB aren't mapped yet */}
                <IconButton icon="tshirt-crew" size={32} iconColor={theme.colors.primary} />
                <Text variant="labelSmall" style={styles.serviceText}>{service.name}</Text>
              </Surface>
            ))}
            {/* Fallback UI if DB is empty */}
            {services.length === 0 && (
              <Text style={{ marginLeft: 16, color: 'gray' }}>No services available.</Text>
            )}
          </ScrollView>
        )}

        {/* Laundry Packages */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Laundry Packages</Text>
        {loading && packages.length === 0 ? (
           <ActivityIndicator style={{ margin: 16 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.packagesScroll}>
            {packages.map((pkg, index) => (
              <Card key={pkg.id || index} style={styles.packageCard} mode="outlined">
                <Card.Content>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{pkg.name}</Text>
                  <Text variant="bodySmall" style={{ color: 'gray', marginVertical: 4 }}>{pkg.description || 'Standard load'}</Text>
                  <Text variant="titleLarge" style={{ marginTop: 8, color: theme.colors.primary, fontWeight: 'bold' }}>₹{pkg.price}</Text>
                </Card.Content>
              </Card>
            ))}
            {/* Fallback UI if DB is empty */}
            {packages.length === 0 && (
              <Text style={{ marginLeft: 16, color: 'gray' }}>No packages available.</Text>
            )}
          </ScrollView>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTextContainer: { marginLeft: 12 },
  headerRight: { alignItems: 'flex-end' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', maxWidth: 120 },
  iconMargin: { margin: 0, padding: 0, width: 20, height: 20 },
  locationText: { color: 'gray' },
  bannerCard: {
    marginHorizontal: 16,
    backgroundColor: '#6200ee',
    borderRadius: 16,
  },
  bannerTitle: { color: 'white', fontWeight: 'bold' },
  bannerSubtitle: { color: 'white', marginBottom: 12, opacity: 0.9 },
  bannerButton: { backgroundColor: 'white', alignSelf: 'flex-start' },
  quickActions: { paddingHorizontal: 16, marginTop: 24 },
  bookButton: { borderRadius: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 },
  sectionTitle: { paddingHorizontal: 16, marginTop: 24, marginBottom: 12, fontWeight: 'bold' },
  activeOrderCard: { marginHorizontal: 16, borderRadius: 12, backgroundColor: '#f8f9fa' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackButton: { marginTop: 12, alignSelf: 'flex-start', borderRadius: 8 },
  servicesScroll: { paddingLeft: 16 },
  serviceItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 90,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  serviceText: { textAlign: 'center', fontSize: 10, paddingHorizontal: 4 },
  packagesScroll: { paddingLeft: 16 },
  packageCard: { width: 160, marginRight: 16, borderRadius: 16, backgroundColor: 'white' }
});
