# SellBuy Mobile App (React Native Bare)

React Native mobile application for **SellBuy Car Marketplace** supporting both **Android** and **iOS** platforms, built using **Redux Toolkit + MVVM (Model-View-ViewModel)** architecture in TypeScript.

- **Package Name / Application ID**: `com.sellbuy.app`
- **Framework**: React Native 0.87 (Bare Native CLI with native `android/` and `ios/` folders)
- **Language**: TypeScript
- **Architecture**: Redux Toolkit + MVVM (Model - View - ViewModel)

---

## 🏛️ MVVM + Redux Architecture Overview

```
Application/mobile/src/
├── models/                     # 1. MODEL (Entities & Interfaces)
│   └── car.model.ts            # Car, Filter, CreateCarInput, User
├── services/                   # 1. MODEL DATA SOURCE (APIs & Repositories)
│   ├── apiClient.ts            # Network client (Android 10.0.2.2 / iOS localhost)
│   └── carService.ts           # Fetching, listing creation, offline fallback
├── store/                      # 2. STATE REPOSITORY (Redux Toolkit)
│   ├── index.ts                # Store config, RootState, AppDispatch & Typed hooks
│   └── slices/
│       ├── carSlice.ts         # Async thunks (fetchCars, createListing, favorites)
│       └── uiSlice.ts          # Active tabs, toast feedback
├── viewmodels/                 # 2. VIEWMODEL (Custom Presentation Hooks)
│   ├── useCarMarketplaceViewModel.ts # Bridges Redux to Marketplace View
│   └── useCreateListingViewModel.ts  # Bridges seller form & validation to Redux
└── views/                      # 3. VIEW (Pure UI Presentation Components)
    ├── components/
    │   ├── MarketplaceHeader.tsx
    │   ├── QuickStatsBanner.tsx
    │   ├── SearchBar.tsx
    │   ├── CarCard.tsx
    │   └── SellerSection.tsx
    └── screens/
        ├── index.ts                # Barrel export of all application screens
        ├── MarketplaceScreen.tsx   # Master screen controller & navigator
        ├── HomeScreen.tsx, SplashScreen.tsx, LoginScreen.tsx, etc.
```

### Flow of Data:
1. **Model**: Defines data types (`car.model.ts`) and interacts with Backend APIs (`apiClient.ts`, `carService.ts`).
2. **ViewModel**: 
   - Redux Slices manage state transitions and asynchronous operations.
   - Custom Hooks (`useCarMarketplaceViewModel`, `useCreateListingViewModel`) derive presentation state, filter logic, and expose callable actions.
3. **View**: Pure UI components consume ViewModels. Views contain **no raw API calls or state mutation logic**, ensuring clean separation of concerns and high testability.

---

## 🚀 Running the Project

### 1. Metro Bundler
```bash
cd mobile
npm start
```
*(Or from `Application`: `npm run mobile:start`)*

### 2. Android
```bash
cd mobile
npm run android
```
*(Or from `Application`: `npm run mobile:android`)*

### 3. iOS (macOS Required)
```bash
cd mobile
npm run ios
```
*(Or from `Application`: `npm run mobile:ios`)*

---

## 🧪 Testing & Verification

- **TypeScript check**: `npx tsc --noEmit` (0 errors)
- **Unit test suite**: `npm test` (Runs Jest tests for both UI rendering and Redux MVVM business logic)
