import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useCreateListingViewModel } from '../../viewmodels/useCreateListingViewModel';

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'] as const;

export const SellerSection: React.FC = () => {
  const { form, submitting, formError, updateField, handleSubmit } = useCreateListingViewModel();

  return (
    <View style={styles.container}>
      {/* Intro Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Sell Your Car Faster 🚀</Text>
        <Text style={styles.bannerText}>
          Reach thousands of genuine buyers directly. Free ad posting with 0% commission.
        </Text>
      </View>

      {/* Form Error */}
      {formError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {formError}</Text>
        </View>
      )}

      {/* Form Fields */}
      <View style={styles.formCard}>
        <Text style={styles.formHeading}>Vehicle Information</Text>

        {/* Title */}
        <Text style={styles.label}>Car Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Honda City 1.5 V i-VTEC"
          placeholderTextColor="#64748b"
          value={form.title}
          onChangeText={(val) => updateField('title', val)}
        />

        {/* Brand & Model */}
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Honda"
              placeholderTextColor="#64748b"
              value={form.brand}
              onChangeText={(val) => updateField('brand', val)}
            />
          </View>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. City"
              placeholderTextColor="#64748b"
              value={form.model}
              onChangeText={(val) => updateField('model', val)}
            />
          </View>
        </View>

        {/* Year & Price */}
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Model Year</Text>
            <TextInput
              style={styles.input}
              placeholder="2023"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={form.year.toString()}
              onChangeText={(val) => updateField('year', parseInt(val, 10) || 2024)}
            />
          </View>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Price (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 1250000"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={form.price ? form.price.toString() : ''}
              onChangeText={(val) => updateField('price', parseInt(val, 10) || 0)}
            />
          </View>
        </View>

        {/* Fuel Type Chips */}
        <Text style={styles.label}>Fuel Type</Text>
        <View style={styles.chipsRow}>
          {FUEL_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, form.fuelType === type && styles.chipActive]}
              onPress={() => updateField('fuelType', type)}>
              <Text
                style={[
                  styles.chipText,
                  form.fuelType === type && styles.chipTextActive,
                ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mileage & Location */}
        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Text style={styles.label}>Mileage (KM)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 25000"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={form.mileage ? form.mileage.toString() : ''}
              onChangeText={(val) => updateField('mileage', parseInt(val, 10) || 0)}
            />
          </View>
          <View style={styles.halfCol}>
            <Text style={styles.label}>City / Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Delhi"
              placeholderTextColor="#64748b"
              value={form.location}
              onChangeText={(val) => updateField('location', val)}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          activeOpacity={0.8}
          disabled={submitting}
          onPress={handleSubmit}>
          {submitting ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>🚀 Publish Listing (Redux MVVM)</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  banner: {
    backgroundColor: '#1e3a8a',
    borderRadius: 14,
    padding: 16,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerText: {
    color: '#bfdbfe',
    fontSize: 13,
    lineHeight: 18,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formHeading: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#3b82f6',
  },
  chipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 15,
  },
});
