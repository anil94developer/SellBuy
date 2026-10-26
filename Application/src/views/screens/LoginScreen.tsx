import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography, shadows } from '../../theme/theme';

interface Props {
  onBack: () => void;
  onSendOtp: (phone: string) => void;
  onSocialLogin?: (provider: 'google' | 'apple') => void;
  onQuickDemoLogin?: (phone: string) => void;
  initialPhone?: string;
  isLoading?: boolean;
}

export const LoginScreen: React.FC<Props> = ({
  onBack,
  onSendOtp,
  onSocialLogin,
  onQuickDemoLogin,
  initialPhone = '9876543210',
  isLoading = false,
}) => {
  const [phone, setPhone] = useState(initialPhone);

  const handleSend = () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }
    onSendOtp(clean);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onBack} title="" showBack={true} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Headline */}
          <Text style={styles.title}>Login or Signup</Text>
          <Text style={styles.subtitle}>
            Enter your mobile number to sign in or register instantly with SellBuy
          </Text>

          {/* Phone Input Box */}
          <View style={styles.inputCard}>
            <View style={styles.countryCodeBox}>
              <Text style={styles.flagIcon}>🇮🇳</Text>
              <Text style={styles.countryCodeText}>+91</Text>
              <Text style={styles.dropdownArrow}>▾</Text>
            </View>
            <View style={styles.verticalDivider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="10-digit Mobile Number"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={10}
              autoFocus
            />
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
            activeOpacity={0.85}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send OTP</Text>
            )}
          </TouchableOpacity>

          {/* Quick Demo Logins Helper */}
          <View style={styles.quickDemoBox}>
            <Text style={styles.quickDemoTitle}>💡 Quick 1-Click Demo Accounts</Text>
            <View style={styles.quickDemoRow}>
              <TouchableOpacity
                style={styles.quickDemoChip}
                onPress={() => {
                  setPhone('9876543210');
                  if (onQuickDemoLogin) onQuickDemoLogin('9876543210');
                  else onSendOtp('9876543210');
                }}>
                <Text style={styles.quickDemoText}>👤 Rakesh (Existing)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickDemoChip}
                onPress={() => {
                  const newPhone = '98700' + Math.floor(10000 + Math.random() * 90000);
                  setPhone(newPhone);
                  onSendOtp(newPhone);
                }}>
                <Text style={styles.quickDemoText}>✨ New User Register</Text>
              </TouchableOpacity>
            </View>
          </View>



          {/* Footer Terms */}
          <View style={styles.footer}>
            <Text style={styles.termsText}>
              By continuing you agree to SellBuy{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 20,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  flagIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  dropdownArrow: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  verticalDivider: {
    width: 1,
    height: 26,
    backgroundColor: colors.border,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  sendButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
  quickDemoBox: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  quickDemoTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: '#1E40AF',
    marginBottom: 10,
  },
  quickDemoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickDemoChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#93C5FD',
    alignItems: 'center',
  },
  quickDemoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontWeight: typography.weights.medium,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EA4335',
    marginRight: 8,
  },
  appleIcon: {
    fontSize: 20,
    color: '#000000',
    marginRight: 8,
  },
  socialText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  termsText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
});
