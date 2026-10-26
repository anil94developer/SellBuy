import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AdminApiService } from '../models/AdminApiService';

import {
  setActiveTab as setActiveTabAction,
  toggleLang as toggleLangAction,
  setLogFilter as setLogFilterAction,
  setSearchListings as setSearchListingsAction,
  fetchStatsRequest,
  fetchListingsRequest,
  fetchUsersRequest,
  fetchCatalogRequest,
  fetchLogsRequest,
  approveListingRequest,
  rejectListingRequest,
  toggleFeaturedRequest,
  deleteListingRequest,
  addNewCarRequest,
  toggleUserBlockRequest,
  addBrandRequest,
  updateBrandRequest,
  toggleBrandStatusRequest,
  deleteBrandRequest,
  addCategoryRequest,
  updateCategoryRequest,
  toggleCategoryStatusRequest,
  deleteCategoryRequest,
  addCityRequest,
  updateCityRequest,
  toggleCityStatusRequest,
  deleteCityRequest,
  toggleDealerVerification as toggleDealerVerificationAction,
  addDealer as addDealerAction,
  updateBuyRequestStatus as updateBuyRequestStatusAction,
  updateSellRequestStatus as updateSellRequestStatusAction,
  updateOrderStatus as updateOrderStatusAction,
  updateEnquiryStatus as updateEnquiryStatusAction,
  updateTestDriveStatus as updateTestDriveStatusAction,
  toggleBannerActive as toggleBannerActiveAction,
  addBanner as addBannerAction,
  addBlogPost as addBlogPostAction,
  approveReview as approveReviewAction,
  flagReview as flagReviewAction,
  deleteReview as deleteReviewAction,
  addAdminUser as addAdminUserAction,
  togglePermission as togglePermissionAction,
  saveSettings as saveSettingsAction,
  resolveTicket as resolveTicketAction
} from '../store/slices/adminSlice';

const adminDict = {
  en: {
    dashboard: "Dashboard",
    listings: "All Cars / Inventory",
    users: "Users & Customers",
    dealers: "Dealers & Sellers",
    brands: "Categories & Brands",
    locations: "Locations / Cities",
    broadcast: "Push Broadcast",
    logs: "System Audit Logs",
    totalUsers: "Total Users",
    activeListings: "Active Listings",
    pendingApprovals: "Pending Approvals",
    catalogValue: "Total Catalog Value",
    approve: "Approve",
    reject: "Reject",
    refresh: "Refresh"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    listings: "कार लिस्टिंग्स व इन्वेंटरी",
    users: "उपयोगकर्ता व ग्राहक",
    dealers: "डीलर्स व विक्रेता",
    brands: "श्रेणियां व ब्रांड्स",
    locations: "स्थान / शहर",
    broadcast: "सूचना प्रसारण",
    logs: "सिस्टम व ऑडिट लॉग्स",
    totalUsers: "कुल उपयोगकर्ता",
    activeListings: "सक्रिय लिस्टिंग्स",
    pendingApprovals: "अनुमोदन की प्रतीक्षा",
    catalogValue: "कुल कैटलॉग मूल्य",
    approve: "मंजूरी दें",
    reject: "अस्वीकार करें",
    refresh: "ताज़ा करें"
  }
};

/**
 * MVVM ViewModel for Admin Dashboard
 * Coordinates between Redux Toolkit store, Redux-Saga side effects, and presentation Views
 */
