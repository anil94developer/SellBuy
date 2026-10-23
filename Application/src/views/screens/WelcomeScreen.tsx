import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <View style={styles.topLogo}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🚗</Text>
        </View>
        <Text style={styles.logoTitle}>Your Logo</Text>
      </View>

      {/* Main Headline */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>
          Buy, Sell & Find{'\n'}your Perfect Car
        </Text>
        <Text style={styles.subtitle}>
          Verified inspections, transparent pricing & fast selling
        </Text>
      </View>

      {/* Center Car Graphic */}
      <View style={styles.imageCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.carImage}
          resizeMode="cover"
        />
        <View style={styles.featurePillRow}>
          <View style={styles.featurePill}>
            <Text style={styles.pillText}>Buy</Text>
          </View>
          <Text style={styles.bulletDot}>•</Text>
          <View style={styles.featurePill}>
            <Text style={styles.pillText}>Sell</Text>
          </View>
          <Text style={styles.bulletDot}>•</Text>
          <View style={styles.featurePill}>
            <Text style={styles.pillText}>Drive</Text>
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingVertical: 30,
  },
  topLogo: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  logoIcon: {
    fontSize: 24,
  },
  logoTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: 6,
  },
  headerTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  imageCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    padding: 12,
    alignItems: 'center',
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  carImage: {
    width: '100%',
    height: 190,
    borderRadius: 14,
  },
  featurePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  featurePill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  bulletDot: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSection: {
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  primaryButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
