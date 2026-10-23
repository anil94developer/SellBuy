import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography } from '../../theme/theme';

interface Props {
  selectedCity?: string;
  onBack: () => void;
  onSelectCity: (city: string) => void;
}

const CITIES = [
  { id: '1', name: 'Delhi', state: 'Delhi NCR' },
  { id: '2', name: 'Mumbai', state: 'Maharashtra' },
  { id: '3', name: 'Bangalore', state: 'Karnataka' },
  { id: '4', name: 'Hyderabad', state: 'Telangana' },
  { id: '5', name: 'Chennai', state: 'Tamil Nadu' },
  { id: '6', name: 'Jaipur', state: 'Rajasthan' },
  { id: '7', name: 'Ahmedabad', state: 'Gujarat' },
  { id: '8', name: 'Pune', state: 'Maharashtra' },
  { id: '9', name: 'Kolkata', state: 'West Bengal' },
  { id: '10', name: 'Chandigarh', state: 'Punjab' },
  { id: '11', name: 'Lucknow', state: 'Uttar Pradesh' },
];

export const SelectCityScreen: React.FC<Props> = ({
  selectedCity = 'Jaipur, Rajasthan',
  onBack,
  onSelectCity,
}) => {
  const [search, setSearch] = useState('');

  const filteredCities = CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header onBack={onBack} title="Select Your City" showBack={true} />

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search City"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* City List */}
      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const fullCity = `${item.name}, ${item.state}`;
          const isSelected = selectedCity.includes(item.name);

          return (
            <TouchableOpacity
              style={[styles.cityRow, isSelected && styles.selectedCityRow]}
              onPress={() => onSelectCity(fullCity)}
              activeOpacity={0.7}>
              <View style={styles.cityInfo}>
                <Text style={styles.pinIcon}>📍</Text>
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.cityName, isSelected && styles.selectedCityName]}>
                    {item.name}
                  </Text>
                  <Text style={styles.cityState}>{item.state}</Text>
                </View>
              </View>

              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
  },
  clearIcon: {
    fontSize: 14,
    color: colors.textMuted,
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectedCityRow: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderBottomColor: 'transparent',
    marginVertical: 2,
  },
  cityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    fontSize: 18,
  },
  cityName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  selectedCityName: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  cityState: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
