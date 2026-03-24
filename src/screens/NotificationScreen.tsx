import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Bell, 
  ChevronLeft, 
  Trash2, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react-native';
import { useTheme } from '../theme';
import { SPACING, RADII, LAYOUT } from '../theme/spacing';
import { useUIStore, Notification } from '../store/useUIStore';
import EmptyState from '../components/EmptyState';

const NotificationIcon = ({ type, size = 20 }: { type: Notification['type'], size?: number }) => {
  const { colors } = useTheme();
  switch (type) {
    case 'success': return <CheckCircle size={size} color={colors.success} />;
    case 'warning': return <AlertTriangle size={size} color={colors.warning} />;
    case 'error': return <XCircle size={size} color={colors.error} />;
    default: return <Info size={size} color={colors.info} />;
  }
};

const NotificationItem = ({ item }: { item: Notification }) => {
  const { colors, typography } = useTheme();
  const markAsRead = useUIStore(state => state.markAsRead);

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <Pressable 
      onPress={() => markAsRead(item.id)}
      style={[
        styles.card, 
        { borderColor: colors.border, backgroundColor: colors.card },
        !item.read && { borderLeftWidth: 4, borderLeftColor: colors.primary }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceAlt }]}>
        <NotificationIcon type={item.type} />
      </View>
      <View style={styles.content}>
        <View style={styles.cardHeader}>
          <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700' }]}>{item.title}</Text>
          <Text style={[typography.caption2, { color: colors.textSecondary }]}>{timeAgo(item.timestamp)}</Text>
        </View>
        <Text style={[typography.subhead, { color: colors.textSecondary, marginTop: 4 }]} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
    </Pressable>
  );
};

const NotificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { notifications, clearNotifications } = useUIStore();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.title2, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity 
          onPress={clearNotifications}
          style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}
        >
          <Trash2 size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + SPACING.xl }]}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <EmptyState 
              title="No Notifications" 
              description="When you get alerts about your habits, they'll show up here."
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingBottom: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: LAYOUT.screenPaddingHorizontal,
    paddingTop: SPACING.md,
    gap: SPACING.md,
  },
  card: {
    padding: SPACING.md,
    borderRadius: RADII.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: SPACING.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyWrap: {
    marginTop: 100,
  },
});

export default NotificationScreen;
