import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/report';
import { useReports } from '../context/ReportsContext';
import { ReportCard } from '../components/ReportCard';
import { Button } from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { localReports, statusCounts } = useReports();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>Field Reports</Text>
          <View style={styles.offlinePill}>
            <View style={styles.greenPulse} />
            <Text style={styles.offlineText}>Offline-First Enabled</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={localReports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <Button
                title="+ Create New Report"
                variant="primary"
                onPress={() => navigation.navigate('CreateReport')}
                style={styles.createButton}
              />

              <Button
                title="☁️ View Server Reports"
                variant="secondary"
                onPress={() => navigation.navigate('ServerReports')}
                style={styles.serverButton}
              />
            </View>

            {/* Status Counts Overview Cards */}
            <Text style={styles.sectionHeader}>Report Status Overview</Text>
            <View style={styles.statusGrid}>
              <View style={[styles.statusCard, styles.pendingBorder]}>
                <Text style={styles.statusCountNumber}>{statusCounts.pending}</Text>
                <Text style={[styles.statusLabel, styles.pendingLabel]}>Pending</Text>
              </View>

              <View style={[styles.statusCard, styles.uploadingBorder]}>
                <Text style={styles.statusCountNumber}>{statusCounts.uploading}</Text>
                <Text style={[styles.statusLabel, styles.uploadingLabel]}>Uploading</Text>
              </View>

              <View style={[styles.statusCard, styles.uploadedBorder]}>
                <Text style={styles.statusCountNumber}>{statusCounts.uploaded}</Text>
                <Text style={[styles.statusLabel, styles.uploadedLabel]}>Uploaded</Text>
              </View>

              <View style={[styles.statusCard, styles.failedBorder]}>
                <Text style={styles.statusCountNumber}>{statusCounts.failed}</Text>
                <Text style={[styles.statusLabel, styles.failedLabel]}>Failed</Text>
              </View>
            </View>

            {/* Local Reports Section Header */}
            <View style={styles.reportsHeaderRow}>
              <Text style={styles.sectionHeader}>Local Device Reports</Text>
              <Text style={styles.reportCountBadge}>
                {localReports.length} {localReports.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => navigation.navigate('ReportDetails', { reportId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Local Reports</Text>
            <Text style={styles.emptySubtitle}>
              You do not have any field reports stored on this device.
            </Text>
            <Button
              title="Create Your First Report"
              variant="outline"
              onPress={() => navigation.navigate('CreateReport')}
              style={styles.emptyButton}
            />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Neutral slate background
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  offlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  greenPulse: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  offlineText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsButtonText: {
    fontSize: 18,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  actionsContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  createButton: {
    marginBottom: 10,
    elevation: 2,
  },
  serverButton: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 16,
    marginBottom: 10,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 1,
  },
  statusCountNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pendingBorder: {
    borderTopWidth: 3,
    borderTopColor: '#D97706',
  },
  pendingLabel: {
    color: '#D97706',
  },
  uploadingBorder: {
    borderTopWidth: 3,
    borderTopColor: '#2563EB',
  },
  uploadingLabel: {
    color: '#2563EB',
  },
  uploadedBorder: {
    borderTopWidth: 3,
    borderTopColor: '#059669',
  },
  uploadedLabel: {
    color: '#059669',
  },
  failedBorder: {
    borderTopWidth: 3,
    borderTopColor: '#DC2626',
  },
  failedLabel: {
    color: '#DC2626',
  },
  reportsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reportCountBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
});
