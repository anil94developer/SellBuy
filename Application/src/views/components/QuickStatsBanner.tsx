import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface QuickStatsBannerProps {
  totalCars: number;
  verifiedCount: number;
  averagePriceLakh: number;
}

export const QuickStatsBanner: React.FC<QuickStatsBannerProps> = ({
  totalCars,
  verifiedCount,
  averagePriceLakh,
}) => {
  return (
    <View style={styles.banner}>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{totalCars}</Text>
        <Text style={styles.statLabel}>Cars Available</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{verifiedCount}</Text>
        <Text style={styles.statLabel}>Verified Ads</Text>
      </View>

      <View style={styles.statDivider} />

      <View style={styles.statBox}>
        <Text style={styles.statNumber}>₹ {averagePriceLakh}L</Text>
        <Text style={styles.statLabel}>Avg Price</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#334155',
  },
});
