import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  initialData?: {
    transmission: 'Manual' | 'Automatic';
    price: number;
    city: string;
    description: string;
  };
  onBack: () => void;
  onPreview: (data: {
    transmission: 'Manual' | 'Automatic';
    price: number;
    city: string;
    description: string;
  }) => void;
}

const CITIES = ['Jaipur, Rajasthan', 'Delhi NCR', 'Mumbai, MH', 'Bangalore, KA', 'Pune, MH'];

export const SellMoreDetailsScreen: React.FC<Props> = ({
  initialData,
  onBack,
  onPreview,
}) => {
  const [transmission, setTransmission] = useState<'Manual' | 'Automatic'>(
    initialData?.transmission || 'Manual'
  );
  const [price, setPrice] = useState(String(initialData?.price || 1150000));
  const [city, setCity] = useState(initialData?.city || 'Jaipur, Rajasthan');
  const [description, setDescription] = useState(
    initialData?.description ||
      'Well maintained Hyundai Creta 2021 model. Single owner. All documents clear.'
  );

  const handleNext = () => {
    onPreview({
      transmission,
      price: parseInt(price, 10) || 1150000,
      city,
      description,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="More Details" subtitle="Step 3 of 4" showBack={true} onBack={onBack} />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Transmission */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Transmission</Text>
          <View style={styles.segmentedRow}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                transmission === 'Manual' && styles.segmentBtnActive,
              ]}
              onPress={() => setTransmission('Manual')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.segmentText,
                  transmission === 'Manual' && styles.segmentTextActive,
                ]}>
                Manual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentBtn,
                transmission === 'Automatic' && styles.segmentBtnActive,
              ]}
              onPress={() => setTransmission('Automatic')}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.segmentText,
                  transmission === 'Automatic' && styles.segmentTextActive,
                ]}>
                Automatic
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expected Price */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Expected Price</Text>
          <View style={styles.priceInputBox}>
            <Text style={styles.rupeePrefix}>₹</Text>
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              placeholder="Enter Price"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* Registration Location */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Registration Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {CITIES.map((c) => {
              const isSelected = city === c;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.cityChip, isSelected && styles.cityChipActive]}
                  onPress={() => setCity(c)}
                  activeOpacity={0.7}>
                  <Text style={[styles.cityChipText, isSelected && styles.cityChipTextActive]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Write about your car condition, service history, features..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Preview Listing CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.previewBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.previewBtnText}>Preview Listing →</Text>
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
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  segmentText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  segmentTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
  },
  rupeePrefix: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    fontWeight: typography.weights.bold,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
  },
  cityChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cityChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  cityChipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  textArea: {
    height: 110,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#F8FAFC',
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  previewBtn: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  previewBtnText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
