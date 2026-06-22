import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Switch, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiClient } from '../api/client';
import { useAppStore } from '../store/useAppStore';

type FormData = {
  title: string;
  flat_number: string;
  building_name: string;
  area: string;
  city: string;
  pincode: string;
  is_default: boolean;
};

export default function ManageAddressScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { fetchAddresses } = useAppStore();
  const { address } = route.params || {};

  const isEditing = !!address;

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      title: '',
      flat_number: '',
      building_name: '',
      area: '',
      city: '',
      pincode: '',
      is_default: false,
    }
  });

  useEffect(() => {
    if (isEditing && address) {
      reset({
        title: address.title || '',
        flat_number: address.flat_number || '',
        building_name: address.building_name || '',
        area: address.area || '',
        city: address.city || '',
        pincode: address.pincode || '',
        is_default: address.is_default || false,
      });
      navigation.setOptions({ title: 'Edit Address' });
    } else {
      navigation.setOptions({ title: 'Add New Address' });
    }
  }, [isEditing, address, reset, navigation]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isEditing) {
        await apiClient.put(`/users/me/addresses/${address.id}`, data);
        Alert.alert('Success', 'Address updated successfully');
      } else {
        await apiClient.post('/users/me/addresses', data);
        Alert.alert('Success', 'Address added successfully');
      }
      await fetchAddresses();
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to save address');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleMedium" style={styles.label}>Title (e.g., Home, Office)</Text>
      <Controller
        control={control}
        rules={{ required: 'Title is required' }}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            placeholder="Home"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.title}
            style={styles.input}
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      <Text variant="titleMedium" style={styles.label}>Flat / House Number</Text>
      <Controller
        control={control}
        rules={{ required: 'Flat number is required' }}
        name="flat_number"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            placeholder="Flat 101"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.flat_number}
            style={styles.input}
          />
        )}
      />
      {errors.flat_number && <Text style={styles.errorText}>{errors.flat_number.message}</Text>}

      <Text variant="titleMedium" style={styles.label}>Building Name</Text>
      <Controller
        control={control}
        name="building_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            placeholder="Sunrise Apartments"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
          />
        )}
      />

      <Text variant="titleMedium" style={styles.label}>Area / Sector</Text>
      <Controller
        control={control}
        rules={{ required: 'Area is required' }}
        name="area"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            placeholder="Downtown"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={!!errors.area}
            style={styles.input}
          />
        )}
      />
      {errors.area && <Text style={styles.errorText}>{errors.area.message}</Text>}

      <View style={styles.row}>
        <View style={styles.flex1}>
          <Text variant="titleMedium" style={styles.label}>City</Text>
          <Controller
            control={control}
            rules={{ required: 'City is required' }}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder="New York"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.city}
                style={styles.input}
              />
            )}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
        </View>
        <View style={{ width: 16 }} />
        <View style={styles.flex1}>
          <Text variant="titleMedium" style={styles.label}>Pincode</Text>
          <Controller
            control={control}
            rules={{ required: 'Pincode is required' }}
            name="pincode"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                placeholder="10001"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.pincode}
                style={styles.input}
              />
            )}
          />
          {errors.pincode && <Text style={styles.errorText}>{errors.pincode.message}</Text>}
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text variant="titleMedium">Set as Default Address</Text>
        <Controller
          control={control}
          name="is_default"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} color={theme.colors.primary} />
          )}
        />
      </View>

      <Button 
        mode="contained" 
        onPress={handleSubmit(onSubmit)} 
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitBtn}
      >
        {isEditing ? 'Update Address' : 'Save Address'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16, paddingBottom: 40 },
  label: { marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: 'white', marginBottom: 4 },
  errorText: { color: 'red', fontSize: 12, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  flex1: { flex: 1 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  submitBtn: { marginTop: 32, paddingVertical: 6, borderRadius: 8 },
});
