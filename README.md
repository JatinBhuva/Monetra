This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `index.js` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

# Supabase Setup

Monetra now includes a shared Supabase client for auth, database, storage, or edge-function calls.

## Environment Variables

Create a `.env` file in the project root with:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

The app reads these values through `react-native-config`, and startup will fail early if either value is missing.

## Client Location

Use the exported singleton from `src/services/supabase.ts`:

```ts
import { supabase } from './services';
```

The client is configured for React Native with:

- `AsyncStorage` session persistence
- token auto-refresh
- URL session detection disabled

## Native Install Step

After pulling these changes or updating dependencies, run:

```sh
cd ios
bundle exec pod install
cd ..
```

## Example Query

```ts
const { data, error } = await supabase.from('transactions').select('*');
```

## Login Setup

Create a Supabase Auth user in the Authentication dashboard with:

- email: `00000001@monetra.app`
- password: `1234`

The app still shows only `user id` and `password`, but it now maps the entered user ID to that internal email format and signs in through Supabase Auth.

There is no per-user SQL step anymore. Once the auth user exists, the app handles the rest.

## Per-User Sync Setup

To sync local SQLite data with Supabase for the logged-in user, also run [app_sync_setup.sql](/Users/jatinbhuva/Desktop/Product/Monetra/supabase/app_sync_setup.sql) in the Supabase SQL Editor.

That script creates:

- `public.app_categories`
- `public.app_transactions`
- `public.app_preferences`
- `public.app_investments`

Current sync behavior:

- login restores the current user's remote snapshot into local SQLite
- local transaction/category/preference/investment writes are mirrored to Supabase for the active user
- switching users resets the local SQLite snapshot before pulling the other user's data
- if the device is offline, failed cloud writes are queued locally and retried automatically when the network returns

The sync tables now use authenticated-only row-level security policies based on `auth.uid()`.

## Cleanup Old Prototype Setup

If you used the earlier prototype auth flow, run [cleanup_old_setup.sql](/Users/jatinbhuva/Desktop/Product/Monetra/supabase/cleanup_old_setup.sql) once to remove obsolete objects:

- `public.users`
- `public.user_profiles`
- `public.verify_app_user(text, text)`

# Local Database Migrations

Monetra stores transactions locally in SQLite. To safely upgrade the app without losing user data, we version the database schema and run migrations at startup.

## How It Works

We use SQLite’s `PRAGMA user_version` to track schema versions in `src/data/db/sqlite.ts`. On startup:

1. Read the current `user_version`.
2. Run any migration steps needed to move forward.
3. Update `user_version` to the latest schema version.

## Adding a New Migration

When you change the schema:

1. Increment `SCHEMA_VERSION` in `src/data/db/sqlite.ts`.
2. Add a new `if (currentVersion < X)` block inside `migrate()` with the SQL changes.
3. Do not remove old migration steps — they are needed for users upgrading from older app versions.

### Example

```sql
ALTER TABLE transactions ADD COLUMN note TEXT;
```

## Upgrade Checklist (APK / App Store)

- Keep the same applicationId / bundle ID.
- Do not uninstall the app on the device.
- Ship the new APK/IPA — the app will upgrade in place and run migrations on first launch.
