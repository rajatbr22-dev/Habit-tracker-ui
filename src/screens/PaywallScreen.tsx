import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  X,
  Check,
  Zap,
  Sparkles,
  Shield,
  ArrowRight,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING} from '../theme/spacing';

const {width} = Dimensions.get('window');

const PaywallScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const FeatureItem = ({text, included}: {text: string; included: boolean}) => (
    <View style={styles.featureRow}>
      <View style={[
        styles.featureIcon, 
        {backgroundColor: included ? '#E0EBFF' : '#F5F7FA'}
      ]}>
        {included ? (
          <Check size={14} color={BRAND_COLORS.primary} strokeWidth={3} />
        ) : (
          <X size={14} color="#AEAEB2" strokeWidth={3} />
        )}
      </View>
      <Text style={[
        typography.body, 
        {color: included ? colors.text : colors.textTertiary, marginLeft: 12}
      ]}>
        {text}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: '#FFF'}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <X size={24} color={colors.text} />
        </Pressable>
        <Text style={[typography.title3, {fontWeight: '700'}]}>Premium</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, SHADOWS.md]}>
            <Sparkles size={32} color={BRAND_COLORS.primary} fill={BRAND_COLORS.primary} />
          </View>
          <Text style={[typography.largeTitle, styles.heroTitle]}>Choose your plan</Text>
          <Text style={[typography.subhead, styles.heroSubtitle]}>
            Unlock your full potential and build life-changing habits today.
          </Text>
        </View>

        {/* Plan Cards */}
        <View style={styles.plansContainer}>
          {/* Free Plan */}
          <View style={[styles.planCard, {backgroundColor: '#F9FAFB'}]}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>Free</Text>
                <Text style={styles.planDescription}>Get started with the basics</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <FeatureItem text="Up to 3 habits" included={true} />
            <FeatureItem text="Basic statistics" included={true} />
            <FeatureItem text="AI Habit Insights" included={false} />
            <FeatureItem text="Cloud sync" included={false} />
            <View style={styles.priceContainer}>
              <Text style={styles.priceValue}>$0</Text>
              <Text style={styles.currentPlan}>Current Plan</Text>
            </View>
          </View>

          {/* Pro Annual */}
          <View style={[styles.planCard, styles.proCard, SHADOWS.md]}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>Pro Annual</Text>
                <Text style={styles.planDescription}>Best value for committed users</Text>
              </View>
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <FeatureItem text="Unlimited habits" included={true} />
            <FeatureItem text="Advanced Analytics" included={true} />
            <FeatureItem text="AI Pro Insights" included={true} />
            <FeatureItem text="Priority Support" included={true} />
            
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>$39.99</Text>
                <Text style={styles.pricePeriod}>/ year</Text>
              </View>
            </View>

            <Pressable style={styles.ctaBtn}>
              <Text style={styles.ctaText}>Try 7 Days Free</Text>
            </Pressable>
          </View>

          {/* Pro Monthly */}
          <View style={[styles.planCard, {backgroundColor: '#F9FAFB'}]}>
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planTitle}>Pro Monthly</Text>
                <Text style={styles.planDescription}>Flexible month-to-month</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <FeatureItem text="Unlimited habits" included={true} />
            <FeatureItem text="Advanced Analytics" included={true} />
            <FeatureItem text="AI Pro Insights" included={true} />
            <FeatureItem text="Standard Support" included={true} />
            
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>$4.99</Text>
                <Text style={styles.pricePeriod}>/ month</Text>
              </View>
              <Pressable>
                <Text style={styles.secondaryLink}>Get Pro Monthly</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerPromo}>Save 33% with the annual plan</Text>
          <View style={styles.footerLinks}>
            <Pressable><Text style={styles.footerLink}>Restore Purchase</Text></Pressable>
            <View style={styles.linkDivider} />
            <Pressable><Text style={styles.footerLink}>Terms of Service</Text></Pressable>
            <View style={styles.linkDivider} />
            <Pressable><Text style={styles.footerLink}>Privacy Policy</Text></Pressable>
          </View>
          <Text style={styles.footerNote}>Secure payment via App Store. Cancel anytime.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  closeBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    textAlign: 'center',
    fontWeight: '800',
    color: '#1A1A2E',
  },
  heroSubtitle: {
    textAlign: 'center',
    color: '#52527A',
    marginTop: 12,
    lineHeight: 22,
  },
  plansContainer: {
    padding: SPACING.xl,
    gap: 16,
  },
  planCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  proCard: {
    backgroundColor: '#FFF',
    borderColor: BRAND_COLORS.primary,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  planDescription: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  popularBadge: {
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  currentPlan: {
    color: BRAND_COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  ctaBtn: {
    backgroundColor: BRAND_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryLink: {
    color: BRAND_COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerPromo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLink: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  linkDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E5EA',
  },
  footerNote: {
    fontSize: 11,
    color: '#AEAEB2',
    marginTop: 24,
  },
});

export default PaywallScreen;
