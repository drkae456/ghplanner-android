import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from '../../src/providers/AuthProvider';

export default function ProfileScreen() {
  const { signOut, tokens } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Sign out failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#06080D', minHeight: '100%' }}>
      <Text style={{ color: '#F8FAFC', fontSize: 26, fontWeight: '700', marginBottom: 12 }}>Profile</Text>
      <Text style={{ color: '#94A3B8', fontSize: 16 }}>
        Manage your session and security preferences. More personalization controls will arrive soon.
      </Text>

      <View
        style={{
          marginTop: 24,
          backgroundColor: '#0F172A',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#1E293B',
          padding: 24,
          gap: 8
        }}
      >
        <Text style={{ color: '#CBD5F5', fontSize: 15 }}>Access token</Text>
        <Text style={{ color: '#64748B', fontSize: 13 }} numberOfLines={1}>
          {tokens?.accessToken ?? 'No active session'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        style={{
          marginTop: 32,
          backgroundColor: '#EF4444',
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#0B1120', fontSize: 16, fontWeight: '700' }}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
