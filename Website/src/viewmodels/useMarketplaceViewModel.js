import { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApiService } from '../models/ApiService';

// Car Actions
import {
  fetchCarsRequest,
  setFilter,
  resetFilters as resetCarsFilters,
  setCarsPage,
  toggleFavoriteRequest,
  setSavedCarIds,
  setSelectedCar,
  setGalleryCar,
  setEditListingCar,
  setMyListingsTab
} from '../store/slices/carsSlice';

// Meta Actions
import { fetchMetaRequest } from '../store/slices/metaSlice';

// Chat Actions
import {
  setConversations,
  setActiveConversation,
  setNotifications,
  setChatOpen,
  sendMessageRequest
} from '../store/slices/chatSlice';

// Auth Actions
import {
  setAuthStep,
  setAuthPhone,
  setCurrentUser,
  logout as logoutAction
} from '../store/slices/authSlice';

// UI Actions
import {
  setAuthModalOpen,
  setCityModalOpen,
  setFilterModalOpen,
  setSellWizardOpen,
  setSellStep,
  setMyListingsOpen,
  setSavedCarsOpen,
  setNotificationsOpen,
  setProfileOpen,
  setDrawerOpen,
  setSellerModalData,
  setToastMessage,
  setViewMode
} from '../store/slices/uiSlice';

/**
 * MVVM ViewModel for Website Marketplace
 * Coordinates between Redux Toolkit store, Redux-Saga side effects, and presentation Views
 */
