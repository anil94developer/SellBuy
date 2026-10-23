import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';

interface MarketplaceHeaderProps {
  activeTab: 'buyer' | 'seller';
  onTabChange: (tab: 'buyer' | 'seller') => void;
  onRefresh?: () => void;
}

export const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  activeTab,
  onTabChange,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        <View>
          <Text style={styles.brandTitle}>SellBuy</Text>
          <Text style={styles.brandSubtitle}>
            Car Marketplace • {Platform.OS === 'android' ? 'Android' : 'iOS'} (MVVM + Redux)
          </Text>
        </View>

        <View style={styles.actionsRight}>
          {onRefresh && (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <Text style={styles.refreshIcon}>🔄</Text>
            </TouchableOpacity>
          )}
          <View style={styles.platformBadge}>
            <Text style={styles.platformText}>{Platform.OS.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      {/* Role Switcher Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.tabButton, activeTab === 'buyer' && styles.tabButtonActive]}
          onPress={() => onTabChange('buyer')}>
          <Text style={[styles.tabText, activeTab === 'buyer' && styles.tabTextActive]}>
            🛒 Buy Cars
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.tabButton, activeTab === 'seller' && styles.tabButtonActive]}
          onPress={() => onTabChange('seller')}>
          <Text style={[styles.tabText, activeTab === 'seller' && styles.tabTextActive]}>
            🏷️ Sell a Car
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e3a8a',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#93c5fd',
    marginTop: 2,
    fontWeight: '500',
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  refreshIcon: {
    fontSize: 13,
  },
  platformBadge: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  platformText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#334155',
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
