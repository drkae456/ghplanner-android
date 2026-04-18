import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../../src/providers/AuthProvider';
import { env } from '../../src/config/env';

function DashboardSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ color: '#CBD5F5', fontSize: 18, fontWeight: '700', marginBottom: 12 }}>{title}</Text>
      <View
        style={{
          backgroundColor: '#0F172A',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#1E293B',
          padding: 20,
          gap: 12
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const { tokens } = useAuth();

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['mobile-dashboard'],
    queryFn: async () => {
      const res = await fetch(`${env.apiBaseUrl}/mobile/dashboard`, {
        headers: {
          Authorization: `Bearer ${tokens?.accessToken ?? ''}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to load dashboard');
      }

      return res.json() as Promise<{
        enterprises: number;
        projects: number;
        activeTasks: number;
        recentActivity: Array<{ id: string; message: string; time: string }>;
      }>;
    },
    enabled: !!tokens?.accessToken
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 180_000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 24, paddingBottom: 64, backgroundColor: '#06080D', minHeight: '100%' }}
      refreshControl={
        <></>
      }
    >
      <Text style={{ color: '#F8FAFC', fontSize: 28, fontWeight: '700', marginBottom: 16 }}>
        Your enterprise snapshot
      </Text>

      <DashboardSection title="Key metrics">
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {([
            { label: 'Companies', value: data?.enterprises ?? 0 },
            { label: 'Projects', value: data?.projects ?? 0 },
            { label: 'Active tasks', value: data?.activeTasks ?? 0 }
          ] as Array<{ label: string; value: number }>).map((item) => (
            <View
              key={item.label}
              style={{
                flex: 1,
                backgroundColor: '#131C2F',
                borderRadius: 12,
                paddingVertical: 16,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#F97316', fontSize: 24, fontWeight: '700' }}>{item.value}</Text>
              <Text style={{ color: '#94A3B8', fontSize: 14 }}>{item.label}</Text>
            </View>
          ))}
        </View>
      </DashboardSection>

      <DashboardSection title="Recent activity">
        <View style={{ gap: 12 }}>
          {data?.recentActivity?.length ? (
            data.recentActivity.map((item: { id: string; message: string; time: string }) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  backgroundColor: '#131C2F',
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#1E293B'
                }}
              >
                <Text style={{ color: '#E2E8F0', flex: 1, paddingRight: 16 }}>{item.message}</Text>
                <Text style={{ color: '#64748B', fontSize: 12 }}>{item.time}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#64748B', fontSize: 14 }}>
              {isFetching ? 'Refreshing activity…' : 'No recent updates. Pull to refresh.'}
            </Text>
          )}
        </View>
      </DashboardSection>
    </ScrollView>
  );
}
