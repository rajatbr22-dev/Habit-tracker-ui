import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Animated,
  Dimensions,
  Pressable,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Sparkles, Flame, ArrowRight} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING} from '../theme/spacing';

const {width, height} = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  Icon?: any;
  type: 'sparkle' | 'heatmap' | 'flame';
  bgColor: string;
  iconBg: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Build better habits',
    description: 'Start small and stay consistent. We help you define habits that actually stick.',
    Icon: Sparkles,
    type: 'sparkle',
    bgColor: '#F8F9FE',
    iconBg: '#EEF0FF',
  },
  {
    id: '2',
    title: 'Track your progress',
    description: 'Visualize your journey with beautiful heatmaps and detailed statistics.',
    type: 'heatmap',
    bgColor: '#F9F9F9',
    iconBg: '#FFFFFF',
  },
  {
    id: '3',
    title: 'Stay on streak',
    description: 'Join thousands of others building life-changing routines every single day.',
    Icon: Flame,
    type: 'flame',
    bgColor: '#FEF9F6',
    iconBg: '#FFF4ED',
  },
];

const HeatmapMockup = () => {
  const {colors} = useTheme();
  return (
    <View style={[styles.heatmapContainer, {backgroundColor: '#FFF', ...SHADOWS.md}]}>
      <View style={styles.heatmapHeader}>
        <Flame size={14} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} />
        <Text style={[styles.heatmapTitle, {color: colors.text}]}>14 Day Streak</Text>
      </View>
      <View style={styles.heatmapGrid}>
        {Array.from({length: 14}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.heatCell,
              {
                backgroundColor: 
                  i % 5 === 0 ? '#E0E3FF' : 
                  (i % 3 === 0 ? '#A2ABFF' : '#7D89FF')
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const Pagination = ({scrollX}: {scrollX: Animated.Value}) => {
  return (
    <View style={styles.paginationContainer}>
      {SLIDES.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ['#D1D1D1', BRAND_COLORS.primary, '#D1D1D1'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              {width: dotWidth, opacity, backgroundColor},
            ]}
          />
        );
      })}
    </View>
  );
};

const OnboardingScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Auth');
    }
  };

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderSlide = ({item}: {item: OnboardingSlide}) => {
    return (
      <View style={[styles.slide, {width}]}>
        <View style={[styles.imageContainer, {backgroundColor: item.bgColor}]}>
          <View style={[styles.iconWrapper, {backgroundColor: item.iconBg}]}>
            {item.type === 'heatmap' ? (
              <HeatmapMockup />
            ) : (
              <item.Icon 
                size={80} 
                color={item.type === 'flame' ? '#FF4F00' : BRAND_COLORS.primary} 
                strokeWidth={1.5}
                fill={item.type === 'flame' ? '#FFE8DC' : 'transparent'}
              />
            )}
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={[typography.title1, styles.title, {color: colors.text}]}>
            {item.title}
          </Text>
          <Text style={[typography.body, styles.description, {color: colors.textSecondary}]}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Skip Button */}
      <Pressable 
        onPress={() => navigation.replace('Auth')}
        style={[styles.skipBtn, {top: insets.top + SPACING.sm}]}
      >
        <Text style={[typography.bodyMedium, {color: colors.textSecondary}]}>Skip</Text>
      </Pressable>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false}
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={(item) => item.id}
      />

      <View style={[styles.footer, {paddingBottom: insets.bottom + SPACING.xl}]}>
        <Pagination scrollX={scrollX} />

        {currentIndex === SLIDES.length - 1 ? (
          <Pressable 
            style={[styles.getStartedBtn, {backgroundColor: BRAND_COLORS.primary}]}
            onPress={handleNext}
          >
            <Text style={[typography.button, {color: '#FFF'}]}>Get Started</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <View style={[styles.nextBtnCircle, {backgroundColor: BRAND_COLORS.primary}]}>
              <Text style={[typography.subheadMedium, {color: '#FFF'}]}>Next Step</Text>
            </View>
            <ArrowRight size={20} color={colors.textSecondary} style={{marginLeft: SPACING.sm}} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    right: SPACING.lg,
    zIndex: 10,
    padding: SPACING.sm,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.1,
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  iconWrapper: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: SPACING.xl * 2,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 2
  },
  footer: {
    alignItems: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBtnCircle: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADII.pill,
  },
  getStartedBtn: {
    width: width - SPACING.xl * 2,
    paddingVertical: SPACING.lg,
    borderRadius: RADII.pill,
    alignItems: 'center',
  },
  // Heatmap Mockup Styles
  heatmapContainer: {
    width: width * 0.65,
    padding: SPACING.md,
    borderRadius: RADII.lg,
  },
  heatmapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  heatmapTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  heatCell: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
