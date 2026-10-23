import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography, shadows } from '../../theme/theme';
import { CarFilter } from '../../models/car.model';

interface Props {
  currentFilters?: CarFilter;
  onBack: () => void;
  onApply: (filters: CarFilter) => void;
}

const BRANDS = ['All', 'Hyundai', 'Maruti', 'Tata', 'Mahindra', 'Kia', 'Honda', 'Toyota'];
const MODELS = ['All', 'Creta', 'Swift', 'Nexon', 'Scorpio', 'Seltos', 'Harrier'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const PRICE_PRESETS = [
  { label: 'Under ₹5L', min: 50000, max: 500000 },
  { label: '₹5L - ₹10L', min: 500000, max: 1000000 },
  { label: '₹10L - ₹20L', min: 1000000, max: 2000000 },
  { label: 'Above ₹20L', min: 2000000, max: 5000000 },
];

export const FilterScreen: React.FC<Props> = ({
  currentFilters,
  onBack,
  onApply,
}) => {
  const [selectedBrand, setSelectedBrand] = useState<string>(currentFilters?.brand || 'All');
  const [selectedModel, setSelectedModel] = useState<string>(currentFilters?.model || 'All');
  const [selectedFuel, setSelectedFuel] = useState<string>(currentFilters?.fuelType || 'Petrol');
  const [selectedTransmission, setSelectedTransmission] = useState<string>(
    currentFilters?.transmission || 'Manual'
  );
  const [minPrice, setMinPrice] = useState<number>(currentFilters?.minPrice || 50000);
  const [maxPrice, setMaxPrice] = useState<number>(currentFilters?.maxPrice || 5000000);
  const [yearFrom, setYearFrom] = useState<number>(currentFilters?.yearFrom || 2016);
  const [yearTo, setYearTo] = useState<number>(currentFilters?.yearTo || 2024);

  const handleReset = () => {
    setSelectedBrand('All');
    setSelectedModel('All');
    setSelectedFuel('Petrol');
    setSelectedTransmission('Manual');
    setMinPrice(50000);
    setMaxPrice(5000000);
    setYearFrom(2016);
    setYearTo(2024);
  };

  const handleApply = () => {
    onApply({
      brand: selectedBrand === 'All' ? undefined : selectedBrand,
      model: selectedModel === 'All' ? undefined : selectedModel,
      fuelType: selectedFuel,
      transmission: selectedTransmission,
      minPrice,
      maxPrice,
      yearFrom,
      yearTo,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Filters"
        showBack={true}
        onBack={onBack}
        rightText="Reset"
        onRightTextPress={handleReset}
      />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Price Range Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.priceDisplayRow}>
            <Text style={styles.priceValue}>₹ {minPrice.toLocaleString('en-IN')}</Text>
            <Text style={styles.priceDivider}>—</Text>
            <Text style={styles.priceValue}>₹ {maxPrice.toLocaleString('en-IN')}</Text>
          </View>

          {/* Quick Price Range Buttons */}
          <View style={styles.chipsRow}>
            {PRICE_PRESETS.map((p) => {
              const isSelected = minPrice === p.min && maxPrice === p.max;
              return (
                <TouchableOpacity
                  key={p.label}
                  style={[styles.presetChip, isSelected && styles.presetChipActive]}
                  onPress={() => {
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  activeOpacity={0.7}>
                  <Text style={[styles.presetChipText, isSelected && styles.presetChipTextActive]}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Brand Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brand</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {BRANDS.map((b) => {
              const isSelected = selectedBrand === b;
              return (
                <TouchableOpacity
                  key={b}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setSelectedBrand(b)}
                  activeOpacity={0.7}>
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{b}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Model Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {MODELS.map((m) => {
              const isSelected = selectedModel === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setSelectedModel(m)}
                  activeOpacity={0.7}>
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{m}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Year Range (From - To) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Year</Text>
          <View style={styles.yearRow}>
            <View style={styles.yearBox}>
              <Text style={styles.yearLabel}>From</Text>
              <Text style={styles.yearValue}>{yearFrom}</Text>
            </View>
            <Text style={styles.yearDivider}>to</Text>
            <View style={styles.yearBox}>
              <Text style={styles.yearLabel}>To</Text>
              <Text style={styles.yearValue}>{yearTo}</Text>
            </View>
          </View>
        </View>

        {/* Fuel Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fuel Type</Text>
          <View style={styles.chipsRow}>
            {FUEL_TYPES.map((f) => {
              const isSelected = selectedFuel === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setSelectedFuel(f)}
                  activeOpacity={0.7}>
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{f}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Transmission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transmission</Text>
          <View style={styles.chipsRow}>
            {TRANSMISSIONS.map((t) => {
              const isSelected = selectedTransmission === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => setSelectedTransmission(t)}
                  activeOpacity={0.7}>
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.85}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
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
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  priceDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  priceValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  priceDivider: {
    fontSize: typography.sizes.base,
    color: colors.textMuted,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  presetChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  presetChipText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  presetChipTextActive: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  horizontalScroll: {
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
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  yearBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  yearLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  yearValue: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  yearDivider: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.lg,
  },
  applyButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
