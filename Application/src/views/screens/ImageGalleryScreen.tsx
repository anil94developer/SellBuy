import React, { useState } from 'react';
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
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  images?: string[];
  title?: string;
  onBack: () => void;
}

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
];

export const ImageGalleryScreen: React.FC<Props> = ({
  images = DEFAULT_GALLERY,
  title = 'Photos (10)',
  onBack,
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={title}
        showBack={true}
        onBack={onBack}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Preview Photo */}
        <View style={styles.featuredContainer}>
          <Image
            source={{ uri: images[selectedIdx] || images[0] }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              Photo {selectedIdx + 1} of {images.length}
            </Text>
          </View>
        </View>

        {/* Thumbnail Grid */}
        <View style={styles.gridSection}>
          <Text style={styles.gridTitle}>All Vehicle Angles & Interior</Text>
          <View style={styles.grid}>
            {images.map((img, idx) => {
              const isSelected = selectedIdx === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.gridItem, isSelected && styles.gridItemSelected]}
                  onPress={() => setSelectedIdx(idx)}
                  activeOpacity={0.8}>
                  <Image source={{ uri: img }} style={styles.thumbnailImage} />
                  {isSelected && (
                    <View style={styles.selectedOverlay}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.viewAllBtn} onPress={onBack} activeOpacity={0.85}>
          <Text style={styles.viewAllBtnText}>Back to Listing</Text>
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
  featuredContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#090D16',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  counterBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  gridSection: {
    padding: 16,
  },
  gridTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  gridItemSelected: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  viewAllBtn: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
