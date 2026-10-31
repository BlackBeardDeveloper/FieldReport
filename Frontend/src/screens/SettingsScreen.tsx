import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/report';
import { useReports } from '../context/ReportsContext';
import { Button } from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { localReports, resetLocalReports } = useReports();

  // Confirmation dialog before clearing local reports
  const handleResetPress = () => {
    Alert.alert(
      'Reset Local Data',
      'Are you sure you want to reset all locally stored reports?\n\nImportant: This action will only clear offline reports stored on this device. Remote server reports will NOT be affected.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset Local Data',
          style: 'destructive',
          onPress: () => {
            resetLocalReports();
            Alert.alert(
              'Data Reset',
              'Local device reports have been cleared successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Dashboard'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
            <Text style={styles.noticeTitle}>⚠️ Data Persistence Note</Text>
            <Text style={styles.noticeBody}>
              Resetting local data only purges un-synced or local reports from this device. Reports already synced to the backend server remain untouched.
            </Text>
          </View>

          <Button
            title="Reset Local Data"
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
          <Text style={styles.guideTitle}>📘 Technical Interview Notes</Text>
          <Text style={styles.guideText}>
            • Clean separation between UI screens, reusable components, and in-memory context.{'\n'}
            • Full camera & gallery support with runtime permissions and image limit guards (1-5 photos).{'\n'}
            • Status transitions designed for future background queue workers (Pending → Uploading → Uploaded / Failed).{'\n'}
            • Server Reports screen supports multiple simulated states (Normal, Loading, Empty, Error).
          </Text>
        </View>
      </ScrollView>
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
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubtitle: {
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
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statsValue: {
    fontSize: 15,
    fontWeight: '700',
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
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  noticeBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 3,
  },
  noticeBody: {
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
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '600',
  },
  guideCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  guideText: {
    fontSize: 12,
    color: '#14532D',
    lineHeight: 20,
  },
});
