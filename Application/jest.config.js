module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|react-native-safe-area-context|react-redux|@reduxjs/toolkit|immer|redux)/)',
  ],
};
