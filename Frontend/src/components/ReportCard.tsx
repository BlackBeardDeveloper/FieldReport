import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import { Report } from '../types/report';
import { StatusBadge } from './StatusBadge';
import { fontFamily } from '../theme/typography';
import { Camera } from 'lucide-react-native';

interface ReportCardProps {
  report: Report;
  onPress: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  // Format readable date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const firstImage = report.images.length > 0 ? report.images[0] : null;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <StatusBadge status={report.status} size="small" />
        <Text style={styles.dateText}>{formatDate(report.createdAt)}</Text>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={styles.description} numberOfLines={2}>
            {report.description}
          </Text>
          <View style={styles.footerRow}>
            <View style={styles.photoCountBadge}>
              <Camera size={13} color="#475569" strokeWidth={2} style={styles.photoIcon} />
              <Text style={styles.photoCountText}>
                {report.images.length} {report.images.length === 1 ? 'photo' : 'photos'}
              </Text>
            </View>
            {report.isLocal && (
              <Text style={styles.localBadgeText}>Local device</Text>
            )}
          </View>
        </View>

        {firstImage && (
          <Image
            source={{ uri: firstImage.uri }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: '#64748B',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  description: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 8,
  },
  photoIcon: {
    marginRight: 4,
  },
  photoCountText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    color: '#475569',
  },
  localBadgeText: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
});
