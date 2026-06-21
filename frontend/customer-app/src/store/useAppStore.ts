import { create } from 'zustand';
import { apiClient } from '../api/client';

interface AppState {
  user: any;
  addresses: any[];
  services: any[];
  packages: any[];
  orders: any[];
  transactions: any[];
  coupons: any[];
  walletBalance: number;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  fetchAddresses: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchPackages: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchCoupons: () => Promise<void>;
  fetchWalletBalance: () => Promise<void>;
  placeOrder: (orderData: any) => Promise<boolean>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  addresses: [],
  services: [],
  packages: [],
  orders: [],
  transactions: [],
  coupons: [],
  walletBalance: 0,
  loading: false,
  error: null,

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/users/me');
      set({ user: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchAddresses: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/users/me/addresses');
      set({ addresses: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/services');
      set({ services: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchPackages: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/services/packages');
      set({ packages: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/orders');
      set({ orders: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/wallet/transactions');
      set({ transactions: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchCoupons: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/wallet/coupons');
      set({ coupons: response.data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchWalletBalance: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get('/wallet/balance');
      set({ walletBalance: response.data.balance, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  placeOrder: async (orderData: any) => {
    set({ loading: true, error: null });
    try {
      await apiClient.post('/orders', orderData);
      set({ loading: false });
      // Refresh orders after placing one
      get().fetchOrders();
      return true;
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return false;
    }
  }
}));
