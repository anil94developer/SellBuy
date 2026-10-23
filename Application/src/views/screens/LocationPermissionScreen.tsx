import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  onAllowLocation: () => void;
  onSelectManually: () => void;
}

export const LocationPermissionScreen: React.FC<Props> = ({
  onAllowLocation,
  onSelectManually,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topEmpty} />

      {/* Center Illustration */}
      <View style={styles.centerSection}>
        <View style={styles.radarOuterCircle}>
          <View style={styles.radarMiddleCircle}>
            <View style={styles.pinCircle}>
              <Text style={styles.pinIcon}>📍</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Allow Location</Text>
        <Text style={styles.subtitle}>
          Find cars near you and get{'\n'}better recommendations
        </Text>
      </View>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onAllowLocation}
          activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSelectManually}
          activeOpacity={0.7}>
          <Text style={styles.secondaryButtonText}>Select Manually</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  topEmpty: {
    height: 20,
  },
  centerSection: {
    alignItems: 'center',
  },
  radarOuterCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  radarMiddleCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  pinIcon: {
    fontSize: 34,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  bottomSection: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    height: 52,
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
  secondaryButton: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
