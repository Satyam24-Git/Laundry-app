import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Avatar, useTheme, List, Divider, Button, IconButton, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

export default function ProfileScreen({ navigation }: any) {
  const theme = useTheme();
  const { user, addresses, fetchUser, fetchAddresses, theme: currentTheme, toggleTheme } = useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchUser();
    fetchAddresses();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchUser(),
      fetchAddresses()
    ]);
    setRefreshing(false);
  }, []);

  const userInitials = user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'U';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Profile</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0093D9']} />}
      >
        {/* Personal Information */}
        <View style={[styles.profileSection, { backgroundColor: theme.colors.surface }]}>
          <Avatar.Text size={80} label={userInitials} style={{ backgroundColor: theme.colors.primary }} />
          <View style={styles.profileDetails}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{user?.full_name || 'Guest User'}</Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>{user?.phone || 'No phone set'}</Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{user?.email || 'No email set'}</Text>
          </View>
          <Button mode="outlined" compact style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>Edit</Button>
        </View>

        {/* Saved Addresses */}
        <List.Section style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <List.Subheader style={styles.sectionTitle}>Saved Addresses</List.Subheader>
          {addresses.map((addr, index) => (
            <React.Fragment key={addr.id || index}>
              <List.Item
                title={addr.title}
                description={`${addr.flat_number}, ${addr.building_name}, ${addr.area}, ${addr.city} - ${addr.pincode}`}
                left={props => <List.Icon {...props} icon={addr.title.toLowerCase() === 'home' ? 'home-outline' : 'office-building-outline'} />}
                right={props => <IconButton {...props} icon="pencil-outline" onPress={() => navigation.navigate('ManageAddress', { address: addr })} />}
                style={styles.listItem}
              />
              {index < addresses.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {addresses.length === 0 && (
            <Text style={{ padding: 16, color: theme.colors.onSurfaceVariant }}>No addresses found.</Text>
          )}
          <Button mode="text" icon="plus" style={{ alignSelf: 'flex-start', marginLeft: 8 }} onPress={() => navigation.navigate('ManageAddress')}>
            Add New Address
          </Button>
        </List.Section>

        {/* App Settings */}
        <List.Section style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <List.Subheader style={styles.sectionTitle}>App Settings</List.Subheader>
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={props => <Switch value={currentTheme === 'dark'} onValueChange={toggleTheme} />}
            style={styles.listItem}
          />
        </List.Section>

        {/* About */}
        <List.Section style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <List.Subheader style={styles.sectionTitle}>About</List.Subheader>
          <List.Item
            title="Terms & Conditions"
            left={props => <List.Icon {...props} icon="file-document-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Terms')}
            style={styles.listItem}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-check-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('Privacy')}
            style={styles.listItem}
          />
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
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 16 },
  profileDetails: { flex: 1, marginLeft: 16 },
  editBtn: { borderRadius: 8 },
  section: { borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  listItem: { paddingLeft: 8 },
  logoutBtn: { marginTop: 8, borderRadius: 12 },
});
