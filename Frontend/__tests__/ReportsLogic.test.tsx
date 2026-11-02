import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { ReportsProvider, useReports } from '../src/context/ReportsContext';
import { StatusBadge } from '../src/components/StatusBadge';
import { ReportCard } from '../src/components/ReportCard';
import { Report } from '../src/types/report';

// Test consumer to inspect context values
const TestConsumer: React.FC<{
  onContext: (ctx: ReturnType<typeof useReports>) => void;
}> = ({ onContext }) => {
  const ctx = useReports();
  React.useEffect(() => {
    onContext(ctx);
  }, [ctx, onContext]);
  return <Text>Consumer</Text>;
};

describe('Reports Logic and Components', () => {
  test('ReportsContext initializes with mock reports and correct status counts', async () => {
    let capturedContext: ReturnType<typeof useReports> | undefined;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <ReportsProvider>
          <TestConsumer onContext={(ctx) => (capturedContext = ctx)} />
        </ReportsProvider>
      );
    });

    expect(capturedContext).toBeDefined();
    expect(capturedContext?.localReports.length).toBeGreaterThan(0);
    expect(capturedContext?.statusCounts.pending).toBeGreaterThanOrEqual(1);
    expect(capturedContext?.statusCounts.uploading).toBeGreaterThanOrEqual(1);
    expect(capturedContext?.statusCounts.uploaded).toBeGreaterThanOrEqual(1);
    expect(capturedContext?.statusCounts.failed).toBeGreaterThanOrEqual(1);
  });

  test('addReport adds a new report to the top with Pending status', async () => {
    let capturedContext: ReturnType<typeof useReports> | undefined;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <ReportsProvider>
          <TestConsumer onContext={(ctx) => (capturedContext = ctx)} />
        </ReportsProvider>
      );
    });

    const initialCount = capturedContext?.localReports.length || 0;
    const initialPending = capturedContext?.statusCounts.pending || 0;

    await ReactTestRenderer.act(async () => {
      capturedContext?.addReport('New Inspection Observation', [
        { id: 'test-img-1', uri: 'file://test1.jpg', fileName: 'test1.jpg' },
      ]);
    });

    expect(capturedContext?.localReports.length).toBe(initialCount + 1);
    expect(capturedContext?.localReports[0].description).toBe('New Inspection Observation');
    expect(capturedContext?.localReports[0].status).toBe('Pending');
    expect(capturedContext?.statusCounts.pending).toBe(initialPending + 1);
  });

  test('resetLocalReports clears all local reports', async () => {
    let capturedContext: ReturnType<typeof useReports> | undefined;

    await ReactTestRenderer.act(async () => {
      ReactTestRenderer.create(
        <ReportsProvider>
          <TestConsumer onContext={(ctx) => (capturedContext = ctx)} />
        </ReportsProvider>
      );
    });

    await ReactTestRenderer.act(async () => {
      capturedContext?.resetLocalReports();
    });

    expect(capturedContext?.localReports.length).toBe(0);
    expect(capturedContext?.statusCounts.pending).toBe(0);
    expect(capturedContext?.statusCounts.uploading).toBe(0);
    expect(capturedContext?.statusCounts.uploaded).toBe(0);
    expect(capturedContext?.statusCounts.failed).toBe(0);
  });

  test('StatusBadge renders without crashing for all statuses', async () => {
    const statuses = ['Pending', 'Uploading', 'Uploaded', 'Failed'] as const;

    for (const status of statuses) {
      await ReactTestRenderer.act(async () => {
        const tree = ReactTestRenderer.create(<StatusBadge status={status} />).toJSON();
        expect(tree).toBeDefined();
      });
    }
  });

  test('ReportCard renders description and image count', async () => {
    const mockReport: Report = {
      id: 'rep-test',
      description: 'Test Report Description for Unit Testing',
      images: [
        { id: '1', uri: 'https://example.com/1.jpg' },
        { id: '2', uri: 'https://example.com/2.jpg' },
      ],
      status: 'Pending',
      createdAt: new Date().toISOString(),
      isLocal: true,
    };

    let component: ReactTestRenderer.ReactTestRenderer | undefined;
    await ReactTestRenderer.act(async () => {
      component = ReactTestRenderer.create(
        <ReportCard report={mockReport} onPress={() => {}} />
      );
    });

    const stringified = JSON.stringify(component?.toJSON());
    expect(stringified).toContain('Test Report Description for Unit Testing');
    expect(stringified).toContain('photos');
  });
});
