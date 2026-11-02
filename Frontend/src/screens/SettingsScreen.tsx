import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AlertTriangle, BookOpen, Trash2 } from 'lucide-react-native';
import { RootStackParamList } from '../types/report';
import { useReports } from '../context/ReportsContext';
import { Button } from '../components/Button';
import { ConfirmDialog, DialogType } from '../components/ConfirmDialog';
import { fontFamily } from '../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { localReports, resetLocalReports } = useReports();
  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: DialogType;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Confirmation dialog before clearing local reports
  const handleResetPress = () => {
    setDialog({
      visible: true,
      title: 'Reset Local Data?',
      message: 'Are you sure you want to purge all locally stored reports on this device? Remote server reports will not be affected.',
      type: 'danger',
      confirmText: 'Reset Data',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        resetLocalReports();
        setDialog({
          visible: true,
          title: 'Data Reset Successful',
          message: 'All local device reports have been cleared successfully.',
          type: 'success',
          confirmText: 'Return to Dashboard',
          showCancel: false,
          onConfirm: () => {
            setDialog((prev) => ({ ...prev, visible: false }));
            navigation.navigate('Dashboard');
          },
        });
      },
      onCancel: () => setDialog((prev) => ({ ...prev, visible: false })),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Storage Management Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Local Storage Management</Text>
          <Text style={styles.sectionSubtitle}>
            Manage reports stored on this device in offline mode.
          </Text>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.statsLabel}>Local Reports Count</Text>
              <Text style={styles.statsValue}>{localReports.length} stored</Text>
            </View>
            <View style={styles.storageTypeBadge}>
              <Text style={styles.storageTypeText}>In-Memory State</Text>
            </View>
          </View>

          <View style={styles.noticeBox}>
            <View style={styles.noticeTitleRow}>
              <AlertTriangle size={15} color="#B45309" strokeWidth={2.2} style={styles.noticeIcon} />
              <Text style={styles.noticeTitle}>Data Persistence Note</Text>
            </View>
            <Text style={styles.noticeBody}>
              Resetting local data only purges un-synced or local reports from this device. Reports already synced to the backend server remain untouched.
            </Text>
          </View>

          <Button
            title="Reset Local Data"
            icon={<Trash2 size={16} color="#FFFFFF" strokeWidth={2.2} />}
            variant="danger"
            onPress={handleResetPress}
            style={styles.dangerButton}
          />
        </View>

        {/* Offline Architecture Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Application Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>Field Reports</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Architecture Mode</Text>
            <Text style={styles.infoValue}>Offline-First</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0 (Phase 1 Frontend)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Local Database</Text>
            <Text style={styles.infoValue}>Ready for SQLite</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Backend API</Text>
            <Text style={styles.infoValue}>Ready for REST Integration</Text>
          </View>
        </View>

        {/* Technical Test Guide */}
        <View style={styles.guideCard}>
          <View style={styles.guideTitleRow}>
            <BookOpen size={16} color="#166534" strokeWidth={2.2} style={styles.guideIcon} />
            <Text style={styles.guideTitle}>Technical Architecture Notes</Text>
          </View>
          <Text style={styles.guideText}>
            • Clean separation between UI screens, reusable components, and in-memory context.{'\n'}
            • Full camera & gallery support with runtime permissions and image limit guards (1-5 photos).{'\n'}
            • Status transitions designed for future background queue workers (Pending → Uploading → Uploaded / Failed).{'\n'}
            • Server Reports screen supports multiple simulated states (Normal, Loading, Empty, Error).
          </Text>
        </View>
      </ScrollView>

      {/* Custom Professional Confirmation Dialog */}
      <ConfirmDialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        showCancel={dialog.showCancel}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel || (() => setDialog((prev) => ({ ...prev, visible: false })))}
      />
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
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statsLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statsValue: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: '#0F172A',
    marginTop: 2,
  },
  storageTypeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  storageTypeText: {
    fontFamily: fontFamily.bold,
    fontSize: 11,
    color: '#1D4ED8',
  },
  noticeBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noticeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noticeIcon: {
    marginRight: 6,
  },
  noticeTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 12,
    color: '#B45309',
  },
  noticeBody: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
  },
  dangerButton: {
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: '#64748B',
  },
  infoValue: {
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
    color: '#1E293B',
  },
  guideCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  guideTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guideIcon: {
    marginRight: 6,
  },
  guideTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: '#166534',
  },
  guideText: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: '#14532D',
    lineHeight: 20,
  },
});
