import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { Icon, IconName } from './Icon';
import { colors, typography } from '../../theme/theme';
import { ScreenName } from '../../navigation/navigationTypes';
import { User } from '../../models/car.model';

interface DrawerMenuModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
}

export const DrawerMenuModal: React.FC<DrawerMenuModalProps> = ({
  visible,
  onClose,
  user,
  onNavigate,
  onLogout,
}) => {
  const isUserLoggedIn = Boolean(user && user.id);
  const menuItems: { title: string; icon: IconName; screen?: ScreenName; action?: () => void; isDestructive?: boolean }[] = [
    { title: 'Home', icon: 'home', screen: 'HOME' },
    { title: 'My Listings', icon: 'car', screen: 'MY_LISTINGS' },
    { title: 'Saved Cars', icon: 'heart', screen: 'SAVED_CARS' },
    { title: 'My Chats', icon: 'chat', screen: 'CHAT' },
    { title: 'Notifications', icon: 'bell', screen: 'NOTIFICATIONS' },
    { title: 'Help & Support', icon: 'help', screen: 'PROFILE' },
    { title: 'Settings', icon: 'settings', screen: 'PROFILE' },
    { title: 'About App', icon: 'info', screen: 'PROFILE' },
    isUserLoggedIn
      ? { title: 'Logout', icon: 'logout', action: onLogout, isDestructive: true }
      : { title: 'Login / Register', icon: 'user', screen: 'LOGIN' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.drawerContainer}>
          {/* User Profile Header */}
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userPhone}>{user.phone}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Menu Items */}
          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            {menuItems.map((item, index) => {
              const isLogout = item.isDestructive;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    onClose();
                    if (item.action) {
                      item.action();
                    } else if (item.screen) {
                      onNavigate(item.screen);
                    }
                  }}
                  activeOpacity={0.7}>
                  <View style={styles.menuIconBox}>
                    <Icon
                      name={item.icon}
                      size={20}
                      color={isLogout ? colors.danger : colors.textPrimary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.menuText,
                      isLogout && { color: colors.danger, fontWeight: typography.weights.bold },
                    ]}>
                    {item.title}
                  </Text>
                  {!isLogout && (
                    <Icon name="chevron-right" size={16} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>SellBuy v1.0.0 • Android Release</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '78%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    height: '100%',
    paddingTop: 48,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
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
    marginBottom: 12,
  },
  menuList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  menuIconBox: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    fontWeight: typography.weights.medium,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
