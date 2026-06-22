import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, Divider, useTheme, SegmentedButtons, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';

export default function OrdersScreen() {
  const theme = useTheme();
  const [value, setValue] = useState('active');
  const { orders, fetchOrders, loading } = useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  const displayOrders = value === 'active' ? activeOrders : completedOrders;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>My Orders</Text>
      </View>
      
      <View style={styles.segmentedContainer}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            { value: 'active', label: 'Active Orders' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0093D9']} />}
      >
        {loading && orders.length === 0 ? (
          <ActivityIndicator style={{ marginTop: 24 }} />
        ) : displayOrders.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 24, color: theme.colors.onSurfaceVariant }}>No {value} orders found.</Text>
        ) : (
          displayOrders.map((order, index) => (
            <Card key={order.id || index} style={[styles.orderCard, { backgroundColor: theme.colors.surface }]} mode={value === 'active' ? "elevated" : "outlined"}>
              <Card.Content>
                <View style={styles.rowBetween}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>Order #{String(order.id).substring(0, 8)}</Text>
                  <Chip 
                    icon={value === 'active' ? "progress-clock" : "check-circle"} 
                    textStyle={{ fontSize: 10, textTransform: 'capitalize' }} 
                    style={{ backgroundColor: value === 'active' ? '#FFF3E0' : '#E8F5E9' }}
                  >
                    {order.status}
                  </Chip>
                </View>
                <Text variant="bodySmall" style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}>
                  {value === 'active' ? `Placed on ${new Date(order.created_at).toLocaleDateString()}` : `Delivered on ${new Date(order.created_at).toLocaleDateString()}`}
                </Text>
                
                <Divider style={styles.divider} />
                
                {value === 'active' && (
                  <>
                    <Text variant="labelMedium" style={{ fontWeight: 'bold' }}>Services Selected:</Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{order.order_items?.length ? order.order_items.map((i: any) => i.service?.name).join(', ') : 'Standard order'}</Text>
                    <Divider style={styles.divider} />
                    
                    <View style={styles.timelineContainer}>
                      {['Placed', 'Picked Up', 'Washing', 'Delivered'].map((step, idx, arr) => (
                        <View key={idx} style={styles.timelineStep}>
                          <View style={[styles.dot, idx <= 1 ? { backgroundColor: theme.colors.primary } : {}]} />
                          <Text variant="labelSmall" style={[{ fontSize: 10 }, idx <= 1 ? { color: theme.colors.primary, fontWeight: 'bold' } : { color: theme.colors.onSurfaceVariant }]}>{step}</Text>
                          {idx !== arr.length - 1 && <View style={[styles.line, idx < 1 ? { backgroundColor: theme.colors.primary } : {}]} />}
                        </View>
                      ))}
                    </View>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>Expected Delivery: {order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'TBD'}</Text>
                  </>
                )}

                {value === 'completed' && (
                  <View style={styles.rowBetween}>
                    <Text variant="bodyMedium">Amount Paid</Text>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>₹{order.total_amount}</Text>
                  </View>
                )}
                
                <View style={styles.actionButtons}>
                  {value === 'active' ? (
                    <>
                      <Button mode="outlined" style={styles.actionBtn} compact>Invoice</Button>
                      <Button mode="contained" style={styles.actionBtn} compact>Track</Button>
                    </>
                  ) : (
                    <Button mode="contained" style={{ flex: 1, marginTop: 16 }} icon="refresh">
                      Reorder
                    </Button>
                  )}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, paddingBottom: 8 },
  segmentedContainer: { paddingHorizontal: 16, marginBottom: 16 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },
  orderCard: { marginBottom: 16, borderRadius: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dateText: { marginTop: 4 },
  divider: { marginVertical: 12 },
  timelineContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  timelineStep: { alignItems: 'center', flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E0E0E0', marginBottom: 4 },
  line: { height: 2, backgroundColor: '#E0E0E0', position: 'absolute', top: 5, left: '60%', right: '-40%', zIndex: -1 },
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, gap: 12 },
  actionBtn: { borderRadius: 8 },
});
