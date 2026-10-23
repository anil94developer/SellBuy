import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../../store';
import { ScreenName } from '../../navigation/navigationTypes';
import {
  navigateTo,
  goBack,
  setScreenDirectly,
  resetToScreen,
  openDrawer,
  closeDrawer,
  setFeedbackMessage,
  clearFeedbackMessage,
} from '../../store/slices/uiSlice';
import {
  fetchCars,
  toggleFavoriteCar,
  createCarListing,
  updateCarListing,
  deleteCarListing,
  setMyListingsTab,
  setActiveCar,
  setFilters,
  updateSellDraft,
  setSelectedBrand,
} from '../../store/slices/carSlice';
import { setSelectedCity, setUser, loginSuccess, setPhoneNumber, logout } from '../../store/slices/userSlice';
import { setActiveFilter, markAsRead, markAllAsRead } from '../../store/slices/notificationSlice';
import {
  sendMessage,
  selectConversation,
  startChatWithCar,
  setActiveConversationByCar,
} from '../../store/slices/chatSlice';
import { authService } from '../../services/authService';
import { setCurrentUserHeaderId, onAccountBlocked } from '../../services/apiClient';

// Common Components
import { AppStatusBar } from '../common/AppStatusBar';
import { BottomNav } from '../common/BottomNav';
import { DrawerMenuModal } from '../common/DrawerMenuModal';

// All 26 Screens matching the blueprint image
import { SplashScreen } from './SplashScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { LoginScreen } from './LoginScreen';
import { OtpScreen } from './OtpScreen';
import { CompleteProfileScreen } from './CompleteProfileScreen';
import { LocationPermissionScreen } from './LocationPermissionScreen';
import { SelectCityScreen } from './SelectCityScreen';
import { HomeScreen } from './HomeScreen';
import { MenuDrawerScreen } from './MenuDrawerScreen';
import { SearchScreen } from './SearchScreen';
import { FilterScreen } from './FilterScreen';
import { SearchResultsScreen } from './SearchResultsScreen';
import { CarDetailsScreen } from './CarDetailsScreen';
import { ImageGalleryScreen } from './ImageGalleryScreen';
import { SellerProfileScreen } from './SellerProfileScreen';
import { SellStartScreen } from './SellStartScreen';
import { SellAddPhotosScreen } from './SellAddPhotosScreen';
import { SellCarInfoScreen } from './SellCarInfoScreen';
import { SellMoreDetailsScreen } from './SellMoreDetailsScreen';
import { SellPreviewScreen } from './SellPreviewScreen';
import { MyListingsScreen } from './MyListingsScreen';
import { EditListingScreen } from './EditListingScreen';
import { SavedCarsScreen } from './SavedCarsScreen';
import { ChatScreen } from './ChatScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { ProfileScreen } from './ProfileScreen';

import { colors, typography, shadows } from '../../theme/theme';
import { Car } from '../../models/car.model';

