import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/report';
import { useReports } from '../context/ReportsContext';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { fontFamily } from '../theme/typography';
import { AlertTriangle, Smartphone, Cloud, ShieldCheck, X } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportDetails'>;

const { width } = Dimensions.get('window');

export const ReportDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { reportId } = route.params;
  const { localReports, serverReports } = useReports();

  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);

  // Search report in local first, then server
  const report =
    localReports.find((r) => r.id === reportId) ||
    serverReports.find((r) => r.id === reportId);

  if (!report) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.notFoundContainer}>
          <View style={styles.notFoundIconCircle}>
            <AlertTriangle size={36} color="#D97706" strokeWidth={2.2} />
          </View>
          <Text style={styles.notFoundTitle}>Report Not Found</Text>
          <Text style={styles.notFoundSubtitle}>
            The requested field report could not be located in local memory.
          </Text>
          <Button
            title="Return to Dashboard"
            variant="primary"
            onPress={() => navigation.goBack()}
            style={styles.returnButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Format readable timestamp
  const formattedDate = () => {
    try {
      const date = new Date(report.createdAt);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return report.createdAt;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status & Metadata Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.reportIdLabel}>REPORT ID</Text>
              <Text style={styles.reportIdText}>#{report.id}</Text>
            </View>
            <StatusBadge status={report.status} size="medium" />
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Created Date</Text>
            <Text style={styles.metaValue}>{formattedDate()}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Storage Location</Text>
            <View style={styles.metaValueRow}>
              {report.isLocal ? (
                <>
                  <Smartphone size={13} color="#1E293B" strokeWidth={2.2} style={styles.metaInlineIcon} />
                  <Text style={styles.metaValue}>Local Device Storage</Text>
                </>
              ) : (
                <>
                  <Cloud size={13} color="#1E293B" strokeWidth={2.2} style={styles.metaInlineIcon} />
                  <Text style={styles.metaValue}>Remote Server Database</Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Synchronization Status</Text>
            <Text style={[styles.metaValue, styles.metaValueBold]}>
              {report.status === 'Uploaded' ? 'Synced with cloud' : 'Queued on device'}
            </Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report Description</Text>
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{report.description}</Text>
          </View>
        </View>

        {/* Attached Photos Card */}
        <View style={styles.card}>
          <View style={styles.photoHeaderRow}>
            <Text style={styles.cardTitle}>Attached Evidence Photos</Text>
            <Text style={styles.photoCount}>
              {report.images.length} {report.images.length === 1 ? 'photo' : 'photos'}
            </Text>
          </View>

          <Text style={styles.photoHint}>Tap any photo to view full size.</Text>

          {report.images.length > 0 ? (
            <View style={styles.photoGrid}>
              {report.images.map((img, index) => (
                <TouchableOpacity
                  key={img.id || index}
                  style={styles.photoCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPhotoUri(img.uri)}
                >
                  <Image
                    source={{ uri: img.uri }}
                    style={styles.photoThumb}
                    resizeMode="cover"
                  />
                  <View style={styles.photoFooter}>
                    <Text style={styles.photoName} numberOfLines={1}>
                      {img.fileName || `Photo ${index + 1}`}
                    </Text>
                    <Text style={styles.photoBadge}>View</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.noPhotosText}>No images attached to this report.</Text>
          )}
        </View>

        {/* Offline-First Information Box */}
        <View style={styles.infoBanner}>
          <View style={styles.infoTitleRow}>
            <ShieldCheck size={16} color="#1E40AF" strokeWidth={2.2} style={styles.infoIcon} />
            <Text style={styles.infoTitle}>Offline-First Architecture</Text>
          </View>
          <Text style={styles.infoBody}>
            This report was saved locally first. Once network connectivity is active and the backend is connected, an automated background worker will synchronize this report to the server.
          </Text>
        </View>
      </ScrollView>

      {/* Full Screen Image Modal */}
      <Modal
        visible={!!selectedPhotoUri}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedPhotoUri(null)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedPhotoUri(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <X size={15} color="#FFFFFF" strokeWidth={2.4} style={styles.modalCloseIcon} />
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>

          {selectedPhotoUri && (
            <Image
              source={{ uri: selectedPhotoUri }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportIdLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  reportIdText: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  metaLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: '#64748B',
  },
  metaValue: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: '#1E293B',
  },
  metaValueBold: {
    fontFamily: fontFamily.bold,
  },
  cardTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 10,
  },
  descriptionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  descriptionText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  photoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  photoCount: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    color: '#64748B',
  },
  photoHint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: (width - 76) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  photoThumb: {
    width: '100%',
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  photoFooter: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  photoName: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: '#475569',
    marginRight: 4,
  },
  photoBadge: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    color: '#2563EB',
  },
  noPhotosText: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  infoBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoBody: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaInlineIcon: {
    marginRight: 5,
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 6,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    zIndex: 10,
  },
  modalCloseIcon: {
    marginRight: 4,
  },
  notFoundTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 6,
  },
  notFoundSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  returnButton: {
    paddingHorizontal: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontFamily: fontFamily.bold,
    color: '#FFFFFF',
    fontSize: 14,
  },
  fullImage: {
    width: '94%',
    height: '75%',
  },
});
