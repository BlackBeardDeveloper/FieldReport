# Field Reports – Offline-First Reporting App

Field Reports is a React Native mobile application designed to help field inspectors create and submit reports with descriptions and photos, even when an internet connection is unavailable.

The application follows an offline-first approach, allowing reports to be stored locally on the device and uploaded to a backend server when an internet connection becomes available.

## Project Structure

```text
FieldReports/
│
├── Frontend/
│   └── React Native Application
│
└── Backend/
    └── Backend API (Coming Soon)
```

## Features

### Report Management
- Create reports with a description.
- Attach 1–5 images from the camera or gallery.
- View report details and attached images.
- Track report upload status.

### Offline Support
- Save reports locally when the internet is unavailable.
- Store report information using SQLite.
- Store image files in the device's internal storage.
- Automatically retry pending uploads when connectivity returns.

### Image Handling
- Compress images before uploading.
- Ensure each image is no larger than 5 MB.
- Maintain usable image quality.
- Store compressed images locally until upload completion.

### Upload Management
- Track Pending, Uploading, and Uploaded report statuses.
- Retry interrupted uploads.
- Use idempotency keys to prevent duplicate reports.
- Confirm successful uploads through backend responses.

### Server Reports
- View reports retrieved from the backend.
- Display server report information separately from locally stored reports.

## Technology Stack

### Frontend
- React Native CLI
- TypeScript
- React Navigation
- SQLite
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

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the Metro development server:

```bash
npm start
```

Open another terminal and run the Android application:

```bash
npm run android
```

## Project Status

**Frontend:** Under development.

**Backend:** Planned.

The project is being developed in stages, starting with the mobile user interface, followed by local storage, image processing, backend integration, and reliable offline synchronization.

## Future Improvements

- Reliable background uploads.
- Automatic retry with appropriate backoff.
- Handling interrupted and partially completed uploads.
- Backend integration and server-side report management.
- Improved error handling for unstable network connections.

---

**Field Reports** – A practical offline-first solution for field inspection and report management.
