import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from './Icon';
import { colors, typography, shadows } from '../../theme/theme';
import { ScreenName } from '../../navigation/navigationTypes';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const isHome = currentScreen === 'HOME';
  const isSearch = currentScreen === 'SEARCH' || currentScreen === 'SEARCH_RESULTS';
  const isSaved = currentScreen === 'SAVED_CARS';
  const isProfile = currentScreen === 'PROFILE';

  return (
    <View style={styles.container}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('HOME')}
        activeOpacity={0.7}>
        <Icon name="home" size={22} color={isHome ? colors.primary : colors.textMuted} />
        <Text style={[styles.tabLabel, isHome && styles.activeTabLabel]}>Home</Text>
      </TouchableOpacity>

      {/* Search Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('SEARCH')}
        activeOpacity={0.7}>
        <Icon name="search" size={22} color={isSearch ? colors.primary : colors.textMuted} />
        <Text style={[styles.tabLabel, isSearch && styles.activeTabLabel]}>Search</Text>
      </TouchableOpacity>

      {/* Center Sell (+) Button */}
      <TouchableOpacity
        style={styles.centerSellButtonContainer}
        onPress={() => onNavigate('SELL_START')}
        activeOpacity={0.85}>
        <View style={styles.centerSellButton}>
          <Text style={styles.centerSellPlus}>+</Text>
        </View>
        <Text style={[styles.tabLabel, styles.sellLabel]}>Sell</Text>
      </TouchableOpacity>

      {/* Saved Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('SAVED_CARS')}
        activeOpacity={0.7}>
        <Icon name="heart-fill" size={20} color={isSaved ? colors.primary : colors.textMuted} />
        <Text style={[styles.tabLabel, isSaved && styles.activeTabLabel]}>Saved</Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onNavigate('PROFILE')}
        activeOpacity={0.7}>
        <Icon name="user" size={22} color={isProfile ? colors.primary : colors.textMuted} />
        <Text style={[styles.tabLabel, isProfile && styles.activeTabLabel]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingBottom: 4,
    ...shadows.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
    marginTop: 3,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  centerSellButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  centerSellButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  centerSellPlus: {
    color: colors.textLight,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  sellLabel: {
    marginTop: 2,
    fontWeight: typography.weights.semibold,
  },
});
