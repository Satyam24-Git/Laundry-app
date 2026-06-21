import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Button, Avatar, IconButton, useTheme, Chip, Surface, ActivityIndicator, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';

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
        
        {/* Header Background */}
        <View style={styles.headerBackground}>
          <View style={styles.headerTop}>
            <View>
              <Text variant="labelMedium" style={styles.locationLabel}>Location</Text>
              <View style={styles.locationRow}>
                <IconButton icon="map-marker" size={16} iconColor="#FFD700" style={styles.iconMargin} />
                <Text variant="titleMedium" numberOfLines={1} style={styles.locationText}>
                  {defaultAddress ? `${defaultAddress.city}, ${defaultAddress.state || 'Maharahshatra'}` : 'Pune, Maharahshatra'}
                </Text>
                <IconButton icon="chevron-down" size={16} iconColor="#FFD700" style={styles.iconMargin} />
              </View>
            </View>
            <View style={styles.avatarPlaceholder} />
          </View>
          
          <Searchbar
            placeholder="Search Service"
            onChangeText={() => {}}
            value=""
            style={styles.searchBar}
            inputStyle={{ minHeight: 0, fontSize: 14 }}
            iconColor="#4285F4"
            elevation={0}
          />
        </View>

        {/* Promotional Banner */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.specialTitle}>#SpecialForYou</Text>
          <Text variant="labelMedium" style={styles.seeAllText}>See All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersScroll} snapToInterval={(width * 0.85) + 16} decelerationRate="fast" snapToAlignment="start">
          {coupons.length > 0 ? (
            coupons.map((coupon, index) => (
              <LinearGradient key={coupon.id || index} colors={['#3a3a3a', '#909090']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.bannerCardGradient}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>Limited time!</Text>
                </View>
                <Text variant="titleMedium" style={styles.bannerTitleWhite}>Get Special Offer</Text>
                <View style={styles.offerRow}>
                  <Text variant="labelMedium" style={styles.bannerSubtitleWhite}>Up to</Text>
                  <View style={styles.percentContainer}>
                    <Text style={styles.bigPercent}>{coupon.discount_percentage}</Text>
                    <View style={styles.percentBadge}><Text style={styles.percentBadgeText}>%</Text></View>
                  </View>
                </View>
                <View style={styles.bannerBottomRow}>
                  <Text style={styles.termsText}>All Services Available | T&C Applied</Text>
                  <Button mode="contained" compact style={styles.claimButton} labelStyle={styles.claimButtonLabel}>
                    Claim
                  </Button>
                </View>
              </LinearGradient>
            ))
          ) : (
            <LinearGradient colors={['#3a3a3a', '#909090']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.bannerCardGradient}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>Limited time!</Text>
              </View>
              <Text variant="titleMedium" style={styles.bannerTitleWhite}>Welcome Offer</Text>
              <View style={styles.offerRow}>
                <Text variant="labelMedium" style={styles.bannerSubtitleWhite}>Up to</Text>
                <View style={styles.percentContainer}>
                  <Text style={styles.bigPercent}>40</Text>
                  <View style={styles.percentBadge}><Text style={styles.percentBadgeText}>%</Text></View>
                </View>
              </View>
              <View style={styles.bannerBottomRow}>
                <Text style={styles.termsText}>All Services Available | T&C Applied</Text>
                <Button mode="contained" compact style={styles.claimButton} labelStyle={styles.claimButtonLabel}>
                  Claim
                </Button>
              </View>
            </LinearGradient>
          )}
        </ScrollView>

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
  headerBackground: {
    backgroundColor: '#0093D9',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationLabel: { color: 'rgba(255,255,255,0.8)' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  iconMargin: { margin: 0, padding: 0, width: 20, height: 20 },
  locationText: { color: 'white', fontWeight: 'bold' },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)' },
  searchBar: { backgroundColor: 'white', borderRadius: 12, height: 48 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  specialTitle: { fontWeight: 'bold', fontSize: 18 },
  seeAllText: { color: '#0093D9' },
  offersScroll: { paddingLeft: 16 },
  bannerCardGradient: { width: width * 0.85, borderRadius: 16, padding: 16, marginRight: 16 },
  badgeContainer: { backgroundColor: 'white', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginBottom: 12 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: 'black' },
  bannerTitleWhite: { color: 'white', fontWeight: 'bold', marginBottom: 4 },
  offerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  bannerSubtitleWhite: { color: 'rgba(255,255,255,0.8)', marginRight: 8 },
  percentContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  bigPercent: { fontSize: 36, fontWeight: 'bold', color: 'white', lineHeight: 40 },
  percentBadge: { backgroundColor: '#0093D9', borderRadius: 10, width: 16, height: 16, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: -12, bottom: 4 },
  percentBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  bannerBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  termsText: { color: 'white', fontSize: 8, opacity: 0.8 },
  claimButton: { backgroundColor: '#FFD700', borderRadius: 20 },
  claimButtonLabel: { color: 'black', fontSize: 12, fontWeight: 'bold', marginVertical: 4 },
  paginationDots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#0093D9' },
  quickActions: { paddingHorizontal: 16, marginTop: 16 },
  bookButton: { borderRadius: 12 },
  sectionTitle: { paddingHorizontal: 16, marginTop: 24, marginBottom: 12, fontWeight: 'bold', fontSize: 18 },
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
