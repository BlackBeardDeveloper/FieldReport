export type ReportStatus = 'Pending' | 'Uploading' | 'Uploaded' | 'Failed';

export interface ReportImage {
  id: string;
  uri: string;
  fileName?: string;
  fileSize?: number;
}

export interface Report {
  id: string;
  description: string;
  images: ReportImage[];
  status: ReportStatus;
  createdAt: string; // ISO string format
  isLocal: boolean;
}

export interface StatusCounts {
  pending: number;
  uploading: number;
  uploaded: number;
  failed: number;
}

export type RootStackParamList = {
  Dashboard: undefined;
  CreateReport: undefined;
  ReportDetails: { reportId: string };
  ServerReports: undefined;
  Settings: undefined;
};
