import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type IconName =
  | 'back'
  | 'search'
  | 'filter'
  | 'heart'
  | 'heart-fill'
  | 'bell'
  | 'pin'
  | 'menu'
  | 'plus'
  | 'share'
  | 'camera'
  | 'phone'
  | 'chat'
  | 'check'
  | 'close'
  | 'user'
  | 'home'
  | 'saved'
  | 'edit'
  | 'trash'
  | 'chevron-right'
  | 'car'
  | 'settings'
  | 'help'
  | 'info'
  | 'logout'
  | 'shield';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, color = '#0F172A' }) => {
  const getSymbol = () => {
    switch (name) {
      case 'back': return '←';
      case 'search': return '🔍';
      case 'filter': return '⚡';
      case 'heart': return '♡';
      case 'heart-fill': return '♥';
      case 'bell': return '🔔';
      case 'pin': return '📍';
      case 'menu': return '☰';
      case 'plus': return '+';
      case 'share': return '↗';
      case 'camera': return '📷';
      case 'phone': return '📞';
      case 'chat': return '💬';
      case 'check': return '✓';
      case 'close': return '✕';
      case 'user': return '👤';
      case 'home': return '🏠';
      case 'saved': return '♥';
      case 'edit': return '✏';
      case 'trash': return '🗑';
      case 'chevron-right': return '›';
      case 'car': return '🚗';
      case 'settings': return '⚙';
      case 'help': return '?';
      case 'info': return 'ℹ';
      case 'logout': return '⎋';
      case 'shield': return '🛡';
      default: return '•';
    }
  };

  const isEmoji = ['🔍', '⚡', '🔔', '📍', '📷', '📞', '💬', '👤', '🏠', '🗑', '🚗', '⚙'].includes(getSymbol());

  if (isEmoji) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Text
          style={{
            fontSize: size * 0.82,
            textAlign: 'center',
            textAlignVertical: 'center',
            includeFontPadding: false,
          }}>
          {getSymbol()}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text
        style={{
          fontSize: size * 0.88,
          color,
          fontWeight: '700',
          textAlign: 'center',
          textAlignVertical: 'center',
          includeFontPadding: false,
        }}>
        {getSymbol()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
