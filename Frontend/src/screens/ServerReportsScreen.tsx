import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/report';
import { useReports } from '../context/ReportsContext';
import { ReportCard } from '../components/ReportCard';
import { Button } from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'ServerReports'>;

export const ServerReportsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    serverReports,
    serverState,
    setServerState,
    refreshServerReports,
  } = useReports();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Backend Integration Info Bar */}
      <View style={styles.backendNotice}>
        <Text style={styles.backendNoticeTitle}>
          ☁️ Server Sync Module (Backend Ready)
        </Text>
        <Text style={styles.backendNoticeBody}>
          This screen connects to the future backend API. Use the simulator pills below to inspect all UI states.
        </Text>

        {/* Demo State Switcher for Technical Evaluation */}
        <View style={styles.stateSelectorRow}>
          <Text style={styles.stateSelectorLabel}>Simulate State:</Text>
          <View style={styles.pillsContainer}>
            <TouchableOpacity
              style={[
                styles.statePill,
                serverState === 'success' && styles.activePill,
              ]}
              onPress={() => setServerState('success')}
            >
              <Text
                style={[
                  styles.pillText,
                  serverState === 'success' && styles.activePillText,
                ]}
              >
                Normal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statePill,
                serverState === 'loading' && styles.activePill,
              ]}
              onPress={() => setServerState('loading')}
            >
              <Text
                style={[
                  styles.pillText,
                  serverState === 'loading' && styles.activePillText,
                ]}
              >
                Loading
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statePill,
                serverState === 'empty' && styles.activePill,
              ]}
              onPress={() => setServerState('empty')}
            >
              <Text
                style={[
                  styles.pillText,
                  serverState === 'empty' && styles.activePillText,
                ]}
              >
                Empty
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statePill,
                serverState === 'error' && styles.activePill,
              ]}
              onPress={() => setServerState('error')}
            >
              <Text
                style={[
                  styles.pillText,
                  serverState === 'error' && styles.activePillText,
                ]}
              >
                Error
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Screen Body based on State */}
      {serverState === 'loading' && (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Fetching reports from server...</Text>
          <Text style={styles.endpointText}>GET /api/v1/reports</Text>
        </View>
      )}

      {serverState === 'error' && (
        <View style={styles.centeredContainer}>
          <View style={styles.errorIconCircle}>
            <Text style={styles.errorIconText}>⚠️</Text>
          </View>
          <Text style={styles.errorTitle}>Server Connection Error</Text>
          <Text style={styles.errorMessage}>
            Failed to connect to backend service. Please check your internet connection or verify the server is running.
          </Text>
          <Button
            title="Retry Connection"
            variant="primary"
            onPress={() => refreshServerReports()}
            style={styles.retryButton}
          />
        </View>
      )}

      {serverState === 'empty' && (
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyIcon}>☁️</Text>
          <Text style={styles.emptyTitle}>No Server Reports Found</Text>
          <Text style={styles.emptyMessage}>
            No reports have been synchronized to the cloud database yet.
          </Text>
          <Button
            title="Refresh List"
            variant="outline"
            onPress={() => setServerState('success')}
            style={styles.retryButton}
          />
        </View>
      )}

      {serverState === 'success' && (
        <FlatList
          data={serverReports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refreshServerReports}
              colors={['#1E40AF']}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeaderRow}>
              <Text style={styles.listHeaderText}>Synced Reports on Cloud</Text>
              <Text style={styles.listHeaderBadge}>
                {serverReports.length} {serverReports.length === 1 ? 'report' : 'reports'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ReportCard
              report={item}
              onPress={() => navigation.navigate('ReportDetails', { reportId: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backendNotice: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  backendNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 2,
  },
  backendNoticeBody: {
    fontSize: 11,
    color: '#3B82F6',
    lineHeight: 16,
    marginBottom: 8,
  },
  stateSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stateSelectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E40AF',
    marginRight: 6,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginRight: 6,
    marginVertical: 2,
  },
  activePill: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  activePillText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  listHeaderBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  endpointText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#94A3B8',
    marginTop: 4,
  },
  errorIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIconText: {
    fontSize: 28,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: 24,
  },
});
