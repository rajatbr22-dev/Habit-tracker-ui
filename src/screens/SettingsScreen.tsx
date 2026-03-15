import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  Dimensions,
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
import {RADII, SHADOWS, SPACING, LAYOUT} from '../theme/spacing';

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
    onToggle 
  }: { 
    Icon: any; 
    label: string; 
    value?: string; 
    type?: 'link' | 'toggle' | 'value'; 
    onPress?: () => void;
    toggleValue?: boolean;
    onToggle?: (val: boolean) => void;
  }) => (
    <Pressable 
      onPress={onPress} 
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
          <Icon size={18} color={colors.text} />
        </View>
        <Text style={[typography.body, { color: colors.text, marginLeft: SPACING.md }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {type === 'toggle' ? (
          <Switch 
            value={toggleValue} 
            onValueChange={onToggle} 
            trackColor={{ true: colors.primary }}
          />
        ) : (
          <>
            {value && <Text style={[typography.body, { color: colors.textSecondary, marginRight: SPACING.xs }]}>{value}</Text>}
            <ChevronRight size={18} color={colors.textTertiary} />
          </>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={[typography.title2, { color: colors.text, fontWeight: '700' }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: BRAND_COLORS.primary }]}>
            <Text style={[typography.title1, { color: '#FFF' }]}>AR</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[typography.title2, { color: colors.text, fontWeight: '700' }]}>Alex Rivera</Text>
            <Text style={[typography.subhead, { color: colors.textSecondary }]}>alex.rivera@design.com</Text>
          </View>
          <Pressable style={[styles.editBtn, { backgroundColor: colors.surfaceAlt }]}>
            <Pencil size={16} color={colors.text} />
          </Pressable>
        </View>

        {/* Pro Banner */}
        <View style={styles.proBanner}>
          <View style={styles.proLeft}>
            <View style={styles.proIcon}>
              <Sparkles size={24} color="#FFF" />
            </View>
            <View style={{ marginLeft: SPACING.md }}>
              <Text style={[typography.title3, { color: '#FFF', fontWeight: '700' }]}>HabitTracker Pro</Text>
              <Text style={[typography.caption1, { color: 'rgba(255,255,255,0.8)' }]}>Unlimited habits & AI insights</Text>
            </View>
          </View>
          <Pressable style={styles.manageBtn}>
            <Text style={[typography.buttonSmall, { color: BRAND_COLORS.primary }]}>Manage</Text>
          </Pressable>
        </View>

        {/* General */}
        <Text style={[typography.overline, styles.sectionTitle, { color: colors.textSecondary }]}>GENERAL</Text>
        <View style={styles.section}>
          <SettingItem 
            Icon={Moon} 
            label="Dark Mode" 
            type="toggle" 
            toggleValue={darkMode} 
            onToggle={setDarkMode} 
          />
          <SettingItem 
            Icon={Bell} 
            label="Notifications" 
            value="On" 
          />
          <SettingItem 
            Icon={Clock} 
            label="Default Reminder" 
            value="08:00 AM" 
          />
        </View>

        {/* Account & Data */}
        <Text style={[typography.overline, styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT & DATA</Text>
        <View style={styles.section}>
          <SettingItem 
            Icon={Cloud} 
            label="iCloud Sync" 
            type="toggle" 
            toggleValue={iCloudSync} 
            onToggle={setICloudSync} 
          />
          <SettingItem 
            Icon={Download} 
            label="Export Data (CSV)" 
          />
          <SettingItem 
            Icon={Trash2} 
            label="Delete Account" 
          />
        </View>

        {/* About */}
        <Text style={[typography.overline, styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
        <View style={styles.section}>
          <SettingItem 
            Icon={Star} 
            label="Rate HabitTracker" 
          />
          <SettingItem 
            Icon={HelpCircle} 
            label="Help Center" 
          />
          <SettingItem 
            Icon={FileText} 
            label="Privacy Policy" 
          />
        </View>

        {/* Sign Out */}
        <Pressable style={styles.signOutBtn}>
          <Text style={[typography.body, { color: colors.text, fontWeight: '600' }]}>Sign Out</Text>
        </Pressable>

        {/* Version */}
        <Text style={[typography.caption2, styles.version, { color: colors.textSecondary }]}>
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
    width: 40,
  },
  scrollContent: {
    paddingBottom: SPACING['3xl'],
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proBanner: {
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADII.xl,
    backgroundColor: BRAND_COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  proLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADII.md,
  },
  sectionTitle: {
    marginLeft: SPACING.lg,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xl,
  },
  section: {
    marginHorizontal: SPACING.lg,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutBtn: {
    alignItems: 'center',
    marginTop: SPACING['3xl'],
    paddingVertical: SPACING.lg,
  },
  version: {
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

export default SettingsScreen;
