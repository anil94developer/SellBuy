import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  onBack: () => void;
  onStartSelling: () => void;
}

export const SellStartScreen: React.FC<Props> = ({ onBack, onStartSelling }) => {
  const benefits = [
    'Free Listing with Zero Hidden Fees',
    'Reach Verified & Genuine Buyers',
    'Quick & Simple 4-Step Process',
    'Sell 2x Faster with Instant Visibility',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sell Your Car" showBack={true} onBack={onBack} />

      <View style={styles.content}>
        {/* Top Headline */}
        <View style={styles.headlineBox}>
          <Text style={styles.title}>Sell Your Car</Text>
          <Text style={styles.subtitle}>List your car in just a few quick steps</Text>
        </View>

        {/* Car Showcase Graphic */}
        <View style={styles.imageCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.carImage}
            resizeMode="cover"
          />
        </View>

        {/* Checklist */}
        <View style={styles.benefitsList}>
          {benefits.map((item, index) => (
            <View key={index} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.benefitText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Start Selling Button */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStartSelling}
          activeOpacity={0.85}>
          <Text style={styles.startButtonText}>Start Selling</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  headlineBox: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 6,
  },
  imageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.borderLight,
    height: 180,
    ...shadows.sm,
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  benefitsList: {
    gap: 14,
    paddingVertical: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  checkIcon: {
    color: colors.success,
    fontSize: 13,
    fontWeight: 'bold',
  },
  benefitText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  startButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    marginBottom: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
