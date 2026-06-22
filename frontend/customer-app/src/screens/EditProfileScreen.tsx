import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/useAppStore';

type FormData = {
  full_name: string;
  email: string;
  phone: string;
};

export default function EditProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, updateUser, fetchUser } = useAppStore();

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    const success = await updateUser(data);
    if (success) {
      await fetchUser();
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text variant="titleMedium" style={styles.label}>Full Name</Text>
      <Controller
        control={control}
        rules={{ required: 'Full Name is required' }}
        name="full_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            placeholder="John Doe"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.full_name}
            style={styles.input}
          />
        )}
      />
      {errors.full_name && <Text style={styles.errorText}>{errors.full_name.message}</Text>}

      <Text variant="titleMedium" style={styles.label}>Email Address</Text>
      <Controller
        control={control}
        rules={{ 
          required: 'Email is required',
          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
        }}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.email}
            style={styles.input}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Text variant="titleMedium" style={styles.label}>Phone Number</Text>
      <Controller
        control={control}
        rules={{ required: 'Phone Number is required' }}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.phone}
            style={styles.input}
          />
        )}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      <Button 
        mode="contained" 
        onPress={handleSubmit(onSubmit)} 
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitBtn}
      >
        Save Changes
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  label: { marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: 'transparent', marginBottom: 4 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
  submitBtn: { marginTop: 32, paddingVertical: 6, borderRadius: 8 },
});
