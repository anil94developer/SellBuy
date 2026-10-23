import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { MarketplaceScreen } from './src/views/screens/MarketplaceScreen';

/**
 * SellBuy Mobile Application
 * Architecture: Redux Toolkit + MVVM (Model-View-ViewModel)
 * Target Platforms: Android & iOS
 */
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MarketplaceScreen />
      </SafeAreaProvider>
    </Provider>
  );
}
