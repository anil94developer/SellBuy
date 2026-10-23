import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography, shadows } from '../../theme/theme';

import { ImagePickerModal } from '../components/ImagePickerModal';

interface Props {
  initialPhotos?: string[];
  onBack: () => void;
  onNext: (photos: string[]) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
];

export const SellAddPhotosScreen: React.FC<Props> = ({
  initialPhotos = SAMPLE_PHOTO_PRESETS.slice(0, 3),
  onBack,
  onNext,
}) => {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [pickerVisible, setPickerVisible] = useState(false);

  const handleAddPhotosFromPicker = (newPhotos: string[]) => {
    const combined = [...photos, ...newPhotos];
    const unique = Array.from(new Set(combined)).slice(0, 8);
    setPhotos(unique);
  };

  const handleSinglePhotoFromPicker = (uri: string) => {
    if (!photos.includes(uri) && photos.length < 8) {
      setPhotos([...photos, uri]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Photos" subtitle="Step 1 of 4" showBack={true} onBack={onBack} />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.title}>Upload Vehicle Photos</Text>
          <Text style={styles.subtitle}>
            Upload clear exterior & interior photos to attract genuine buyers faster
          </Text>
        </View>

        {/* Big Add Photos Tile */}
        <TouchableOpacity
          style={styles.bigAddBox}
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.8}>
          <View style={styles.cameraCircle}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
          <Text style={styles.addPhotosText}>Add Photos</Text>
          <Text style={styles.addPhotosSubtext}>Tap to open camera/gallery photo picker</Text>
        </TouchableOpacity>

        {/* Uploaded Photos Grid */}
        <View style={styles.gridSection}>
          <Text style={styles.gridHeader}>
            Uploaded Photos ({photos.length}/6)
          </Text>

          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoCard}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.deleteBadge}
                  onPress={() => handleRemovePhoto(index)}
                  activeOpacity={0.7}>
                  <Text style={styles.deleteText}>✕</Text>
                </TouchableOpacity>
                <View style={styles.indexTag}>
                  <Text style={styles.indexText}>{index === 0 ? 'Main' : `#${index + 1}`}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Next Step Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => onNext(photos)}
          activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onSelectImage={handleSinglePhotoFromPicker}
        onSelectMultipleImages={handleAddPhotosFromPicker}
        title="Choose Vehicle Photos"
        allowMultiple={true}
        allowCaption={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTextBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 4,
  },
  bigAddBox: {
    height: 140,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cameraCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...shadows.sm,
  },
  plusIcon: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  addPhotosText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  addPhotosSubtext: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gridSection: {
    marginBottom: 30,
  },
  gridHeader: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoCard: {
    width: '47%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  indexTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  indexText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  nextButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
