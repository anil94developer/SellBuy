import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Car } from '../../models/car.model';
import { colors, typography, shadows } from '../../theme/theme';

interface CarCardProps {
  car: Car;
  onToggleFavorite: (car: Car) => void;
  onPressDetails?: (car: Car) => void;
  onContactSeller?: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onToggleFavorite,
  onPressDetails,
  onContactSeller,
}) => {
  const imageUrl =
    car.imageUrl ||
    (car.images && car.images[0]) ||
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressDetails?.(car)}
      activeOpacity={0.88}>
      {/* Car Image with Badge & Favorite */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.carImage} resizeMode="cover" />

        {car.badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{car.badge}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleFavorite(car);
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.favoriteButton}
          activeOpacity={0.8}>
          <Text style={[styles.favoriteIcon, car.isFavorite && styles.favoriteIconActive]}>
            {car.isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {car.title}
        </Text>

        {/* Price */}
        <Text style={styles.price}>{car.formattedPrice}</Text>

        {/* Specs line: Year • Mileage • Fuel */}
        <Text style={styles.specsLine}>
          {car.year} • {(car.mileage || 30000).toLocaleString('en-IN')} km • {car.fuelType}
        </Text>

        {/* Location & Seller Action */}
        <View style={styles.footerRow}>
          <View style={styles.locationBox}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {car.location}
            </Text>
          </View>

          {onContactSeller && (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={(e) => {
                e.stopPropagation?.();
                onContactSeller(car);
              }}
              activeOpacity={0.7}>
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#94A3B8',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  favoriteIconActive: {
    color: colors.danger,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  price: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginTop: 4,
  },
  specsLine: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationPin: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  chatButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryMuted,
  },
  chatButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});
