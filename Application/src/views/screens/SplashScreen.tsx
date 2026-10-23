import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { colors, typography } from '../../theme/theme';

interface Props {
  onContinue: () => void;
}

export const SplashScreen: React.FC<Props> = ({ onContinue }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <View style={styles.container}>
      {/* Top Branding Section */}
      <View style={styles.topSection}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🚗</Text>
        </View>
        <Text style={styles.logoText}>Your Logo</Text>
        <Text style={styles.subLogoText}>SELL • BUY • DRIVE</Text>
      </View>

      {/* Middle Tagline */}
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>
          Buy, Sell & Find{'\n'}your Perfect Car
        </Text>
        <Text style={styles.taglineSub}>
          India's most trusted certified pre-owned vehicle marketplace
        </Text>
      </View>

      {/* Car Hero Showcase Image */}
      <View style={styles.carImageContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.carImage}
          resizeMode="cover"
        />
        <View style={styles.gradientFade} />
      </View>

      {/* Bottom Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.button} onPress={onContinue} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Get Started →</Text>
        </TouchableOpacity>
        <Text style={styles.autoAdvanceText}>Tap anywhere or auto-advancing...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  logoIcon: {
    fontSize: 32,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginTop: 12,
    letterSpacing: 1,
  },
  subLogoText: {
    color: '#60A5FA',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    letterSpacing: 2,
    marginTop: 4,
  },
  taglineContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginVertical: 10,
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: typography.weights.extrabold,
    textAlign: 'center',
    lineHeight: 34,
  },
  taglineSub: {
    color: '#94A3B8',
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginTop: 8,
  },
  carImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  gradientFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(9, 13, 22, 0.6)',
  },
  bottomSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
  autoAdvanceText: {
    color: '#64748B',
    fontSize: typography.sizes.xs,
    marginTop: 12,
  },
});
