import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Header } from '../common/Header';
import { Car } from '../../models/car.model';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  car: Car;
  onBack: () => void;
  onUpdate: (carId: string, updates: Partial<Car>) => void;
}

export const EditListingScreen: React.FC<Props> = ({
  car,
  onBack,
  onUpdate,
}) => {
  const [brand, setBrand] = useState(car.brand || 'Hyundai');
  const [model, setModel] = useState(car.model || 'Creta');
  const [year, setYear] = useState(String(car.year || 2021));
  const [kmDriven, setKmDriven] = useState(String(car.mileage || 30000));
  const [price, setPrice] = useState(String(car.price || 1150000));
  const [description, setDescription] = useState(
    car.description || 'Well maintained Hyundai Creta 2021. Single owner. All documents clear.'
  );

  const handleSave = () => {
    const numPrice = parseInt(price, 10) || 1150000;
    const numYear = parseInt(year, 10) || 2021;
    const numKm = parseInt(kmDriven, 10) || 30000;

    onUpdate(car.id, {
      brand,
      model,
      year: numYear,
      mileage: numKm,
      price: numPrice,
      formattedPrice: `₹ ${numPrice.toLocaleString('en-IN')}`,
      title: `${brand} ${model} ${numYear}`,
      description,
    });

    Alert.alert('Success', 'Listing updated successfully!', [{ text: 'OK', onPress: onBack }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Listing" showBack={true} onBack={onBack} />

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Brand</Text>
          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="Brand"
          />
        </View>

        {/* Model */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="Model"
          />
        </View>

        {/* Year */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
            placeholder="Year"
          />
        </View>

        {/* KM Driven */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>KM Driven</Text>
          <TextInput
            style={styles.input}
            value={kmDriven}
            onChangeText={setKmDriven}
            keyboardType="number-pad"
            placeholder="Kilometers Driven"
          />
        </View>

        {/* Price */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Price (₹)</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="number-pad"
            placeholder="Price"
          />
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.updateButton} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.updateButtonText}>Update Listing</Text>
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
    marginBottom: 18,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    marginBottom: 6,
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
  textArea: {
    height: 100,
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
  updateButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
