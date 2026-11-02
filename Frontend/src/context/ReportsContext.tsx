import React, { createContext, useContext, useState, useMemo } from 'react';
import { Report, ReportImage, StatusCounts } from '../types/report';

interface ReportsContextType {
  localReports: Report[];
  serverReports: Report[];
  statusCounts: StatusCounts;
  addReport: (description: string, images: ReportImage[]) => void;
  resetLocalReports: () => void;
  serverState: 'success' | 'loading' | 'empty' | 'error';
  setServerState: (state: 'success' | 'loading' | 'empty' | 'error') => void;
  refreshServerReports: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

// Initial mock data for local reports (to demonstrate all status types on Dashboard)
const INITIAL_LOCAL_REPORTS: Report[] = [
  {
    id: 'rep-001',
    description: 'Found crack in foundation wall near section B during routine morning site inspection.',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isLocal: true,
    images: [
      {
        id: 'img-1',
        uri: 'https://picsum.photos/seed/report1/400/300',
        fileName: 'foundation_crack_1.jpg',
      },
      {
        id: 'img-2',
        uri: 'https://picsum.photos/seed/report2/400/300',
        fileName: 'foundation_crack_2.jpg',
      },
    ],
  },
  {
    id: 'rep-002',
    description: 'Electrical conduits installed along corridor 4 awaiting inspector sign-off.',
    status: 'Uploading',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    isLocal: true,
    images: [
      {
        id: 'img-3',
        uri: 'https://picsum.photos/seed/report3/400/300',
        fileName: 'conduit_corridor_4.jpg',
      },
    ],
  },
  {
    id: 'rep-003',
    description: 'Perimeter fencing reinforced following heavy rain warning yesterday evening.',
    status: 'Uploaded',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isLocal: true,
    images: [
      {
        id: 'img-4',
        uri: 'https://picsum.photos/seed/report4/400/300',
        fileName: 'perimeter_fence.jpg',
      },
    ],
  },
  {
    id: 'rep-004',
    description: 'HVAC ducting misaligned on 3rd floor west wing. Upload failed due to temporary timeout.',
    status: 'Failed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 28 hours ago
    isLocal: true,
    images: [
      {
        id: 'img-5',
        uri: 'https://picsum.photos/seed/report5/400/300',
        fileName: 'hvac_ducting_fl3.jpg',
      },
    ],
  },
];

// Initial mock data for server reports (to simulate future backend sync)
const MOCK_SERVER_REPORTS: Report[] = [
  {
    id: 'srv-101',
    description: 'Roof waterproofing membrane layer completed and pressure tested.',
    status: 'Uploaded',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isLocal: false,
    images: [
      {
        id: 'srv-img-1',
        uri: 'https://picsum.photos/seed/roof1/400/300',
        fileName: 'roof_membrane.jpg',
      },
    ],
  },
  {
    id: 'srv-102',
    description: 'Safety railings installed along stairwell C across all five floors.',
    status: 'Uploaded',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    isLocal: false,
    images: [
      {
        id: 'srv-img-2',
        uri: 'https://picsum.photos/seed/stair1/400/300',
        fileName: 'stairwell_railing.jpg',
      },
    ],
  },
  {
    id: 'srv-103',
    description: 'Concrete core testing samples collected by geotechnical engineers.',
    status: 'Uploaded',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    isLocal: false,
    images: [
      {
        id: 'srv-img-3',
        uri: 'https://picsum.photos/seed/concrete1/400/300',
        fileName: 'concrete_samples.jpg',
      },
    ],
  },
];

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localReports, setLocalReports] = useState<Report[]>(INITIAL_LOCAL_REPORTS);
  const [serverReports] = useState<Report[]>(MOCK_SERVER_REPORTS);
  const [serverState, setServerState] = useState<'success' | 'loading' | 'empty' | 'error'>('success');

  // Compute status counts dynamically from local reports
  const statusCounts: StatusCounts = useMemo(() => {
    return localReports.reduce(
      (acc, report) => {
        switch (report.status) {
          case 'Pending':
            acc.pending += 1;
            break;
          case 'Uploading':
            acc.uploading += 1;
            break;
          case 'Uploaded':
            acc.uploaded += 1;
            break;
          case 'Failed':
            acc.failed += 1;
            break;
        }
        return acc;
      },
      { pending: 0, uploading: 0, uploaded: 0, failed: 0 }
    );
  }, [localReports]);

  // Add a newly created report (defaults to Pending status in offline-first mode)
  const addReport = (description: string, images: ReportImage[]) => {
    const newReport: Report = {
      id: `rep-${Date.now()}`,
      description: description.trim(),
      images,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      isLocal: true,
    };

    setLocalReports((prev) => [newReport, ...prev]);
  };

  // Reset local reports (used in Settings)
  const resetLocalReports = () => {
    setLocalReports([]);
  };

  // Simulate pull-to-refresh or backend reload
  const refreshServerReports = () => {
    setServerState('loading');
    setTimeout(() => {
      setServerState('success');
    }, 1000);
  };

  return (
    <ReportsContext.Provider
      value={{
        localReports,
        serverReports,
        statusCounts,
        addReport,
        resetLocalReports,
        serverState,
        setServerState,
        refreshServerReports,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = (): ReportsContextType => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
