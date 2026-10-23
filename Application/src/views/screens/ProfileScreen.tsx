import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { User } from '../../models/car.model';
import { colors, typography, shadows } from '../../theme/theme';
import { ScreenName } from '../../navigation/navigationTypes';

interface Props {
  user: User;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
  onEditProfile: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  user,
  onNavigate,
  onLogout,
  onEditProfile,
}) => {
  const links = [
    { title: 'My Listings', icon: '🚗', screen: 'MY_LISTINGS' as ScreenName },
    { title: 'Saved Cars', icon: '♥', screen: 'SAVED_CARS' as ScreenName },
    { title: 'My Chats', icon: '💬', screen: 'CHAT' as ScreenName },
    { title: 'Notifications', icon: '🔔', screen: 'NOTIFICATIONS' as ScreenName },
    {
      title: 'Settings',
      icon: '⚙',
      action: () => Alert.alert('Settings', 'App preferences & notifications configured.'),
    },
    {
      title: 'Help & Support',
      icon: '?',
      action: () => Alert.alert('Help & Support', 'Call support helpline: +91 98765 43210'),
    },
    {
      title: 'Privacy Policy',
      icon: '📄',
      action: () =>
        Alert.alert(
          'Privacy Policy',
          'Your data is protected under SellBuy verified buyer/seller data protocols.'
        ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
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
            <TouchableOpacity onPress={onEditProfile} activeOpacity={0.7}>
              <Text style={styles.editProfileLink}>Edit Profile ›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Links */}
        <View style={styles.menuCard}>
          {links.map((link, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuRow, index === links.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => {
                if (link.screen) onNavigate(link.screen);
                else if (link.action) link.action();
              }}
              activeOpacity={0.7}>
              <View style={styles.iconBox}>
                <Text style={styles.menuIcon}>{link.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{link.title}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Login or Logout Button */}
        {user && user.id ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.75}>
            <Text style={styles.logoutIcon}>⎋</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: colors.primary, backgroundColor: colors.primary }]}
            onPress={() => onNavigate('LOGIN')}
            activeOpacity={0.75}>
            <Text style={[styles.logoutIcon, { color: '#FFFFFF' }]}>➔</Text>
            <Text style={[styles.logoutText, { color: '#FFFFFF' }]}>Login or Sign Up</Text>
          </TouchableOpacity>
        )}

        <View style={styles.appVersionBlock}>
          <Text style={styles.appVersionText}>SellBuy Mobile • Build 2026.1</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 16,
    ...shadows.sm,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
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
  editProfileLink: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
    marginTop: 6,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    marginBottom: 18,
    ...shadows.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconBox: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuTitle: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 18,
    color: colors.textMuted,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  logoutIcon: {
    fontSize: 18,
    color: colors.danger,
    fontWeight: '700',
  },
  logoutText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
  appVersionBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  appVersionText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
});
