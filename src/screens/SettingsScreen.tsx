import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Sparkles,
  Moon,
  Bell,
  Clock,
  Cloud,
  Download,
  Trash2,
  Star,
  HelpCircle,
  FileText,
} from 'lucide-react-native';
import {useTheme} from '../theme';
import {BRAND_COLORS} from '../theme/colors';
import {RADII, SHADOWS, SPACING} from '../theme/spacing';
import { getItem, removeItem } from '../lib/storage';

import { useUIStore, ThemeMode as UIThemeMode } from '../store/useUIStore';

const {width} = Dimensions.get('window');

const SettingsScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography, mode, isDark} = useTheme();
  const insets = useSafeAreaInsets();
  const { themeMode, setThemeMode } = useUIStore();

  const [iCloudSync, setICloudSync] = useState(true);

  const handleLogout = async () => {
    await removeItem('userToken');
    setTimeout(() => {
      navigation.replace('Auth');
    }, 500);
  };

  const ThemeOption = ({ mode: optionMode, label, icon: Icon }: { mode: UIThemeMode, label: string, icon: any }) => (
    <Pressable 
      onPress={() => setThemeMode(optionMode)}
      style={[
        styles.themeOption, 
        { 
          backgroundColor: themeMode === optionMode ? BRAND_COLORS.primaryUltraLight : colors.surfaceAlt,
          borderColor: themeMode === optionMode ? BRAND_COLORS.primary : 'transparent'
        }
      ]}
    >
      <Icon size={18} color={themeMode === optionMode ? BRAND_COLORS.primary : colors.textSecondary} />
      <Text style={[typography.caption1, { color: themeMode === optionMode ? BRAND_COLORS.primary : colors.textSecondary, marginTop: 4 }]}>
        {label}
      </Text>
    </Pressable>
  );

  const SettingItem = ({ 
    Icon, 
    label, 
    value, 
    type = 'link', 
    onPress, 
    toggleValue, 
    onToggle,
    iconBg
  }: { 
    Icon: any; 
    label: string; 
    value?: string; 
    type?: 'link' | 'toggle' | 'value'; 
    onPress?: () => void;
    toggleValue?: boolean;
    onToggle?: (val: boolean) => void;
    iconBg?: string;
  }) => (
    <Pressable 
      onPress={onPress} 
      style={styles.settingItem}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, {backgroundColor: iconBg || (isDark ? colors.surfaceAlt : '#F5F7FA')}]}>
          <Icon size={20} color={iconBg ? '#FFF' : colors.text} />
        </View>
        <Text style={[typography.bodyMedium, {color: colors.text, marginLeft: 16, fontWeight: '600'}]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {type === 'toggle' ? (
          <Switch 
            value={toggleValue} 
            onValueChange={onToggle} 
            trackColor={{true: BRAND_COLORS.primary, false: isDark ? colors.border : '#E0E0E0'}}
            ios_backgroundColor={isDark ? colors.border : "#E0E0E0"}
          />
        ) : (
          <>
            {value && <Text style={[typography.body, {color: colors.textSecondary, marginRight: 8}]}>{value}</Text>}
            <ChevronRight size={18} color={colors.textTertiary} />
          </>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md, borderBottomColor: colors.border}]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={[typography.title3, {color: colors.text, fontWeight: '800'}]}>Settings</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={[styles.profileSection, {backgroundColor: colors.card}]}>
          <View style={[styles.avatar, {backgroundColor: BRAND_COLORS.primary}]}>
            <Text style={[typography.title1, {color: '#FFF'}]}>AR</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[typography.title2, {color: colors.text, fontWeight: '800'}]}>Alex Rivera</Text>
            <Text style={[typography.subhead, {color: colors.textSecondary, marginTop: 2}]}>alex.rivera@design.com</Text>
          </View>
          <Pressable style={[styles.editBtn, {backgroundColor: isDark ? colors.surfaceAlt : '#EEF2FF'}]}>
            <Pencil size={18} color={BRAND_COLORS.primary} />
          </Pressable>
        </View>

        {/* Pro Banner */}
        <View style={[styles.proBanner, SHADOWS.md]}>
          <View style={styles.proLeft}>
            <View style={styles.proIcon}>
              <Sparkles size={24} color="#FFF" fill="#FFF" />
            </View>
            <View style={{marginLeft: 16}}>
              <Text style={styles.proTitle}>HabitTracker Pro</Text>
              <Text style={styles.proSubtitle}>Unlimited habits & AI insights</Text>
            </View>
          </View>
          <Pressable style={styles.manageBtn} onPress={() => navigation.navigate('Paywall')}>
            <Text style={styles.manageBtnText}>Manage</Text>
          </Pressable>
        </View>

        {/* Appearance */}
        <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>APPEARANCE</Text>
        <View style={styles.themeSelector}>
          <ThemeOption mode="light" label="Light" icon={Sparkles} />
          <ThemeOption mode="dark" label="Dark" icon={Moon} />
          <ThemeOption mode="system" label="System" icon={Cloud} />
        </View>

        {/* General */}
        <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>GENERAL</Text>
        <View style={[styles.section, {backgroundColor: colors.card}]}>
          <SettingItem 
            Icon={Bell} 
            label="Notifications" 
            value="On" 
            iconBg="#FF9F0A"
          />
          <SettingItem 
            Icon={Clock} 
            label="Default Reminder" 
            value="08:00 AM" 
            iconBg={BRAND_COLORS.primary}
          />
        </View>

        {/* Account & Data */}
        <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>ACCOUNT & DATA</Text>
        <View style={[styles.section, {backgroundColor: colors.card}]}>
          <SettingItem 
            Icon={Cloud} 
            label="iCloud Sync" 
            type="toggle" 
            toggleValue={iCloudSync} 
            onToggle={setICloudSync} 
            iconBg="#34C759"
          />
          <SettingItem 
            Icon={Download} 
            label="Export Data (CSV)" 
            iconBg="#007AFF"
          />
          <SettingItem 
            Icon={Trash2} 
            label="Delete Account" 
            iconBg="#FF3B30"
          />
        </View>

        {/* About */}
        <Text style={[styles.sectionTitle, {color: colors.textSecondary}]}>ABOUT</Text>
        <View style={[styles.section, {backgroundColor: colors.card}]}>
          <SettingItem 
            Icon={Star} 
            label="Rate HabitTracker" 
            iconBg="#FFCC00"
          />
          <SettingItem 
            Icon={HelpCircle} 
            label="Help Center" 
            iconBg="#8E8E93"
          />
          <SettingItem 
            Icon={FileText} 
            label="Privacy Policy" 
            iconBg="#5856D6"
          />
        </View>

        {/* Sign Out */}
        <Pressable style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={[styles.signOutText, {color: colors.error}]}>Sign Out</Text>
        </Pressable>

        {/* Version */}
        <Text style={[styles.version, {color: colors.textTertiary}]}>
          Version 2.4.0 (Build 102)
        </Text>
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
  backButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  editBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBanner: {
    marginHorizontal: SPACING.xl,
    marginTop: 8,
    padding: 24,
    borderRadius: 32,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  proLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
  },
  proSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    fontWeight: '600',
  },
  manageBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  manageBtnText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: SPACING.xl,
    marginBottom: 8,
    marginTop: 32,
    letterSpacing: 1,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.sm,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  section: {
    borderRadius: 24,
    marginHorizontal: SPACING.xl,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutBtn: {
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SettingsScreen;
