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

const {width} = Dimensions.get('window');

const SettingsScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const {colors, typography} = useTheme();
  const insets = useSafeAreaInsets();

  const [darkMode, setDarkMode] = useState(false);
  const [iCloudSync, setICloudSync] = useState(true);

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
        <View style={[styles.iconContainer, {backgroundColor: iconBg || '#F5F7FA'}]}>
          <Icon size={20} color={iconBg ? '#FFF' : '#1A1A2E'} />
        </View>
        <Text style={[typography.bodyMedium, {color: colors.text, marginLeft: 16, fontWeight: '600'}]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {type === 'toggle' ? (
          <Switch 
            value={toggleValue} 
            onValueChange={onToggle} 
            trackColor={{true: BRAND_COLORS.primary, false: '#E0E0E0'}}
            ios_backgroundColor="#E0E0E0"
          />
        ) : (
          <>
            {value && <Text style={[typography.body, {color: colors.textSecondary, marginRight: 8}]}>{value}</Text>}
            <ChevronRight size={18} color="#AEAEB2" />
          </>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, {backgroundColor: '#FFF'}]}>
      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + SPACING.md}]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1A1A2E" />
        </Pressable>
        <Text style={[typography.title3, {color: '#1A1A2E', fontWeight: '800'}]}>Settings</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, {backgroundColor: BRAND_COLORS.primary}]}>
            <Text style={[typography.title1, {color: '#FFF'}]}>AR</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[typography.title2, {color: '#1A1A2E', fontWeight: '800'}]}>Alex Rivera</Text>
            <Text style={[typography.subhead, {color: '#52527A', marginTop: 2}]}>alex.rivera@design.com</Text>
          </View>
          <Pressable style={styles.editBtn}>
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

        {/* General */}
        <Text style={styles.sectionTitle}>GENERAL</Text>
        <View style={styles.section}>
          <SettingItem 
            Icon={Moon} 
            label="Dark Mode" 
            type="toggle" 
            toggleValue={darkMode} 
            onToggle={setDarkMode}
            iconBg="#1A1A2E"
          />
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
        <Text style={styles.sectionTitle}>ACCOUNT & DATA</Text>
        <View style={styles.section}>
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
        <Text style={styles.sectionTitle}>ABOUT</Text>
        <View style={styles.section}>
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
        <Pressable style={styles.signOutBtn} onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        {/* Version */}
        <Text style={styles.version}>
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
    backgroundColor: '#FFF',
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
    backgroundColor: '#F9FAFB',
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
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBanner: {
    marginHorizontal: SPACING.xl,
    marginTop: 24,
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
    color: '#8E8E93',
    marginLeft: SPACING.xl,
    marginBottom: 8,
    marginTop: 32,
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#F9FAFB',
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
    color: '#1A1A2E',
  },
  version: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#AEAEB2',
  },
});

export default SettingsScreen;
