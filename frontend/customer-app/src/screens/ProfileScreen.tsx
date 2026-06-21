import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Avatar, useTheme, List, Divider, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, addresses, fetchUser, fetchAddresses } = useAppStore();

  useEffect(() => {
    fetchUser();
    fetchAddresses();
  }, []);

  const userInitials = user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'U';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <View style={styles.profileSection}>
          <Avatar.Text size={80} label={userInitials} style={{ backgroundColor: theme.colors.primary }} />
          <View style={styles.profileDetails}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{user?.full_name || 'Guest User'}</Text>
            <Text variant="bodyMedium" style={{ color: 'gray' }}>{user?.phone || 'No phone set'}</Text>
            <Text variant="bodySmall" style={{ color: 'gray' }}>{user?.email || 'No email set'}</Text>
          </View>
          <Button mode="outlined" compact style={styles.editBtn}>Edit</Button>
        </View>

        {/* Saved Addresses */}
        <List.Section style={styles.section}>
          <List.Subheader style={styles.sectionTitle}>Saved Addresses</List.Subheader>
          {addresses.map((addr, index) => (
            <React.Fragment key={addr.id || index}>
              <List.Item
                title={addr.title}
                description={`${addr.flat_number}, ${addr.building_name}, ${addr.area}, ${addr.city} - ${addr.pincode}`}
                left={props => <List.Icon {...props} icon={addr.title.toLowerCase() === 'home' ? 'home-outline' : 'office-building-outline'} />}
                right={props => <IconButton {...props} icon="pencil-outline" />}
                style={styles.listItem}
              />
              {index < addresses.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {addresses.length === 0 && (
            <Text style={{ padding: 16, color: 'gray' }}>No addresses found.</Text>
          )}
          <Button mode="text" icon="plus" style={{ alignSelf: 'flex-start', marginLeft: 8 }}>
            Add New Address
          </Button>
        </List.Section>

        {/* Payment Methods */}
        <List.Section style={styles.section}>
          <List.Subheader style={styles.sectionTitle}>Payment Methods</List.Subheader>
          <List.Item
            title="HDFC Credit Card"
            description="**** **** **** 4589"
            left={props => <List.Icon {...props} icon="credit-card-outline" />}
            style={styles.listItem}
          />
          <Divider />
          <List.Item
            title="UPI / Google Pay"
            description="john@okaxis"
            left={props => <List.Icon {...props} icon="cellphone" />}
            style={styles.listItem}
          />
        </List.Section>

        {/* Support */}
        <List.Section style={styles.section}>
          <List.Subheader style={styles.sectionTitle}>Support</List.Subheader>
          <List.Item title="Live Chat" left={props => <List.Icon {...props} icon="chat-outline" />} style={styles.listItem} />
          <Divider />
          <List.Item title="Call Support" left={props => <List.Icon {...props} icon="phone-outline" />} style={styles.listItem} />
          <Divider />
          <List.Item title="WhatsApp Support" left={props => <List.Icon {...props} icon="whatsapp" />} style={styles.listItem} />
          <Divider />
          <List.Item title="FAQs" left={props => <List.Icon {...props} icon="help-circle-outline" />} style={styles.listItem} />
        </List.Section>

        <Button mode="contained-tonal" icon="logout" style={styles.logoutBtn} buttonColor="#FFEBEE" textColor="#D32F2F">
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 8 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  profileSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 16 },
  profileDetails: { flex: 1, marginLeft: 16 },
  editBtn: { borderRadius: 8 },
  section: { backgroundColor: 'white', borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  listItem: { paddingLeft: 8 },
  logoutBtn: { marginTop: 8, borderRadius: 12 },
});
