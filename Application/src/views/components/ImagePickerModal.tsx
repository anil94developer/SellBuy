import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { colors, typography, shadows } from '../../theme/theme';

export interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (imageUri: string, caption?: string) => void;
  onSelectMultipleImages?: (images: string[]) => void;
  title?: string;
  allowMultiple?: boolean;
  allowCaption?: boolean;
}

// Curated high-res automotive gallery presets
const GALLERY_PRESETS = [
  {
    id: 'g1',
    category: 'Exterior',
    label: 'Front View',
    uri: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g2',
    category: 'Exterior',
    label: 'Side Profile',
    uri: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g3',
    category: 'Interior',
    label: 'Dashboard & Cockpit',
    uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g4',
    category: 'Interior',
    label: 'Rear Leather Seats',
    uri: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g5',
    category: 'Documents',
    label: 'Vehicle RC Smart Card',
    uri: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g6',
    category: 'Mechanical',
    label: 'Engine Bay',
    uri: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g7',
    category: 'Exterior',
    label: 'Rear 45° Angle',
    uri: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'g8',
    category: 'Mechanical',
    label: 'Alloy Wheels & Tires',
    uri: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onSelectImage,
  onSelectMultipleImages,
  title = 'Attach Image / Photo',
  allowMultiple = false,
  allowCaption = true,
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'camera' | 'url'>('gallery');
  const [selectedUris, setSelectedUris] = useState<string[]>([GALLERY_PRESETS[0].uri]);
  const [caption, setCaption] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);

  const toggleSelectUri = (uri: string) => {
    if (allowMultiple) {
      if (selectedUris.includes(uri)) {
        setSelectedUris(selectedUris.filter((u) => u !== uri));
      } else {
        setSelectedUris([...selectedUris, uri]);
      }
    } else {
      setSelectedUris([uri]);
    }
  };

  const handleSimulateCameraCapture = () => {
    setCameraCountdown(3);
    const interval = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev && prev > 1) return prev - 1;
        clearInterval(interval);
        // Captured photo from camera
        const captured = GALLERY_PRESETS[Math.floor(Math.random() * GALLERY_PRESETS.length)].uri;
        setSelectedUris([captured]);
        setActiveTab('gallery');
        Alert.alert('Photo Captured! 📸', 'Your camera photo has been captured and selected.');
        return null;
      });
    }, 600);
  };

  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;
    setSelectedUris([customUrl.trim()]);
    setActiveTab('gallery');
    setCustomUrl('');
  };

  const handleConfirm = () => {
    if (selectedUris.length === 0) {
      Alert.alert('No Image Selected', 'Please tap on a photo to select it.');
      return;
    }

    if (allowMultiple && onSelectMultipleImages) {
      onSelectMultipleImages(selectedUris);
    } else {
      onSelectImage(selectedUris[0], caption.trim() || undefined);
    }

    setCaption('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>{title}</Text>
              <Text style={styles.sheetSubtitle}>
                {allowMultiple
                  ? `Selected (${selectedUris.length}) photos`
                  : 'Select photo from Camera, Gallery or Presets'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Source Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'gallery' && styles.tabButtonActive]}
              onPress={() => setActiveTab('gallery')}
              activeOpacity={0.7}>
              <Text style={[styles.tabText, activeTab === 'gallery' && styles.tabTextActive]}>
                🖼️ Gallery ({GALLERY_PRESETS.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'camera' && styles.tabButtonActive]}
              onPress={() => setActiveTab('camera')}
              activeOpacity={0.7}>
              <Text style={[styles.tabText, activeTab === 'camera' && styles.tabTextActive]}>
                📸 Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'url' && styles.tabButtonActive]}
              onPress={() => setActiveTab('url')}
              activeOpacity={0.7}>
              <Text style={[styles.tabText, activeTab === 'url' && styles.tabTextActive]}>
                🔗 Custom Link
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB 1: GALLERY & PRESETS */}
          {activeTab === 'gallery' && (
            <ScrollView style={styles.galleryScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.galleryGrid}>
                {GALLERY_PRESETS.map((item) => {
                  const isSelected = selectedUris.includes(item.uri);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.presetCard, isSelected && styles.presetCardSelected]}
                      onPress={() => toggleSelectUri(item.uri)}
                      activeOpacity={0.8}>
                      <Image source={{ uri: item.uri }} style={styles.presetImage} />
                      <View style={styles.presetLabelBox}>
                        <Text style={styles.presetLabel} numberOfLines={1}>
                          {item.label}
                        </Text>
                        <Text style={styles.presetCategory}>{item.category}</Text>
                      </View>
                      {isSelected && (
                        <View style={styles.checkCircle}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}

          {/* TAB 2: CAMERA SIMULATOR */}
          {activeTab === 'camera' && (
            <View style={styles.cameraBox}>
              <View style={styles.viewfinderFrame}>
                <Text style={styles.viewfinderIcon}>📷</Text>
                <Text style={styles.viewfinderText}>
                  {cameraCountdown ? `Capturing in ${cameraCountdown}...` : 'Point camera at vehicle / document'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.shutterButton}
                onPress={handleSimulateCameraCapture}
                disabled={cameraCountdown !== null}
                activeOpacity={0.8}>
                <View style={styles.shutterInner} />
              </TouchableOpacity>
              <Text style={styles.shutterLabel}>Tap Shutter to Capture</Text>
            </View>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === 'url' && (
            <View style={styles.urlBox}>
              <Text style={styles.inputLabel}>Enter or paste Image Web URL:</Text>
              <TextInput
                style={styles.urlInput}
                placeholder="https://images.unsplash.com/..."
                value={customUrl}
                onChangeText={setCustomUrl}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.loadUrlBtn}
                onPress={handleAddCustomUrl}
                activeOpacity={0.8}>
                <Text style={styles.loadUrlText}>Load & Select Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Optional Caption Input for Chat */}
          {allowCaption && selectedUris.length > 0 && (
            <View style={styles.captionSection}>
              <TextInput
                style={styles.captionInput}
                placeholder="Add a message or description for this photo..."
                value={caption}
                onChangeText={setCaption}
              />
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.sheetFooter}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, selectedUris.length === 0 && styles.confirmBtnDisabled]}
              onPress={handleConfirm}
              disabled={selectedUris.length === 0}
              activeOpacity={0.85}>
              <Text style={styles.confirmBtnText}>
                {allowMultiple
                  ? `Attach ${selectedUris.length} Photo${selectedUris.length > 1 ? 's' : ''}`
                  : 'Send Photo ➔'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
    ...shadows.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sheetTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  sheetSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: colors.surfaceSecondary,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  galleryScroll: {
    maxHeight: 320,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 16,
  },
  presetCard: {
    width: '48%',
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.borderLight,
    position: 'relative',
    backgroundColor: '#000000',
  },
  presetCardSelected: {
    borderColor: colors.primary,
  },
  presetImage: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  presetLabelBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  presetLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  presetCategory: {
    color: '#93C5FD',
    fontSize: 9,
    fontWeight: '600',
  },
  checkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  cameraBox: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  viewfinderFrame: {
    width: '100%',
    height: 170,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  viewfinderIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  viewfinderText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  shutterInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },
  shutterLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  urlBox: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  urlInput: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  loadUrlBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loadUrlText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  captionSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  captionInput: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.textPrimary,
  },
  sheetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  confirmBtn: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  confirmBtnDisabled: {
    backgroundColor: colors.textMuted,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
