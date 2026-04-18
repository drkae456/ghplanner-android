import { ScrollView, Text, View } from 'react-native';

export default function BoardsScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 24, backgroundColor: '#06080D', minHeight: '100%' }}>
      <Text style={{ color: '#F8FAFC', fontSize: 26, fontWeight: '700', marginBottom: 12 }}>Boards</Text>
      <Text style={{ color: '#94A3B8', fontSize: 16 }}>
        Mobile Kanban is under construction. You will soon be able to manage columns, drag tasks, and review
        PR-linked updates from here. For now, use the desktop experience for full functionality.
      </Text>
      <View
        style={{
          marginTop: 24,
          backgroundColor: '#0F172A',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#1E293B',
          padding: 24,
          gap: 12
        }}
      >
        <Text style={{ color: '#E2E8F0', fontSize: 18, fontWeight: '600' }}>Upcoming milestones</Text>
        <View style={{ gap: 8 }}>
          {['Board list synced with enterprises', 'Task cards with PR status', 'Drag & drop via Reanimated'].map((item) => (
            <View key={item} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 8, height: 8, borderRadius: 999, backgroundColor: '#F97316' }} />
              <Text style={{ color: '#CBD5F5', fontSize: 15 }}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
