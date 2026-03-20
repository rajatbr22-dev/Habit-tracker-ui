import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {SHADOWS, SPACING} from '../theme/spacing';
import { forgotPasswordSchema } from '../schema/auth.scehma';
import { ForgotPasswordFormValues } from '../types';
import { useMutation } from '@tanstack/react-query';
import AuthService from '../services/auth.services';
import Alert, { useAlert } from '../components/Alert';

const MiniLogo: React.FC = () => (
  <View style={logoStyles.container}>
    <View style={[logoStyles.star, logoStyles.starLarge]} />
    <View style={[logoStyles.star, logoStyles.starMedium]} />
    <View style={[logoStyles.star, logoStyles.starSmall]} />
    <View style={[logoStyles.star, logoStyles.starTiny]} />
  </View>
);

const logoStyles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    backgroundColor: '#EDE9FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#1A1A2E',
    transform: [{rotate: '45deg'}],
  },
  starLarge: {
    width: 18,
    height: 18,
    borderRadius: 2,
    top: 14,
    left: 25,
  },
  starMedium: {
    width: 12,
    height: 12,
    borderRadius: 2,
    top: 14,
    left: 14,
  },
  starSmall: {
    width: 9,
    height: 9,
    borderRadius: 1,
    top: 32,
    left: 18,
  },
  starTiny: {
    width: 6,
    height: 6,
    borderRadius: 1,
    top: 34,
    left: 36,
  },
});

const ForgotPasswordScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const { alertProps, error: showError, success: showSuccess } = useAlert();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: (data: ForgotPasswordFormValues) => AuthService.forgotPassword(data),
    onSuccess: (data) => {
      showSuccess('Your password has been reset successfully!', { title: 'Success' });
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    },
    onError: (error: any) => {
      showError(error.message || 'Something went wrong. Please try again.', { title: 'Reset Failed' });
    }
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPasswordMutation.mutate(data);
  };

  const goBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, {backgroundColor: '#FFF'}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      <Alert {...alertProps} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {paddingTop: insets.top + SPACING.md, paddingBottom: insets.bottom + SPACING.lg},
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* ── Back Button ── */}
        <Pressable onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A2E" />
        </Pressable>

        {/* ── Header ── */}
        <View style={styles.header}>
          <MiniLogo />
          <Text style={[styles.appTitle, typography.title1, {color: '#1A1A2E', marginTop: SPACING.md, fontWeight: '800'}]}>
            Reset Password
          </Text>
          <Text style={[styles.subtitle, typography.subhead, {color: '#52527A', marginTop: SPACING.xs}]}>
            Enter your email and a new password to recover access
          </Text>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          {/* Email */}
          <Text style={[styles.label, typography.footnote, {color: '#8E8E93'}]}>
            Email Address
          </Text>
          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: '#F9FAFB',
                    borderColor: errors.email ? colors.error : '#F0F0F0',
                  },
                ]}
                placeholder="alex@example.com"
                placeholderTextColor="#AEAEB2"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          {/* New Password */}
          <Text style={[styles.label, typography.footnote, {color: '#8E8E93', marginTop: SPACING.lg}]}>
            New Password
          </Text>
          <View style={styles.passwordRow}>
            <Controller
              control={control}
              name="newPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: '#F9FAFB',
                      borderColor: errors.newPassword ? colors.error : '#F0F0F0',
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#AEAEB2"
                  secureTextEntry={secureText}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setSecureText(!secureText)}
              hitSlop={12}>
              {secureText ? (
                <EyeOff size={20} color="#AEAEB2" />
              ) : (
                <Eye size={20} color={BRAND_COLORS.primary} />
              )}
            </Pressable>
          </View>
          {errors.newPassword && (
            <Text style={styles.errorText}>{errors.newPassword.message}</Text>
          )}

          {/* Confirm Password */}
          <Text style={[styles.label, typography.footnote, {color: '#8E8E93', marginTop: SPACING.lg}]}>
            Confirm Password
          </Text>
          <View style={styles.passwordRow}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: '#F9FAFB',
                      borderColor: errors.confirmPassword ? colors.error : '#F0F0F0',
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#AEAEB2"
                  secureTextEntry={secureConfirmText}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setSecureConfirmText(!secureConfirmText)}
              hitSlop={12}>
              {secureConfirmText ? (
                <EyeOff size={20} color="#AEAEB2" />
              ) : (
                <Eye size={20} color={BRAND_COLORS.primary} />
              )}
            </Pressable>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
          )}
        </View>

        {/* ── CTA ── */}
        <Pressable
          disabled={forgotPasswordMutation.isPending}
          style={({pressed}) => [
            styles.cta,
            SHADOWS.md,
            {
              backgroundColor: forgotPasswordMutation.isPending
                ? '#ccc'
                : pressed
                ? BRAND_COLORS.primaryDark
                : BRAND_COLORS.primary,
              opacity: forgotPasswordMutation.isPending ? 0.9 : 1,
            },
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          <View style={styles.ctaContent}>
            <Text
              style={[
                typography.button,
                {color: '#FFFFFF', fontWeight: '800'},
              ]}
            >
              {forgotPasswordMutation.isPending ? 'Resetting Password...' : 'Reset Password'}
            </Text>

            {!forgotPasswordMutation.isPending && (
              <LogIn size={18} color="#FFF" style={{marginLeft: 8}} />
            )}
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  scroll: {
    paddingHorizontal: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
  },
  appTitle: {textAlign: 'center'},
  subtitle: {textAlign: 'center'},
  form: {
    marginBottom: SPACING.xl,
  },
  label: {
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    fontSize: 16,
    color: '#1A1A2E',
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 54,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '600',
  },
  cta: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: SPACING.lg,
    alignSelf: 'flex-start',
    padding: 8,
    marginLeft: -8,
  },
});

export default ForgotPasswordScreen;
