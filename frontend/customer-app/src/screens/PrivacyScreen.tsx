import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function PrivacyScreen() {
  const theme = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.title}>Privacy Policy</Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
        Your privacy is important to us. It is XpressLaundry's policy to respect your privacy regarding any information we may collect from you across our application.{'\n\n'}
        We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.{'\n\n'}
        (Placeholder Text: Please replace with your actual privacy policy).
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 }, content: { padding: 16 }, title: { fontWeight: 'bold', marginBottom: 16 } });
