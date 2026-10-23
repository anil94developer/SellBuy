import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Header } from '../common/Header';
import { Car } from '../../models/car.model';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  cars: Car[];
  activeTab: 'active' | 'pending' | 'sold';
  onTabChange: (tab: 'active' | 'pending' | 'sold') => void;
  onBack: () => void;
  onEditListing: (car: Car) => void;
  onDeleteListing: (carId: string) => void;
  onAddNewListing: () => void;
}

export const MyListingsScreen: React.FC<Props> = ({
  cars,
  activeTab,
  onTabChange,
  onBack,
  onEditListing,
  onDeleteListing,
  onAddNewListing,
}) => {
  const activeCount = cars.filter((c) => (c.status || 'active') === 'active').length;
  const pendingCount = cars.filter((c) => c.status === 'pending').length;
  const soldCount = cars.filter((c) => c.status === 'sold').length;

  const displayedCars = cars.filter((c) => (c.status || 'active') === activeTab);

  const handleDeletePrompt = (car: Car) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${car.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteListing(car.id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Listings"
        showBack={true}
        onBack={onBack}
        rightText="+ Add"
        onRightTextPress={onAddNewListing}
      />

      {/* Tabs Row: Active (3), Pending (1), Sold (2) */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          onPress={() => onTabChange('active')}
          activeOpacity={0.7}>
          <Text style={[styles.tabBtnText, activeTab === 'active' && styles.tabBtnTextActive]}>
            Active ({activeCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
          onPress={() => onTabChange('pending')}
          activeOpacity={0.7}>
          <Text style={[styles.tabBtnText, activeTab === 'pending' && styles.tabBtnTextActive]}>
            Pending ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'sold' && styles.tabBtnActive]}
          onPress={() => onTabChange('sold')}
          activeOpacity={0.7}>
          <Text style={[styles.tabBtnText, activeTab === 'sold' && styles.tabBtnTextActive]}>
            Sold ({soldCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Listings List */}
      <FlatList
        data={displayedCars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const img =
            item.imageUrl ||
            (item.images && item.images[0]) ||
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

          const isPending = item.status === 'pending';
          const isSold = item.status === 'sold';

          return (
            <View style={styles.listingCard}>
              <View style={styles.cardMainRow}>
                <Image source={{ uri: img }} style={styles.thumbnail} />

                <View style={styles.cardDetails}>
                  <View style={styles.statusRow}>
                    <View
                      style={[
                        styles.statusBadge,
                        isPending && styles.statusBadgePending,
                        isSold && styles.statusBadgeSold,
                      ]}>
                      <Text
                        style={[
                          styles.statusText,
                          isPending && styles.statusTextPending,
                          isSold && styles.statusTextSold,
                        ]}>
                        {isPending ? 'Pending Approval' : isSold ? 'Sold' : 'Active'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.carTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.carPrice}>{item.formattedPrice}</Text>
                  <Text style={styles.carSpecs}>
                    {item.year} • {(item.mileage || 30000).toLocaleString('en-IN')} km • {item.fuelType}
                  </Text>
                </View>
              </View>

              {/* Action Buttons: Edit & Delete */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => onEditListing(item)}
                  activeOpacity={0.7}>
                  <Text style={styles.editBtnText}>✏ Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDeletePrompt(item)}
                  activeOpacity={0.7}>
                  <Text style={styles.deleteBtnText}>🗑 Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No {activeTab} listings</Text>
            <Text style={styles.emptySubtitle}>
              Vehicles under the {activeTab} tab will be shown here.
            </Text>
            <TouchableOpacity style={styles.addFirstBtn} onPress={onAddNewListing} activeOpacity={0.8}>
              <Text style={styles.addFirstBtnText}>+ Add New Listing</Text>
            </TouchableOpacity>
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
    paddingVertical: 9,
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
    padding: 16,
    paddingBottom: 40,
  },
  listingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardMainRow: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 100,
    height: 85,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  statusBadgeSold: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
  },
  statusTextPending: {
    color: '#D97706',
  },
  statusTextSold: {
    color: colors.textMuted,
  },
  carTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: 3,
  },
  carPrice: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
  },
  carSpecs: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 10,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  editBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.danger,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
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
  addFirstBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addFirstBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: typography.sizes.xs,
  },
});
