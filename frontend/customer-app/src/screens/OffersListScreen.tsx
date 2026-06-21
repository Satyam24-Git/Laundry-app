import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import { useAppStore } from '../store/useAppStore';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';

export default function OffersListScreen() {
  const { coupons } = useAppStore();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState('');

  const handleClaim = async (code: string) => {
    if (!code) return;
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    setSnackbarVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
        style={{ marginBottom: 90, backgroundColor: '#F0F0F0', borderRadius: 16, elevation: 5 }}
      >
        <Text style={{ color: '#333', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>🎉 Woohoo! Code Copied! ✨</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 16 },
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
