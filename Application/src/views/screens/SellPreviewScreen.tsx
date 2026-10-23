import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  data: {
    photos: string[];
    brand: string;
    model: string;
    year: number;
    regYear: number;
    kmDriven: number;
    fuelType: string;
    transmission: string;
    price: number;
    city: string;
    description: string;
  };
  onBack: () => void;
  onPostListing: () => void;
}

export const SellPreviewScreen: React.FC<Props> = ({
  data,
  onBack,
  onPostListing,
}) => {
  const title = `${data.brand} ${data.model} ${data.year}`;
  const formattedPrice = `₹ ${data.price.toLocaleString('en-IN')}`;
  const mainImage =
    data.photos && data.photos.length > 0
      ? data.photos[0]
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Preview Listing" subtitle="Final Step 4 of 4" showBack={true} onBack={onBack} />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Notice Banner */}
        <View style={styles.noticeBanner}>
          <Text style={styles.noticeIcon}>ℹ️</Text>
          <Text style={styles.noticeText}>
            This is how buyers will see your vehicle on the marketplace.
          </Text>
        </View>

        {/* Preview Card */}
        <View style={styles.previewCard}>
          <Image source={{ uri: mainImage }} style={styles.cardImage} resizeMode="cover" />

          <View style={styles.cardContent}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Verified Inspection</Text>
              </View>
              <Text style={styles.photosCount}>{data.photos.length} Photos</Text>
            </View>

            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardPrice}>{formattedPrice}</Text>

            <View style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationText}>{data.city}</Text>
            </View>

            {/* Specs Badges */}
            <View style={styles.specsRow}>
              <View style={styles.specPill}>
                <Text style={styles.specText}>⛽ {data.fuelType}</Text>
              </View>
              <View style={styles.specPill}>
                <Text style={styles.specText}>⚙️ {data.transmission}</Text>
              </View>
              <View style={styles.specPill}>
                <Text style={styles.specText}>⏱️ {data.kmDriven.toLocaleString('en-IN')} km</Text>
              </View>
              <View style={styles.specPill}>
                <Text style={styles.specText}>👤 1st Owner</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descHeading}>Seller's Notes</Text>
              <Text style={styles.descBody}>{data.description}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Post Listing CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.postButton} onPress={onPostListing} activeOpacity={0.85}>
          <Text style={styles.postButtonText}>Post Listing Now ✓</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  noticeIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    color: '#1E40AF',
    fontWeight: typography.weights.medium,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  photosCount: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  cardPrice: {
    fontSize: 22,
    fontWeight: typography.weights.extrabold,
    color: colors.primary,
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  locationPin: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specPill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  specText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  descriptionSection: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  descHeading: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  descBody: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  postButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
