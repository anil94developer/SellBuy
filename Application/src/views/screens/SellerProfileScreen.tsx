import React, { useState } from 'react';
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
import { Header } from '../common/Header';
import { Car } from '../../models/car.model';
import { CarCard } from '../components/CarCard';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  sellerName?: string;
  sellerAvatar?: string;
  sellerRating?: number;
  sellerJoined?: string;
  listingsCount?: number;
  sellerCars: Car[];
  onBack: () => void;
  onSelectCar: (car: Car) => void;
  onToggleFavorite: (car: Car) => void;
  onStartChat: (car: Car) => void;
}

export const SellerProfileScreen: React.FC<Props> = ({
  sellerName = 'Rakesh Sharma',
  sellerAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  sellerRating = 4.8,
  sellerJoined = 'Member since 2022',
  listingsCount = 12,
  sellerCars,
  onBack,
  onSelectCar,
  onToggleFavorite,
  onStartChat,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    Alert.alert(
      isFollowing ? 'Unfollowed' : 'Following',
      `You are ${isFollowing ? 'no longer following' : 'now following'} ${sellerName}.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Seller Profile" showBack={true} onBack={onBack} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileSection}>
          <Image source={{ uri: sellerAvatar }} style={styles.avatar} />
          <Text style={styles.sellerName}>{sellerName}</Text>
          <Text style={styles.memberSince}>{sellerJoined}</Text>

          {/* Stats Box: Listings & Rating */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{listingsCount}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>★ {sellerRating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Verified Mobile Badge */}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedIcon}>✓</Text>
            <Text style={styles.verifiedText}>Verified Mobile</Text>
          </View>

          {/* Action Buttons: View All Listings & Follow */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.viewListingsBtn}
              onPress={() => {}}
              activeOpacity={0.8}>
              <Text style={styles.viewListingsBtnText}>View All Listings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={handleFollowToggle}
              activeOpacity={0.8}>
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seller's Cars List */}
        <View style={styles.carsSection}>
          <Text style={styles.sectionTitle}>Vehicles by this Seller</Text>
          {sellerCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onToggleFavorite={onToggleFavorite}
              onPressDetails={onSelectCar}
              onContactSeller={onStartChat}
            />
          ))}
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
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    ...shadows.sm,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: 12,
  },
  sellerName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  memberSince: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statBox: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedIcon: {
    color: colors.success,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
  },
  verifiedText: {
    color: colors.success,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 20,
  },
  viewListingsBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewListingsBtnText: {
    color: colors.primary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  followBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  followingBtn: {
    backgroundColor: '#334155',
  },
  followBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  followingBtnText: {
    color: '#E2E8F0',
  },
  carsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
});
