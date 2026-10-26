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
  setSavedCars,
  setUserListings,
  setUserListingsCounts,
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
  setSocketConnected,
  setTypingStatus,
  appendSocketMessage,
  markMessagesAsReadLocally,
  sendMessageRequest
} from '../store/slices/chatSlice';
import { socketService } from '../services/socketService';

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
    savedCars,
    userListings,
    userListingsCounts,
    selectedCar,
    galleryCar,
    editListingCar,
    myListingsTab
  } = useSelector((state) => state.cars);

  const { brands, cities } = useSelector((state) => state.meta);
  const {
    conversations,
    activeConversation,
    notifications,
    isOpen: isChatOpen,
    isSocketConnected,
    typingStatus
  } = useSelector((state) => state.chat);
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

  // Dynamic user data loader: fetches user's real database records when logged in
  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      dispatch(setUserListings([]));
      dispatch(setUserListingsCounts({ active: 0, pending: 0, sold: 0 }));
      dispatch(setSavedCars([]));
      dispatch(setConversations([]));
      dispatch(setNotifications([]));
      return;
    }

    // Connect user to real-time chat socket
    socketService.connect(currentUser.id, currentUser.name || 'User');

    let isMounted = true;
    const loadUserData = async () => {
      try {
        const [listingsRes, savedRes, chatsRes, notifsRes] = await Promise.all([
          ApiService.getUserListings(currentUser.id, myListingsTab),
          ApiService.getSavedCars(currentUser.id),
          ApiService.getConversations(currentUser.id),
          ApiService.getNotifications(currentUser.id)
        ]);

        if (isMounted) {
          if (listingsRes && listingsRes.listings) {
            dispatch(setUserListings(listingsRes.listings));
            dispatch(setUserListingsCounts(listingsRes.counts));
          }
          if (savedRes && savedRes.savedCars) {
            dispatch(setSavedCars(savedRes.savedCars));
            dispatch(setSavedCarIds(savedRes.savedCarIds));
          }
          if (Array.isArray(chatsRes)) {
            dispatch(setConversations(chatsRes));
          }
          if (Array.isArray(notifsRes)) {
            dispatch(setNotifications(notifsRes));
          }
        }
      } catch (err) {
        console.error('Error loading dynamic user data:', err);
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [currentUser, myListingsTab, dispatch]);

  // Real-Time WebSocket Global Event Listeners
  useEffect(() => {
    const unsubMsg = socketService.on('new_message', (data) => {
      dispatch(appendSocketMessage({
        chatId: data.chatId,
        message: data.message,
        currentUserId: currentUser?.id
      }));
    });

    const unsubTyping = socketService.on('typing', (data) => {
      dispatch(setTypingStatus(data));
    });

    const unsubStatus = socketService.on('connection_status', (data) => {
      dispatch(setSocketConnected(data.connected));
    });

    const unsubUpdate = socketService.on('chat_updated', async () => {
      if (currentUser?.id) {
        try {
          const convs = await ApiService.getConversations(currentUser.id);
          if (Array.isArray(convs)) {
            dispatch(setConversations(convs));
          }
        } catch (e) {}
      }
    });

    return () => {
      unsubMsg();
      unsubTyping();
      unsubStatus();
      unsubUpdate();
    };
  }, [currentUser, dispatch]);

  // Real-Time Chat Room Subscription for Active Conversation
  useEffect(() => {
    if (activeConversation && activeConversation.id) {
      socketService.joinChat(activeConversation.id);
      socketService.markRead(activeConversation.id);
      dispatch(markMessagesAsReadLocally(activeConversation.id));

      return () => {
        socketService.leaveChat(activeConversation.id);
      };
    }
  }, [activeConversation?.id, dispatch]);

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

  // Unread badge counts
  const unreadNotificationsCount = useMemo(() => {
    return Array.isArray(notifications) ? notifications.filter((n) => !n.read).length : 0;
  }, [notifications]);

  const unreadChatsCount = useMemo(() => {
    return Array.isArray(conversations) ? conversations.length : 0;
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
    if (!currentUser) {
      dispatch(setAuthStep('login'));
      dispatch(setAuthModalOpen(true));
      showToast('Please sign in to save vehicles to your wishlist');
      return;
    }
    const isSaved = savedCarIds.includes(String(carId));
    dispatch(toggleFavoriteRequest({ carId, userId: currentUser.id }));
    showToast(!isSaved ? 'Vehicle added to Saved Cars ♥' : 'Removed from Saved Cars');
  }, [currentUser, dispatch, savedCarIds, showToast]);

  // Car Details Modal Actions
  const openCarDetails = useCallback(async (carId) => {
    try {
      const res = await ApiService.getCarDetails(carId, currentUser?.id);
      if (res.success) {
        dispatch(setSelectedCar(res.car));
        return;
      }
    } catch {}
    const fallback = cars.find((c) => String(c.id) === String(carId));
    if (fallback) dispatch(setSelectedCar(fallback));
  }, [cars, currentUser, dispatch]);

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
  const startChatWithCar = useCallback(async (car) => {
    dispatch(setSelectedCar(null));
    if (!currentUser) {
      dispatch(setAuthStep('login'));
      dispatch(setAuthModalOpen(true));
      showToast('Please sign in to chat with the seller');
      return;
    }

    const sellerId = car.user_id || car.userId || car.seller_id || car.sellerId || 1;
    if (String(sellerId) === String(currentUser.id)) {
      showToast('This is your own listing.');
      return;
    }

    const res = await ApiService.startChat(
      currentUser.id,
      sellerId,
      car.id,
      `Hi ${car.seller_name || car.sellerName || 'Seller'}, is this ${car.title} still available for inspection?`
    );

    if (res && res.success && res.conversation) {
      const allConvs = await ApiService.getConversations(currentUser.id);
      dispatch(setConversations(allConvs));
      dispatch(setActiveConversation(res.conversation));
      dispatch(setChatOpen(true));
    } else {
      showToast(res?.message || 'Could not initiate chat with seller');
    }
  }, [currentUser, dispatch, showToast]);

  // Send message in Chat (Instant Real-time Socket + Saga database synchronization)
  const sendMessage = useCallback((text, attachmentUrl = null) => {
    if (!text?.trim() && !attachmentUrl) return;
    if (!activeConversation) return;

    const cleanText = text ? text.trim() : '';

    // 1. Send instantly over live WebSocket if connected
    socketService.sendMessage(activeConversation.id, cleanText, attachmentUrl);

    // 2. Also dispatch Redux Saga request for server-side persistence & offline safety
    dispatch(sendMessageRequest({
      conversationId: activeConversation.id,
      text: cleanText,
      attachmentUrl
    }));

    // Stop typing indicator
    socketService.sendTyping(activeConversation.id, false);
  }, [activeConversation, dispatch]);

  // Emit typing indicator over socket
  const sendTyping = useCallback((isTyping) => {
    if (!activeConversation) return;
    socketService.sendTyping(activeConversation.id, isTyping);
  }, [activeConversation]);

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
      userId: currentUser?.id,
      sellerName: currentUser?.name || 'Verified Seller',
      sellerPhone: currentUser?.phone || '',
      sellerAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };
    const res = await ApiService.createListing(carPayload);
    dispatch(setSellWizardOpen(false));
    showToast('Your vehicle listing is live on SellBuy! 🎉');
    dispatch(fetchCarsRequest());
    if (currentUser?.id) {
      const listRes = await ApiService.getUserListings(currentUser.id, myListingsTab);
      if (listRes && listRes.listings) {
        dispatch(setUserListings(listRes.listings));
        dispatch(setUserListingsCounts(listRes.counts));
      }
    }
    return res;
  }, [currentUser, myListingsTab, dispatch, showToast]);

  // Edit / Delete Listings Action
  const updateListing = useCallback(async (carId, updates) => {
    await ApiService.updateListing(carId, updates);
    dispatch(setEditListingCar(null));
    showToast('Listing updated successfully!');
    dispatch(fetchCarsRequest());
    if (currentUser?.id) {
      const listRes = await ApiService.getUserListings(currentUser.id, myListingsTab);
      if (listRes && listRes.listings) {
        dispatch(setUserListings(listRes.listings));
        dispatch(setUserListingsCounts(listRes.counts));
      }
    }
  }, [currentUser, myListingsTab, dispatch, showToast]);

  const deleteListing = useCallback(async (carId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await ApiService.deleteListing(carId);
      showToast('Listing removed successfully.');
      dispatch(fetchCarsRequest());
      if (currentUser?.id) {
        const listRes = await ApiService.getUserListings(currentUser.id, myListingsTab);
        if (listRes && listRes.listings) {
          dispatch(setUserListings(listRes.listings));
          dispatch(setUserListingsCounts(listRes.counts));
        }
      }
    }
  }, [currentUser, myListingsTab, dispatch, showToast]);

  // Notifications Actions
  const markNotificationRead = useCallback(async (id) => {
    await ApiService.markNotificationRead(id);
    if (currentUser?.id) {
      const notifs = await ApiService.getNotifications(currentUser.id);
      dispatch(setNotifications(notifs));
    }
  }, [currentUser, dispatch]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!currentUser?.id) return;
    await ApiService.markAllNotificationsRead(currentUser.id);
    const notifs = await ApiService.getNotifications(currentUser.id);
    dispatch(setNotifications(notifs));
    showToast('All notifications marked as read');
  }, [currentUser, dispatch, showToast]);

  // Auth Actions
  const requestOtp = useCallback(async (phone) => {
    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    dispatch(setAuthPhone(cleanPhone));
    const res = await ApiService.sendOtp(cleanPhone);
    if (res && res.success !== false) {
      dispatch(setAuthStep('otp'));
      showToast(res.message || `OTP sent to +91 ${cleanPhone} (Demo: 123456)`);
    } else {
      showToast(res?.message || 'Failed to send OTP. Please check mobile number.');
    }
    return res;
  }, [dispatch, showToast]);

  const verifyOtp = useCallback(async (otp, phoneParam) => {
    const phoneToUse = phoneParam || authPhone;
    const res = await ApiService.verifyOtp(phoneToUse, otp);
    if (res && res.success) {
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
      return res;
    } else {
      showToast(res?.message || 'Invalid OTP code. Please enter demo OTP 123456.');
      return res;
    }
  }, [authPhone, dispatch, showToast]);

  const socialLogin = useCallback(async (provider = 'google') => {
    const res = await ApiService.socialLogin(provider);
    if (res && res.success && res.user) {
      dispatch(setCurrentUser(res.user));
      dispatch(setAuthModalOpen(false));
      showToast(res.message || `Signed in with ${provider === 'apple' ? 'Apple' : 'Google'}!`);
      return res;
    } else {
      showToast(res?.message || 'Social sign-in failed');
      return res;
    }
  }, [dispatch, showToast]);

  const uploadAvatar = useCallback(async (file) => {
    return await ApiService.uploadImage(file);
  }, []);

  const saveProfile = useCallback(async (profileData) => {
    const payload = {
      id: currentUser?.id,
      phone: currentUser?.phone || authPhone,
      ...profileData
    };
    const res = await ApiService.completeProfile(payload);
    if (res && res.success) {
      if (res.user) {
        dispatch(setCurrentUser(res.user));
      }
      dispatch(setAuthModalOpen(false));
      dispatch(setProfileOpen(false));
      showToast(res.message || 'Profile saved successfully!');
      return res;
    } else {
      showToast(res?.message || 'Could not save profile');
      return res;
    }
  }, [currentUser, authPhone, dispatch, showToast]);

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
    userListingsCounts,

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
    socialLogin,
    uploadAvatar,
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
    sendTyping,
    isSocketConnected,
    typingStatus,
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
