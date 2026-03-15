/**
 * HabitTracker – Register Screen
 *
 * Create-account form with display name, email, password,
 * T&C checkbox, social logins, and link to Login.
 */

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
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SPACING} from '../theme/spacing';

// ──────────────────────────────────────────────
// Mini Logo Component
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// Checkbox
// ──────────────────────────────────────────────

const Checkbox: React.FC<{checked: boolean; onToggle: () => void}> = ({
  checked,
  onToggle,
}) => (
  <Pressable
    onPress={onToggle}
    style={[
      checkboxStyles.box,
      checked && {backgroundColor: BRAND_COLORS.primary, borderColor: BRAND_COLORS.primary},
    ]}
    hitSlop={8}>
    {checked && <Text style={checkboxStyles.tick}>✓</Text>}
  </Pressable>
);

const checkboxStyles = StyleSheet.create({
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tick: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginTop: -1,
  },
});

// ──────────────────────────────────────────────
// RegisterScreen
// ──────────────────────────────────────────────

interface RegisterScreenProps {
  navigation?: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleCreateAccount = () => {
    // placeholder — will integrate auth later
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
      style={[styles.flex, {backgroundColor: colors.background}]}
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
          <Text
            style={[
              styles.centered,
              {...typography.title1, color: colors.text, marginTop: SPACING.md},
            ]}>
            HabitTracker
          </Text>
          <Text
            style={[
              styles.centered,
              {...typography.subhead, color: colors.textSecondary, marginTop: SPACING.xs},
            ]}>
            Join 10,000+ users building better habits
          </Text>
        </View>

        {/* ── Tab Toggle ── */}
        <View
          style={[
            styles.tabToggle,
            {backgroundColor: colors.surfaceAlt, borderColor: colors.border},
          ]}>
          <Pressable style={styles.tab} onPress={goToLogin}>
            <Text style={[typography.subheadMedium, {color: colors.textSecondary}]}>Sign in</Text>
          </Pressable>
          <View style={[styles.tab, styles.tabActive, {borderBottomColor: BRAND_COLORS.primary}]}>
            <Text style={[typography.subheadMedium, {color: colors.text}]}>Create account</Text>
          </View>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          {/* Display Name */}
          <Text style={[styles.label, {...typography.footnote, color: colors.textSecondary}]}>
            Display Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                ...typography.body,
                color: colors.text,
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
              },
            ]}
            placeholder="Alex Johnson"
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="words"
            value={displayName}
            onChangeText={setDisplayName}
          />

          {/* Email */}
          <Text
            style={[
              styles.label,
              {...typography.footnote, color: colors.textSecondary, marginTop: SPACING.lg},
            ]}>
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                ...typography.body,
                color: colors.text,
                backgroundColor: colors.surfaceAlt,
                borderColor: colors.border,
              },
            ]}
            placeholder="alex@example.com"
            placeholderTextColor={colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <Text
            style={[
              styles.label,
              {...typography.footnote, color: colors.textSecondary, marginTop: SPACING.lg},
            ]}>
            Password
          </Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[
                styles.input,
                styles.passwordInput,
                {
                  ...typography.body,
                  color: colors.text,
                  backgroundColor: colors.surfaceAlt,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Create a strong password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry={secureText}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              style={styles.eyeButton}
              onPress={() => setSecureText(!secureText)}
              hitSlop={12}>
              <Text style={{fontSize: 18, color: colors.textSecondary}}>
                {secureText ? '👁️‍🗨️' : '👁️'}
              </Text>
            </Pressable>
          </View>

          {/* Terms Checkbox */}
          <View style={styles.termsRow}>
            <Checkbox checked={agreedToTerms} onToggle={() => setAgreedToTerms(!agreedToTerms)} />
            <Text style={[typography.subhead, {color: colors.textSecondary, marginLeft: SPACING.sm, flex: 1}]}>
              I agree to the{' '}
              <Text style={{color: BRAND_COLORS.primary, fontWeight: '600'}}>
                Terms of Service
              </Text>
            </Text>
          </View>
        </View>

        {/* ── CTA ── */}
        <Pressable
          style={({pressed}) => [
            styles.cta,
            {
              backgroundColor: pressed
                ? BRAND_COLORS.primaryDark
                : BRAND_COLORS.primary,
            },
          ]}
          onPress={handleCreateAccount}>
          <Text style={[typography.button, {color: '#FFFFFF'}]}>Create Account</Text>
        </Pressable>

        {/* ── Divider ── */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, {backgroundColor: colors.border}]} />
          <Text
            style={[
              styles.dividerText,
              {...typography.caption1, color: colors.textSecondary},
            ]}>
            or continue with
          </Text>
          <View style={[styles.dividerLine, {backgroundColor: colors.border}]} />
        </View>

        {/* ── Social Buttons ── */}
        <View style={styles.socialRow}>
          <Pressable
            style={[
              styles.socialButton,
              {backgroundColor: colors.socialButton, borderColor: colors.socialButtonBorder},
            ]}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={[typography.subheadMedium, {color: colors.text}]}>Google</Text>
          </Pressable>
          <Pressable
            style={[
              styles.socialButton,
              {backgroundColor: colors.socialButton, borderColor: colors.socialButtonBorder},
            ]}>
            <Text style={[styles.socialIcon, {fontSize: 18}]}></Text>
            <Text style={[typography.subheadMedium, {color: colors.text}]}>Apple</Text>
          </Pressable>
        </View>

        {/* ── Bottom Link ── */}
        <View style={styles.bottomLink}>
          <Text style={[typography.subhead, {color: colors.textSecondary}]}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={goToLogin}>
            <Text style={[typography.subheadMedium, {color: BRAND_COLORS.primary}]}>Sign in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

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
    borderRadius: RADII.pill,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING['2xl'],
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  label: {
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  cta: {
    borderRadius: RADII.sm,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
  },
  socialRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING['3xl'],
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: RADII.sm,
    paddingVertical: 14,
    gap: SPACING.sm,
  },
  socialIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  bottomLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
});

export default RegisterScreen;
