import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Text, Card, Button, Avatar, IconButton, useTheme, Chip, Surface, ActivityIndicator, Searchbar, Portal, Modal, List, Divider, Snackbar, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';
import { MapWrapper } from '../components/MapWrapper';
import * as Location from 'expo-location';
import { apiClient } from '../api/client';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const { 
    user, addresses, services, packages, orders, coupons,
    fetchUser, fetchAddresses, fetchServices, fetchPackages, fetchOrders, fetchCoupons, loading 
  } = useAppStore();

  const [locationModalVisible, setLocationModalVisible] = React.useState(false);
  const [activeAddressId, setActiveAddressId] = React.useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [mapRegion, setMapRegion] = React.useState({
    latitude: 28.6139,
    longitude: 77.2090, // default new delhi
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedCoordinate, setSelectedCoordinate] = React.useState<any>(null);
  
  const [newAddress, setNewAddress] = React.useState({
    title: '',
    flat_number: '',
    building_name: '',
    area: '',
    city: '',
    pincode: '',
    is_default: false,
  });
  const [isSavingAddress, setIsSavingAddress] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);

  const startEditingAddress = (addr: any) => {
    setEditingAddressId(addr.id);
    setNewAddress({
      title: addr.title || '',
      flat_number: addr.flat_number || '',
      building_name: addr.building_name || '',
      area: addr.area || '',
      city: addr.city || '',
      pincode: addr.pincode || '',
      is_default: addr.is_default || false,
    });
    setIsAddingAddress(true);
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow location access to use this feature.');
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setMapRegion({ ...coords, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      setSelectedCoordinate(coords);
      handleReverseGeocode(coords);
    } catch (e) {
      console.log('Error getting location', e);
    }
  };

  const handleReverseGeocode = async (coords: any) => {
    try {
      const addressResp = await Location.reverseGeocodeAsync(coords);
      if (addressResp && addressResp.length > 0) {
        const addr = addressResp[0];
        setNewAddress(prev => ({
          ...prev,
          area: addr.district || addr.subregion || addr.city || prev.area,
          city: addr.city || addr.region || prev.city,
          pincode: addr.postalCode || prev.pincode,
          building_name: addr.street || addr.name || prev.building_name,
        }));
      }
    } catch (e) {
      console.log('Geocoding error', e);
    }
  };

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setSelectedCoordinate(coords);
    handleReverseGeocode(coords);
  };

  const saveInlineAddress = async () => {
    if (!newAddress.title || !newAddress.area || !newAddress.city) {
      Alert.alert('Error', 'Please fill at least Title, Area, and City');
      return;
    }
    setIsSavingAddress(true);
    try {
      if (editingAddressId) {
        await apiClient.put(`/users/me/addresses/${editingAddressId}`, newAddress);
      } else {
        await apiClient.post('/users/me/addresses', newAddress);
      }
      await fetchAddresses();
      Alert.alert('Success', 'Address saved successfully');
      setIsAddingAddress(false);
      setEditingAddressId(null);
      setNewAddress({ title: '', flat_number: '', building_name: '', area: '', city: '', pincode: '', is_default: false });
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to save address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const [copiedCode, setCopiedCode] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchUser();
    fetchAddresses();
    fetchServices();
    fetchPackages();
    fetchOrders();
    fetchCoupons();
  }, []);

  const defaultAddress = addresses?.find(a => a.is_default) || (addresses?.length > 0 ? addresses[0] : null);
  const currentAddress = activeAddressId ? addresses.find(a => a.id === activeAddressId) : defaultAddress;
  const userInitials = user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'U';
  
  const activeOrder = orders.find(o => !['delivered', 'cancelled'].includes(o.status));
  const topCoupon = coupons[0];

  const handleClaim = async (code: string) => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    setSnackbarVisible(true);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchUser(),
      fetchAddresses(),
      fetchServices(),
      fetchPackages(),
      fetchOrders(),
      fetchCoupons()
    ]);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0093D9']} />}
      >
        
        {/* Header Background */}
        <View style={styles.headerBackground}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => setLocationModalVisible(true)} style={styles.locationContainer}>
              <IconButton icon="map-marker" size={28} iconColor="#FFD700" style={styles.largeIconMargin} />
              <View style={styles.locationTextContainer}>
                <View style={styles.locationRow}>
                  <Text variant="titleMedium" numberOfLines={1} style={styles.locationText}>
                    {currentAddress ? `${currentAddress.flat_number ? currentAddress.flat_number + ', ' : ''}${currentAddress.building_name ? currentAddress.building_name + ', ' : ''}${currentAddress.area ? currentAddress.area + ', ' : ''}${currentAddress.city}` : 'Select Location'}
                  </Text>
                  <IconButton icon="chevron-down" size={20} iconColor="#FFD700" style={styles.iconMargin} />
                </View>
              </View>
            </TouchableOpacity>
            <View style={[styles.avatarPlaceholder, { justifyContent: 'center', alignItems: 'center' }]}>
              <IconButton icon="bell-outline" size={20} iconColor="white" style={{ margin: 0 }} onPress={() => {}} />
            </View>
          </View>
          
          <Searchbar
            placeholder="Search Service"
            onChangeText={() => {}}
            value=""
            style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
            inputStyle={{ minHeight: 0, fontSize: 14 }}
            iconColor="#4285F4"
            elevation={0}
          />
        </View>

        {/* Promotional Banner */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.specialTitle}>#SpecialForYou</Text>
          <TouchableOpacity onPress={() => navigation.navigate('OffersList')}>
            <Text variant="labelMedium" style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersScroll} snapToInterval={(width * 0.85) + 16} decelerationRate="fast" snapToAlignment="start">
          {coupons.map((coupon, index) => (
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
                <Button 
                  mode="contained" 
                  compact 
                  style={styles.claimButton} 
                  labelStyle={styles.claimButtonLabel}
                  onPress={() => handleClaim(coupon.code)}
                >
                  Claim
                </Button>
              </View>
            </LinearGradient>
          ))}
          {coupons.length === 0 && !loading && (
             <Text style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>No offers available at the moment.</Text>
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
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
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
          <Text variant="titleMedium" style={styles.specialTitle}>Services</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ServicesList')}>
            <Text variant="labelMedium" style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>
        {loading && services.length === 0 ? (
           <ActivityIndicator style={{ margin: 16 }} />
        ) : (
          <View style={styles.servicesGrid}>
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
              <TouchableOpacity 
                key={service.id || index} 
                style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate('ServicesList')}
              >
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
              </TouchableOpacity>
            )})}
            {/* Fallback UI if DB is empty */}
            {services.length === 0 && (
              <Text style={{ color: theme.colors.onSurfaceVariant, paddingBottom: 16 }}>No services available.</Text>
            )}
          </View>
        )}

        {/* Laundry Packages */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Laundry Packages</Text>
        {loading && packages.length === 0 ? (
           <ActivityIndicator style={{ margin: 16 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.packagesScroll}>
            {packages.map((pkg, index) => (
              <Card key={pkg.id || index} style={[styles.packageCard, { backgroundColor: theme.colors.surface }]} mode="outlined">
                <Card.Content>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{pkg.name}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginVertical: 4 }}>{pkg.description || 'Standard load'}</Text>
                  <Text variant="titleLarge" style={{ marginTop: 8, color: theme.colors.primary, fontWeight: 'bold' }}>₹{pkg.price}</Text>
                </Card.Content>
              </Card>
            ))}
            {/* Fallback UI if DB is empty */}
            {packages.length === 0 && (
              <Text style={{ marginLeft: 16, color: theme.colors.onSurfaceVariant }}>No packages available.</Text>
            )}
          </ScrollView>
        )}

      </ScrollView>

      {/* Location Selection Modal */}
      <Portal>
        <Modal 
          visible={locationModalVisible} 
          onDismiss={() => {
            setLocationModalVisible(false);
            if(isAddingAddress) setIsAddingAddress(false);
          }} 
          contentContainerStyle={[styles.modalContainer, { backgroundColor: theme.colors.surface }, isAddingAddress ? styles.mapModalContainer : {}]}
        >
          {!isAddingAddress ? (
            <View>
              <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>Choose Location</Text>
              {addresses.map((addr, index) => (
                <React.Fragment key={addr.id || index}>
                  <List.Item
                    title={addr.title}
                    description={`${addr.flat_number}, ${addr.building_name}, ${addr.area}, ${addr.city}`}
                    left={props => <List.Icon {...props} icon={addr.title.toLowerCase() === 'home' ? 'home-outline' : 'office-building-outline'} />}
                    right={props => (
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton 
                          icon="pencil-outline" 
                          size={20} 
                          onPress={() => startEditingAddress(addr)} 
                          style={{ margin: 0, marginRight: currentAddress?.id === addr.id ? 8 : 0 }} 
                        />
                        {currentAddress?.id === addr.id && <List.Icon {...props} icon="check" color={theme.colors.primary} style={{ margin: 0 }} />}
                      </View>
                    )}
                    onPress={() => {
                      setActiveAddressId(addr.id);
                      setLocationModalVisible(false);
                    }}
                    style={{ paddingLeft: 0 }}
                  />
                  {index < addresses.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {addresses.length === 0 && (
                <Text style={{ paddingVertical: 16, color: theme.colors.onSurfaceVariant }}>No addresses found.</Text>
              )}
              <Button 
                mode="contained-tonal" 
                icon="plus" 
                style={{ marginTop: 16 }}
                onPress={() => {
                  setIsAddingAddress(true);
                  getCurrentLocation();
                }}
              >
                Add New Address
              </Button>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <IconButton 
                  icon="arrow-left" 
                  size={20} 
                  onPress={() => {
                    setIsAddingAddress(false);
                    setEditingAddressId(null);
                    setNewAddress({ title: '', flat_number: '', building_name: '', area: '', city: '', pincode: '', is_default: false });
                  }} 
                  style={{ margin: 0, marginRight: 8 }} 
                />
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{editingAddressId ? 'Edit Address' : 'Add Address'}</Text>
              </View>
              <View style={styles.mapContainer}>
                <MapWrapper
                  style={styles.map}
                  region={mapRegion}
                  onRegionChangeComplete={setMapRegion}
                  onPress={handleMapPress}
                  selectedCoordinate={selectedCoordinate}
                />
                <IconButton
                  icon="crosshairs-gps"
                  mode="contained"
                  containerColor="white"
                  iconColor="#0093D9"
                  size={24}
                  style={styles.myLocationButton}
                  onPress={getCurrentLocation}
                />
              </View>
              <ScrollView style={{ marginTop: 12 }} showsVerticalScrollIndicator={false}>
                <TextInput
                  mode="outlined"
                  label="Title (e.g. Home, Office)"
                  value={newAddress.title}
                  onChangeText={text => setNewAddress({...newAddress, title: text})}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  dense
                />
                <TextInput
                  mode="outlined"
                  label="Flat / House Number"
                  value={newAddress.flat_number}
                  onChangeText={text => setNewAddress({...newAddress, flat_number: text})}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  dense
                />
                <TextInput
                  mode="outlined"
                  label="Building Name / Street"
                  value={newAddress.building_name}
                  onChangeText={text => setNewAddress({...newAddress, building_name: text})}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  dense
                />
                <View style={{ flexDirection: 'row' }}>
                  <TextInput
                    mode="outlined"
                    label="Area"
                    value={newAddress.area}
                    onChangeText={text => setNewAddress({...newAddress, area: text})}
                    style={[styles.input, { backgroundColor: theme.colors.surface, flex: 1, marginRight: 8 }]}
                    dense
                  />
                  <TextInput
                    mode="outlined"
                    label="City"
                    value={newAddress.city}
                    onChangeText={text => setNewAddress({...newAddress, city: text})}
                    style={[styles.input, { backgroundColor: theme.colors.surface, flex: 1 }]}
                    dense
                  />
                </View>
                <TextInput
                  mode="outlined"
                  label="Pincode"
                  value={newAddress.pincode}
                  onChangeText={text => setNewAddress({...newAddress, pincode: text})}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  keyboardType="numeric"
                  dense
                />
                <Button 
                  mode="contained" 
                  onPress={saveInlineAddress} 
                  loading={isSavingAddress}
                  disabled={isSavingAddress}
                  style={{ marginTop: 12, borderRadius: 8 }}
                >
                  Save Address
                </Button>
              </ScrollView>
            </View>
          )}
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
        style={{ marginBottom: 90, backgroundColor: '#F0F0F0', borderRadius: 16, elevation: 5 }}
      >
        <Text style={{ color: '#333', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>🎉 Woohoo! Code Copied! ✨</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  headerBackground: {
    backgroundColor: '#0093D9',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationTextContainer: { flex: 1, justifyContent: 'center' },
  locationLabel: { color: 'rgba(255,255,255,0.8)' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  iconMargin: { margin: 0, padding: 0, width: 24, height: 24 },
  largeIconMargin: { margin: 0, marginRight: 8, padding: 0, width: 32, height: 32 },
  locationText: { color: 'white', fontWeight: '500', flexShrink: 1 },
  avatarPlaceholder: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)' },
  searchBar: { borderRadius: 30, height: 48 },
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
  claimButton: { backgroundColor: '#FFD700', borderRadius: 20, paddingHorizontal: 16 },
  claimButtonLabel: { color: 'black', fontSize: 12, fontWeight: 'bold', marginVertical: 4 },
  paginationDots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0E0', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#0093D9' },
  quickActions: { paddingHorizontal: 16, marginTop: 16 },
  bookButton: { borderRadius: 30 },
  sectionTitle: { paddingHorizontal: 16, marginTop: 24, marginBottom: 12, fontWeight: 'bold', fontSize: 18 },
  activeOrderCard: { marginHorizontal: 16, borderRadius: 12 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trackButton: { marginTop: 12, alignSelf: 'flex-start', borderRadius: 8 },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
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
  packagesScroll: { paddingLeft: 16 },
  packageCard: { width: 160, marginRight: 16, borderRadius: 16 },
  modalContainer: { padding: 20, margin: 20, borderRadius: 16, maxHeight: '80%' },
  mapModalContainer: { height: '85%', maxHeight: '85%', padding: 16 },
  mapContainer: { height: 200, borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  map: { flex: 1 },
  myLocationButton: { position: 'absolute', bottom: 8, right: 8, elevation: 4 },
  input: { marginBottom: 8, fontSize: 14 }
});
