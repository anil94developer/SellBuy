import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Header } from '../common/Header';
import { NotificationItem } from '../../models/notification.model';
import { colors, typography } from '../../theme/theme';

interface Props {
  notifications: NotificationItem[];
  activeFilter: 'all' | 'messages' | 'listings';
  onFilterChange: (filter: 'all' | 'messages' | 'listings') => void;
  onBack: () => void;
  onNotificationPress: (item: NotificationItem) => void;
  onMarkAllRead: () => void;
}

export const NotificationsScreen: React.FC<Props> = ({
  notifications,
  activeFilter,
  onFilterChange,
  onBack,
  onNotificationPress,
  onMarkAllRead,
}) => {
  const filtered = notifications.filter(
    (n) => activeFilter === 'all' || n.type === activeFilter || n.type === 'all'
  );

  const getIcon = (type: NotificationItem['iconType']) => {
    switch (type) {
      case 'message': return '💬';
      case 'approval': return '✓';
      case 'interest': return '👤';
      case 'price_alert': return '🏷️';
      case 'feature': return '✨';
      default: return '🔔';
    }
  };

  const getIconBg = (type: NotificationItem['iconType']) => {
    switch (type) {
      case 'message': return '#EFF6FF';
      case 'approval': return '#ECFDF5';
      case 'interest': return '#FEF3C7';
      case 'price_alert': return '#FEE2E2';
      default: return '#F3E8FF';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications"
        showBack={true}
        onBack={onBack}
        rightText="Mark Read"
        onRightTextPress={onMarkAllRead}
      />

      {/* Filter Tabs: All, Messages, Listings */}
      <View style={styles.tabsRow}>
        {(['all', 'messages', 'listings'] as const).map((tab) => {
          const isActive = activeFilter === tab;
          const label = tab.charAt(0).toUpperCase() + tab.slice(1);
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabBtn, isActive && styles.tabBtnActive]}
              onPress={() => onFilterChange(tab)}
              activeOpacity={0.7}>
              <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Notifications List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
            onPress={() => onNotificationPress(item)}
            activeOpacity={0.75}>
            <View style={[styles.iconBox, { backgroundColor: getIconBg(item.iconType) }]}>
              <Text style={styles.iconText}>{getIcon(item.iconType)}</Text>
            </View>

            <View style={styles.textContent}>
              <View style={styles.titleRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
              <Text style={styles.itemMessage} numberOfLines={2}>
                {item.message}
              </Text>
            </View>

            {!item.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  textContent: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  itemTime: {
    fontSize: 10,
    color: colors.textMuted,
  },
  itemMessage: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 70,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