export const MarketplaceScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.ui);
  const carsState = useAppSelector((state) => state.cars);
  const userState = useAppSelector((state) => state.user);
  const chatState = useAppSelector((state) => state.chat);
  const notificationState = useAppSelector((state) => state.notifications);

  useEffect(() => {
    // Populate cars if empty on launch
    if (carsState.cars.length === 0) {
      dispatch(fetchCars());
    }
  }, [dispatch, carsState.cars.length]);

  // Account Blocked Listener from apiClient (fires on any 403 / isBlocked response)
  useEffect(() => {
    const unsubscribe = onAccountBlocked(() => {
      if (userState.isLoggedIn) {
        dispatch(logout());
        dispatch(resetToScreen({ screen: 'LOGIN' }));
        Alert.alert(
          'Account Suspended',
          'Your account has been suspended by administrator. You have been logged out and returned to the login screen.'
        );
      }
    });
    return unsubscribe;
  }, [dispatch, userState.isLoggedIn]);

  // Real-time account status guard: periodically checks if active user is blocked by admin
  useEffect(() => {
    if (!userState.isLoggedIn || !userState.currentUser?.id || userState.currentUser?.id === '') return;

    setCurrentUserHeaderId(String(userState.currentUser.id));

    let isMounted = true;
    let isChecking = false;

    const checkStatus = async () => {
      if (isChecking) return;
      isChecking = true;
      try {
        const res = await authService.checkUserStatus(userState.currentUser.id);
        if (isMounted && res && res.isBlocked) {
          dispatch(logout());
          dispatch(resetToScreen({ screen: 'LOGIN' }));
          Alert.alert(
            'Account Suspended',
            'Your account has been blocked by administrator. You have been logged out and returned to the login screen.',
            [{ text: 'OK' }]
          );
        }
      } catch {
        // network or silent error
      } finally {
        isChecking = false;
      }
    };

    // Immediate status check
    checkStatus();

    // Fast 3s poll for instant reaction when admin toggles block
    const interval = setInterval(checkStatus, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [dispatch, userState.isLoggedIn, userState.currentUser?.id]);

  // Authentication guard: ensure unauthenticated users are on auth screens
  useEffect(() => {
    const authScreens: ScreenName[] = [
      'SPLASH',
      'WELCOME',
      'LOGIN',
      'OTP',
      'COMPLETE_PROFILE',
    ];
    if (!userState.isLoggedIn && !authScreens.includes(ui.currentScreen)) {
      dispatch(resetToScreen({ screen: 'LOGIN' }));
    }
  }, [userState.isLoggedIn, ui.currentScreen, dispatch]);

  const handleNavigate = (screen: ScreenName, params: Record<string, any> = {}) => {
    const authScreens: ScreenName[] = [
      'SPLASH',
      'WELCOME',
      'LOGIN',
      'OTP',
      'COMPLETE_PROFILE',
    ];
    if (!userState.isLoggedIn && !authScreens.includes(screen)) {
      Alert.alert(
        'Login Required',
        'Please login or signup to continue to the marketplace.',
        [{ text: 'OK', onPress: () => dispatch(resetToScreen({ screen: 'LOGIN' })) }]
      );
      dispatch(resetToScreen({ screen: 'LOGIN' }));
      return;
    }
    dispatch(navigateTo({ screen, params }));
  };

  const handleGoBack = () => {
    dispatch(goBack());
  };

  const handleSelectCarDetails = (car: Car) => {
    dispatch(setActiveCar(car));
    handleNavigate('CAR_DETAILS');
  };

  const handleToggleFavorite = (car: Car) => {
    dispatch(toggleFavoriteCar(car.id));
  };

  const handleStartChatWithCar = (car: Car) => {
    dispatch(
      startChatWithCar({
        carId: car.id,
        title: car.title,
        price: car.formattedPrice,
        image: car.imageUrl,
        sellerName: car.sellerName || 'Rakesh Sharma',
        sellerPhone: car.sellerPhone || '+91 98765-43210',
        sellerAvatar: car.sellerAvatar,
        sellerLocation: car.regCity || car.location || 'Jaipur',
      })
    );
    handleNavigate('CHAT');
  };

  const unreadNotificationsCount = notificationState.items.filter((n) => !n.read).length;

  const showBottomNav =
    userState.isLoggedIn &&
    (ui.currentScreen === 'HOME' ||
      ui.currentScreen === 'SEARCH' ||
      ui.currentScreen === 'SAVED_CARS' ||
      ui.currentScreen === 'PROFILE');

  // Render current screen from the 26 screens
  const renderScreen = () => {
    switch (ui.currentScreen) {
      // 1. Authentication
      case 'SPLASH':
        return (
          <SplashScreen
            onContinue={() => {
              if (userState.isLoggedIn) {
                dispatch(resetToScreen({ screen: 'HOME' }));
              } else {
                handleNavigate('WELCOME');
              }
            }}
          />
        );
      case 'WELCOME':
        return (
          <WelcomeScreen
            onGetStarted={() => {
              if (userState.isLoggedIn) {
                dispatch(resetToScreen({ screen: 'HOME' }));
              } else {
                handleNavigate('LOGIN');
              }
            }}
          />
        );
      case 'LOGIN':
        return (
          <LoginScreen
            initialPhone={userState.phoneNumber || '9876543210'}
            onBack={() => {
              if (userState.isLoggedIn) {
                handleGoBack();
              } else {
                handleNavigate('WELCOME');
              }
            }}
            onSendOtp={async (phone) => {
              try {
                dispatch(setPhoneNumber(phone));
                const res = await authService.sendOtp(phone);
                if (res.success) {
                  dispatch(setFeedbackMessage(res.message || `OTP sent to +91 ${phone} (Demo: 123456)`));
                  handleNavigate('OTP');
                } else {
                  Alert.alert('Send OTP Failed', res.message || 'Unable to send OTP');
                }
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Network error sending OTP');
              }
            }}
            onSocialLogin={async (provider) => {
              try {
                const res = await authService.socialLogin(provider);
                if (res.success && res.user) {
                  dispatch(loginSuccess(res.user));
                  dispatch(setFeedbackMessage(`Welcome, ${res.user.name}!`));
                  dispatch(resetToScreen({ screen: 'HOME' }));
                } else {
                  Alert.alert('Login Failed', res.message || 'Social login failed');
                }
              } catch (err: any) {
                Alert.alert('Social Login Error', err.message || 'Could not authenticate');
              }
            }}
            onQuickDemoLogin={async (demoPhone) => {
              try {
                dispatch(setPhoneNumber(demoPhone));
                const res = await authService.verifyOtp(demoPhone, '123456');
                if (res.success && res.user) {
                  dispatch(loginSuccess(res.user));
                  dispatch(setFeedbackMessage(`Logged in as ${res.user.name}`));
                  dispatch(resetToScreen({ screen: 'HOME' }));
                } else {
                  const sendRes = await authService.sendOtp(demoPhone);
                  dispatch(setFeedbackMessage(sendRes.message || 'OTP sent'));
                  handleNavigate('OTP');
                }
              } catch (err: any) {
                Alert.alert('Login Error', err.message);
              }
            }}
          />
        );
      case 'OTP':
        return (
          <OtpScreen
            phone={userState.phoneNumber}
            onBack={handleGoBack}
            onResendOtp={async () => {
              try {
                const res = await authService.sendOtp(userState.phoneNumber);
                dispatch(setFeedbackMessage(res.message || 'OTP resent successfully'));
                Alert.alert('OTP Sent', `A new OTP has been sent to +91 ${userState.phoneNumber} (Demo: 123456)`);
              } catch (err: any) {
                Alert.alert('Resend Failed', err.message);
              }
            }}
            onVerifySuccess={async (enteredOtp) => {
              try {
                const res = await authService.verifyOtp(userState.phoneNumber, enteredOtp);
                if (!res.success) {
                  Alert.alert('Verification Failed', res.message || 'Invalid OTP code. Please enter 123456.');
                  return;
                }
                if (res.isNewUser) {
                  dispatch(setFeedbackMessage('Mobile verified! Please set up your profile.'));
                  handleNavigate('COMPLETE_PROFILE');
                } else if (res.user) {
                  if (res.user.status === 'blocked') {
                    Alert.alert('Account Suspended', 'Your account has been blocked by administrator.');
                    return;
                  }
                  dispatch(loginSuccess(res.user));
                  dispatch(setFeedbackMessage(`Welcome back, ${res.user.name}!`));
                  dispatch(resetToScreen({ screen: 'HOME' }));
                } else {
                  handleNavigate('COMPLETE_PROFILE');
                }
              } catch (err: any) {
                Alert.alert('Verification Error', err.message || 'Could not verify OTP.');
              }
            }}
          />
        );
      case 'COMPLETE_PROFILE': {
        const isEditing = Boolean(userState.isLoggedIn && userState.currentUser?.id);
        const activePhone =
          userState.currentUser?.phone || userState.phoneNumber || '9876543210';
        return (
          <CompleteProfileScreen
            phone={activePhone}
            initialName={userState.currentUser?.name || ''}
            initialEmail={userState.currentUser?.email || ''}
            initialAvatar={userState.currentUser?.avatar}
            isEditing={isEditing}
            onBack={handleGoBack}
            onContinue={async (profile) => {
              try {
                const res = await authService.completeProfile({
                  phone: activePhone,
                  name: profile.name,
                  email: profile.email,
                  avatar: profile.avatar,
                });
                if (res.success && res.user) {
                  dispatch(loginSuccess(res.user));
                  dispatch(
                    setFeedbackMessage(
                      isEditing
                        ? 'Profile updated successfully!'
                        : `Account created successfully! Welcome, ${res.user.name}!`
                    )
                  );
                  if (isEditing) {
                    handleGoBack();
                  } else {
                    dispatch(resetToScreen({ screen: 'HOME' }));
                  }
                } else {
                  Alert.alert(
                    isEditing ? 'Update Failed' : 'Registration Failed',
                    res.message || 'Unable to save profile'
                  );
                }
              } catch (err: any) {
                Alert.alert('Error', err.message || 'Could not save profile.');
              }
            }}
          />
        );
      }

      // 2. Location Setup
      case 'LOCATION_PERMISSION':
        return (
          <LocationPermissionScreen
            onAllowLocation={() => {
              dispatch(setSelectedCity('Jaipur, Rajasthan'));
              handleNavigate('HOME');
            }}
            onSelectManually={() => handleNavigate('SELECT_CITY')}
          />
        );
      case 'SELECT_CITY':
        return (
          <SelectCityScreen
            selectedCity={userState.selectedCity}
            onBack={handleGoBack}
            onSelectCity={(city) => {
              dispatch(setSelectedCity(city));
              handleNavigate('HOME');
            }}
          />
        );

      // 3. Home & Navigations
      case 'HOME':
        return (
          <HomeScreen
            selectedCity={userState.selectedCity}
            cars={carsState.cars}
            unreadNotificationsCount={unreadNotificationsCount}
            onOpenDrawer={() => dispatch(openDrawer())}
            onSelectCity={() => handleNavigate('SELECT_CITY')}
            onOpenNotifications={() => handleNavigate('NOTIFICATIONS')}
            onOpenSearch={() => handleNavigate('SEARCH')}
            onNavigate={handleNavigate}
            onSelectCar={handleSelectCarDetails}
            onToggleFavorite={handleToggleFavorite}
            onSelectBrand={(brand) => {
              dispatch(setSelectedBrand(brand || null));
              if (brand) {
                handleNavigate('SEARCH_RESULTS');
              }
            }}
            selectedBrand={carsState.selectedBrand}
          />
        );
      case 'DRAWER_MENU':
        return (
          <MenuDrawerScreen
            user={userState.currentUser}
            onBack={handleGoBack}
            onNavigate={handleNavigate}
            onLogout={() => {
              dispatch(logout());
              dispatch(resetToScreen({ screen: 'LOGIN' }));
            }}
          />
        );

      // 4. Search & Filter
      case 'SEARCH':
        return (
          <SearchScreen
            cars={carsState.cars}
            onBack={handleGoBack}
            onOpenFilter={() => handleNavigate('FILTER')}
            onSelectCar={handleSelectCarDetails}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'FILTER':
        return (
          <FilterScreen
            currentFilters={carsState.filters}
            onBack={handleGoBack}
            onApply={(filters) => {
              dispatch(setFilters(filters));
              handleNavigate('SEARCH_RESULTS');
            }}
          />
        );
      case 'SEARCH_RESULTS':
        return (
          <SearchResultsScreen
            cars={carsState.cars}
            onBack={handleGoBack}
            onOpenFilter={() => handleNavigate('FILTER')}
            onSelectCar={handleSelectCarDetails}
            onToggleFavorite={handleToggleFavorite}
          />
        );

      // 5. Car Details & Actions
      case 'CAR_DETAILS':
        return (
          <CarDetailsScreen
            car={carsState.activeCar || carsState.cars[0]}
            onBack={handleGoBack}
            onToggleFavorite={handleToggleFavorite}
            onViewGallery={() => handleNavigate('IMAGE_GALLERY')}
            onViewSellerProfile={() => handleNavigate('SELLER_PROFILE')}
            onStartChat={handleStartChatWithCar}
          />
        );
      case 'IMAGE_GALLERY':
        return (
          <ImageGalleryScreen
            images={carsState.activeCar?.images}
            onBack={handleGoBack}
          />
        );
      case 'SELLER_PROFILE':
        return (
          <SellerProfileScreen
            sellerName={carsState.activeCar?.sellerName || 'Rakesh Sharma'}
            sellerAvatar={carsState.activeCar?.sellerAvatar}
            sellerRating={carsState.activeCar?.sellerRating}
            sellerJoined={carsState.activeCar?.sellerJoined}
            listingsCount={carsState.activeCar?.sellerListingsCount || 12}
            sellerCars={carsState.cars}
            onBack={handleGoBack}
            onSelectCar={handleSelectCarDetails}
            onToggleFavorite={handleToggleFavorite}
            onStartChat={handleStartChatWithCar}
          />
        );

      // 6. Sell Car Flow
      case 'SELL_START':
        return (
          <SellStartScreen
            onBack={handleGoBack}
            onStartSelling={() => handleNavigate('SELL_ADD_PHOTOS')}
          />
        );
      case 'SELL_ADD_PHOTOS':
        return (
          <SellAddPhotosScreen
            initialPhotos={carsState.sellDraft.photos}
            onBack={handleGoBack}
            onNext={(photos) => {
              dispatch(updateSellDraft({ photos }));
              handleNavigate('SELL_CAR_INFO');
            }}
          />
        );
      case 'SELL_CAR_INFO':
        return (
          <SellCarInfoScreen
            initialData={carsState.sellDraft}
            onBack={handleGoBack}
            onNext={(info) => {
              dispatch(updateSellDraft(info));
              handleNavigate('SELL_MORE_DETAILS');
            }}
          />
        );
      case 'SELL_MORE_DETAILS':
        return (
          <SellMoreDetailsScreen
            initialData={carsState.sellDraft}
            onBack={handleGoBack}
            onPreview={(details) => {
              dispatch(updateSellDraft(details));
              handleNavigate('SELL_PREVIEW');
            }}
          />
        );
      case 'SELL_PREVIEW':
        return (
          <SellPreviewScreen
            data={carsState.sellDraft}
            onBack={handleGoBack}
            onPostListing={async () => {
              await dispatch(
                createCarListing({
                  title: `${carsState.sellDraft.brand} ${carsState.sellDraft.model} ${carsState.sellDraft.year}`,
                  brand: carsState.sellDraft.brand,
                  model: carsState.sellDraft.model,
                  year: carsState.sellDraft.year,
                  price: carsState.sellDraft.price,
                  mileage: carsState.sellDraft.kmDriven,
                  fuelType: carsState.sellDraft.fuelType,
                  transmission: carsState.sellDraft.transmission,
                  location: carsState.sellDraft.city,
                  description: carsState.sellDraft.description,
                  images: carsState.sellDraft.photos,
                  ownership: '1st Owner',
                })
              );
              dispatch(setFeedbackMessage('Your vehicle listing is live on SellBuy! 🎉'));
              handleNavigate('MY_LISTINGS');
            }}
          />
        );

      // 7. My Listings & Management
      case 'MY_LISTINGS':
        return (
          <MyListingsScreen
            cars={carsState.cars}
            activeTab={carsState.myListingsTab}
            onTabChange={(tab) => dispatch(setMyListingsTab(tab))}
            onBack={handleGoBack}
            onEditListing={(car) => {
              dispatch(setActiveCar(car));
              handleNavigate('EDIT_LISTING');
            }}
            onDeleteListing={(id) => {
              dispatch(deleteCarListing(id));
              dispatch(setFeedbackMessage('Listing removed successfully.'));
            }}
            onAddNewListing={() => handleNavigate('SELL_START')}
          />
        );
      case 'EDIT_LISTING':
        return (
          <EditListingScreen
            car={carsState.activeCar || carsState.cars[0]}
            onBack={handleGoBack}
            onUpdate={(carId, updates) => {
              dispatch(updateCarListing({ id: carId, updates }));
              dispatch(setFeedbackMessage('Listing details updated successfully!'));
            }}
          />
        );

      // 8. User Features
      case 'SAVED_CARS':
        return (
          <SavedCarsScreen
            cars={carsState.cars}
            onBack={handleGoBack}
            onSelectCar={handleSelectCarDetails}
            onToggleFavorite={handleToggleFavorite}
            onExplore={() => handleNavigate('HOME')}
          />
        );
      case 'CHAT':
        return (
          <ChatScreen
            conversation={chatState.activeConversation}
            conversations={chatState.conversations}
            onBack={handleGoBack}
            onSendMessage={(text, images) => dispatch(sendMessage({ text, images }))}
            onSelectConversation={(id) => dispatch(selectConversation(id))}
            onViewCarDetails={() => handleNavigate('CAR_DETAILS')}
          />
        );
      case 'NOTIFICATIONS':
        return (
          <NotificationsScreen
            notifications={notificationState.items}
            activeFilter={notificationState.activeFilter}
            onFilterChange={(filter) => dispatch(setActiveFilter(filter))}
            onBack={handleGoBack}
            onNotificationPress={(item) => {
              dispatch(markAsRead(item.id));
              if (item.type === 'messages') handleNavigate('CHAT');
              else if (item.type === 'listings') handleNavigate('MY_LISTINGS');
            }}
            onMarkAllRead={() => dispatch(markAllAsRead())}
          />
        );

      // 9. Profile & Settings
      case 'PROFILE':
        return (
          <ProfileScreen
            user={userState.currentUser}
            onNavigate={handleNavigate}
            onLogout={() => {
              dispatch(logout());
              dispatch(resetToScreen({ screen: 'LOGIN' }));
            }}
            onEditProfile={() => handleNavigate('COMPLETE_PROFILE')}
          />
        );

      default:
        return (
          <HomeScreen
            selectedCity={userState.selectedCity}
            cars={carsState.cars}
            unreadNotificationsCount={unreadNotificationsCount}
            onOpenDrawer={() => dispatch(openDrawer())}
            onSelectCity={() => handleNavigate('SELECT_CITY')}
            onOpenNotifications={() => handleNavigate('NOTIFICATIONS')}
            onOpenSearch={() => handleNavigate('SEARCH')}
            onNavigate={handleNavigate}
            onSelectCar={handleSelectCarDetails}
            onToggleFavorite={handleToggleFavorite}
            onSelectBrand={(brand) => dispatch(setSelectedBrand(brand))}
            selectedBrand={carsState.selectedBrand}
          />
        );
    }
  };

  const isDarkScreen =
    ui.currentScreen === 'SPLASH' ||
    ui.currentScreen === 'DRAWER_MENU' ||
    ui.currentScreen === 'CAR_DETAILS' ||
    ui.currentScreen === 'IMAGE_GALLERY';

  return (
    <SafeAreaView
      style={[
        styles.rootContainer,
        { backgroundColor: isDarkScreen ? '#090D16' : colors.surface },
      ]}
      edges={['top', 'left', 'right']}>
      {/* Adaptive Status Bar for Android & iOS */}
      <AppStatusBar currentScreen={ui.currentScreen} />

      {/* Toast Feedback Banner */}
      {ui.feedbackMessage && (
        <TouchableOpacity
          style={styles.feedbackBanner}
          onPress={() => dispatch(clearFeedbackMessage())}
          activeOpacity={0.9}>
          <Text style={styles.feedbackText}>✨ {ui.feedbackMessage}</Text>
          <Text style={styles.feedbackClose}>✕</Text>
        </TouchableOpacity>
      )}

      {/* Screen Render Container */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Bottom Navigation on Main Tabs */}
      {showBottomNav && (
        <BottomNav currentScreen={ui.currentScreen} onNavigate={handleNavigate} />
      )}

      {/* Drawer Menu Modal (Screen 9) */}
      <DrawerMenuModal
        visible={ui.isDrawerOpen}
        onClose={() => dispatch(closeDrawer())}
        user={userState.currentUser}
        onNavigate={handleNavigate}
        onLogout={() => {
          dispatch(logout());
          dispatch(resetToScreen({ screen: 'LOGIN' }));
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  feedbackBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  feedbackClose: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
  },
});
