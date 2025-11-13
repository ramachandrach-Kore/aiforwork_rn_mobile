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

### aiforwork_sdk_core - Data Layer Architecture

```
src/aiforwork_sdk_core/
├── sdk.config.ts              # SDK configuration & initialization
├── restapi/
│   └── axios/
│       ├── axios_base.ts      # Base Axios client with auto-auth
│       └── api_client.ts      # API client implementation
├── socket/
│   └── socket.service.ts      # WebSocket service for real-time
├── store/
│   ├── threadsStore.ts        # Threads/Boards state management
│   ├── messagesStore.ts       # Messages state management
│   ├── agentsStore.ts         # Agents state management
│   └── middleware/            # Clean API separation layer
│       ├── messageMiddleware.ts     # Message creation & validation
│       ├── apiMessageMiddleware.ts  # Message API operations
│       ├── apiAgentsMiddleware.ts   # Agents API operations
│       └── README.md               # Middleware documentation
└── utils/
    ├── MessageStates.tsx      # Message state definitions
    └── utils.ts               # Utility functions
```

### aiforwork_sdk_ui - UI Components

```
src/aiforwork_sdk_ui/
├── sdk_main/                  # Main chat components
├── sdk_components/            # Reusable UI components
├── sdk_templates/             # Template components
└── sdk_composebar/            # Message compose components
```

## ⚙️ Configuration

### Initialize the SDK

The SDK requires initialization before any other operations. Initialize in your App component:

```typescript
import { initializeSDK, isSDKInitialized, getSDKConfig } from './src/aiforwork_sdk_core/sdk.config';

// Initialize SDK with required configuration
initializeSDK({
  accessToken: 'your-access-token',
  apiUrl: 'https://work-qa.kore.ai/',
  presenceUrl: 'https://work-qa.kore.ai/',
  userId: 'your-user-id'
});

// Check if SDK is initialized
if (isSDKInitialized()) {
  console.log('SDK initialized successfully');
  const config = getSDKConfig(); // Get current configuration
}
```

### Configuration Interface
```typescript
interface SDKConfig {
  accessToken: string;    // Authentication token
  apiUrl: string;        // Base API URL
  presenceUrl: string;   // WebSocket presence URL
  userId: string;        // Current user ID
}
```

## 🔌 API Client (`aiforwork_sdk_core/restapi`)

### Features
- **Singleton Pattern**: Single instance across the app
- **Automatic Authentication**: Headers injected automatically
- **Device Information**: Auto-included device headers
- **Error Handling**: Comprehensive error handling
- **URL Parameter Resolution**: Dynamic parameter replacement

### Device Headers
Automatically includes device information in all requests:
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
import ApiClient from './src/aiforwork_sdk_core/restapi/axios/api_client';

// Get singleton instance
const apiClient = ApiClient.getInstance();

// GET request - returns data directly
const data = await apiClient.getCall<ResponseType>('/api/endpoint');

// POST request - returns data directly
const result = await apiClient.postCall<ResponseType>('/api/endpoint', payload);

// PUT request - returns data directly
const updated = await apiClient.putCall<ResponseType>('/api/endpoint', data);
```

### Error Handling
The API client automatically handles common scenarios:
- **401 Unauthorized**: Clears stored credentials
- **Service Errors**: Logs and propagates errors
- **Network Issues**: Standard error propagation

## 📦 Data Stores (`aiforwork_sdk_core/store`)

### 🧵 Threads Store

Zustand-based state management for threads/boards with automatic API integration.

#### Store Structure
```typescript
interface ThreadsState {
  boards: any[];           // List of threads/boards
  loading: boolean;        // Loading state
  error: string | null;    // Error message
  moreAvailable: boolean;  // Pagination flag
  currentBoard: any;       // Selected board
}

interface ThreadsActions {
  fetchThreads: () => Promise<void>;                              // Fetch boards list
  renameThread: (boardId: string, newName: RenameData) => Promise<void>; // Rename board
  clearError: () => void;                                         // Clear error state
  resetStore: () => void;                                         // Reset to initial state
}
```

#### Usage Example
```typescript
import { useThreadsStore } from './src/aiforwork_sdk_core/store/threadsStore';

