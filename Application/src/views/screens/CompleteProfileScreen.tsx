import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Header } from '../common/Header';
import { colors, typography, shadows } from '../../theme/theme';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
];

interface Props {
  phone?: string;
  initialName?: string;
  initialEmail?: string;
  initialAvatar?: string;
  isEditing?: boolean;
  onBack: () => void;
  onContinue: (profile: { name: string; email: string; avatar: string }) => void;
  isLoading?: boolean;
}

export const CompleteProfileScreen: React.FC<Props> = ({
  phone = '9876543210',
  initialName = '',
  initialEmail = '',
  initialAvatar,
  isEditing = false,
  onBack,
  onContinue,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [avatarUri, setAvatarUri] = useState(initialAvatar || AVATAR_OPTIONS[0]);

  useEffect(() => {
    if (initialName) setName(initialName);
    if (initialEmail) setEmail(initialEmail);
    if (initialAvatar) setAvatarUri(initialAvatar);
  }, [initialName, initialEmail, initialAvatar]);

  const handleNext = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your full name');
      return;
    }
    onContinue({
      name: name.trim(),
      email: email.trim(),
      avatar: avatarUri,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onBack={onBack} title={isEditing ? 'Edit Profile' : ''} showBack={true} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{isEditing ? 'Edit Your Profile' : 'Complete Your Profile'}</Text>
          <Text style={styles.subtitle}>
            {isEditing
              ? 'Update your name, email, and choose your preferred profile avatar.'
              : 'Register your buyer/seller account on SellBuy to start browsing, posting, and chatting.'}
          </Text>

          {/* Phone Badge */}
          <View style={styles.phoneBadge}>
            <Text style={styles.phoneCheck}>✓</Text>
            <Text style={styles.phoneBadgeText}>
              {isEditing ? 'Registered Mobile' : 'Verified Mobile'}: +91 {phone}
            </Text>
          </View>

          {/* Current Avatar Preview */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraIcon}>✓</Text>
            </View>
          </View>

          {/* Choose Avatar Options */}
          <Text style={styles.avatarLabel}>Select Profile Avatar</Text>
          <View style={styles.avatarOptionsRow}>
            {AVATAR_OPTIONS.map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setAvatarUri(uri)}
                activeOpacity={0.7}
                style={[
                  styles.avatarChoice,
                  avatarUri === uri && styles.avatarChoiceSelected,
                ]}>
                <Image source={{ uri }} style={styles.avatarSmall} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Full Name <Text style={styles.requiredMark}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Rahul Sharma"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="e.g. rahul@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Save / Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
            onPress={handleNext}
            disabled={isLoading}
            activeOpacity={0.85}>
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>
                {isEditing ? 'Save Changes ✓' : 'Create Account & Continue'}
              </Text>
            )}
          </TouchableOpacity>
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 24,
    gap: 6,
  },
  phoneCheck: {
    color: '#16A34A',
    fontWeight: 'bold',
    fontSize: 14,
  },
  phoneBadgeText: {
    color: '#15803D',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    ...shadows.sm,
  },
  cameraIcon: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  avatarLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  avatarOptionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  avatarChoice: {
    padding: 3,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarChoiceSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  form: {
    width: '100%',
    marginBottom: 28,
    gap: 16,
  },
  inputGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  requiredMark: {
    color: '#EF4444',
  },
  textInput: {
    width: '100%',
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    fontSize: typography.sizes.base,
    color: colors.textPrimary,
    fontWeight: typography.weights.semibold,
  },
  continueButton: {
    width: '100%',
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});
