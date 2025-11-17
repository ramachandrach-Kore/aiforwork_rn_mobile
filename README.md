# AIforWork React Native SDK - Sample Application

This is a sample React Native application demonstrating the integration of the **aiforwork-sdk-core** module. The SDK provides comprehensive features for integrating with the AIforWork platform, including socket connectivity, API management, and state management for threads/boards.

## 🚀 Features

- **WebSocket Integration**: Real-time communication with socket.io
- **API Client**: Axios-based HTTP client with automatic device headers
- **State Management**: Zustand-powered stores for threads/boards
- **Device Integration**: Automatic device information headers
- **Thread Management**: Fetch and rename threads/boards
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript Support**: Full TypeScript implementation

## 📋 Prerequisites

- React Native 0.79.0+
- Node.js 18+
- TypeScript 5.0+
- iOS 13.4+ or Android 5.0+

---

## 📦 Integration Steps

Follow these steps to integrate the `aiforwork-sdk-core` module into your React Native application.

### Step 1: Install the Package

Install the `aiforwork-sdk-core` module in your React Native project:

```bash
npm install aiforwork-sdk-core
# or
yarn add aiforwork-sdk-core
```

### Step 2: Install Peer Dependencies

The SDK requires several peer dependencies. Install them in your project:

```bash
npm install axios zustand socket.io-client react-native-device-info immer uuid react-native-get-random-values eventemitter3 lodash nanoid
# or
yarn add axios zustand socket.io-client react-native-device-info immer uuid react-native-get-random-values eventemitter3 lodash nanoid
```

### Step 3: iOS Setup (for iOS apps)

After installing the dependencies, run the following command to install iOS pods:

```bash
cd ios && pod install && cd ..
```

### Step 4: Configure Polyfills (Required for uuid)

For the `uuid` package to work properly in React Native, you need to import `react-native-get-random-values` **before** any other imports.

In your `index.js` or `App.tsx` file, add this import at the very top:

```typescript
import 'react-native-get-random-values';
```

### Step 5: Initialize the SDK

Import and initialize the SDK in your main App component (typically in `App.tsx` or `App.js`):

```typescript
import React, { useEffect } from 'react';
import { initializeSDK } from 'aiforwork-sdk-core';

const App = () => {
  useEffect(() => {
    // Initialize SDK with your configuration
    initializeSDK({
      accessToken: 'your-access-token-here',
      apiUrl: 'https://your-api-url.com/',
      presenceUrl: 'https://your-presence-url.com/',
      userId: 'your-user-id'
    });
  }, []);

  return (
    // Your app components
  );
};

export default App;
```

**Configuration Parameters:**
- `accessToken`: Your authentication token from the AIforWork platform
- `apiUrl`: Base URL for the API endpoints
- `presenceUrl`: URL for presence/WebSocket connections
- `userId`: Unique identifier for the current user

### Step 6: Use WebSocket Service (Optional)

To enable real-time communication, import and use the WebSocket service:

```typescript
import { WebsocketService as socketService } from 'aiforwork-sdk-core';

// Connect to WebSocket
const connectWebSocket = () => {
  socketService.connectToWebSocket();
};

// Listen for connection state changes
socketService.on('connectionStateChange', (data) => {
  console.log('Connection state:', data.newState);
  // Handle: 'connecting', 'connected', 'reconnecting', 'disconnected'
});

// Listen for connection errors
socketService.on('connectionError', (error) => {
  console.error('Connection error:', error);
});

// Disconnect when needed
const disconnectWebSocket = () => {
  socketService.disconnect();
};

// Clean up listeners when component unmounts
useEffect(() => {
  return () => {
    socketService.removeAllListeners('connectionStateChange');
    socketService.removeAllListeners('connectionError');
  };
}, []);
```

### Step 7: Use Threads Store

The SDK provides a Zustand store for managing threads/boards:

```typescript
import { useThreadsStore } from 'aiforwork-sdk-core';

const MyComponent = () => {
  const { boards, loading, error, fetchThreads, renameThread } = useThreadsStore();

  // Fetch threads
  const handleFetchThreads = () => {
    fetchThreads();
  };

  // Rename a thread
  const handleRenameThread = (boardId: string, newName: string) => {
    renameThread(boardId, { name: newName });
  };

  useEffect(() => {
    if (boards.length > 0) {
      console.log('Boards:', boards);
    }
  }, [boards]);

  return (
    // Your UI components
  );
};
```

