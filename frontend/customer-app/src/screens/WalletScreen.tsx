import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, useTheme, Divider, List, Surface, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

export default function WalletScreen() {
  const theme = useTheme();
  const { walletBalance, coupons, transactions, fetchWalletBalance, fetchCoupons, fetchTransactions } = useAppStore();

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchWalletBalance();
    fetchCoupons();
    fetchTransactions();
  }, []);

  const handleClaim = async (code: string) => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    setSnackbarVisible(true);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchWalletBalance(),
      fetchCoupons(),
      fetchTransactions()
    ]);
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Wallet & Offers</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0093D9']} />}
      >
        {/* Wallet Balance Card */}
        <Card style={styles.walletCard}>
          <Card.Content>
            <Text variant="labelLarge" style={{ color: 'rgba(255,255,255,0.8)' }}>Available Balance</Text>
            <Text variant="displayMedium" style={{ color: 'white', fontWeight: 'bold', marginVertical: 8 }}>₹{walletBalance}</Text>
            <Button mode="contained" buttonColor="white" textColor={theme.colors.primary} style={styles.addMoneyBtn}>
              + Add Money
            </Button>
          </Card.Content>
        </Card>

        {/* Available Coupons */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Available Coupons</Text>
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

        {/* Transaction History */}
        <Text variant="titleMedium" style={styles.sectionTitle}>Transaction History</Text>
        <Surface style={styles.transactionsSurface} elevation={1}>
          {transactions.length === 0 ? (
            <Text style={{ textAlign: 'center', margin: 24, color: 'gray' }}>No transactions found.</Text>
          ) : (
            transactions.map((tx, index) => (
              <View key={tx.id || index}>
                <List.Item
                  title={tx.description || (tx.type === 'credit' ? 'Wallet Recharge' : 'Payment')}
                  description={new Date(tx.created_at).toLocaleString()}
                  left={props => <List.Icon {...props} icon={tx.type === 'credit' ? "plus-circle" : "minus-circle"} color={tx.type === 'credit' ? "green" : "red"} />}
                  right={() => <Text variant="titleMedium" style={{ alignSelf: 'center', color: tx.type === 'credit' ? "green" : "red", fontWeight: 'bold' }}>{tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}</Text>}
                />
                {index < transactions.length - 1 && <Divider />}
              </View>
            ))
          )}
        </Surface>

      </ScrollView>

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
  header: { padding: 16, paddingBottom: 8 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  walletCard: { backgroundColor: '#0093D9', borderRadius: 16, marginBottom: 24 },
  addMoneyBtn: { alignSelf: 'flex-start', borderRadius: 12, marginTop: 8 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  transactionsSurface: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' },
  bannerCardGradient: { borderRadius: 16, padding: 16, marginBottom: 16 },
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
});
