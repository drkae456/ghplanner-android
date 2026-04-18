import { useState } from 'react';
import { Link } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { useAuth } from '../../src/providers/AuthProvider';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    setSubmitting(true);
    try {
      await signIn({ email, password });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      Alert.alert('Sign in failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, padding: 24, backgroundColor: '#06080D', justifyContent: 'center' }}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={{ gap: 12 }}>
        <Text style={{ color: '#F8FAFC', fontSize: 32, fontWeight: '700' }}>Welcome back</Text>
        <Text style={{ color: '#94A3B8', fontSize: 16 }}>
          Sign in to sync your GitHub planning workflow on the go.
        </Text>
      </View>

      <View style={{ marginTop: 32, gap: 16 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ color: '#E2E8F0', fontSize: 14, fontWeight: '600' }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#475569"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              borderRadius: 12,
              backgroundColor: '#0F172A',
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: '#F1F5F9',
              borderWidth: 1,
              borderColor: '#1E293B'
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: '#E2E8F0', fontSize: 14, fontWeight: '600' }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#475569"
            secureTextEntry
            style={{
              borderRadius: 12,
              backgroundColor: '#0F172A',
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: '#F1F5F9',
              borderWidth: 1,
              borderColor: '#1E293B'
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSignIn}
        disabled={isSubmitting}
        style={{
          marginTop: 32,
          backgroundColor: isSubmitting ? '#FB923C' : '#F97316',
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: '#0B1120', fontSize: 16, fontWeight: '700' }}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 24, alignItems: 'center', gap: 6 }}>
        <Text style={{ color: '#64748B', fontSize: 13 }}>Need an account?</Text>
        <Link href="https://planner.gh/internal/signup" style={{ color: '#F97316', fontWeight: '600' }}>
          Request access from your administrator
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
