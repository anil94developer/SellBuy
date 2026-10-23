import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, IconName } from './Icon';
import { BackButton } from './BackButton';
import { colors, typography } from '../../theme/theme';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightIcon?: IconName;
  onRightPress?: () => void;
  rightText?: string;
  onRightTextPress?: () => void;
  theme?: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightIcon,
  onRightPress,
  rightText,
  onRightTextPress,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? colors.textLight : colors.textPrimary;
  const subtextColor = isDark ? colors.textMuted : colors.textSecondary;

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.leftContainer}>
        {showBack && onBack ? (
          <BackButton
            onPress={onBack}
            theme={isDark ? 'dark' : 'light'}
            size={38}
          />
        ) : null}
      </View>

      <View style={styles.titleContainer}>
        {title ? (
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text style={[styles.subtitle, { color: subtextColor }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightContainer}>
        {rightText ? (
          <TouchableOpacity onPress={onRightTextPress} activeOpacity={0.7}>
            <Text style={styles.rightText}>{rightText}</Text>
          </TouchableOpacity>
        ) : null}
        {rightIcon && onRightPress ? (
          <TouchableOpacity
            style={[styles.iconButton, isDark && styles.darkButton]}
            onPress={onRightPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name={rightIcon} size={20} color={textColor} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  darkContainer: {
    backgroundColor: colors.darkBg,
    borderBottomColor: colors.darkBorder,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  darkButton: {
    backgroundColor: colors.darkCard,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  rightText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
});
