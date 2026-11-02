import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReportStatus } from '../types/report';
import { fontFamily } from '../theme/typography';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case 'Pending':
        return {
          bg: '#FEF3C7',
          border: '#FDE68A',
          text: '#B45309',
          dot: '#D97706',
        };
      case 'Uploading':
        return {
          bg: '#DBEAFE',
          border: '#BFDBFE',
          text: '#1D4ED8',
          dot: '#2563EB',
        };
      case 'Uploaded':
        return {
          bg: '#D1FAE5',
          border: '#A7F3D0',
          text: '#047857',
          dot: '#059669',
        };
      case 'Failed':
        return {
          bg: '#FEE2E2',
          border: '#FECACA',
          text: '#B91C1C',
          dot: '#DC2626',
        };
      default:
        return {
          bg: '#F3F4F6',
          border: '#E5E7EB',
          text: '#4B5563',
          dot: '#9CA3AF',
        };
    }
  };

  const colors = getBadgeStyles();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.smallBadge : styles.mediumBadge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text
        style={[
          styles.text,
          isSmall ? styles.smallText : styles.mediumText,
          {
            color: colors.text,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  smallBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  mediumBadge: {
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontFamily: fontFamily.bold,
    letterSpacing: 0.3,
  },
  smallText: {
    fontSize: 11,
  },
  mediumText: {
    fontSize: 13,
  },
});
