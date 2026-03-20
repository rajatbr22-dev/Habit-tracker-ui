/**
 * HabitTracker – Splash Screen
 *
 * Centered logo with app name and a loading spinner.
 * Auto-navigates to the Auth stack after a short delay.
 */

import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import { getItem } from '../lib/storage';

// ──────────────────────────────────────────────
// Sparkle Icon Component (SVG-like paths drawn with Views)
// ──────────────────────────────────────────────

const SparkleIcon: React.FC = () => {
  // Four-pointed stars rendered with rotated squares
  return (
    <View style={iconStyles.container}>
      {/* Large star (center-right) */}
      <View style={[iconStyles.star, iconStyles.starLarge]} />
      {/* Medium star (top-left) */}
      <View style={[iconStyles.star, iconStyles.starMedium]} />
      {/* Small star (bottom-left) */}
      <View style={[iconStyles.star, iconStyles.starSmall]} />
      {/* Tiny star (top-right of large) */}
      <View style={[iconStyles.star, iconStyles.starTiny]} />
    </View>
  );
};

const iconStyles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    transform: [{rotate: '45deg'}],
  },
  starLarge: {
    width: 24,
    height: 24,
    borderRadius: 3,
    top: 18,
    left: 32,
  },
  starMedium: {
    width: 16,
    height: 16,
    borderRadius: 2,
    top: 18,
    left: 16,
  },
  starSmall: {
    width: 12,
    height: 12,
    borderRadius: 2,
    top: 42,
    left: 22,
  },
  starTiny: {
    width: 8,
    height: 8,
    borderRadius: 1,
    top: 44,
    left: 46,
  },
});

// ──────────────────────────────────────────────
// SplashScreen
// ──────────────────────────────────────────────

interface SplashScreenProps {
  navigation?: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await getItem('userToken');

    if (token) {
      navigation.replace('Main');
    } else {
      navigation.replace('Login');
    }
  };

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-navigate after 2.5s
    const timer = setTimeout(() => {
      if (navigation) {
        navigation.replace('Onboarding');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <Animated.View
        style={[
          styles.content,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <SparkleIcon />
        <Text
          style={[
            styles.title,
            {
              ...typography.largeTitle,
              color: colors.text,
              marginTop: 16,
            },
          ]}>
          HabitTracker
        </Text>
      </Animated.View>

      <Animated.View style={[styles.loader, {opacity: fadeAnim}]}>
        <ActivityIndicator size="large" color={BRAND_COLORS.primaryLight} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  loader: {
    position: 'absolute',
    bottom: '35%',
  },
});

export default SplashScreen;
