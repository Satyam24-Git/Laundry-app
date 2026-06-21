import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, useTheme, Card, RadioButton, Divider, Checkbox, IconButton, TextInput, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

export default function SchedulePickupScreen({ navigation }: any) {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const { 
    placeOrder, loading, 
    services, packages, addresses,
    fetchServices, fetchPackages, fetchAddresses 
  } = useAppStore();

  useEffect(() => {
    if (services.length === 0) fetchServices();
    if (packages.length === 0) fetchPackages();
    if (addresses.length === 0) fetchAddresses();
  }, []);

  // Set default form state based on available data
  const [service, setService] = useState('');
  const [pkg, setPkg] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('today');
  const [time, setTime] = useState('12pm-3pm');
  const [instructions, setInstructions] = useState('');

  // Sync initial selection once data loads
  useEffect(() => {
    if (services.length > 0 && !service) setService(services[0].id);
    if (packages.length > 0 && !pkg) setPkg(packages[0].id);
    if (addresses.length > 0 && !address) {
      const def = addresses.find(a => a.is_default);
      setAddress(def ? def.id : addresses[0].id);
    }
  }, [services, packages, addresses]);

  const handleConfirm = async () => {
    if (!service || !pkg || !address) {
      alert("Please ensure Service, Package, and Address are selected.");
      return;
    }
    const mockOrder = {
      address_id: address,
      package_id: pkg,
      total_amount: packages.find(p => p.id === pkg)?.price || 0, // Simplified pricing
      special_instructions: instructions,
      pickup_date: date === 'today' ? new Date().toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickup_time_slot: time,
      items: [{ service_id: service, quantity: 1, price_per_unit: services.find(s => s.id === service)?.base_price || 0 }]
    };

    const success = await placeOrder(mockOrder);
    if (success) {
      alert('Order Placed Successfully!');
      setStep(1); // reset
      navigation.navigate('Orders');
    } else {
      alert('Failed to place order. Please check backend connection.');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <View key={s} style={[styles.stepDot, s <= step ? { backgroundColor: theme.colors.primary } : {}]} />
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text variant="titleMedium" style={styles.stepTitle}>Select Services</Text>
      {services.length === 0 ? <ActivityIndicator /> : (
        <RadioButton.Group onValueChange={setService} value={service}>
          {services.map(s => (
            <RadioButton.Item key={s.id} label={`${s.name} (Base ₹${s.base_price})`} value={s.id} style={styles.radioItem} />
          ))}
        </RadioButton.Group>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text variant="titleMedium" style={styles.stepTitle}>Select Laundry Package</Text>
      {packages.length === 0 ? <ActivityIndicator /> : (
        <RadioButton.Group onValueChange={setPkg} value={pkg}>
          {packages.map(p => (
            <RadioButton.Item key={p.id} label={`${p.name} - ₹${p.price}`} value={p.id} style={styles.radioItem} />
          ))}
        </RadioButton.Group>
      )}
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text variant="titleMedium" style={styles.stepTitle}>Add Additional Services</Text>
      <Text variant="bodyMedium" style={{ marginBottom: 16, color: 'gray' }}>Coming Soon - Select Addons from DB</Text>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <Text variant="titleMedium" style={styles.stepTitle}>Pickup Address</Text>
      {addresses.length === 0 ? <Text>No addresses found. Add one in Profile.</Text> : (
        <RadioButton.Group onValueChange={setAddress} value={address}>
          {addresses.map(a => (
            <RadioButton.Item key={a.id} label={`${a.title} - ${a.flat_number}, ${a.building_name}`} value={a.id} style={styles.radioItem} />
          ))}
        </RadioButton.Group>
      )}
      <Button icon="plus" mode="text" style={{ alignSelf: 'flex-start' }}>Add New Address</Button>
    </View>
  );

  const renderStep5 = () => (
    <View>
      <Text variant="titleMedium" style={styles.stepTitle}>Pickup Schedule</Text>
      <Text variant="labelLarge" style={{ marginTop: 8, marginBottom: 4 }}>Date</Text>
      <RadioButton.Group onValueChange={setDate} value={date}>
        <RadioButton.Item label="Today" value="today" style={styles.radioItem} />
        <RadioButton.Item label="Tomorrow" value="tomorrow" style={styles.radioItem} />
      </RadioButton.Group>

      <Text variant="labelLarge" style={{ marginTop: 16, marginBottom: 4 }}>Time Slot</Text>
      <RadioButton.Group onValueChange={setTime} value={time}>
        <RadioButton.Item label="9 AM - 12 PM" value="9am-12pm" style={styles.radioItem} />
        <RadioButton.Item label="12 PM - 3 PM" value="12pm-3pm" style={styles.radioItem} />
        <RadioButton.Item label="3 PM - 6 PM" value="3pm-6pm" style={styles.radioItem} />
      </RadioButton.Group>
    </View>
  );

  const renderStep6 = () => {
    const selectedService = services.find(s => s.id === service);
    const selectedPkg = packages.find(p => p.id === pkg);
    const selectedAddress = addresses.find(a => a.id === address);

    return (
      <View>
        <Text variant="titleMedium" style={styles.stepTitle}>Review Order</Text>
        <Card style={{ backgroundColor: 'white', borderRadius: 12 }}>
          <Card.Content>
            <Text variant="labelLarge" style={{ fontWeight: 'bold' }}>Service</Text>
            <Text variant="bodyMedium">{selectedService?.name || 'None'} - {selectedPkg?.name || 'None'}</Text>
            <Divider style={styles.divider} />
            
            <Text variant="labelLarge" style={{ fontWeight: 'bold' }}>Pickup details</Text>
            <Text variant="bodyMedium">{selectedAddress?.title || 'No address selected'}, {date}, {time}</Text>
            <Divider style={styles.divider} />
            
            <TextInput
              mode="outlined"
              label="Special Instructions"
              placeholder="e.g. Please ring doorbell"
              multiline
              numberOfLines={2}
              value={instructions}
              onChangeText={setInstructions}
              style={{ marginBottom: 16 }}
            />

            <View style={styles.rowBetween}>
              <Text variant="titleMedium">Total Amount</Text>
              <Text variant="titleLarge" style={{ fontWeight: 'bold', color: theme.colors.primary }}>₹{selectedPkg?.price || 0}</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Schedule Pickup</Text>
      </View>
      
      {renderStepIndicator()}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6()}
      </ScrollView>

      <View style={styles.footer}>
        {step > 1 && (
          <Button mode="outlined" onPress={() => setStep(step - 1)} style={styles.navButton} disabled={loading}>
            Back
          </Button>
        )}
        <Button 
          mode="contained" 
          onPress={() => {
            if (step < 6) setStep(step + 1);
            else handleConfirm();
          }} 
          style={[styles.navButton, { flex: 1, marginLeft: step > 1 ? 16 : 0 }]}
          disabled={loading}
          loading={loading}
        >
          {step === 6 ? 'Confirm Pickup' : 'Next'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 8 },
  stepIndicator: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  stepDot: { flex: 1, height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  stepTitle: { fontWeight: 'bold', marginBottom: 16 },
  radioItem: { backgroundColor: 'white', borderRadius: 8, marginBottom: 8 },
  itemCard: { backgroundColor: 'white', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  divider: { marginVertical: 12 },
  footer: { padding: 16, flexDirection: 'row', backgroundColor: 'white', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  navButton: { borderRadius: 8, paddingVertical: 4 },
});
