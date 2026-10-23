import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../src/store';
import { setScreenDirectly } from '../src/store/slices/uiSlice';
import { MarketplaceScreen } from '../src/views/screens/MarketplaceScreen';
import { ScreenName } from '../src/navigation/navigationTypes';

const ALL_SCREENS: ScreenName[] = [
  'SPLASH',
  'WELCOME',
  'LOGIN',
  'OTP',
  'COMPLETE_PROFILE',
  'LOCATION_PERMISSION',
  'SELECT_CITY',
  'HOME',
  'DRAWER_MENU',
  'SEARCH',
  'FILTER',
  'SEARCH_RESULTS',
  'CAR_DETAILS',
  'IMAGE_GALLERY',
  'SELLER_PROFILE',
  'SELL_START',
  'SELL_ADD_PHOTOS',
  'SELL_CAR_INFO',
  'SELL_MORE_DETAILS',
  'SELL_PREVIEW',
  'MY_LISTINGS',
  'EDIT_LISTING',
  'SAVED_CARS',
  'CHAT',
  'NOTIFICATIONS',
  'PROFILE',
];

describe('All 26 Blueprint Screens Rendering', () => {
  ALL_SCREENS.forEach((screenName, index) => {
    it(`renders Screen #${index + 1} (${screenName}) successfully`, async () => {
      await ReactTestRenderer.act(() => {
        store.dispatch(setScreenDirectly({ screen: screenName }));
      });

      let tree: any;
      await ReactTestRenderer.act(() => {
        tree = ReactTestRenderer.create(
          <Provider store={store}>
            <SafeAreaProvider>
              <MarketplaceScreen />
            </SafeAreaProvider>
          </Provider>
        );
      });

      expect(tree).toBeDefined();
    });
  });
});
