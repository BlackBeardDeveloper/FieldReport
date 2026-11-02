import { Platform } from 'react-native';

/**
 * Typography system using Inter font family
 * Linked in android/app/src/main/assets/fonts/
 */
export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export const typography = {
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: -0.3,
  },
  cardTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  captionMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
  },
  badge: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  idBadge: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
};
