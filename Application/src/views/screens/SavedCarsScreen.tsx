import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../common/Header';
import { Car } from '../../models/car.model';
import { CarCard } from '../components/CarCard';
import { colors, typography } from '../../theme/theme';

interface Props {
  cars: Car[];
  onBack: () => void;
  onSelectCar: (car: Car) => void;
  onToggleFavorite: (car: Car) => void;
  onExplore: () => void;
}

export const SavedCarsScreen: React.FC<Props> = ({
  cars,
  onBack,
  onSelectCar,
  onToggleFavorite,
  onExplore,
}) => {
  const savedList = cars.filter((c) => c.isFavorite);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Saved Cars" showBack={true} onBack={onBack} />

      <View style={styles.countRow}>
        <Text style={styles.countText}>{savedList.length} cars saved</Text>
      </View>

      <FlatList
        data={savedList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CarCard
            car={item}
            onToggleFavorite={onToggleFavorite}
            onPressDetails={onSelectCar}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>♥</Text>
            <Text style={styles.emptyTitle}>No saved cars yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any vehicle card to save it for quick access later.
            </Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={onExplore} activeOpacity={0.8}>
              <Text style={styles.exploreBtnText}>Explore Vehicles</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  countRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  countText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 50,
    color: '#CBD5E1',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  exploreBtn: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: typography.sizes.sm,
  },
});
