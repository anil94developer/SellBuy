import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTab: 'dashboard',
  lang: 'en',
  loading: false,
  error: null,
  stats: {
    totalUsers: 1420,
    activeListings: 48,
    pendingApprovals: 6,
    totalMarketValue: 34500000,
    totalChats: 215,
    totalViews: 84300
  },
  listings: [],
  users: [],
  usersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  usersFilters: {
    search: '',
    status: 'all',
    mode: 'all'
  },
  brands: [],
  categories: [
    { id: 1, name: 'SUV', icon: '🚙', description: 'Sport Utility Vehicles with high ground clearance and dominant stance', popular_models: 'Creta, Thar, Scorpio, Nexon', avg_budget: '₹ 9 - 25 Lakh', is_active: true, cars_count: 24 },
    { id: 2, name: 'Sedan', icon: '🏎️', description: 'Comfortable 3-box passenger cars offering supreme highway stability', popular_models: 'City, Verna, Dzire, Ciaz', avg_budget: '₹ 6 - 18 Lakh', is_active: true, cars_count: 14 },
    { id: 3, name: 'Hatchback', icon: '🚗', description: 'Compact agile runabouts ideal for city commute and easy parking', popular_models: 'Swift, Baleno, i20, Altroz', avg_budget: '₹ 4 - 10 Lakh', is_active: true, cars_count: 18 },
    { id: 4, name: 'MUV / MPV', icon: '🚐', description: 'Spacious multi-utility 7-seater vehicles for large families', popular_models: 'Innova, Ertiga, Carens, Triber', avg_budget: '₹ 8 - 28 Lakh', is_active: true, cars_count: 8 },
    { id: 5, name: 'Electric EV', icon: '⚡', description: 'Zero-emission green electric powertrains with fast charging', popular_models: 'Nexon EV, Tiago EV, ZS EV, Ioniq 5', avg_budget: '₹ 8 - 45 Lakh', is_active: true, cars_count: 5 },
    { id: 6, name: 'Luxury Coupe', icon: '👑', description: 'Premium executive performance and German engineering', popular_models: 'BMW 3-Series, Mercedes C-Class, Audi A4', avg_budget: '₹ 35 - 90 Lakh', is_active: true, cars_count: 6 }
  ],
  cities: [],
  logs: [],
  logFilter: 'ALL',
  searchListings: '',

  // 1. Dealers & Sellers
  dealers: [
    { id: 1, name: 'Apex Motors Jaipur', owner: 'Ravi Sharma', phone: '+91 98290 12345', city: 'Jaipur', stock: 18, sold: 64, rating: 4.9, tier: 'Platinum Partner', verified: true, joined: 'Jan 2024' },
    { id: 2, name: 'Prime Wheels Delhi', owner: 'Amit Verma', phone: '+91 98111 54321', city: 'Delhi', stock: 24, sold: 98, rating: 4.8, tier: 'Gold Partner', verified: true, joined: 'Mar 2024' },
    { id: 3, name: 'Royal Auto Hub', owner: 'Kunal Singh', phone: '+91 98765 43210', city: 'Jaipur', stock: 12, sold: 35, rating: 4.7, tier: 'Silver Partner', verified: true, joined: 'Jun 2024' },
    { id: 4, name: 'Metro City Cars', owner: 'Vikram Malhotra', phone: '+91 98222 33445', city: 'Mumbai', stock: 29, sold: 110, rating: 4.9, tier: 'Platinum Partner', verified: true, joined: 'Feb 2024' },
    { id: 5, name: 'Starline Automobiles', owner: 'Neeraj Gupta', phone: '+91 99887 76655', city: 'Gurgaon', stock: 8, sold: 19, rating: 4.6, tier: 'Bronze Partner', verified: false, joined: 'Aug 2024' }
  ],

  // 2. Buy Requests
  buyRequests: [
    { id: 'BR-101', buyer: 'Rohit Meena', phone: '+91 98291 88223', targetCar: 'Hyundai Creta SX (O) Diesel 2021+', budget: '₹12,00,000 - ₹14,50,000', city: 'Jaipur', finance: 'Yes (Axis Bank)', status: 'New', date: 'Today, 2:30 PM' },
    { id: 'BR-102', buyer: 'Priya Sharma', phone: '+91 98110 33441', targetCar: 'Maruti Swift ZXI+ Automatic', budget: '₹6,50,000 - ₹7,50,000', city: 'Delhi', finance: 'No (Direct Cash)', status: 'In Discussion', date: 'Yesterday' },
    { id: 'BR-103', buyer: 'Aman Joshi', phone: '+91 99280 44552', targetCar: 'Mahindra Thar 4x4 Hard Top Diesel', budget: '₹13,00,000 - ₹15,00,000', city: 'Jaipur', finance: 'Yes (HDFC Bank)', status: 'Test Drive Scheduled', date: '08 Oct 2026' },
    { id: 'BR-104', buyer: 'Deepak Singhania', phone: '+91 98234 11223', targetCar: 'Toyota Fortuner 4x2 AT', budget: '₹28,00,000 - ₹32,00,000', city: 'Mumbai', finance: 'Yes', status: 'Matched', date: '07 Oct 2026' },
    { id: 'BR-105', buyer: 'Neha Kapoor', phone: '+91 98102 77889', targetCar: 'Honda City ZX CVT Petrol', budget: '₹9,00,000 - ₹11,00,000', city: 'Gurgaon', finance: 'No', status: 'Closed (Purchased)', date: '05 Oct 2026' }
  ],

  // 3. Sell Requests
  sellRequests: [
    { id: 'SR-201', seller: 'Vikas Choudhary', phone: '+91 98293 44551', car: '2020 Kia Seltos GTX+ DCT', km: '38,000 km', expectedPrice: '₹12,50,000', city: 'Jaipur', inspectionDate: '11 Oct 2026, 11:00 AM', status: 'Pending Inspection' },
    { id: 'SR-202', seller: 'Ankit Saxena', phone: '+91 98112 66778', car: '2019 Maruti Baleno Alpha Petrol', km: '42,000 km', expectedPrice: '₹5,80,000', city: 'Delhi', inspectionDate: 'Today, 4:00 PM', status: 'Inspected (Quote ₹5.5L)' },
    { id: 'SR-203', seller: 'Sunita Rao', phone: '+91 98220 99881', car: '2022 Tata Nexon EV Prime', km: '19,000 km', expectedPrice: '₹11,00,000', city: 'Mumbai', inspectionDate: 'Completed', status: 'Purchased by Apex Motors' },
    { id: 'SR-204', seller: 'Harpreet Singh', phone: '+91 98188 22334', car: '2018 Hyundai Verna 1.6 SX', km: '55,000 km', expectedPrice: '₹7,20,000', city: 'Noida', inspectionDate: 'Pending', status: 'Pending Inspection' }
  ],

  // 4. Orders & Bookings
  orders: [
    { id: 'ORD-9081', car: 'Hyundai Creta 1.5 SX', buyer: 'Rahul Batra', phone: '+91 98290 88771', token: 25000, total: 1175000, gateway: 'Razorpay UPI', date: '09 Oct 2026', status: 'Token Confirmed' },
    { id: 'ORD-9080', car: 'Maruti Suzuki Swift ZXi', buyer: 'Kavita Rao', phone: '+91 98110 55442', token: 10000, total: 680000, gateway: 'HDFC NetBanking', date: '08 Oct 2026', status: 'Inspection Done' },
    { id: 'ORD-9079', car: 'Mahindra Thar LX Hard Top', buyer: 'Devendra Rathore', phone: '+91 98280 11990', token: 50000, total: 1450000, gateway: 'ICICI UPI', date: '07 Oct 2026', status: 'Vehicle Delivered' },
    { id: 'ORD-9078', car: 'Honda City VX CVT', buyer: 'Nitin Aggarwal', phone: '+91 98101 22334', token: 20000, total: 920000, gateway: 'Razorpay Card', date: '05 Oct 2026', status: 'Cancelled (Refunded)' }
  ],

  // 5. Wishlist & Enquiries
  wishlistEnquiries: [
    { id: 'ENQ-501', user: 'Manish Kumawat', phone: '+91 98290 66554', car: 'Hyundai Creta 1.5 SX', message: 'Is the first-owner insurance zero-depreciation valid till next year?', date: 'Today, 1:10 PM', status: 'Pending Follow-up' },
    { id: 'ENQ-502', user: 'Sanjay Soni', phone: '+91 98114 99001', car: 'Mahindra Thar LX 4x4', message: 'Can I get RC transfer assistance in Jaipur RTO?', date: 'Yesterday', status: 'Contacted' },
    { id: 'ENQ-503', user: 'Shweta Agarwal', phone: '+91 98223 44112', car: 'Tata Nexon XZ+ Diesel', message: 'What is the absolute best cash offer available?', date: '08 Oct 2026', status: 'Converted' },
    { id: 'ENQ-504', user: 'Karthik Raja', phone: '+91 98801 22334', car: 'Toyota Fortuner 4x2 AT', message: 'Is service history available from authorized Toyota service center?', date: '07 Oct 2026', status: 'Contacted' }
  ],

  // 6. Test Drive Bookings
  testDrives: [
    { id: 'TD-401', user: 'Alok Mishra', phone: '+91 98292 11002', car: 'Hyundai Creta 1.5 SX', slot: '10 Oct 2026, 11:30 AM', location: 'Doorstep (Malviya Nagar, Jaipur)', agent: 'Ravi Sharma', status: 'Scheduled' },
    { id: 'TD-402', user: 'Shalini Mathur', phone: '+91 98113 44556', car: 'Maruti Swift ZXi', slot: '10 Oct 2026, 3:00 PM', location: 'Showroom Visit (Apex Motors, Jaipur)', agent: 'Kunal Singh', status: 'Confirmed' },
    { id: 'TD-403', user: 'Gaurav Bansal', phone: '+91 98281 77889', car: 'Mahindra Thar LX 4x4', slot: '09 Oct 2026, 4:30 PM', location: 'Doorstep (Vaishali Nagar, Jaipur)', agent: 'Amit Verma', status: 'Completed' },
    { id: 'TD-404', user: 'Sameer Sheikh', phone: '+91 98221 66778', car: 'Honda City ZX CVT', slot: '11 Oct 2026, 10:00 AM', location: 'Doorstep (Bandra West, Mumbai)', agent: 'Vikram Malhotra', status: 'Scheduled' }
  ],

  // 7. Website Pages CMS
  websitePages: [
    { id: 1, name: 'Home Marketplace', slug: '/', title: 'Buy & Sell Verified Cars Online in India', status: 'Published', updated: 'Today, 10:15 AM' },
    { id: 2, name: 'Explore & Filter Cars', slug: '/explore', title: 'Search thousands of certified pre-owned cars', status: 'Published', updated: 'Yesterday' },
    { id: 3, name: 'Sell Your Car Fast', slug: '/sell-car', title: 'Get highest price and free doorstep inspection', status: 'Published', updated: '08 Oct 2026' },
    { id: 4, name: 'About SellBuy Platform', slug: '/about', title: "India's trusted digital automotive marketplace", status: 'Published', updated: '01 Oct 2026' },
    { id: 5, name: 'Terms & Conditions', slug: '/terms', title: 'Marketplace policy, buyer escrow, and seller rules', status: 'Published', updated: '01 Oct 2026' },
    { id: 6, name: 'Privacy Policy', slug: '/privacy', title: 'User data encryption and location safety', status: 'Published', updated: '01 Oct 2026' },
    { id: 7, name: 'EMI & Loan Calculator', slug: '/emi-calculator', title: 'Calculate vehicle loan interest and monthly payments', status: 'Published', updated: '05 Oct 2026' }
  ],

  // 8. Banners & Sliders
  banners: [
    { id: 1, title: 'Mega Festive Carnival 2026', subtitle: 'Up to ₹50,000 Instant Cash Discount & Free RC Transfer', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', placement: 'Web Hero Carousel', active: true },
    { id: 2, title: 'Zero Downpayment Loan Deal', subtitle: 'Partnered with HDFC & SBI with interest starting at 8.25%', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', placement: 'App Strip Banner', active: true },
    { id: 3, title: 'Sell Your Car in 29 Minutes', subtitle: 'Instant Bank Transfer & Free Doorstep Evaluation', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', placement: 'Marketplace Mid Banner', active: true }
  ],

  // 9. Blog & Content
  blogPosts: [
    { id: 1, title: 'Top 7 Most Reliable Used SUVs in India for 2026', category: 'Buying Guide', author: 'Vikram Rathore', readTime: '6 min read', views: 4210, status: 'Published', date: '08 Oct 2026' },
    { id: 2, title: 'Petrol vs Diesel vs Electric: Complete Cost of Ownership Guide', category: 'Market Trends', author: 'Pooja Deshmukh', readTime: '8 min read', views: 6150, status: 'Published', date: '05 Oct 2026' },
    { id: 3, title: 'How to Inspect a Used Car Engine and RC Before Paying Token', category: 'Safety & Tips', author: 'Ravi Shankar', readTime: '5 min read', views: 3890, status: 'Published', date: '02 Oct 2026' }
  ],

  // 10. Reviews & Ratings
  reviews: [
    { id: 1, reviewer: 'Siddharth Sen', target: 'Apex Motors (Hyundai Creta)', rating: 5, comment: 'Seamless buying experience! Vehicle was in mint condition and RC transfer took only 4 days.', date: '08 Oct 2026', status: 'Approved' },
    { id: 2, reviewer: 'Preeti Duggal', target: 'Royal Auto Hub (Maruti Baleno)', rating: 4, comment: 'Genuine seller, price was reasonably negotiable and car was delivered clean.', date: '07 Oct 2026', status: 'Approved' },
    { id: 3, reviewer: 'Rohit Agarwal', target: 'Private Seller (Swift VDi)', rating: 1, comment: 'Seller asked for advance before showing the car. Avoid!', date: '06 Oct 2026', status: 'Flagged' }
  ],

  // 11. Admin Users & Staff Roles
  adminUsers: [
    { id: 1, name: 'Super Admin (You)', email: 'admin@sellbuy.in', role: 'Super Admin', lastActive: 'Just now', status: 'Active' },
    { id: 2, name: 'Vikram Rathore', email: 'vikram.r@sellbuy.in', role: 'Inventory & Catalog Manager', lastActive: 'Today, 11:30 AM', status: 'Active' },
    { id: 3, name: 'Anjali Saxena', email: 'anjali.s@sellbuy.in', role: 'Customer Grievance & Support', lastActive: 'Today, 9:15 AM', status: 'Active' },
    { id: 4, name: 'Rakesh Chawla', email: 'rakesh.c@sellbuy.in', role: 'Finance & Settlement Auditor', lastActive: 'Yesterday', status: 'Active' }
  ],

  // 12. Permissions Matrix
  permissions: {
    'Super Admin': { approveListings: true, deleteInventory: true, banUsers: true, financeAccess: true, sendBroadcasts: true, manageAdmins: true },
    'Catalog Manager': { approveListings: true, deleteInventory: true, banUsers: false, financeAccess: false, sendBroadcasts: true, manageAdmins: false },
    'Support Agent': { approveListings: false, deleteInventory: false, banUsers: false, financeAccess: false, sendBroadcasts: false, manageAdmins: false },
    'Finance Auditor': { approveListings: false, deleteInventory: false, banUsers: false, financeAccess: true, sendBroadcasts: false, manageAdmins: false }
  },

  // 13. Reports & Analytics
  reports: {
    monthlyGmv: 84500000,
    totalDeals: 74,
    avgTurnaroundDays: 16,
    regionalShare: [
      { city: 'Jaipur', share: '44%' },
      { city: 'Delhi NCR', share: '32%' },
      { city: 'Mumbai', share: '16%' },
      { city: 'Others', share: '8%' }
    ],
    brandVolume: [
      { brand: 'Hyundai', volume: '₹ 2.8 Cr' },
      { brand: 'Maruti Suzuki', volume: '₹ 2.2 Cr' },
      { brand: 'Mahindra', volume: '₹ 1.8 Cr' },
      { brand: 'Tata', volume: '₹ 1.1 Cr' },
      { brand: 'Toyota', volume: '₹ 55 Lakh' }
    ]
  },

  // 14. Financial Transactions
  transactions: [
    { id: 'TXN-89012', user: 'Rahul Batra', type: 'Token Deposit', amount: 25000, gateway: 'Razorpay UPI', date: '09 Oct 2026, 12:44 PM', status: 'Success' },
    { id: 'TXN-89011', user: 'Apex Motors', type: 'Featured Boost (3 Cars)', amount: 4499, gateway: 'HDFC Corporate NetBanking', date: '09 Oct 2026, 10:15 AM', status: 'Success' },
    { id: 'TXN-89010', user: 'Kavita Rao', type: 'Token Deposit', amount: 10000, gateway: 'PhonePe UPI', date: '08 Oct 2026, 4:20 PM', status: 'Success' },
    { id: 'TXN-89009', user: 'Nitin Aggarwal', type: 'Token Refund', amount: -20000, gateway: 'Refund Gateway', date: '06 Oct 2026, 11:00 AM', status: 'Refunded' }
  ],

  // 15. General Settings
  settings: {
    platformName: 'SellBuy India',
    supportPhone: '+91 1800-200-7355',
    supportEmail: 'support@sellbuy.in',
    headquarters: 'Jaipur, Rajasthan, India',
    currency: 'INR (₹)',
    freeListingsLimit: 3,
    listingValidityDays: 60,
    commissionRate: 1.5,
    maintenanceMode: false
  },

  // 16. Support & Complaints
  supportTickets: [
    { id: 'TKT-1044', customer: 'Manoj Pareek', phone: '+91 98290 33221', subject: 'RC transfer delay from private seller', category: 'Seller Misconduct', priority: 'High', status: 'Open', date: 'Today, 1:15 PM' },
    { id: 'TKT-1043', customer: 'Divya Jain', phone: '+91 98112 44332', subject: 'Token payment deducted but confirmation SMS delayed', category: 'Payment Issue', priority: 'Urgent', status: 'In Progress', date: 'Today, 11:00 AM' },
    { id: 'TKT-1042', customer: 'Karan Bedi', phone: '+91 99281 55667', subject: 'Inquired vehicle was marked sold after booking', category: 'Inventory', priority: 'Medium', status: 'Resolved', date: 'Yesterday' }
  ]
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Tab and language
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setLang: (state, action) => {
      state.lang = action.payload;
    },
    toggleLang: (state) => {
      state.lang = state.lang === 'en' ? 'hi' : 'en';
    },
    setLogFilter: (state, action) => {
      state.logFilter = action.payload;
    },
    setSearchListings: (state, action) => {
      state.searchListings = action.payload;
    },

    // Saga triggers & handlers
    fetchStatsRequest: (state) => {
      state.loading = true;
    },
    fetchStatsSuccess: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
    fetchStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchListingsRequest: (state) => {
      state.loading = true;
    },
    fetchListingsSuccess: (state, action) => {
      state.loading = false;
      state.listings = action.payload;
    },
    fetchListingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchUsersRequest: (state) => {
      state.loading = true;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      if (Array.isArray(action.payload)) {
        state.users = action.payload;
        state.usersPagination.total = action.payload.length;
      } else if (action.payload && action.payload.users) {
        state.users = action.payload.users;
        if (action.payload.pagination) {
          state.usersPagination = action.payload.pagination;
        }
      }
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUsersFilters: (state, action) => {
      state.usersFilters = { ...state.usersFilters, ...action.payload };
    },

    fetchCatalogRequest: (state) => {
      state.loading = true;
    },
    fetchCatalogSuccess: (state, action) => {
      state.loading = false;
      if (action.payload.brands) state.brands = action.payload.brands;
      if (action.payload.cities) state.cities = action.payload.cities;
      if (action.payload.categories) state.categories = action.payload.categories;
    },
    fetchCatalogFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchLogsRequest: (state) => {},
    fetchLogsSuccess: (state, action) => {
      state.logs = action.payload;
    },

    // Listing operations (handled by sagas)
    approveListingRequest: () => {},
    rejectListingRequest: () => {},
    toggleFeaturedRequest: () => {},
    deleteListingRequest: () => {},
    addNewCarRequest: () => {},

    // User operations (handled by sagas)
    toggleUserBlockRequest: () => {},

    // Catalog operations (Brands, Categories, Cities)
    addBrandRequest: () => {},
    updateBrandRequest: () => {},
    toggleBrandStatusRequest: () => {},
    deleteBrandRequest: () => {},

    addCategoryRequest: () => {},
    updateCategoryRequest: () => {},
    toggleCategoryStatusRequest: () => {},
    deleteCategoryRequest: () => {},

    addCityRequest: () => {},
    updateCityRequest: () => {},
    toggleCityStatusRequest: () => {},
    deleteCityRequest: () => {},

    // In-memory table reducers
    toggleDealerVerification: (state, action) => {
      const d = state.dealers.find(x => x.id === action.payload);
      if (d) d.verified = !d.verified;
    },
    addDealer: (state, action) => {
      state.dealers.unshift(action.payload);
    },
    updateBuyRequestStatus: (state, action) => {
      const { id, status } = action.payload;
      const b = state.buyRequests.find(x => x.id === id);
      if (b) b.status = status;
    },
    updateSellRequestStatus: (state, action) => {
      const { id, status } = action.payload;
      const s = state.sellRequests.find(x => x.id === id);
      if (s) s.status = status;
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const o = state.orders.find(x => x.id === id);
      if (o) o.status = status;
    },
    updateEnquiryStatus: (state, action) => {
      const { id, status } = action.payload;
      const e = state.wishlistEnquiries.find(x => x.id === id);
      if (e) e.status = status;
    },
    updateTestDriveStatus: (state, action) => {
      const { id, status } = action.payload;
      const t = state.testDrives.find(x => x.id === id);
      if (t) t.status = status;
    },
    toggleBannerActive: (state, action) => {
      const b = state.banners.find(x => x.id === action.payload);
      if (b) b.active = !b.active;
    },
    addBanner: (state, action) => {
      state.banners.push(action.payload);
    },
    addBlogPost: (state, action) => {
      state.blogPosts.unshift(action.payload);
    },
    approveReview: (state, action) => {
      const r = state.reviews.find(x => x.id === action.payload);
      if (r) r.status = 'Approved';
    },
    flagReview: (state, action) => {
      const r = state.reviews.find(x => x.id === action.payload);
      if (r) r.status = 'Flagged';
    },
    deleteReview: (state, action) => {
      state.reviews = state.reviews.filter(x => x.id !== action.payload);
    },
    addAdminUser: (state, action) => {
      state.adminUsers.push(action.payload);
    },
    togglePermission: (state, action) => {
      const { role, key } = action.payload;
      if (state.permissions[role]) {
        state.permissions[role][key] = !state.permissions[role][key];
      }
    },
    saveSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    resolveTicket: (state, action) => {
      const t = state.supportTickets.find(x => x.id === action.payload);
      if (t) t.status = 'Resolved';
    }
  }
});

export const {
  setActiveTab,
  setLang,
  toggleLang,
  setLogFilter,
  setSearchListings,
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  fetchListingsRequest,
  fetchListingsSuccess,
  fetchListingsFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchCatalogRequest,
  fetchCatalogSuccess,
  fetchCatalogFailure,
  fetchLogsRequest,
  fetchLogsSuccess,
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
  toggleDealerVerification,
  addDealer,
  updateBuyRequestStatus,
  updateSellRequestStatus,
  updateOrderStatus,
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
  setUsersFilters
} = adminSlice.actions;

export default adminSlice.reducer;
