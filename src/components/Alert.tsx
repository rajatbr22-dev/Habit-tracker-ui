import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertPosition = 'top' | 'bottom';

export interface AlertProps {
  visible: boolean;
  type: AlertType;
  title?: string;
  message: string;
  position?: AlertPosition;
  duration?: number; // ms, 0 = persist until closed
  onClose?: () => void;
  closable?: boolean;
  showIcon?: boolean;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const TOKENS: Record<
  AlertType,
  { bg: string; border: string; title: string; body: string; icon: string; glow: string }
> = {
  success: {
    bg: '#FFF',
    border: '#1aff8c',
    title: '#1aff8c',
    body: '#a3e6c6',
    icon: '#1aff8c',
    glow: 'rgba(26,255,140,0.18)',
  },
  error: {
    bg: '#FFF',
    border: '#ff3d5a',
    title: '#ff3d5a',
    body: '#df5353ff',
    icon: '#ff3d5a',
    glow: 'rgba(255,61,90,0.18)',
  },
  warning: {
    bg: '#1f1800',
    border: '#ffbe00',
    title: '#ffbe00',
    body: '#e6d5a3',
    icon: '#ffbe00',
    glow: 'rgba(255,190,0,0.18)',
  },
  info: {
    bg: '#0d1520',
    border: '#3da9ff',
    title: '#3da9ff',
    body: '#a3c7e6',
    icon: '#3da9ff',
    glow: 'rgba(61,169,255,0.18)',
  },
};

// ─── SVG-style icons (pure RN) ────────────────────────────────────────────────

const SuccessIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconRing, { borderColor: color }]}>
    <View style={styles.checkWrapper}>
      <View style={[styles.checkLeft, { backgroundColor: color }]} />
      <View style={[styles.checkRight, { backgroundColor: color }]} />
    </View>
  </View>
);

const ErrorIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconRing, { borderColor: color }]}>
    <View style={styles.xWrapper}>
      <View style={[styles.xLine1, { backgroundColor: color }]} />
      <View style={[styles.xLine2, { backgroundColor: color }]} />
    </View>
  </View>
);

const WarningIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconRing, { borderColor: color }]}>
    <Text style={[styles.iconText, { color }]}>!</Text>
  </View>
);

const InfoIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconRing, { borderColor: color }]}>
    <Text style={[styles.iconText, { color }]}>i</Text>
  </View>
);

const ICONS: Record<AlertType, React.FC<{ color: string }>> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

// ─── Alert Component ──────────────────────────────────────────────────────────

const Alert: React.FC<AlertProps> = ({
  visible,
  type,
  title,
  message,
  position = 'top',
  duration = 3500,
  onClose,
  closable = true,
  showIcon = true,
}) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const translateY = useRef(new Animated.Value(position === 'top' ? -120 : 120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.94)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tokens = TOKENS[type] || TOKENS.info;
  const Icon = ICONS[type] || ICONS.info;

  const show = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 18,
        stiffness: 220,
        mass: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        stiffness: 240,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
          Animated.timing(glowAnim, { toValue: 0, duration: 1200, useNativeDriver: false }),
        ]),
      ).start();
    });
  };

  const hide = (cb?: () => void) => {
    glowAnim.stopAnimation();
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -120 : 120,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.94,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(cb);
  };

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      translateY.setValue(position === 'top' ? -120 : 120);
      opacity.setValue(0);
      scale.setValue(0.94);
      // Wait a frame for component to mount if it wasn't rendered
      requestAnimationFrame(() => {
        show();
      });
      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          hide(() => {
            onClose?.();
            setShouldRender(false);
          });
        }, duration);
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      hide(() => setShouldRender(false));
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    hide(() => {
      onClose?.();
      setShouldRender(false);
    });
  };

  const glowOpacity = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });

  if (!shouldRender) return null;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        position === 'top' ? styles.top : styles.bottom,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
      pointerEvents="box-none"
    >
      {/* Glow backdrop */}
      <Animated.View
        style={[
          styles.glow,
          { backgroundColor: tokens.glow, opacity: glowOpacity },
        ]}
      />

      {/* Card */}
      <View style={[styles.card, { backgroundColor: tokens.bg, borderColor: tokens.border }]}>
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: tokens.border }]} />

        <View style={styles.content}>
          {showIcon && (
            <View style={styles.iconWrap}>
              <Icon color={tokens.icon} />
            </View>
          )}

          <View style={styles.textBlock}>
            {title ? (
              <Text style={[styles.title, { color: tokens.title }]}>{title}</Text>
            ) : null}
            <Text style={[styles.message, { color: tokens.body }]}>{message}</Text>
          </View>

          {closable && (
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={10}>
              <View style={[styles.closeLine1, { backgroundColor: tokens.title }]} />
              <View style={[styles.closeLine2, { backgroundColor: tokens.title }]} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 20,
    alignItems: 'stretch',
  },
  top: { top: Platform.OS === 'ios' ? 56 : 35 },
  bottom: { bottom: Platform.OS === 'ios' ? 48 : 35 },

  glow: {
    position: 'absolute',
    inset: 0,
    borderRadius: 18,
    marginHorizontal: -6,
    marginVertical: -6,
    zIndex: -1,
  } as any,

  card: {
    borderRadius: 14,
    borderWidth: 1.2,
    overflow: 'hidden',
    flexDirection: 'row',
    // shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },

  accentBar: {
    width: 4,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },

  iconWrap: { flexShrink: 0 },

  iconRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkWrapper: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLeft: {
    position: 'absolute',
    width: 5,
    height: 2,
    borderRadius: 1,
    bottom: 4,
    left: 1,
    transform: [{ rotate: '45deg' }],
  },
  checkRight: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 1,
    bottom: 5,
    left: 4,
    transform: [{ rotate: '-50deg' }],
  },
  xWrapper: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  xLine1: {
    position: 'absolute',
    width: 14,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    position: 'absolute',
    width: 14,
    height: 2,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  iconText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },

  textBlock: { flex: 1, gap: 2 },
  title: { fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
  message: { fontSize: 13, fontWeight: '400', lineHeight: 18, opacity: 0.9 },

  closeBtn: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  closeLine1: {
    position: 'absolute',
    width: 14,
    height: 1.8,
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  closeLine2: {
    position: 'absolute',
    width: 14,
    height: 1.8,
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
});

export default Alert;




export const useAlert = () => {
  const [state, setState] = useState<Omit<AlertProps, 'visible' | 'onClose'>>({
    type: 'info',
    message: '',
  });
  const [visible, setVisible] = useState(false);

  const hide = () => setVisible(false);

  const show = (opts: Omit<AlertProps, 'visible' | 'onClose'>) => {
    setState(opts);
    setVisible(true);
  };

  return {
    alertProps: { ...state, visible, onClose: hide },
    show,
    hide,
    success: (message: string, opts?: Partial<typeof state>) => show({ type: 'success', message, ...opts }),
    error:   (message: string, opts?: Partial<typeof state>) => show({ type: 'error',   message, ...opts }),
    warning: (message: string, opts?: Partial<typeof state>) => show({ type: 'warning', message, ...opts }),
    info:    (message: string, opts?: Partial<typeof state>) => show({ type: 'info',    message, ...opts }),
  };
};