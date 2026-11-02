# Field Reports

Field Reports is a React Native mobile app prototype for field inspectors to create reports with written observations and photos. The repository currently contains the mobile frontend; a backend service is not yet included.

## Current features

- Create reports with a description and photos from the camera or photo library.
- View report details, attached images, and report status.
- Browse local and server report screens.
- View report status summaries for Pending, Uploading, Uploaded, and Failed reports.

**Prototype status:** Report data and server reports are currently held in in-memory mock data. Reports do not persist across app restarts, and there is no backend integration or automatic upload/synchronization yet. The offline-first workflow is a planned direction, not an implemented feature.

## Repository structure

```text
FieldReports/
├── Frontend/          React Native application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── theme/
│   │   ├── types/
│   │   └── utils/
│   ├── android/       Android native project
│   ├── ios/           iOS native project
│   └── __tests__/     Frontend tests
└── README.md
```

## Technology

- React Native CLI and TypeScript
- React Navigation
- React Native Image Picker
- React Native SVG and Lucide icons

## Getting started

### Requirements

- Node.js 22.11 or newer and npm
- React Native CLI Envirment Setup
- Android Studio, Android SDK, and a device or emulator for Android development
- macOS with Xcode for iOS development

### Install dependencies

From the repository root:

```sh
cd Frontend
npm install
```

### Run the app

Start Metro:

```sh
npm start
```

In another terminal, run the app on Android:

```sh
npm run android
```

For iOS, install the CocoaPods dependencies on macOS and launch the app:

```sh
cd ios
bundle install
bundle exec pod install
cd ..
npm run ios
```

### Run checks

From `Frontend/`:

```sh
npm test -- --runInBand
npm run lint
npx tsc --noEmit
```

## Planned work

- Persist reports and photos on the device.
- Connect to a backend for report submission and retrieval.
- Add reliable offline upload queuing, retries, and synchronization.
- Improve automated test coverage and build validation.
