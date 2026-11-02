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
- React Native Image Resizer
- React Native NetInfo

### Backend
- Node.js
- Express.js
- Database: To be implemented

## Local Data Storage

The application uses two types of local storage:

**SQLite Database**
- Report ID
- Description
- Idempotency key
- Image file paths
- Upload status
- Server report ID

**Device File System**
- Compressed image files
- Images organized by report ID

## Report Upload Workflow

1. The inspector creates a report and attaches images.
2. Images are compressed to meet the 5 MB size limit.
3. The report and its image paths are saved locally.
4. The application attempts to upload the report.
5. If the internet is unavailable, the report remains pending.
6. When connectivity returns, the application retries the upload.
7. The backend checks the idempotency key to prevent duplicate reports.
8. After successful upload confirmation, the local report status changes to Uploaded.

## Installation and Setup

### Prerequisites

- Node.js and npm
- JDK 17
- Android Studio
- Android SDK
- Android SDK Platform Tools
- Physical Android device or Android Emulator

### Frontend Setup

Navigate to the frontend directory:

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
