import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Header } from '../common/Header';
import { User } from '../../models/car.model';
import { colors, typography } from '../../theme/theme';
import { ScreenName } from '../../navigation/navigationTypes';

interface Props {
  user: User;
  onBack: () => void;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
}

export const MenuDrawerScreen: React.FC<Props> = ({
  user,
  onBack,
  onNavigate,
  onLogout,
}) => {
  const isUserLoggedIn = Boolean(user && user.id);
  const menuItems: { title: string; icon: string; screen?: ScreenName; action?: () => void; isDestructive?: boolean }[] = [
    { title: 'Home', icon: '🏠', screen: 'HOME' },
    { title: 'My Listings', icon: '🚗', screen: 'MY_LISTINGS' },
    { title: 'Saved Cars', icon: '♥', screen: 'SAVED_CARS' },
    { title: 'My Chats', icon: '💬', screen: 'CHAT' },
    { title: 'Notifications', icon: '🔔', screen: 'NOTIFICATIONS' },
    { title: 'Help & Support', icon: '?', screen: 'PROFILE' },
    { title: 'Settings', icon: '⚙', screen: 'PROFILE' },
    { title: 'About App', icon: 'ℹ', screen: 'PROFILE' },
    isUserLoggedIn
      ? { title: 'Logout', icon: '⎋', action: onLogout, isDestructive: true }
      : { title: 'Login / Register', icon: '👤', screen: 'LOGIN' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Menu / Drawer" showBack={true} onBack={onBack} />

      <View style={styles.drawerCard}>
        {/* User Card */}
        <View style={styles.userSection}>
          <Image
            source={{
              uri:
                user.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menu list */}
        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            const isLogout = item.isDestructive;
            return (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  if (item.action) item.action();
                  else if (item.screen) onNavigate(item.screen);
                }}
                activeOpacity={0.7}>
                <View style={styles.menuIconBox}>
                  <Text style={[styles.menuIcon, isLogout && { color: colors.danger }]}>
                    {item.icon}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.menuText,
                    isLogout && { color: colors.danger, fontWeight: typography.weights.bold },
                  ]}>
                  {item.title}
                </Text>
                {!isLogout && <Text style={styles.chevron}>›</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  drawerCard: {
    flex: 1,
    width: '88%',
    backgroundColor: colors.surface,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  userPhone: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  menuIconBox: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  chevron: {
    fontSize: 18,
    color: colors.textMuted,
  },
});