export function useMarketplaceViewModel() {
  const dispatch = useDispatch();

  // Redux Selectors
  const {
    items: cars,
    loading,
    filters,
    pagination,
    savedCarIds,
    selectedCar,
    galleryCar,
    editListingCar,
    myListingsTab
  } = useSelector((state) => state.cars);

  const { brands, cities } = useSelector((state) => state.meta);
  const { conversations, activeConversation, notifications, isOpen: isChatOpen } = useSelector((state) => state.chat);
  const { currentUser, authStep, authPhone } = useSelector((state) => state.auth);
  const {
    isAuthModalOpen,
    isCityModalOpen,
    isFilterModalOpen,
    isSellWizardOpen,
    sellStep,
    isMyListingsOpen,
    isSavedCarsOpen,
    isNotificationsOpen,
    isProfileOpen,
    isDrawerOpen,
    sellerModalData,
    toastMessage,
    viewMode
  } = useSelector((state) => state.ui);

  // Toast feedback
  const showToast = useCallback((msg) => {
    dispatch(setToastMessage(msg));
    setTimeout(() => dispatch(setToastMessage(null)), 3500);
  }, [dispatch]);

  // Load cars via Saga
  const loadCars = useCallback(() => {
    dispatch(fetchCarsRequest());
  }, [dispatch]);

  // Initial load
  useEffect(() => {
    dispatch(fetchMetaRequest());
    dispatch(fetchCarsRequest());
  }, [dispatch]);

  // Reload cars on query / filter changes
  useEffect(() => {
    dispatch(fetchCarsRequest());
  }, [dispatch, filters.selectedBrand, filters.selectedCity, filters.activeTab, filters.sortBy]);

  // Real-time account status guard: auto-logout and open login modal if user is blocked by Admin
  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    let isMounted = true;
    let isChecking = false;

    const checkUserStatus = async () => {
      if (isChecking) return;
      isChecking = true;
      try {
        const res = await ApiService.checkUserStatus(currentUser.id);
        if (isMounted && res && res.isBlocked) {
          ApiService.logout();
          dispatch(logoutAction());
          dispatch(setProfileOpen(false));
          dispatch(setDrawerOpen(false));
          dispatch(setSellWizardOpen(false));
          dispatch(setAuthStep('login'));
          dispatch(setAuthModalOpen(true));
          showToast('⚠️ Your account has been suspended by administrator.');
        }
      } catch {
        // network or silent error
      } finally {
        isChecking = false;
      }
    };

    checkUserStatus();
    const interval = setInterval(checkUserStatus, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser, dispatch, showToast]);

  // Saved cars list
  const savedCars = useMemo(() => {
    return cars.filter((c) => savedCarIds.includes(String(c.id)));
  }, [cars, savedCarIds]);

  // User's own listings
  const userListings = useMemo(() => {
    if (!currentUser) return [];
    return cars.filter((c) => c.seller_name === currentUser.name || c.sellerName === currentUser.name);
  }, [cars, currentUser]);

  // Unread badge counts
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const unreadChatsCount = useMemo(() => {
    return conversations.length;
  }, [conversations]);

  // Filter setters
  const setKeyword = useCallback((val) => dispatch(setFilter({ keyword: val })), [dispatch]);
  const setSelectedBrand = useCallback((val) => dispatch(setFilter({ selectedBrand: val })), [dispatch]);
  const setSelectedCity = useCallback((val) => dispatch(setFilter({ selectedCity: val })), [dispatch]);
  const setMaxBudget = useCallback((val) => dispatch(setFilter({ maxBudget: val })), [dispatch]);
  const setMinPrice = useCallback((val) => dispatch(setFilter({ minPrice: val })), [dispatch]);
  const setSelectedFuel = useCallback((val) => dispatch(setFilter({ selectedFuel: val })), [dispatch]);
  const setSelectedTransmission = useCallback((val) => dispatch(setFilter({ selectedTransmission: val })), [dispatch]);
  const setYearFrom = useCallback((val) => dispatch(setFilter({ yearFrom: val })), [dispatch]);
  const setYearTo = useCallback((val) => dispatch(setFilter({ yearTo: val })), [dispatch]);
  const setActiveTab = useCallback((val) => dispatch(setFilter({ activeTab: val })), [dispatch]);
  const setSortBy = useCallback((val) => dispatch(setFilter({ sortBy: val })), [dispatch]);

  // Toggle Favorite
  const toggleFavorite = useCallback((carId, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const isSaved = savedCarIds.includes(String(carId));
    dispatch(toggleFavoriteRequest(carId));
    showToast(!isSaved ? 'Vehicle added to Saved Cars ♥' : 'Removed from Saved Cars');
  }, [dispatch, savedCarIds, showToast]);

  // Car Details Modal Actions
  const openCarDetails = useCallback(async (carId) => {
    try {
      const res = await ApiService.getCarDetails(carId);
      if (res.success) {
        dispatch(setSelectedCar(res.car));
        return;
      }
    } catch {}
    const fallback = cars.find((c) => String(c.id) === String(carId));
    if (fallback) dispatch(setSelectedCar(fallback));
  }, [cars, dispatch]);

  const closeCarDetails = useCallback(() => {
    dispatch(setSelectedCar(null));
  }, [dispatch]);

  // Image Gallery Action
  const openGallery = useCallback((car) => {
    dispatch(setGalleryCar(car));
  }, [dispatch]);

  const closeGallery = useCallback(() => {
    dispatch(setGalleryCar(null));
  }, [dispatch]);

  // Seller Profile Action
  const openSellerProfile = useCallback((car) => {
    const sellerCars = cars.filter((c) => c.seller_name === (car.seller_name || car.sellerName));
    dispatch(setSellerModalData({
      name: car.seller_name || car.sellerName || 'Rakesh Sharma',
      avatar: car.seller_avatar || car.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: car.seller_rating || car.sellerRating || 4.8,
      joined: car.seller_joined || car.sellerJoined || 'Member since 2022',
      phone: car.seller_phone || car.sellerPhone || '+91 98765-43210',
      verified: car.seller_verified || true,
      cars: sellerCars.length ? sellerCars : [car]
    }));
  }, [cars, dispatch]);

  // Start chat with car seller
  const startChatWithCar = useCallback((car) => {
    dispatch(setSelectedCar(null));
    let conv = conversations.find((c) => String(c.carId) === String(car.id));
    if (!conv) {
      conv = {
        id: 'c_' + car.id,
        sellerId: car.seller_phone || 's1',
        sellerName: car.seller_name || car.sellerName || 'Verified Seller',
        sellerAvatar: car.seller_avatar || car.sellerAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        sellerPhone: car.seller_phone || car.sellerPhone || '+91 98765-43210',
        carId: String(car.id),
        carTitle: car.title,
        carPrice: car.formattedPrice || ('₹ ' + Number(car.price).toLocaleString('en-IN')),
        carImage: car.primary_image || car.imageUrl || (car.images && car.images[0]),
        isOnline: true,
        lastMessage: 'Hi, is this vehicle available?',
        lastMessageTime: 'Just now',
        messages: [
          {
            id: 'm_init',
            senderId: 'buyer',
            senderName: 'You',
            text: `Hi ${car.seller_name || 'Seller'}, is this ${car.title} still available for inspection?`,
            time: 'Just now',
            isMe: true
          }
        ]
      };
      dispatch(setConversations([conv, ...conversations]));
    }
    dispatch(setActiveConversation(conv));
    dispatch(setChatOpen(true));
  }, [conversations, dispatch]);

  // Send message in Chat
  const sendMessage = useCallback((text) => {
    if (!text.trim() || !activeConversation) return;
    dispatch(sendMessageRequest({ conversationId: activeConversation.id, text: text.trim() }));
  }, [activeConversation, dispatch]);

  // Sell Car Wizard Action
  const startSellWizard = useCallback(() => {
    if (!currentUser) {
      dispatch(setAuthStep('login'));
      dispatch(setAuthModalOpen(true));
      showToast('Please sign in to list your car');
      return;
    }
    dispatch(setSellStep(1));
    dispatch(setSellWizardOpen(true));
  }, [currentUser, dispatch, showToast]);

  const submitSellCar = useCallback(async (sellData) => {
    const carPayload = {
      ...sellData,
      sellerName: currentUser?.name || 'Rakesh Sharma',
      sellerPhone: currentUser?.phone || '+91 98765-43210',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    const res = await ApiService.createListing(carPayload);
    dispatch(setSellWizardOpen(false));
    showToast('Your vehicle listing is live on SellBuy! 🎉');
    dispatch(fetchCarsRequest());
    return res;
  }, [currentUser, dispatch, showToast]);

  // Edit / Delete Listings Action
  const updateListing = useCallback(async (carId, updates) => {
    await ApiService.updateListing(carId, updates);
    dispatch(setEditListingCar(null));
    showToast('Listing updated successfully!');
    dispatch(fetchCarsRequest());
  }, [dispatch, showToast]);

  const deleteListing = useCallback(async (carId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await ApiService.deleteListing(carId);
      showToast('Listing removed successfully.');
      dispatch(fetchCarsRequest());
    }
  }, [dispatch, showToast]);

  // Notifications Actions
  const markNotificationRead = useCallback((id) => {
    ApiService.markNotificationRead(id);
    dispatch(setNotifications(ApiService.getNotifications()));
  }, [dispatch]);

  const markAllNotificationsRead = useCallback(() => {
    ApiService.markAllNotificationsRead();
    dispatch(setNotifications(ApiService.getNotifications()));
    showToast('All notifications marked as read');
  }, [dispatch, showToast]);

  // Auth Actions
  const requestOtp = useCallback(async (phone) => {
    dispatch(setAuthPhone(phone));
    const res = await ApiService.sendOtp(phone);
    dispatch(setAuthStep('otp'));
    showToast(res.message || `OTP sent to +91 ${phone} (Demo: 123456)`);
    return res;
  }, [dispatch, showToast]);

  const verifyOtp = useCallback(async (otp) => {
    const res = await ApiService.verifyOtp(authPhone, otp);
    if (res.success) {
      if (res.user) {
        dispatch(setCurrentUser(res.user));
      }
      if (res.isNewUser) {
        dispatch(setAuthStep('profile'));
        showToast('Mobile verified! Please complete your profile.');
      } else {
        dispatch(setAuthModalOpen(false));
        showToast(`Welcome back, ${res.user ? res.user.name : 'User'}!`);
      }
      return true;
    } else {
      showToast(res.message || 'Invalid OTP code');
      return false;
    }
  }, [authPhone, dispatch, showToast]);

  const saveProfile = useCallback(async (profileData) => {
    const res = await ApiService.completeProfile(profileData);
    if (res.success) {
      if (res.user) {
        dispatch(setCurrentUser(res.user));
      }
      dispatch(setAuthModalOpen(false));
      dispatch(setProfileOpen(false));
      showToast('Profile registered successfully!');
    } else {
      showToast(res.message || 'Could not save profile');
    }
  }, [dispatch, showToast]);

  const logout = useCallback(() => {
    ApiService.logout();
    dispatch(logoutAction());
    dispatch(setProfileOpen(false));
    dispatch(setDrawerOpen(false));
    showToast('Signed out successfully.');
  }, [dispatch, showToast]);

  // City selection
  const selectCity = useCallback((cityName) => {
    dispatch(setFilter({ selectedCity: cityName }));
    dispatch(setCityModalOpen(false));
    showToast(`Location set to: ${cityName}`);
  }, [dispatch, showToast]);

  // Apply Advanced Filters
  const applyAdvancedFilters = useCallback((newFilters) => {
    const patch = {};
    if (newFilters.brand !== undefined) patch.selectedBrand = newFilters.brand;
    if (newFilters.minPrice !== undefined) patch.minPrice = newFilters.minPrice;
    if (newFilters.maxPrice !== undefined) patch.maxBudget = newFilters.maxPrice;
    if (newFilters.fuel !== undefined) patch.selectedFuel = newFilters.fuel;
    if (newFilters.transmission !== undefined) patch.selectedTransmission = newFilters.transmission;
    if (newFilters.yearFrom !== undefined) patch.yearFrom = newFilters.yearFrom;
    if (newFilters.yearTo !== undefined) patch.yearTo = newFilters.yearTo;
    dispatch(setFilter(patch));
    dispatch(setFilterModalOpen(false));
    dispatch(fetchCarsRequest());
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(resetCarsFilters());
    dispatch(setFilterModalOpen(false));
    dispatch(fetchCarsRequest());
    showToast('All filters cleared');
  }, [dispatch, showToast]);

  return {
    // Data
    cars,
    brands,
    cities,
    loading,
    savedCars,
    savedCarIds,
    userListings,

    // Filters & Search
    keyword: filters.keyword,
    setKeyword,
    selectedBrand: filters.selectedBrand,
    setSelectedBrand,
    selectedCity: filters.selectedCity,
    maxBudget: filters.maxBudget,
    setMaxBudget,
    minPrice: filters.minPrice,
    setMinPrice,
    selectedFuel: filters.selectedFuel,
    setSelectedFuel,
    selectedTransmission: filters.selectedTransmission,
    setSelectedTransmission,
    yearFrom: filters.yearFrom,
    yearTo: filters.yearTo,
    activeTab: filters.activeTab,
    setActiveTab,
    sortBy: filters.sortBy,
    setSortBy,
    loadCars,
    applyAdvancedFilters,
    resetFilters,
    pagination,
    setPage: (p) => dispatch(setCarsPage(p)),

    // User & Auth
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen: (val) => dispatch(setAuthModalOpen(val)),
    authStep,
    setAuthStep: (val) => dispatch(setAuthStep(val)),
    authPhone,
    requestOtp,
    verifyOtp,
    saveProfile,
    logout,

    // Location / City
    isCityModalOpen,
    setIsCityModalOpen: (val) => dispatch(setCityModalOpen(val)),
    selectCity,

    // Filter Modal
    isFilterModalOpen,
    setIsFilterModalOpen: (val) => dispatch(setFilterModalOpen(val)),

    // Car Details & Modals
    selectedCar,
    openCarDetails,
    closeCarDetails,
    galleryCar,
    openGallery,
    closeGallery,
    sellerModalData,
    setSellerModalData: (val) => dispatch(setSellerModalData(val)),
    openSellerProfile,

    // Sell Car Flow
    isSellWizardOpen,
    setIsSellWizardOpen: (val) => dispatch(setSellWizardOpen(val)),
    sellStep,
    setSellStep: (val) => dispatch(setSellStep(val)),
    startSellWizard,
    submitSellCar,

    // My Listings
    isMyListingsOpen,
    setIsMyListingsOpen: (val) => dispatch(setMyListingsOpen(val)),
    myListingsTab,
    setMyListingsTab: (val) => dispatch(setMyListingsTab(val)),
    editListingCar,
    setEditListingCar: (val) => dispatch(setEditListingCar(val)),
    updateListing,
    deleteListing,

    // Saved Cars
    isSavedCarsOpen,
    setIsSavedCarsOpen: (val) => dispatch(setSavedCarsOpen(val)),
    toggleFavorite,

    // Chats
    conversations,
    activeConversation,
    setActiveConversation: (val) => dispatch(setActiveConversation(val)),
    isChatOpen,
    setIsChatOpen: (val) => dispatch(setChatOpen(val)),
    startChatWithCar,
    sendMessage,
    unreadChatsCount,

    // Notifications
    notifications,
    isNotificationsOpen,
    setIsNotificationsOpen: (val) => dispatch(setNotificationsOpen(val)),
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,

    // Profile & Menu Drawer
    isProfileOpen,
    setIsProfileOpen: (val) => dispatch(setProfileOpen(val)),
    isDrawerOpen,
    setIsDrawerOpen: (val) => dispatch(setDrawerOpen(val)),

    // Mode View (Desktop vs Android Mobile view)
    viewMode,
    setViewMode: (val) => dispatch(setViewMode(val)),

    // Toast
    toastMessage,
    showToast
  };
}
