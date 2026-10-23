import React, { useEffect } from 'react';
import { StatusBar, Platform, StatusBarStyle } from 'react-native';
import { ScreenName } from '../../navigation/navigationTypes';
import { colors } from '../../theme/theme';

interface AppStatusBarProps {
  currentScreen: ScreenName;
}

export const AppStatusBar: React.FC<AppStatusBarProps> = ({ currentScreen }) => {
  // Determine if current screen has dark background
  const isDarkScreen =
    currentScreen === 'SPLASH' ||
    currentScreen === 'DRAWER_MENU' ||
    currentScreen === 'CAR_DETAILS' ||
    currentScreen === 'IMAGE_GALLERY';

  const barStyle: StatusBarStyle = isDarkScreen ? 'light-content' : 'dark-content';
  const backgroundColor = isDarkScreen ? '#090D16' : '#FFFFFF';

  useEffect(() => {
    // Android-specific StatusBar handling
    if (Platform.OS === 'android') {
      try {
        if (typeof (StatusBar as any).setBackgroundColor === 'function') {
          (StatusBar as any).setBackgroundColor(backgroundColor, true);
        }
        if (typeof (StatusBar as any).setTranslucent === 'function') {
          (StatusBar as any).setTranslucent(false);
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    // Both Android & iOS
    try {
      StatusBar.setBarStyle(barStyle, true);
    } catch (err) {
      // Fallback gracefully
    }
  }, [barStyle, backgroundColor, currentScreen]);

  return (
    <StatusBar
      barStyle={barStyle}
      animated={true}
    />
  );
};
