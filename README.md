# GHPlanner Lite – Mobile

Expo-managed React Native client for the GHPlanner Lite platform. The Android build targets Google Play Store distribution, while the same codebase can produce iOS and web previews during development.

## Prerequisites

- Node.js 18+
- `npm` or `pnpm`
- Expo CLI (`npm install -g expo-cli`) **optional** – `npx expo` also works
- Android Studio + SDK platform tools for local device/emulator testing

## Getting started

```bash
cd mobile
npm install
npm run start
```

When the Expo Dev Tools window opens, press `a` to launch an Android emulator or scan the QR code using the Expo Go app on a physical device.

### Environment variables

Set the API base URL in `app.config.ts` or via `.env` files consumed by Expo:

```bash
EXPO_PUBLIC_API_URL=https://your-ghplanner-instance/api
```

During local development with the Next.js app running on the same machine, keep
`EXPO_PUBLIC_API_URL` as `http://10.0.2.2:3000/api` to talk to the Android emulator loopback interface.

### Available scripts

- `npm run start` – Launch Expo dev server
- `npm run android` – Build and install the native Android app locally
- `npm run lint` – Run ESLint over the mobile source
- `npm run typecheck` – TypeScript project validation

## Project structure

```
app/                # expo-router navigation structure
assets/             # icons, splash screen, marketing artwork
src/
  api/              # REST clients and response schema validation
  components/       # Themed UI primitives and layout helpers
  config/           # Environment + feature flag handling
  hooks/            # Data fetching + business logic hooks
  providers/        # React context providers (auth, query cache, theme)
  types/            # Module shims, shared type declarations
```

## Linking with the existing backend

The app consumes the same API that powers the web client. To support mobile:

1. Implement JWT-based mobile auth routes under `src/app/api/mobile/auth/` in the Next.js app (login, refresh, revoke).
2. Add `/api/mobile/dashboard` and `/api/mobile/boards` REST handlers that return compact payloads for the dashboard and board lists.
3. Secure endpoints with bearer-token validation and the same role/permission checks used on the web.
4. Reuse shared TypeScript types by extracting them into a `packages/shared` workspace package.

## Production build

Use [Expo Application Services](https://expo.dev/eas) for reproducible Android App Bundle builds:

```bash
npm install -g eas-cli
cd mobile
eas build --platform android
```

Configure `android.package` inside `app.json` before submitting to the Play Store. Upload the resulting `.aab` through the Google Play Console.

## Google Play compliance checklist

- ✅ Minimal permissions (`INTERNET` only) declared in `app.json`
- ✅ Privacy policy URL included in store listing and in-app (add to Profile screen)
- ✅ Data Safety form mappings documented in `/docs/mobile-architecture.md`
- ✅ Custom theming with dark background + accessible contrast
- ✅ Auth tokens stored using `expo-secure-store`
- ☐ Implement biometric unlock toggle (planned)
- ☐ Add crash/analytics telemetry via Sentry Mobile SDK
- ☐ Provide account deletion flow via in-app deep link to the web dashboard

Keep the checklist updated as features ship to ensure ongoing Play Store approval.
