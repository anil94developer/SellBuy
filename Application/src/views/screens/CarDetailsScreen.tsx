import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Car } from '../../models/car.model';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  car: Car;
  onBack: () => void;
  onToggleFavorite: (car: Car) => void;
  onViewGallery: () => void;
  onViewSellerProfile: () => void;
  onStartChat: (car: Car) => void;
}

export const CarDetailsScreen: React.FC<Props> = ({
  car,
  onBack,
  onToggleFavorite,
  onViewGallery,
  onViewSellerProfile,
  onStartChat,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const images = car.images && car.images.length > 0 ? car.images : [
    car.imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  ];

  const handleCall = () => {
    Alert.alert(
      'Call Seller',
      `Calling ${car.sellerName || 'Seller'} at ${car.sellerPhone || '+91 98765-43210'}...`,
      [{ text: 'OK' }]
    );
  };

  const handleShare = () => {
    Alert.alert('Share Listing', `Sharing ${car.title} (${car.formattedPrice}) link copied!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Top Hero Image with Overlay Header */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: images[activePhotoIdx] }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Floating Header Controls */}
          <View style={styles.headerOverlay}>
            <TouchableOpacity style={styles.circleBtn} onPress={onBack} activeOpacity={0.8}>
              <Text style={styles.circleBtnText}>←</Text>
            </TouchableOpacity>

            <View style={styles.rightOverlayBtns}>
              <TouchableOpacity style={styles.circleBtn} onPress={handleShare} activeOpacity={0.8}>
                <Text style={styles.circleBtnText}>↗</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => onToggleFavorite(car)}
                activeOpacity={0.8}>
                <Text style={[styles.circleBtnText, car.isFavorite && styles.activeHeart]}>
                  {car.isFavorite ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Image Pagination Badge */}
          <TouchableOpacity
            style={styles.paginationBadge}
            onPress={onViewGallery}
            activeOpacity={0.8}>
            <Text style={styles.paginationText}>
              {activePhotoIdx + 1}/{images.length}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Details Card */}
        <View style={styles.contentCard}>
          {/* Title & Price */}
          <Text style={styles.title}>{car.title}</Text>
          <Text style={styles.price}>{car.formattedPrice}</Text>

          {/* Location Badge */}
          <View style={styles.locationRow}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationText}>{car.location}</Text>
          </View>

          {/* Key Specs Row */}
          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Text style={styles.specIcon}>⛽</Text>
              <Text style={styles.specValue}>{car.fuelType}</Text>
              <Text style={styles.specLabel}>Fuel Type</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specIcon}>⚙️</Text>
              <Text style={styles.specValue}>{car.transmission}</Text>
              <Text style={styles.specLabel}>Transmission</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specIcon}>👤</Text>
              <Text style={styles.specValue}>{car.ownership || '1st Owner'}</Text>
              <Text style={styles.specLabel}>Ownership</Text>
            </View>

            <View style={styles.specBox}>
              <Text style={styles.specIcon}>⏱️</Text>
              <Text style={styles.specValue}>
                {(car.mileage || 30000).toLocaleString('en-IN')} km
              </Text>
              <Text style={styles.specLabel}>Kilometers</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descriptionText}>
              {car.description ||
                'Well maintained Hyundai Creta 2021. Single owner. All documents clear. Complete authorized service record available.'}
            </Text>
          </View>

          {/* Photos Preview Strip */}
          <View style={styles.sectionBlock}>
            <View style={styles.photosHeadingRow}>
              <Text style={styles.sectionHeading}>Photos ({images.length})</Text>
              <TouchableOpacity onPress={onViewGallery} activeOpacity={0.7}>
                <Text style={styles.viewGalleryLink}>View All Photos</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScroll}>
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActivePhotoIdx(idx)}
                  activeOpacity={0.8}
                  style={[styles.thumbBox, activePhotoIdx === idx && styles.activeThumbBox]}>
                  <Image source={{ uri: img }} style={styles.thumbImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Seller Profile Card */}
          <View style={styles.sellerCard}>
            <TouchableOpacity
              style={styles.sellerRow}
              onPress={onViewSellerProfile}
              activeOpacity={0.8}>
              <Image
                source={{
                  uri:
                    car.sellerAvatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                }}
                style={styles.sellerAvatar}
              />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{car.sellerName || 'Rakesh Sharma'}</Text>
                <Text style={styles.sellerJoined}>{car.sellerJoined || 'Member since 2022'}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {car.sellerRating || 4.8} Rating</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={() => setIsFollowing(!isFollowing)}
                activeOpacity={0.7}>
                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Actions Bar: Chat & Call */}
      <View style={styles.stickyBottomBar}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => onStartChat(car)}
          activeOpacity={0.85}>
          <Text style={styles.chatIcon}>💬</Text>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.85}>
          <Text style={styles.callIcon}>📞</Text>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
    backgroundColor: '#090D16',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightOverlayBtns: {
    flexDirection: 'row',
    gap: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  circleBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  activeHeart: {
    color: colors.danger,
  },
  paginationBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  paginationText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  contentCard: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.surface,
    marginTop: -20,
    ...shadows.md,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  price: {
    fontSize: 24,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginTop: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  locationPin: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  specBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  specIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  specValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  specLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  photosHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewGalleryLink: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  thumbScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  thumbBox: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
  },
  activeThumbBox: {
    borderColor: colors.primary,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  sellerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  sellerJoined: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingBadge: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: typography.sizes.xs,
    color: colors.warning,
    fontWeight: typography.weights.bold,
  },
  followBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  followingBtn: {
    backgroundColor: colors.primary,
  },
  followBtnText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  followingBtnText: {
    color: '#FFFFFF',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
    ...shadows.lg,
  },
  chatButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  chatIcon: {
    fontSize: 16,
  },
  chatButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  callButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...shadows.sm,
  },
  callIcon: {
    fontSize: 16,
  },
  callButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: '#FFFFFF',
  },
});