export function useAdminViewModel() {
  const dispatch = useDispatch();

  const {
    activeTab,
    lang,
    stats,
    listings,
    users,
    usersPagination,
    usersFilters,
    dealers,
    brands,
    categories,
    cities,
    logs,
    logFilter,
    searchListings,
    buyRequests,
    sellRequests,
    orders,
    wishlistEnquiries,
    testDrives,
    websitePages,
    banners,
    blogPosts,
    reviews,
    adminUsers,
    permissions,
    reports,
    transactions,
    settings,
    supportTickets
  } = useSelector((state) => state.admin);

  const t = useCallback((key) => adminDict[lang]?.[key] || adminDict['en']?.[key] || key, [lang]);
  const toggleLang = useCallback(() => dispatch(toggleLangAction()), [dispatch]);

  // Initial load via Redux Sagas
  useEffect(() => {
    dispatch(fetchStatsRequest());
    dispatch(fetchListingsRequest());
    dispatch(fetchUsersRequest());
    dispatch(fetchCatalogRequest());
    dispatch(fetchLogsRequest());
  }, [dispatch]);

  // Periodic logs stream
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(fetchLogsRequest());
    }, 5000);
    return () => clearInterval(timer);
  }, [dispatch]);

  // Listing commands
  const approveListing = useCallback((id) => {
    dispatch(approveListingRequest(id));
    alert(`Listing #${id} approved successfully!`);
  }, [dispatch]);

  const rejectListing = useCallback((id) => {
    dispatch(rejectListingRequest(id));
    alert(`Listing #${id} rejected!`);
  }, [dispatch]);

  const toggleFeatured = useCallback((id) => {
    dispatch(toggleFeaturedRequest(id));
  }, [dispatch]);

  const deleteListing = useCallback((id) => {
    if (window.confirm(`Delete listing #${id}?`)) {
      dispatch(deleteListingRequest(id));
    }
  }, [dispatch]);

  // User commands
  const toggleUserBlock = useCallback((id) => {
    dispatch(toggleUserBlockRequest(id));
  }, [dispatch]);

  const fetchUsers = useCallback((params) => {
    dispatch(fetchUsersRequest(params));
  }, [dispatch]);

  // Dealer commands
  const toggleDealerVerification = useCallback((dealerId) => {
    dispatch(toggleDealerVerificationAction(dealerId));
  }, [dispatch]);

  const addDealer = useCallback((dealerData) => {
    dispatch(addDealerAction({
      id: Date.now(),
      ...dealerData,
      stock: 0,
      sold: 0,
      verified: true,
      joined: 'Just now'
    }));
    alert('Dealer added successfully!');
  }, [dispatch]);

  // Add Car Command
  const addNewCar = useCallback((carData) => {
    const payload = {
      userId: 1,
      brandId: carData.brandId || 1,
      modelName: carData.modelName || 'Model',
      manufacturingYear: parseInt(carData.manufacturingYear, 10) || 2022,
      regYear: parseInt(carData.regYear, 10) || 2022,
      regCity: carData.regCity || 'Jaipur',
      price: parseFloat(carData.price) || 500000,
      kmDriven: parseInt(carData.kmDriven, 10) || 25000,
      fuelType: carData.fuelType || 'Petrol',
      transmission: carData.transmission || 'Manual',
      ownership: carData.ownership || '1st Owner',
      title: carData.title || `${carData.modelName} ${carData.manufacturingYear}`,
      description: carData.description || 'Verified vehicle in pristine condition.',
      images: carData.images && carData.images.length > 0 ? carData.images : ['/assets/cars/creta.jpg']
    };

    dispatch(addNewCarRequest(payload));
    alert('Car added and published successfully to inventory!');
    dispatch(setActiveTabAction('inventory'));
  }, [dispatch]);

  // Buy Requests Commands
  const updateBuyRequestStatus = useCallback((id, status) => {
    dispatch(updateBuyRequestStatusAction({ id, status }));
  }, [dispatch]);

  // Sell Requests Commands
  const updateSellRequestStatus = useCallback((id, status) => {
    dispatch(updateSellRequestStatusAction({ id, status }));
  }, [dispatch]);

  // Orders Commands
  const updateOrderStatus = useCallback((id, status) => {
    dispatch(updateOrderStatusAction({ id, status }));
  }, [dispatch]);

  const downloadInvoice = useCallback((orderId) => {
    alert(`Downloading Tax Invoice & Token Receipt for Order #${orderId}...`);
  }, []);

  // Wishlist Enquiries Commands
  const updateEnquiryStatus = useCallback((id, status) => {
    dispatch(updateEnquiryStatusAction({ id, status }));
  }, [dispatch]);

  // Test Drives Commands
  const updateTestDriveStatus = useCallback((id, status) => {
    dispatch(updateTestDriveStatusAction({ id, status }));
  }, [dispatch]);

  // Banners Commands
  const toggleBannerActive = useCallback((id) => {
    dispatch(toggleBannerActiveAction(id));
  }, [dispatch]);

  const addBanner = useCallback((bannerData) => {
    dispatch(addBannerAction({ id: Date.now(), ...bannerData, active: true }));
    alert('Promotional banner published!');
  }, [dispatch]);

  // Blog Commands
  const addBlogPost = useCallback((postData) => {
    dispatch(addBlogPostAction({ id: Date.now(), ...postData, views: 0, date: 'Just now' }));
    alert('Blog post published!');
  }, [dispatch]);

  // Reviews Commands
  const approveReview = useCallback((id) => {
    dispatch(approveReviewAction(id));
  }, [dispatch]);

  const flagReview = useCallback((id) => {
    dispatch(flagReviewAction(id));
  }, [dispatch]);

  const deleteReview = useCallback((id) => {
    if (window.confirm('Delete this review permanently?')) {
      dispatch(deleteReviewAction(id));
    }
  }, [dispatch]);

  // Admin Users Commands
  const addAdminUser = useCallback((userData) => {
    dispatch(addAdminUserAction({ id: Date.now(), ...userData, lastActive: 'Never', status: 'Active' }));
    alert('Staff member registered!');
  }, [dispatch]);

  // Permissions Commands
  const togglePermission = useCallback((role, key) => {
    dispatch(togglePermissionAction({ role, key }));
  }, [dispatch]);

  // Settings Commands
  const saveSettings = useCallback((newSettings) => {
    dispatch(saveSettingsAction(newSettings));
    alert('General platform settings updated successfully!');
  }, [dispatch]);

  // Support Tickets Commands
  const resolveTicket = useCallback((id) => {
    dispatch(resolveTicketAction(id));
    alert(`Ticket #${id} marked as Resolved!`);
  }, [dispatch]);

  // Catalog commands (Brands, Categories, Locations)
  const addBrand = useCallback((brandData) => {
    const payload = typeof brandData === 'string'
      ? { name: brandData.trim(), isPopular: true, logoIcon: '🚗' }
      : brandData;
    if (!payload.name) return;
    dispatch(addBrandRequest(payload));
  }, [dispatch]);

  const updateBrand = useCallback((id, brandData) => {
    dispatch(updateBrandRequest({ id, data: brandData }));
  }, [dispatch]);

  const deleteBrand = useCallback((id) => {
    dispatch(deleteBrandRequest(id));
  }, [dispatch]);

  const toggleBrandStatus = useCallback((id) => {
    dispatch(toggleBrandStatusRequest(id));
  }, [dispatch]);

  const addCategory = useCallback((categoryData) => {
    if (!categoryData.name) return;
    dispatch(addCategoryRequest(categoryData));
  }, [dispatch]);

  const updateCategory = useCallback((id, categoryData) => {
    dispatch(updateCategoryRequest({ id, data: categoryData }));
  }, [dispatch]);

  const toggleCategoryStatus = useCallback((id) => {
    dispatch(toggleCategoryStatusRequest(id));
  }, [dispatch]);

  const deleteCategory = useCallback((id) => {
    dispatch(deleteCategoryRequest(id));
  }, [dispatch]);

  const addCity = useCallback((cityData, stateParam) => {
    const payload = typeof cityData === 'string'
      ? { name: cityData.trim(), state: (stateParam || '').trim(), isPopular: true }
      : cityData;
    if (!payload.name || !payload.state) return;
    dispatch(addCityRequest(payload));
  }, [dispatch]);

  const updateCity = useCallback((id, cityData) => {
    dispatch(updateCityRequest({ id, data: cityData }));
  }, [dispatch]);

  const toggleCityStatus = useCallback((id) => {
    dispatch(toggleCityStatusRequest(id));
  }, [dispatch]);

  const deleteCity = useCallback((id) => {
    dispatch(deleteCityRequest(id));
  }, [dispatch]);

  // Broadcast command
  const sendBroadcast = useCallback(async (title, message) => {
    const res = await AdminApiService.sendBroadcast(title, message);
    if (res.success) {
      alert('Broadcast notification dispatched to all users!');
    }
  }, []);

  const filteredListings = listings.filter((l) =>
    l.title?.toLowerCase().includes(searchListings.toLowerCase()) ||
    (l.seller_name && l.seller_name.toLowerCase().includes(searchListings.toLowerCase())) ||
    (l.reg_city && l.reg_city.toLowerCase().includes(searchListings.toLowerCase()))
  );

  return {
    activeTab,
    setActiveTab: (val) => dispatch(setActiveTabAction(val)),
    lang,
    toggleLang,
    t,
    stats,
    listings: filteredListings,
    users,
    usersPagination,
    usersFilters,
    fetchUsers,
    dealers,
    brands,
    categories,
    cities,
    logs,
    logFilter,
    setLogFilter: (val) => dispatch(setLogFilterAction(val)),
    searchListings,
    setSearchListings: (val) => dispatch(setSearchListingsAction(val)),
    buyRequests,
    sellRequests,
    orders,
    wishlistEnquiries,
    testDrives,
    websitePages,
    banners,
    blogPosts,
    reviews,
    adminUsers,
    permissions,
    reports,
    transactions,
    settings,
    supportTickets,
    refreshAll: () => {
      dispatch(fetchStatsRequest());
      dispatch(fetchListingsRequest());
      dispatch(fetchUsersRequest());
      dispatch(fetchCatalogRequest());
      dispatch(fetchLogsRequest());
    },
    approveListing,
    rejectListing,
    toggleFeatured,
    deleteListing,
    toggleUserBlock,
    toggleDealerVerification,
    addDealer,
    addNewCar,
    updateBuyRequestStatus,
    updateSellRequestStatus,
    updateOrderStatus,
    downloadInvoice,
    updateEnquiryStatus,
    updateTestDriveStatus,
    toggleBannerActive,
    addBanner,
    addBlogPost,
    approveReview,
    flagReview,
    deleteReview,
    addAdminUser,
    togglePermission,
    saveSettings,
    resolveTicket,
    addBrand,
    updateBrand,
    toggleBrandStatus,
    deleteBrand,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
    addCity,
    updateCity,
    toggleCityStatus,
    deleteCity,
    sendBroadcast,
    uploadImage: (file) => AdminApiService.uploadImage(file)
  };
}
