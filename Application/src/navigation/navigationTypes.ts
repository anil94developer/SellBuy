export type ScreenName =
  | 'SPLASH'              // 1. Splash Screen
  | 'WELCOME'             // 2. Welcome Screen
  | 'LOGIN'               // 3. Login or Signup
  | 'OTP'                 // 4. Enter OTP
  | 'COMPLETE_PROFILE'    // 5. Complete Your Profile
  | 'LOCATION_PERMISSION' // 6. Allow Location
  | 'SELECT_CITY'         // 7. Select City
  | 'HOME'                // 8. Home Screen
  | 'DRAWER_MENU'         // 9. Menu / Drawer
  | 'SEARCH'              // 10. Search Screen
  | 'FILTER'              // 11. Filter Screen
  | 'SEARCH_RESULTS'      // 12. Search Results
  | 'CAR_DETAILS'         // 13. Car Details
  | 'IMAGE_GALLERY'       // 14. Image Gallery
  | 'SELLER_PROFILE'      // 15. Seller Profile
  | 'SELL_START'          // 16. Sell Car - Start
  | 'SELL_ADD_PHOTOS'     // 17. Add Photos
  | 'SELL_CAR_INFO'       // 18. Car Information
  | 'SELL_MORE_DETAILS'   // 19. More Details
  | 'SELL_PREVIEW'        // 20. Preview Listing
  | 'MY_LISTINGS'         // 21. My Listings
  | 'EDIT_LISTING'        // 22. Edit Listing
  | 'SAVED_CARS'          // 23. Saved Cars
  | 'CHAT'                // 24. Chat / Conversation
  | 'NOTIFICATIONS'       // 25. Notifications
  | 'PROFILE';            // 26. Profile & Settings

export interface NavigationState {
  currentScreen: ScreenName;
  history: ScreenName[];
  params: Record<string, any>;
  isDrawerOpen: boolean;
}
