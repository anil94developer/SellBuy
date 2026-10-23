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
    brand: string;
    model: string;
    year: number;
    regYear: number;
    kmDriven: number;
    fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  };
  onBack: () => void;
  onNext: (data: {
    brand: string;
    model: string;
    year: number;
    regYear: number;
    kmDriven: number;
    fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  }) => void;
}

const BRANDS = ['Hyundai', 'Maruti', 'Tata', 'Mahindra', 'Kia', 'Honda', 'Toyota'];
const FUEL_TYPES: ('Petrol' | 'Diesel' | 'CNG' | 'Electric')[] = ['Petrol', 'Diesel', 'CNG', 'Electric'];

export const SellCarInfoScreen: React.FC<Props> = ({
  initialData,
  onBack,
  onNext,
}) => {
  const [brand, setBrand] = useState(initialData?.brand || 'Hyundai');
  const [model, setModel] = useState(initialData?.model || 'Creta');
  const [year, setYear] = useState(String(initialData?.year || 2021));
  const [regYear, setRegYear] = useState(String(initialData?.regYear || 2021));
  const [kmDriven, setKmDriven] = useState(String(initialData?.kmDriven || 30000));
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid'>(
    initialData?.fuelType || 'Petrol'
  );

  const handleNext = () => {
    onNext({
      brand,
      model,
      year: parseInt(year, 10) || 2021,
      regYear: parseInt(regYear, 10) || 2021,
      kmDriven: parseInt(kmDriven, 10) || 30000,
      fuelType,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Car Information" subtitle="Step 2 of 4" showBack={true} onBack={onBack} />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Brand</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
            {BRANDS.map((b) => {
              const isSelected = brand === b;
              return (
                <TouchableOpacity
                  key={b}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setBrand(b)}
                  activeOpacity={0.7}>
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{b}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Model Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="Select or enter Model (e.g. Creta)"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Manufacturing Year & Registration Year */}
        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Manufacturing Year</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              placeholder="e.g. 2021"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Registration Year</Text>
            <TextInput
              style={styles.input}
              value={regYear}
              onChangeText={setRegYear}
              keyboardType="number-pad"
              placeholder="e.g. 2021"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        {/* KM Driven */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kilometers Driven (KM)</Text>
          <TextInput
            style={styles.input}
            value={kmDriven}
            onChangeText={setKmDriven}
            keyboardType="number-pad"
            placeholder="Enter KM (e.g. 30000)"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Fuel Type */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.fuelRow}>
            {FUEL_TYPES.map((f) => {
              const isSelected = fuelType === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.fuelChip, isSelected && styles.fuelChipActive]}
                  onPress={() => setFuelType(f)}
                  activeOpacity={0.7}>
                  <Text style={[styles.fuelChipText, isSelected && styles.fuelChipTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>Next →</Text>
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
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
  },
  fuelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fuelChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  fuelChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  fuelChipText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  fuelChipTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weights.bold,
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