function ThreadsComponent() {
  const { 
    boards, 
    loading, 
    error, 
    fetchThreads, 
    renameThread, 
    clearError 
  } = useThreadsStore();

  useEffect(() => {
    fetchThreads(); // Fetch threads on mount
  }, []);

  const handleRename = async (boardId: string, newName: string) => {
    try {
      await renameThread(boardId, { name: newName });
      console.log('Thread renamed successfully');
    } catch (error) {
      console.error('Failed to rename thread:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onClear={clearError} />;

  return (
    <View>
      {boards.map(board => (
        <ThreadItem 
          key={board.id} 
          board={board} 
          onRename={(newName) => handleRename(board.id, newName)}
        />
      ))}
    </View>
  );
}
```

### 💬 Messages Store

Real-time message management with WebSocket integration and middleware pattern.

#### Store Structure
```typescript
interface MessagesState {
  messages: any[];         // List of messages
  loading: boolean;        // Loading state
  moreAvailable: boolean;  // Pagination flag
  currentBoard: any;       // Current board context
  recentMessage: any;      // Latest message
  failedMessage: number;   // Failed message count
}

interface MessagesActions {
  sendMessage: (messageObject: any) => Promise<void>;            // Send new message
  updateMessageStatus: (payload: any, params: any) => Promise<void>; // Update message
  fetchMessages: () => Promise<void>;                            // Fetch message history
  listenSocket: () => void;                                      // Start socket listeners
  resetStore: () => void;                                        // Reset store
}
```

#### Usage Example
```typescript
import { useMessagesStore } from './src/aiforwork_sdk_core/store/messagesStore';
import { MessageState } from './src/aiforwork_sdk_core/utils/MessageStates';

function ChatComponent() {
  const { 
    messages, 
    loading, 
    recentMessage,
    sendMessage, 
    listenSocket,
    updateMessageStatus 
  } = useMessagesStore();

  useEffect(() => {
    listenSocket(); // Start real-time listeners
  }, []);

  const handleSendMessage = async (question: string) => {
    try {
      await sendMessage({
        question: question.trim(),
        boardId: 'board-123' // Optional board context
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleUpdateMessage = async (messageId: string, status: any) => {
    try {
      await updateMessageStatus(
        { status }, 
        { messageId, boardId: 'board-123' }
      );
    } catch (error) {
      console.error('Failed to update message:', error);
    }
  };

  return (
    <View>
      <ScrollView>
        {messages.map(message => (
          <MessageBubble 
            key={message.messageId || message.reqId}
            message={message}
            onUpdate={(status) => handleUpdateMessage(message.messageId, status)}
          />
        ))}
      </ScrollView>
      <ComposeBar onSend={handleSendMessage} />
    </View>
  );
}
```

### 🤖 Agents Store

AI agents management with connection handling and provider integrations.

#### Store Structure
```typescript
interface AgentsState {
  agentsLoading: boolean;                    // Agents loading state
  agentsData: any;                          // Organized agents data
  selectedAgent: any;                       // Currently selected agent
  apiAgentsConnectionsLoading: boolean;     // Connections loading
  apiAgentsConnectionsData: any;           // Provider connections
  addingApiAgentConnection: boolean;       // Adding connection state
  connectionAdded: any;                    // Connection result
  connectionAddError: string | null;       // Connection error
}

interface AgentsActions {
  getAgents: () => Promise<void>;                                        // Fetch all agents
  setLocalAgentSelection: (agent: any) => Promise<void>;                // Select agent
  removeLocalAgentSelection: () => Promise<void>;                       // Deselect agent
  getApiAgentsConnectionsByProvider: (provider: string) => Promise<void>; // Get connections
  addApiAgentConnection: (payload: any) => Promise<void>;               // Add connection
  cleanApiAgentConnection: () => Promise<void>;                         // Clean connection state
}
```

#### Usage Example
```typescript
import { useAgentsStore } from './src/aiforwork_sdk_core/store/agentsStore';

function AgentsComponent() {
  const { 
    agentsData,
    agentsLoading,
    selectedAgent,
    connectionAddError,
    getAgents,
    setLocalAgentSelection,
    addApiAgentConnection,
    getApiAgentsConnectionsByProvider 
  } = useAgentsStore();

  useEffect(() => {
    getAgents(); // Load agents on mount
  }, []);

  const handleSelectAgent = async (agent: any) => {
    await setLocalAgentSelection(agent);
    console.log('Selected agent:', agent.name);
  };

  const handleAddConnection = async (provider: string, credentials: any) => {
    try {
      await addApiAgentConnection({
        provider,
        payload: credentials,
        isReconnect: false
      });
      console.log('Connection added successfully');
    } catch (error) {
      console.error('Failed to add connection:', connectionAddError);
    }
  };

  if (agentsLoading) return <LoadingSpinner />;

  return (
    <View>
      {/* Recent Agents */}
      <AgentsList 
        title="Recent" 
        agents={agentsData?.recents} 
        onSelect={handleSelectAgent}
      />
      
      {/* All Agents */}
      <AgentsList 
        title="All Agents" 
        agents={agentsData?.agents} 
        onSelect={handleSelectAgent}
      />
      
      {/* Agentic Apps */}
      <AgentsList 
        title="Agentic Apps" 
        agents={agentsData?.agenticApps} 
        onSelect={handleSelectAgent}
      />
      
      {/* Selected Agent */}
      {selectedAgent && (
        <SelectedAgentCard 
          agent={selectedAgent}
          onAddConnection={handleAddConnection}
        />
      )}
    </View>
  );
}
```

## 🏗️ Middleware Architecture (`aiforwork_sdk_core/store/middleware`)

The SDK uses a clean middleware pattern to separate business logic from state management.

### 🔄 Message Middleware

Handles message creation, validation, and state management.

#### Features
- **Message Creation**: Standardized message object creation
- **State Management**: Message state transitions
- **Validation**: Input validation and sanitization

#### Usage
```typescript
import { createMessageMiddleware, MessageMiddleware } from './src/aiforwork_sdk_core/store/middleware/messageMiddleware';
import { MessageState } from './src/aiforwork_sdk_core/utils/MessageStates';

const messageMiddleware: MessageMiddleware = createMessageMiddleware();

// Create a new message
const message = messageMiddleware.createMessage({
  question: "What is AI?",
  boardId: "board-123" // Optional
});

// Update message state
messageMiddleware.updateMessageState(message.reqId, MessageState.SENT);
```

#### Message States
```typescript
enum MessageState {
  SENDING = 'SENDING',     // Message being sent
  SENT = 'SENT',          // Successfully sent
  FAILED = 'FAILED',      // Send failed
  DELIVERED = 'DELIVERED', // Delivered to server
  READ = 'READ',          // Read by recipient
  PENDING = 'PENDING'     // Waiting to send
}
```

### 🌐 API Message Middleware

Handles all message-related API communications.

#### Features
- **Send Messages**: POST messages to API
- **Update Status**: PUT message status updates
- **Error Handling**: Automatic error handling and retries

#### Usage
```typescript
import { createApiMessageMiddleware } from './src/aiforwork_sdk_core/store/middleware/apiMessageMiddleware';

const apiMiddleware = createApiMessageMiddleware();

// Send message to API
try {
  const response = await apiMiddleware.sendMessageToAPI(message);
  console.log('Message sent:', response);
} catch (error) {
  console.error('API Error:', error);
}

// Update message status
try {
  await apiMiddleware.updateMessageStatus(
    { status: 'completed' },
    { messageId: 'msg-123', boardId: 'board-123' }
  );
} catch (error) {
  console.error('Update failed:', error);
}
```

### 🤖 API Agents Middleware

Handles agent-related API operations with provider integrations.

#### Features
- **Agent Management**: Fetch and organize agents
- **Connection Handling**: Manage provider connections
- **Error Handling**: Comprehensive error scenarios

#### Usage
```typescript
import { apiAgentsMiddleware } from './src/aiforwork_sdk_core/store/middleware/apiAgentsMiddleware';

const agentsMiddleware = apiAgentsMiddleware();

// Get all agents
const agents = await agentsMiddleware.getAgents();

// Get connections by provider
const connections = await agentsMiddleware.getApiAgentsConnectionsByProvider('openai');

// Add new connection
const newConnection = await agentsMiddleware.addApiAgentConnection({
  provider: 'openai',
  payload: { apiKey: 'your-api-key' },
  isReconnect: false
});
```

### 🔧 Middleware Integration Pattern

The stores integrate middleware for clean separation of concerns:

```typescript
// In messagesStore.ts
const messageMiddleware = createMessageMiddleware();
const apiMiddleware = createApiMessageMiddleware();

sendMessage: async (messageObject: any) => {
  // 1. Create message using middleware
  const message = messageMiddleware.createMessage(messageObject);
  
  // 2. Update store state
  set((state) => {
    state.messages.push(message);
  });
  
  try {
    // 3. Send via API middleware
    const response = await apiMiddleware.sendMessageToAPI(message);
    
    // 4. Update success state
    set((state) => {
      const messageIndex = state.messages.findIndex(m => m.reqId === message.reqId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...response };
        state.messages[messageIndex].messageState = MessageState.SENT;
      }
    });
  } catch (error) {
    // 5. Handle errors
    set((state) => {
      const messageIndex = state.messages.findIndex(m => m.reqId === message.reqId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].messageState = MessageState.FAILED;
      }
    });
  }
}
```

## 🔌 WebSocket Service (`aiforwork_sdk_core/socket`)

Real-time communication service with automatic reconnection and event handling.

### Features
- **Auto-reconnection**: Automatic reconnection on disconnect
- **Connection State Management**: Track connection status
- **Event Handling**: Subscribe to real-time events
- **Latency Monitoring**: Connection quality monitoring
- **Message Queuing**: Queue messages when disconnected

### Usage
```typescript
import socketService from './src/aiforwork_sdk_core/socket/socket.service';

// Connect to WebSocket
socketService.connectToWebSocket();

// Listen for connection state changes
socketService.on('connectionStateChange', (data) => {
  console.log('Connection state:', data.newState);
});

// Listen for real-time messages
socketService.on('answerChunk', (message) => {
  console.log('Received answer chunk:', message.data.chunk);
});

socketService.on('reqFlow', (message) => {
  console.log('Request flow update:', message.data);
});

// Disconnect
socketService.disconnect();
```

### Integration with Messages Store

The WebSocket service integrates with the Messages Store for real-time updates:

```typescript
// In messagesStore.ts - listenSocket action
listenSocket: () => {
  // Listen for answer chunks
  socketService.on('answerChunk', (message) => {
    if (message?.data?.reqId === get().recentMessage?.reqId) {
      const messageIndex = get().messages?.findIndex(
        (msg) => msg?.reqId === message?.data?.reqId
      );
      
      if (messageIndex !== -1) {
        set((state) => {
          state.messages[messageIndex]["answer"] = 
            (state.messages[messageIndex]["answer"] || "") + message?.data?.chunk;
        });
      }
    }
  });

  // Listen for request flow updates
  socketService.on('reqFlow', (message) => {
    // Update message with request flow data
    // ... similar pattern for real-time updates
  });
}
```

### Connection Management

```typescript
// Check connection status
if (socketService.isConnected()) {
  console.log('Socket is connected');
}

// Manual reconnection
socketService.reconnect();

// Connection with custom options
socketService.connectToWebSocket({
  timeout: 5000,
  autoReconnect: true,
  maxReconnectAttempts: 5
});
```

## 🚀 Getting Started with aiforwork_sdk_core

### 1. Initialize the SDK

First, initialize the SDK in your main App component:

```typescript
import React, { useEffect } from 'react';
import { initializeSDK, isSDKInitialized } from './src/aiforwork_sdk_core/sdk.config';

export default function App() {
  useEffect(() => {
    // Initialize SDK with your configuration
    initializeSDK({
      accessToken: 'your-access-token',
      apiUrl: 'https://work-qa.kore.ai/',
      presenceUrl: 'https://work-qa.kore.ai/',
      userId: 'your-user-id'
    });
    
    if (isSDKInitialized()) {
      console.log('✅ AIforWork SDK initialized successfully');
    }
  }, []);

  return <YourAppContent />;
}
```

### 2. Complete Integration Example

Here's a comprehensive example showing how to use all data layer components:

```typescript
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';

// Import all stores
import { useThreadsStore } from './src/aiforwork_sdk_core/store/threadsStore';
import { useMessagesStore } from './src/aiforwork_sdk_core/store/messagesStore';
import { useAgentsStore } from './src/aiforwork_sdk_core/store/agentsStore';

// Import WebSocket service
import socketService from './src/aiforwork_sdk_core/socket/socket.service';

function ChatApp() {
  const [inputText, setInputText] = useState('');
  
  // Threads Store
  const { 
    boards, 
    loading: threadsLoading, 
    fetchThreads,
    renameThread 
  } = useThreadsStore();
  
  // Messages Store
  const { 
    messages, 
    loading: messagesLoading,
    sendMessage,
    listenSocket 
  } = useMessagesStore();
  
  // Agents Store
  const { 
    agentsData,
    selectedAgent,
    getAgents,
    setLocalAgentSelection 
  } = useAgentsStore();

  useEffect(() => {
    // Initialize data layer
    const initializeApp = async () => {
      try {
        // 1. Fetch threads/boards
        await fetchThreads();
        
        // 2. Fetch available agents
        await getAgents();
        
        // 3. Connect to WebSocket for real-time updates
        socketService.connectToWebSocket();
        
        // 4. Start listening to socket events
        listenSocket();
        
        console.log('✅ App data layer initialized');
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
      }
    };

    initializeApp();
    
    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    try {
      await sendMessage({
        question: inputText,
        boardId: boards[0]?.id, // Use first board or create new one
        agentId: selectedAgent?.id // Optional agent selection
      });
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSelectAgent = async (agent: any) => {
    await setLocalAgentSelection(agent);
    console.log('Selected agent:', agent.name);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Threads/Boards List */}
      <View style={{ height: 100 }}>
        <Text>Threads ({boards.length})</Text>
        <ScrollView horizontal>
          {boards.map(board => (
            <TouchableOpacity 
              key={board.id}
              onPress={() => console.log('Selected board:', board.name)}
            >
              <Text>{board.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Agents Selection */}
      <View style={{ height: 80 }}>
        <Text>Agents</Text>
        <ScrollView horizontal>
          {agentsData?.agents?.map(agent => (
            <TouchableOpacity 
              key={agent.id}
              onPress={() => handleSelectAgent(agent)}
              style={{ 
                backgroundColor: selectedAgent?.id === agent.id ? '#007AFF' : '#f0f0f0' 
              }}
            >
              <Text>{agent.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages */}
      <ScrollView style={{ flex: 1 }}>
        {messages.map(message => (
          <View key={message.messageId || message.reqId}>
            <Text>Q: {message.question}</Text>
            {message.answer && <Text>A: {message.answer}</Text>}
            <Text>Status: {message.messageState}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask a question..."
          style={{ flex: 1, borderWidth: 1, padding: 10 }}
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ChatApp;
```

### 3. Individual Store Usage

#### Using Threads Store Only
```typescript
import { useThreadsStore } from './src/aiforwork_sdk_core/store/threadsStore';

function ThreadsOnlyComponent() {
  const { boards, loading, fetchThreads } = useThreadsStore();
  
  useEffect(() => {
    fetchThreads();
  }, []);
  
  if (loading) return <Text>Loading threads...</Text>;
  
  return (
    <View>
      {boards.map(board => (
        <Text key={board.id}>{board.name}</Text>
      ))}
    </View>
  );
}
```

#### Using Messages Store with WebSocket
```typescript
import { useMessagesStore } from './src/aiforwork_sdk_core/store/messagesStore';
import socketService from './src/aiforwork_sdk_core/socket/socket.service';

function MessagesOnlyComponent() {
  const { messages, sendMessage, listenSocket } = useMessagesStore();
  
  useEffect(() => {
    socketService.connectToWebSocket();
    listenSocket(); // Start real-time listeners
    
    return () => socketService.disconnect();
  }, []);
  
  return (
    <View>
      {messages.map(msg => (
        <View key={msg.reqId}>
          <Text>{msg.question}</Text>
          <Text>{msg.answer}</Text>
        </View>
      ))}
    </View>
  );
}
```

#### Using Direct API Client
```typescript
import ApiClient from './src/aiforwork_sdk_core/restapi/axios/api_client';

async function directApiUsage() {
  const apiClient = ApiClient.getInstance();
  
  // Direct API calls
  const boards = await apiClient.getCall('/api/1.1/kora/boards?type=history');
  const agents = await apiClient.getCall('/api/1.1/users/:userId/agents');
  
  console.log('Boards:', boards);
  console.log('Agents:', agents);
}
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
- `src/aiforwork_sdk_core/` - Core data layer functionality
  - `sdk.config.ts` - SDK configuration and initialization
  - `restapi/` - HTTP client and API management
  - `socket/` - WebSocket service for real-time communication
  - `store/` - State management (Zustand stores)
    - `threadsStore.ts` - Threads/boards management
    - `messagesStore.ts` - Messages and chat functionality
    - `agentsStore.ts` - AI agents management
    - `middleware/` - Clean separation layer for API operations
  - `utils/` - Utility functions and constants
- `src/aiforwork_sdk_ui/` - UI components and templates
  - `sdk_main/` - Main chat interface components
  - `sdk_components/` - Reusable UI components
  - `sdk_templates/` - Template components for different flows
  - `sdk_composebar/` - Message input and compose functionality

## 💡 Best Practices for aiforwork_sdk_core

### 1. **Initialization Order**
Always initialize components in this order:
```typescript
// 1. Initialize SDK first
initializeSDK(config);

// 2. Fetch initial data
await fetchThreads();
await getAgents();

// 3. Connect WebSocket last
socketService.connectToWebSocket();
listenSocket();
```

### 2. **Error Handling**
Use try-catch blocks for all async operations:
```typescript
const handleAction = async () => {
  try {
    await sendMessage({ question: "Hello" });
  } catch (error) {
    console.error('Action failed:', error);
    // Handle error appropriately
  }
};
```

### 3. **State Management**
- Use stores for reactive data that needs to be shared
- Access stores using hooks: `useThreadsStore()`, `useMessagesStore()`, `useAgentsStore()`
- Reset stores when needed: `resetStore()`

### 4. **WebSocket Management**
- Connect WebSocket after SDK initialization
- Always disconnect on component unmount
- Use `listenSocket()` to start real-time listeners

### 5. **Memory Management**
```typescript
useEffect(() => {
  // Setup
  socketService.connectToWebSocket();
  listenSocket();
  
  // Cleanup
  return () => {
    socketService.disconnect();
    resetStore(); // Optional: reset store state
  };
}, []);
```

### 6. **TypeScript Usage**
Import proper types for better development experience:
```typescript
import { ThreadsState, ThreadsActions } from './src/aiforwork_sdk_core/store/threadsStore';
import { MessageState } from './src/aiforwork_sdk_core/utils/MessageStates';
import { SDKConfig } from './src/aiforwork_sdk_core/sdk.config';
```

## 🔧 Error Handling

The aiforwork_sdk_core includes comprehensive error handling:

### Store-Level Error Handling
- **API Errors**: Caught and stored in state with descriptive messages
- **Loading States**: Automatic loading state management
- **Error Recovery**: Built-in retry mechanisms where appropriate

### WebSocket Error Handling
- **Connection Errors**: Automatic reconnection attempts
- **Message Queuing**: Messages queued when disconnected
- **Graceful Degradation**: App continues to work without real-time features

### API Client Error Handling
- **Authentication Errors**: Automatic token cleanup on 401
- **Network Errors**: Proper error propagation with context
- **Device Information**: Fallback to defaults if device info unavailable

### Error Logging
All errors are logged to console with context for debugging:
```typescript
// Example error logs
console.error('Error fetching threads:', error);
console.error('WebSocket connection failed:', connectionError);
console.error('API request failed:', { url, method, error });
```

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

## 📚 Additional Resources

### Data Layer Components
- **[Middleware Documentation](./src/aiforwork_sdk_core/store/middleware/README.md)** - Detailed middleware architecture
- **[Socket Service](./src/aiforwork_sdk_core/socket/socket.service.ts)** - WebSocket implementation
- **[API Client](./src/aiforwork_sdk_core/restapi/axios/api_client.ts)** - HTTP client implementation

### Example Implementation
- **[App.tsx](./App.tsx)** - Complete integration example
- **[BotChat Component](./src/aiforwork_sdk_ui/sdk_main/BotChat.tsx)** - Chat interface implementation

---

## ⚠️ Important Notes

- **Authentication Required**: This SDK requires valid AIforWork platform credentials
- **SDK Initialization**: Always call `initializeSDK()` before using any other SDK features
- **WebSocket Connection**: WebSocket connection is optional but recommended for real-time features
- **Error Handling**: Always implement proper error handling for production apps
- **Memory Management**: Properly cleanup WebSocket connections and reset stores when needed

**Note**: This SDK is designed for internal AIforWork platform integration. Ensure proper authentication tokens and API endpoints are configured before use.
