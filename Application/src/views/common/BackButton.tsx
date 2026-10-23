import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { colors, typography, shadows } from '../../theme/theme';

interface BackButtonProps {
  onPress: () => void;
  theme?: 'light' | 'dark' | 'overlay';
  size?: number;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  theme = 'light',
  size = 40,
}) => {
  const isDark = theme === 'dark';
  const isOverlay = theme === 'overlay';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        isDark && styles.darkButton,
        isOverlay && styles.overlayButton,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
      <Text
        style={[
          styles.chevron,
          isDark && styles.darkChevron,
          isOverlay && styles.overlayChevron,
        ]}>
        ‹
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.sm,
  },
  darkButton: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  overlayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...shadows.md,
  },
  chevron: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  darkChevron: {
    color: '#FFFFFF',
  },
  overlayChevron: {
    color: '#0F172A',
  },
});
