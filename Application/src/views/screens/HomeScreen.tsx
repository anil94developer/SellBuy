import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Car } from '../../models/car.model';
import { CarCard } from '../components/CarCard';
import { colors, typography, shadows } from '../../theme/theme';
import { ScreenName } from '../../navigation/navigationTypes';

interface Props {
  selectedCity: string;
  cars: Car[];
  unreadNotificationsCount?: number;
  onOpenDrawer: () => void;
  onSelectCity: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  onNavigate: (screen: ScreenName, params?: any) => void;
  onSelectCar: (car: Car) => void;
  onToggleFavorite: (car: Car) => void;
  onSelectBrand: (brand: string) => void;
  selectedBrand: string | null;
}

const BRANDS = [
  { name: 'Maruti', logo: '🚗' },
  { name: 'Hyundai', logo: '🚙' },
  { name: 'Tata', logo: '🏎️' },
  { name: 'Mahindra', logo: '🚐' },
  { name: 'Kia', logo: '🚘' },
  { name: 'Honda', logo: '🚖' },
  { name: 'Toyota', logo: '🚙' },
];

export const HomeScreen: React.FC<Props> = ({
  selectedCity = 'Jaipur, Rajasthan',
  cars,
  unreadNotificationsCount = 2,
  onOpenDrawer,
  onSelectCity,
  onOpenNotifications,
  onOpenSearch,
  onNavigate,
  onSelectCar,
  onToggleFavorite,
  onSelectBrand,
  selectedBrand,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onOpenDrawer} activeOpacity={0.7}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        {/* Location Dropdown */}
        <TouchableOpacity style={styles.locationSelector} onPress={onSelectCity} activeOpacity={0.8}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationCity} numberOfLines={1}>
              {selectedCity}
            </Text>
            <Text style={styles.locationChevron}>▾</Text>
          </View>
        </TouchableOpacity>

        {/* Bell Notifications */}
        <TouchableOpacity style={styles.iconButton} onPress={onOpenNotifications} activeOpacity={0.7}>
          <Text style={styles.bellIcon}>🔔</Text>
          {unreadNotificationsCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadNotificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar Input */}
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchBar} onPress={onOpenSearch} activeOpacity={0.85}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search cars, brand, model...</Text>
          </TouchableOpacity>
        </View>

        {/* 4 Circular Action Buttons */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={onOpenSearch}
            activeOpacity={0.75}>
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.actionIcon}>🚗</Text>
            </View>
            <Text style={styles.actionLabel}>Buy Car</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => onNavigate('SELL_START')}
            activeOpacity={0.75}>
            <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
              <Text style={styles.actionIcon}>🏷️</Text>
            </View>
            <Text style={styles.actionLabel}>Sell Car</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => onNavigate('SEARCH', { tab: 'new' })}
            activeOpacity={0.75}>
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.actionIcon}>✨</Text>
            </View>
            <Text style={styles.actionLabel}>New Cars</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => onNavigate('SEARCH', { tab: 'used' })}
            activeOpacity={0.75}>
            <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Text style={styles.actionIcon}>🚙</Text>
            </View>
            <Text style={styles.actionLabel}>Used Cars</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card Banner: Find Your Perfect Car */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>Find Your{'\n'}Perfect Car</Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => onNavigate('SEARCH')}
              activeOpacity={0.85}>
              <Text style={styles.bannerButtonText}>Explore Cars →</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80',
            }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Popular Brands */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Brands</Text>
          <TouchableOpacity onPress={() => onNavigate('SEARCH')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brandsScroll}>
          {BRANDS.map((item) => {
            const isSelected = selectedBrand === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.brandItem, isSelected && styles.brandItemSelected]}
                onPress={() => {
                  onSelectBrand(isSelected ? '' : item.name);
                }}
                activeOpacity={0.7}>
                <View style={styles.brandIconBox}>
                  <Text style={styles.brandIcon}>{item.logo}</Text>
                </View>
                <Text style={[styles.brandName, isSelected && styles.brandNameSelected]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Cars */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Cars</Text>
          <TouchableOpacity onPress={() => onNavigate('SEARCH_RESULTS')} activeOpacity={0.7}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.carsList}>
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onToggleFavorite={onToggleFavorite}
              onPressDetails={onSelectCar}
              onContactSeller={(c) => {
                onNavigate('CHAT', { car: c });
              }}
            />
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  menuIcon: {
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  bellIcon: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  unreadBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  locationSelector: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationPin: {
    fontSize: 13,
    marginRight: 4,
  },
  locationCity: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    maxWidth: 160,
  },
  locationChevron: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  actionItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  bannerCard: {
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...shadows.md,
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: '#FFFFFF',
    lineHeight: 26,
  },
  bannerButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  bannerImage: {
    width: 120,
    height: 80,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  viewAllText: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  brandsScroll: {
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 10,
  },
  brandItem: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minWidth: 70,
  },
  brandItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  brandIconBox: {
    marginBottom: 4,
  },
  brandIcon: {
    fontSize: 22,
  },
  brandName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  brandNameSelected: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  carsList: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
