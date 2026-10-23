import { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchCars,
  toggleFavoriteCar,
  setSearchQuery,
  setSelectedBrand,
  setSelectedFuel,
  clearFilters,
} from '../store/slices/carSlice';
import { setActiveTab, setFeedbackMessage, clearFeedbackMessage } from '../store/slices/uiSlice';
import { Car } from '../models/car.model';

export function useCarMarketplaceViewModel() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { cars, loading, error, searchQuery, selectedBrand, selectedFuel } = useAppSelector(
    (state) => state.cars
  );
  const { activeTab, feedbackMessage } = useAppSelector((state) => state.ui);

  // Initialize and load data on mount
  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  // Derived Presentation State: Filtered Cars based on search and filters
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchesQuery =
        !searchQuery ||
        car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = !selectedBrand || car.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchesFuel = !selectedFuel || car.fuelType.toLowerCase() === selectedFuel.toLowerCase();

      return matchesQuery && matchesBrand && matchesFuel;
    });
  }, [cars, searchQuery, selectedBrand, selectedFuel]);

  // Market Stats
  const marketplaceStats = useMemo(() => {
    return {
      totalCars: cars.length,
      verifiedCount: cars.filter((c) => c.badge?.includes('Verified')).length,
      averagePrice:
        cars.length > 0
          ? Math.round(cars.reduce((acc, c) => acc + c.price, 0) / cars.length / 100000)
          : 0,
    };
  }, [cars]);

  // ViewModel Actions / Handlers
  const handleTabChange = useCallback(
    (tab: 'buyer' | 'seller') => {
      dispatch(setActiveTab(tab));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (text: string) => {
      dispatch(setSearchQuery(text));
    },
    [dispatch]
  );

  const handleBrandSelect = useCallback(
    (brand: string | null) => {
      dispatch(setSelectedBrand(brand));
    },
    [dispatch]
  );

  const handleFuelSelect = useCallback(
    (fuel: string | null) => {
      dispatch(setSelectedFuel(fuel));
    },
    [dispatch]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleToggleFavorite = useCallback(
    (car: Car) => {
      dispatch(toggleFavoriteCar(car.id));
      const message = car.isFavorite
        ? `Removed ${car.title} from favorites`
        : `Saved ${car.title} to favorites`;
      dispatch(setFeedbackMessage(message));

      setTimeout(() => {
        dispatch(clearFeedbackMessage());
      }, 3000);
    },
    [dispatch]
  );

  const handleRefresh = useCallback(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  return {
    // State exposed to View
    cars: filteredCars,
    allCarsCount: cars.length,
    loading,
    error,
    searchQuery,
    selectedBrand,
    selectedFuel,
    activeTab,
    feedbackMessage,
    stats: marketplaceStats,

    // Methods / Commands exposed to View
    handleTabChange,
    handleSearchChange,
    handleBrandSelect,
    handleFuelSelect,
    handleResetFilters,
    handleToggleFavorite,
    handleRefresh,
  };
}