**Available Store Methods:**
- `fetchThreads()`: Fetch all threads/boards
- `renameThread(boardId, data)`: Rename a specific thread
- `clearError()`: Clear error state
- `resetStore()`: Reset store to initial state

### Step 8: TypeScript Configuration (Optional)

If you're using TypeScript, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true
  }
}
```

---

## 🎯 Complete Integration Example

Here's a complete example showing all features:

```typescript
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  initializeSDK, 
  WebsocketService as socketService, 
  useThreadsStore 
} from 'aiforwork-sdk-core';

const App = () => {
  const { boards, fetchThreads, renameThread } = useThreadsStore();

  useEffect(() => {
    // Step 1: Initialize SDK
    initializeSDK({
      accessToken: 'your-access-token',
      apiUrl: 'https://work-qa.kore.ai/',
      presenceUrl: 'https://work-qa.kore.ai/',
      userId: 'your-user-id'
    });

    // Step 2: Setup WebSocket listeners
    socketService.on('connectionStateChange', (data) => {
      console.log('Connection state:', data.newState);
    });

    socketService.on('connectionError', (error) => {
      console.error('Connection error:', error);
    });

    // Step 3: Connect to WebSocket
    socketService.connectToWebSocket();

    // Cleanup
    return () => {
      socketService.removeAllListeners('connectionStateChange');
      socketService.removeAllListeners('connectionError');
      socketService.disconnect();
    };
  }, []);

  const handleFetchThreads = () => {
    fetchThreads();
  };

  const handleRenameThread = () => {
    if (boards.length > 0) {
      renameThread(boards[0].id, { name: 'New Thread Name' });
    }
  };

  return (
    <View>
      <Text>AIforWork SDK Integration</Text>
      <TouchableOpacity onPress={handleFetchThreads}>
        <Text>Fetch Threads</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleRenameThread}>
        <Text>Rename First Thread</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
```

---

## 📚 API Reference

### SDK Initialization

**`initializeSDK(config: SDKConfig): void`**

Initializes the SDK with required configuration.

```typescript
interface SDKConfig {
  accessToken: string;  // Authentication token
  apiUrl: string;       // Base API URL
  presenceUrl: string;  // WebSocket URL
  userId: string;       // User identifier
}
```

### WebSocket Service

**`WebsocketService`**

Singleton service for managing WebSocket connections.

**Methods:**
- `connectToWebSocket(): void` - Establish WebSocket connection
- `disconnect(): void` - Close WebSocket connection
- `on(event: string, callback: Function): void` - Listen to events
- `removeAllListeners(event: string): void` - Remove event listeners

**Events:**
- `connectionStateChange` - Connection state updates
- `connectionError` - Connection errors
- `connect` - Connection established
- `disconnect` - Connection closed
- `reconnect` - Reconnection successful
- `reconnectionAttempt` - Reconnection attempt
- `highLatency` - High latency detected
- `pingPong` - Ping/pong heartbeat

### Threads Store

**`useThreadsStore()`**

Zustand hook for managing threads/boards state.

**State:**
```typescript
interface ThreadsState {
  boards: any[];           // Array of threads/boards
  loading: boolean;        // Loading state
  error: string | null;    // Error message
  moreAvailable: boolean;  // More data available
  currentBoard: any;       // Currently selected board
}
```

**Actions:**
- `fetchThreads(): Promise<void>` - Fetch all threads
- `renameThread(boardId: string, data: { name: string }): Promise<void>` - Rename thread
- `clearError(): void` - Clear error state
- `resetStore(): void` - Reset to initial state

---

## 🛠️ Troubleshooting

### Common Issues

**1. UUID/Crypto Errors**
- **Error**: `crypto.getRandomValues() not supported`
- **Solution**: Import `react-native-get-random-values` at the top of your entry file

**2. Device Info Errors**
- **Error**: Native module not found
- **Solution**: Run `pod install` for iOS and rebuild your app

**3. Socket Connection Issues**
- **Error**: Connection timeout or failed
- **Solution**: Verify your `presenceUrl` and network connectivity

**4. TypeScript Errors**
- **Error**: Type definitions not found
- **Solution**: Ensure `@types` packages are installed and `tsconfig.json` is configured

---

## 🎓 Sample Application

This repository serves as a complete sample application demonstrating the integration. You can:

1. Clone this repository
2. Run `npm install`
3. Update the configuration in `App.tsx` with your credentials
4. Run the app: `npm run ios` or `npm run android`

### Running the Sample App

```bash
# Install dependencies
npm install

# iOS
npm run ios

# Android
npm run android
```

---

## 📄 Package Dependencies

When you install `aiforwork-sdk-core`, ensure these peer dependencies are also installed:

| Package | Version | Purpose |
|---------|---------|---------|
| `axios` | ^1.9.0 | HTTP client for API requests |
| `zustand` | ^5.0.5 | State management |
| `socket.io-client` | ^2.5.0 | WebSocket communication |
| `react-native-device-info` | ^14.0.4 | Device information |
| `immer` | ^10.1.1 | Immutable state updates |
| `uuid` | ^11.1.0 | Unique identifier generation |
| `react-native-get-random-values` | ^1.11.0 | Polyfill for crypto.getRandomValues |
| `eventemitter3` | ^5.0.1 | Event emitter |
| `lodash` | ^4.17.21 | Utility functions |
| `nanoid` | ^5.1.5 | ID generation |

---

## 🏗️ SDK Architecture

The `aiforwork-sdk-core` module is built with a modular architecture:

### Core Components

- **SDK Initialization**: Central configuration and setup
- **API Client**: Axios-based HTTP client with automatic headers
- **WebSocket Service**: Real-time communication layer
- **State Management**: Zustand stores for application state
- **Device Integration**: Automatic device info injection
- **Utility Functions**: Helper methods for common operations

### Data Flow

```
┌─────────────────┐
│   Your App      │
└────────┬────────┘
         │
         │ initialize
         ▼
┌─────────────────┐
│  aiforwork-sdk  │
│     -core       │
├─────────────────┤
│ • initializeSDK │
│ • WebSocket     │
│ • useThreads    │
│ • API Client    │
└────────┬────────┘
         │
         │ API calls / WebSocket
         ▼
┌─────────────────┐
│  AIforWork      │
│   Platform      │
└─────────────────┘
```

---

## 🔧 Advanced Configuration

### Custom Headers

The SDK automatically adds device-specific headers to all API requests:

```typescript
{
  "channel": "iOS" | "Android",
  "version": "1.0.0",
  "deviceId": "unique-device-id",
  "name": "Device Name",
  "tz": "Timezone",
  "manufacturer": "Device Manufacturer"
}
```

### Error Handling

The SDK provides comprehensive error handling:

```typescript
import { useThreadsStore } from 'aiforwork-sdk-core';

const { error, clearError } = useThreadsStore();

useEffect(() => {
  if (error) {
    console.error('Store error:', error);
    // Handle error in your UI
    clearError();
  }
}, [error]);
```

### WebSocket Events

Available WebSocket events for monitoring:

| Event | Description | Data |
|-------|-------------|------|
| `connectionStateChange` | Connection state changed | `{ oldState, newState }` |
| `connectionError` | Connection error occurred | `{ error, timestamp }` |
| `connect` | Connected successfully | - |
| `disconnect` | Disconnected | `{ reason }` |
| `reconnect` | Reconnected successfully | `{ attempt }` |
| `reconnectionAttempt` | Attempting reconnection | `{ attempt }` |
| `highLatency` | High latency detected | `{ latency, threshold }` |
| `pingPong` | Heartbeat event | `{ latency }` |

---

## 🛠️ Development & Testing

### Running the Sample Application

```bash
# Clone the repository
git clone <repository-url>
cd aiforwork_rn_mobile

# Install dependencies
npm install

# For iOS
cd ios && pod install && cd ..
npm run ios

# For Android
npm run android

# Start Metro bundler separately (optional)
npm start
```

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro bundler |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run lint` | Run ESLint |

### Project Structure (Sample App)

```
aiforwork_rn_mobile/
├── App.tsx                    # Main application file
├── src/
│   └── aiforwork_sdk_ui/     # UI components for SDK
│       ├── sdk_main/         # Main chat interface
│       ├── sdk_components/   # Reusable components
│       ├── sdk_composebar/   # Message input components
│       ├── sdk_templates/    # Template components
│       └── utils/            # Utility functions
├── android/                   # Android native code
├── ios/                       # iOS native code
└── package.json              # Dependencies
```

---

## 📝 Best Practices

### 1. SDK Initialization

Initialize the SDK as early as possible in your app lifecycle:

```typescript
// Good: Initialize in App component's useEffect or componentDidMount
useEffect(() => {
  initializeSDK({ ... });
}, []);

// Avoid: Initializing multiple times or too late
```

### 2. WebSocket Management

Properly manage WebSocket lifecycle:

```typescript
useEffect(() => {
  // Connect
  socketService.connectToWebSocket();
  
  // Setup listeners
  socketService.on('connectionStateChange', handleStateChange);
  
  // Cleanup on unmount
  return () => {
    socketService.removeAllListeners('connectionStateChange');
    socketService.disconnect();
  };
}, []);
```

### 3. State Management

Use the provided Zustand store efficiently:

```typescript
// Good: Select only what you need
const boards = useThreadsStore(state => state.boards);
const fetchThreads = useThreadsStore(state => state.fetchThreads);

// Avoid: Selecting entire store unnecessarily
const store = useThreadsStore(); // Re-renders on any state change
```

### 4. Error Handling

Always handle errors gracefully:

```typescript
const { error, clearError } = useThreadsStore();

useEffect(() => {
  if (error) {
    Alert.alert('Error', error, [
      { text: 'OK', onPress: clearError }
    ]);
  }
}, [error]);
```

---

## 🔒 Security Considerations

1. **Access Tokens**: Never hardcode access tokens. Use secure storage:
   ```typescript
   import { getSecureToken } from './secureStorage';
   
   const token = await getSecureToken();
   initializeSDK({ accessToken: token, ... });
   ```

2. **User IDs**: Ensure user IDs are validated and sanitized

3. **Network Security**: The SDK uses HTTPS for all API calls

4. **Data Privacy**: User data is not stored locally by the SDK

---

## 📱 Platform Support

| Platform | Minimum Version | Status |
|----------|----------------|--------|
| iOS | 13.4+ | ✅ Fully Supported |
| Android | 5.0+ (API 21) | ✅ Fully Supported |
| React Native | 0.79.0+ | ✅ Required |

---

## 📚 Additional Resources

- **React Native Documentation**: [https://reactnative.dev/](https://reactnative.dev/)
- **Zustand Documentation**: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- **Socket.IO Documentation**: [https://socket.io/](https://socket.io/)
- **Axios Documentation**: [https://axios-http.com/](https://axios-http.com/)

---

## 🤝 Support & Contribution

For issues, questions, or contributions related to the `aiforwork-sdk-core` module:

1. Check the sample application in this repository
2. Review the troubleshooting section above
3. Contact the AIforWork development team

---

## 📋 Changelog

### Version 0.0.1 (Current)
- Initial release of aiforwork-sdk-core
- WebSocket integration with connection management
- API client with automatic device headers
- Threads/boards state management
- TypeScript support
- React Native 0.79.6 compatibility

---

## ⚖️ License

This SDK is proprietary software developed for the AIforWork platform. Ensure you have proper authorization before integrating into your application.

---

## 🎯 Quick Start Checklist

Before you start integrating, make sure you have:

- [ ] React Native project set up (v0.79.0+)
- [ ] Node.js 18+ installed
- [ ] Access token from AIforWork platform
- [ ] API URL and Presence URL endpoints
- [ ] User ID for authentication
- [ ] iOS and/or Android development environment configured

Then follow the [Integration Steps](#📦-integration-steps) above to get started!

---

**Need Help?** Refer to the [Troubleshooting](#🛠️-troubleshooting) section or check the complete example in `App.tsx` of this repository.
