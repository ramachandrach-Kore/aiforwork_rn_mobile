# AIforWork React Native Core SDK

A comprehensive React Native SDK for integrating with AIforWork platform, providing socket connectivity, API management, and state management for threads/boards.

## 🚀 Features

- **WebSocket Integration**: Real-time communication with socket.io
- **API Client**: Axios-based HTTP client with automatic device headers
- **State Management**: Zustand-powered stores for threads/boards
- **Device Integration**: Automatic device information headers
- **Thread Management**: Fetch and rename threads/boards
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript Support**: Full TypeScript implementation

## 📋 Prerequisites

- React Native 0.77.0+
- Node.js 18+
- TypeScript 5.0+

## 📦 Installation

```bash
npm install
# or
yarn install
```

### Dependencies

The SDK includes these key dependencies:
- `axios` - HTTP client
- `zustand` - State management
- `socket.io-client` - WebSocket communication
- `react-native-device-info` - Device information
- `immer` - Immutable state updates
- `uuid` - Unique identifier generation

## 🏗️ Architecture

### Core Components

```
src/
├── sdk/
│   └── sdk.config.ts          # SDK configuration
├── restapi/
│   └── axios/
│       ├── axios_base.ts      # Base Axios client
│       └── api_client.ts      # API client implementation
├── socket/
│   └── socket.service.ts      # WebSocket service
├── store/
│   └── threadsStore.ts        # Threads state management
└── utils/
    └── utils.ts               # Utility functions
```

## ⚙️ Configuration

### Initialize the SDK

```typescript
import { initializeSDK } from './src/sdk/sdk.config';

initializeSDK({
  accessToken: 'your-access-token',
  apiUrl: 'https://work-qa.kore.ai/',
  presenceUrl: 'https://work-qa.kore.ai/',
  userId: 'your-user-id'
});
```

## 🔌 API Client

### Features
- Automatic authentication headers
- Device information headers
- Error handling and retry logic
- URL parameter resolution

### Device Headers
Automatically includes device information:
```typescript
{
  channel: "iOS" | "Android",
  version: "1.0.0",
  deviceId: "unique-device-id",
  name: "Apple, iPhone 14",
  tz: "America/New_York",
  manufacturer: "Apple"
}
```

### Usage
```typescript
import ApiClient from './src/restapi/axios/api_client';

const apiClient = ApiClient.getInstance();

// GET request
const data = await apiClient.getCall('/api/endpoint');

// POST request
const result = await apiClient.postCall('/api/endpoint', payload);

// PUT request
const updated = await apiClient.putCall('/api/endpoint', data);
```

## 🧵 Threads Store

Zustand-based state management for threads/boards.

### Store Structure
```typescript
interface ThreadsState {
  boards: any[];
  loading: boolean;
  error: string | null;
  moreAvailable: boolean;
  currentBoard: any;
}
```

### Available Actions
- `fetchThreads()` - Fetch threads/boards list
- `renameThread(boardId, data)` - Rename a specific thread/board
- `clearError()` - Clear error state
- `resetStore()` - Reset to initial state

### Usage Example
#### See App.tsx file

## 🔌 WebSocket Service

Real-time communication service with connection monitoring.

### Features
- Auto-reconnection
- Connection state management
- Message queuing
- Latency monitoring
- Custom event handling

### Usage
```typescript
import socketService from './src/socket/socket.service';

// Connect
socketService.connectToWebSocket();

// Listen for events
socketService.on('connectionStateChange', (data) => {
  console.log('Connection state:', data.newState);
});

// Disconnect
socketService.disconnect();
```

## 🚀 Getting Started

1. **Initialize the SDK** in your App component:
```typescript
componentDidMount() {
  initializeSDK({
    accessToken: 'your-token',
    apiUrl: 'https://work-qa.kore.ai/',
    presenceUrl: 'https://work-qa.kore.ai/',
    userId: 'your-user-id'
  });
}
```

2. **Use the Threads Store**:
```typescript
const { fetchThreads, boards } = useThreadsStore();

useEffect(() => {
  fetchThreads();
}, []);
```

3. **Connect to WebSocket** (optional):
```typescript
socketService.connectToWebSocket();
```

## 🛠️ Development

### Scripts
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Lint code
npm run lint
```

### Project Structure
- `src/sdk/` - SDK configuration and initialization
- `src/restapi/` - HTTP client and API management
- `src/socket/` - WebSocket service
- `src/store/` - State management (Zustand stores)
- `src/utils/` - Utility functions

## 🔧 Error Handling

The SDK includes comprehensive error handling:
- API errors are caught and stored in state
- WebSocket connection errors are handled gracefully
- Device information errors fallback to defaults
- All errors are logged to console for debugging

## 📱 Platform Support

- ✅ iOS
- ✅ Android
- ⚡ React Native 0.77.0+

## 🔗 Related

- [React Native](https://reactnative.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Socket.IO](https://socket.io/)
- [Axios](https://axios-http.com/)

---

**Note**: This SDK is designed for internal AIforWork platform integration. Ensure proper authentication tokens and API endpoints are configured before use.
