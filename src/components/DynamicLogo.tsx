import React from 'react';
import { View } from 'react-native';
import Svg, {
  Rect,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
} from 'react-native-svg';
import { useTheme } from '../theme';

interface DynamicLogoProps {
  color: string;
  size?: number;
}

const DynamicLogo: React.FC<DynamicLogoProps> = ({ color, size = 24 }) => {
  const { colors, isDark } = useTheme();

  const today = new Date();
  const dayNum = today.getDate().toString();

  // Short day name: Mon, Tue, Wed …
  const dayName = today
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();

  const isActive = color === colors.primary;

  // ─── Palette ────────────────────────────────────────────────
  // Active: vibrant red-coral accent (like Apple/Google Calendar)
  // Inactive: muted gray-slate
  const accent = isActive
    ? isDark ? colors.primaryDark : colors.primary
    : isDark ? '#6B7280' : '#9CA3AF';

  const accentLight = isActive
    ? isDark ? colors.primaryDark : colors.primary
    : isDark ? '#9CA3AF' : '#D1D5DB';

  // Body background
  const bodyFill = isDark ? '#1E2028' : '#FFFFFF';
  const bodyStroke = isDark ? '#2D3240' : '#E5E7EB';

  // Date number color
  const dateColor = isActive
    ? isDark ? '#F9FAFB' : '#1A202C'
    : isDark ? '#9CA3AF' : '#6B7280';

  // Day-of-week label color
  const dowColor = accent;

  // Ring/pin colors
  const ringFill = isDark ? '#374151' : '#E5E7EB';
  const ringStroke = accent;

  // Scale everything to the requested size
  // The internal viewBox is 0 0 24 24
  const scale = size / 24;

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Defs>
          {/* Subtle header gradient */}
          <LinearGradient id="headerGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={accentLight} stopOpacity="1" />
            <Stop offset="100%" stopColor={accent} stopOpacity="1" />
          </LinearGradient>

          {/* Very soft drop shadow simulation via layered rect */}
          <LinearGradient id="shadowGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <Stop offset="100%" stopColor="#000000" stopOpacity={isDark ? '0.35' : '0.08'} />
          </LinearGradient>
        </Defs>

        {/* ── Shadow layer ─────────────────────────── */}
        <Rect
          x="2.5"
          y="5.5"
          width="19"
          height="17.5"
          rx="3.5"
          fill="url(#shadowGrad)"
          opacity="1"
        />

        {/* ── Calendar body ────────────────────────── */}
        <Rect
          x="2"
          y="5"
          width="19"
          height="17"
          rx="3"
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth="0.75"
        />

        {/* ── Header strip ─────────────────────────── */}
        <Rect
          x="2"
          y="5"
          width="19"
          height="6"
          rx="3"
          fill="url(#headerGrad)"
        />
        {/* Square off the bottom corners of the header */}
        <Rect
          x="2"
          y="8"
          width="19"
          height="3"
          fill={accent}
        />

        {/* ── Day-of-week label (inside header) ────── */}
        <SvgText
          x="11.5"
          y="9.6"
          textAnchor="middle"
          fontSize="3.2"
          fontWeight="700"
          fill="#FFFFFF"
          fontFamily="System"
          letterSpacing="0.4"
          opacity="0.92"
        >
          {dayName}
        </SvgText>

        {/* ── Date number ──────────────────────────── */}
        <SvgText
          x="12"
          y="19.5"
          textAnchor="middle"
          fontSize={dayNum.length > 1 ? '7.5' : '8.5'}
          fontWeight="700"
          fill={dateColor}
          fontFamily="System"
        >
          {dayNum}
        </SvgText>

        {/* ── Ring pins ─────────────────────────────── */}
        {/* Left pin */}
        <G>
          {/* Pin shaft */}
          <Rect
            x="7"
            y="2.5"
            width="1.8"
            height="4"
            rx="0.9"
            fill={ringFill}
            stroke={ringStroke}
            strokeWidth="0.5"
          />
          {/* Pin head cap */}
          <Circle
            cx="7.9"
            cy="2.9"
            r="1.1"
            fill={accent}
          />
        </G>

        {/* Right pin */}
        <G>
          <Rect
            x="14.4"
            y="2.5"
            width="1.8"
            height="4"
            rx="0.9"
            fill={ringFill}
            stroke={ringStroke}
            strokeWidth="0.5"
          />
          <Circle
            cx="15.3"
            cy="2.9"
            r="1.1"
            fill={accent}
          />
        </G>
      </Svg>
    </View>
  );
};

export default DynamicLogo;