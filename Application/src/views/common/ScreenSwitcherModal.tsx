import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { ScreenName } from '../../navigation/navigationTypes';
import { colors, typography } from '../../theme/theme';

interface ScreenSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectScreen: (screen: ScreenName) => void;
  currentScreen: ScreenName;
}

interface ScreenGroup {
  groupTitle: string;
  screens: { number: number; name: string; screen: ScreenName }[];
}

const GROUPS: ScreenGroup[] = [
  {
    groupTitle: '1. Authentication (Login/Signup)',
    screens: [
      { number: 1, name: 'Splash Screen', screen: 'SPLASH' },
      { number: 2, name: 'Welcome Screen', screen: 'WELCOME' },
      { number: 3, name: 'Login / Signup', screen: 'LOGIN' },
      { number: 4, name: 'Enter OTP', screen: 'OTP' },
      { number: 5, name: 'Complete Profile', screen: 'COMPLETE_PROFILE' },
    ],
  },
  {
    groupTitle: '2. Location Setup',
    screens: [
      { number: 6, name: 'Location Permission', screen: 'LOCATION_PERMISSION' },
      { number: 7, name: 'Select City', screen: 'SELECT_CITY' },
    ],
  },
  {
    groupTitle: '3. Home & Navigations',
    screens: [
      { number: 8, name: 'Home Screen', screen: 'HOME' },
      { number: 9, name: 'Menu / Drawer', screen: 'DRAWER_MENU' },
    ],
  },
  {
    groupTitle: '4. Search & Filter',
    screens: [
      { number: 10, name: 'Search Screen', screen: 'SEARCH' },
      { number: 11, name: 'Filter Screen', screen: 'FILTER' },
      { number: 12, name: 'Search Results', screen: 'SEARCH_RESULTS' },
    ],
  },
  {
    groupTitle: '5. Car Details & Actions',
    screens: [
      { number: 13, name: 'Car Details', screen: 'CAR_DETAILS' },
      { number: 14, name: 'Image Gallery', screen: 'IMAGE_GALLERY' },
      { number: 15, name: 'Seller Profile', screen: 'SELLER_PROFILE' },
    ],
  },
  {
    groupTitle: '6. Sell Car Flow',
    screens: [
      { number: 16, name: 'Sell Car - Start', screen: 'SELL_START' },
      { number: 17, name: 'Add Photos', screen: 'SELL_ADD_PHOTOS' },
      { number: 18, name: 'Car Information', screen: 'SELL_CAR_INFO' },
      { number: 19, name: 'More Details', screen: 'SELL_MORE_DETAILS' },
      { number: 20, name: 'Preview Listing', screen: 'SELL_PREVIEW' },
    ],
  },
  {
    groupTitle: '7. My Listings & Management',
    screens: [
      { number: 21, name: 'My Listings', screen: 'MY_LISTINGS' },
      { number: 22, name: 'Edit Listing', screen: 'EDIT_LISTING' },
    ],
  },
  {
    groupTitle: '8. User Features',
    screens: [
      { number: 23, name: 'Saved Cars', screen: 'SAVED_CARS' },
      { number: 24, name: 'Chat / Conversation', screen: 'CHAT' },
      { number: 25, name: 'Notifications', screen: 'NOTIFICATIONS' },
    ],
  },
  {
    groupTitle: '9. Profile & Settings',
    screens: [
      { number: 26, name: 'Profile & Settings', screen: 'PROFILE' },
    ],
  },
];

export const ScreenSwitcherModal: React.FC<ScreenSwitcherModalProps> = ({
  visible,
  onClose,
  onSelectScreen,
  currentScreen,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>All 26 Screens Showcase</Text>
              <Text style={styles.subtitle}>Directly jump to any screen from design blueprint</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Groups list */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {GROUPS.map((group, gIdx) => (
              <View key={gIdx} style={styles.groupCard}>
                <Text style={styles.groupHeader}>{group.groupTitle}</Text>
                <View style={styles.screenGrid}>
                  {group.screens.map((item) => {
                    const isActive = currentScreen === item.screen;
                    return (
                      <TouchableOpacity
                        key={item.number}
                        style={[styles.screenChip, isActive && styles.activeScreenChip]}
                        onPress={() => {
                          onSelectScreen(item.screen);
                          onClose();
                        }}
                        activeOpacity={0.7}>
                        <View style={[styles.badgeNumber, isActive && styles.activeBadgeNumber]}>
                          <Text style={[styles.badgeNumberText, isActive && styles.activeBadgeText]}>
                            {item.number}
                          </Text>
                        </View>
                        <Text
                          style={[styles.screenName, isActive && styles.activeScreenName]}
                          numberOfLines={1}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  groupCard: {
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  groupHeader: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    marginBottom: 8,
  },
  screenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  screenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeScreenChip: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  badgeNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  activeBadgeNumber: {
    backgroundColor: colors.primary,
  },
  badgeNumberText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  activeBadgeText: {
    color: colors.textLight,
  },
  screenName: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  activeScreenName: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});
