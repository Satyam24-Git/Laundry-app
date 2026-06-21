import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme, Divider, List, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

export default function WalletScreen() {
  const theme = useTheme();
  const { walletBalance, coupons, transactions, fetchWalletBalance, fetchCoupons, fetchTransactions } = useAppStore();

  useEffect(() => {
    fetchWalletBalance();
    fetchCoupons();
    fetchTransactions();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Wallet & Offers</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          <Card key={coupon.id || index} style={styles.couponCard} mode="outlined">
            <Card.Content style={styles.rowBetween}>
              <View>
                <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>{coupon.code}</Text>
                <Text variant="bodySmall" style={{ color: 'gray' }}>Get {coupon.discount_percentage}% off. Max ₹{coupon.max_discount_amount}</Text>
              </View>
              <Button mode="outlined" compact style={{ borderRadius: 8 }}>Apply</Button>
            </Card.Content>
          </Card>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 8 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  walletCard: { backgroundColor: '#6200ee', borderRadius: 16, marginBottom: 24 },
  addMoneyBtn: { alignSelf: 'flex-start', borderRadius: 12, marginTop: 8 },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12 },
  couponCard: { borderRadius: 12, backgroundColor: 'white', marginBottom: 12, borderStyle: 'dashed' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  transactionsSurface: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' },
});
