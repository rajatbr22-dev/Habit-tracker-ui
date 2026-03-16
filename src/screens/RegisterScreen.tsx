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
  Apple,
  Chrome,
  UserPlus,
  CheckCircle2,
  Circle,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {SHADOWS, SPACING} from '../theme/spacing';
import { RegisterFormValues } from '../types/auth';
import { registerSchema } from '../schema/auth.scehma';

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
  starLarge: {width: 18, height: 18, borderRadius: 2, top: 14, left: 25},
  starMedium: {width: 12, height: 12, borderRadius: 2, top: 14, left: 14},
  starSmall: {width: 9, height: 9, borderRadius: 1, top: 32, left: 18},
  starTiny: {width: 6, height: 6, borderRadius: 1, top: 34, left: 36},
});

const RegisterScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();
  const [secureText, setSecureText] = useState(true);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      agreedToTerms: true,
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log('Register form data:', data);
    if (navigation) {
      navigation.replace('Main');
    }
  };

  const goToLogin = () => {
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, {backgroundColor: '#FFF'}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {paddingTop: insets.top + SPACING['2xl'], paddingBottom: insets.bottom + SPACING.lg},
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* ── Header ── */}
        <View style={styles.header}>
          <MiniLogo />
          <Text style={[styles.centered, typography.title1, {color: '#1A1A2E', marginTop: SPACING.md, fontWeight: '800'}]}>
            HabitTracker
          </Text>
          <Text style={[styles.centered, typography.subhead, {color: '#52527A', marginTop: SPACING.xs}]}>
            Join 10,000+ users building better habits
          </Text>
        </View>

        {/* ── Tab Toggle ── */}
        <View style={[styles.tabToggle, {backgroundColor: '#F8F9FE'}]}>
          <Pressable style={styles.tab} onPress={goToLogin}>
            <Text style={[typography.subheadMedium, {color: '#8E8E93'}]}>Sign in</Text>
          </Pressable>
          <View style={[styles.tab, styles.tabActive]}>
            <Text style={[typography.subheadMedium, {color: BRAND_COLORS.primary, fontWeight: '700'}]}>Create account</Text>
          </View>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          {/* Display Name */}
          <Text style={[styles.label, typography.footnote, {color: '#8E8E93'}]}>
            Name
          </Text>
          <Controller
            control={control}
            name="displayName"
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: '#F9FAFB',
                    borderColor: errors.displayName ? colors.error : '#F0F0F0',
                  },
                ]}
                placeholder="Alex Johnson"
                placeholderTextColor="#AEAEB2"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.displayName && (
            <Text style={styles.errorText}>{errors.displayName.message}</Text>
          )}

          {/* Email */}
          <Text style={[styles.label, typography.footnote, {color: '#8E8E93', marginTop: SPACING.lg}]}>
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

          {/* Password */}
          <Text style={[styles.label, typography.footnote, {color: '#8E8E93', marginTop: SPACING.lg}]}>
            Password
          </Text>
          <View style={styles.passwordRow}>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: '#F9FAFB',
                      borderColor: errors.password ? colors.error : '#F0F0F0',
                    },
                  ]}
                  placeholder="Create a strong password"
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
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}

          {/* Terms Checkbox */}
          <Controller
            control={control}
            name="agreedToTerms"
            render={({field: {onChange, value}}) => (
              <View style={styles.termsRow}>
                <Pressable onPress={() => onChange(!value)} style={styles.checkboxWrapper}>
                  {value ? (
                    <CheckCircle2 size={24} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primaryUltraLight} />
                  ) : (
                    <Circle size={24} color="#C7C7CC" />
                  )}
                </Pressable>
                <Text style={[typography.subhead, {color: '#52527A', marginLeft: 12, flex: 1}]}>
                  I agree to the{' '}
                  <Text style={{color: BRAND_COLORS.primary, fontWeight: '700'}}>
                    Terms of Service
                  </Text>
                </Text>
              </View>
            )}
          />
          {errors.agreedToTerms && (
            <Text style={styles.errorText}>{errors.agreedToTerms.message}</Text>
          )}
        </View>

        {/* ── CTA ── */}
        <Pressable
          style={({pressed}) => [
            styles.cta,
            SHADOWS.md,
            {
              backgroundColor: pressed ? BRAND_COLORS.primaryDark : BRAND_COLORS.primary,
            },
          ]}
          onPress={handleSubmit(onSubmit)}>
          <View style={styles.ctaContent}>
            <Text style={[typography.button, {fontWeight: '800', color: '#FFF' }]}>Sign Up</Text>
            <UserPlus size={18} color="#FFF" style={{marginLeft: 8}} />
          </View>
        </Pressable>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={[styles.dividerText, typography.caption1, {color: '#8E8E93'}]}>
            or continue with
          </Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Social Buttons ── */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialButton}>
            <Chrome size={20} color="#1A1A2E" />
            <Text style={[typography.subheadMedium, {color: '#1A1A2E', fontWeight: '700'}]}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialButton}>
            <Apple size={20} color="#1A1A2E" fill="#1A1A2E" />
            <Text style={[typography.subheadMedium, {color: '#1A1A2E', fontWeight: '700'}]}>Apple</Text>
          </Pressable>
        </View>

        {/* ── Bottom Link ── */}
        <View style={styles.bottomLink}>
          <Text style={[typography.subhead, {color: '#8E8E93'}]}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={goToLogin}>
            <Text style={[typography.subheadMedium, {color: BRAND_COLORS.primary, fontWeight: '700'}]}>Sign in</Text>
          </Pressable>
        </View>
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
  centered: {textAlign: 'center'},
  tabToggle: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: SPACING['2xl'],
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#FFF',
    ...SHADOWS.sm,
  },
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  checkboxWrapper: {
    padding: 2,
  },
  errorText: {
    color: '#FF3B30', // Fallback error red
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
    justifyContent: "center"
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  dividerText: {
    marginHorizontal: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: SPACING['3xl'],
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 10,
    backgroundColor: '#FFF',
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
});

export default RegisterScreen;
