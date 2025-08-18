# Message Middleware Architecture

## Overview

The message middleware system provides a clean separation of concerns for handling message operations. It consists of two main components:

- **MessageMiddleware**: Handles message creation and state management
- **ApiMessageMiddleware**: Handles API communication

## Architecture

```
src/store/middleware/
├── messageMiddleware.ts      # Core message operations
├── apiMessageMiddleware.ts   # API communication
└── README.md                # This documentation
```

## Core Middleware

### MessageMiddleware

Handles message creation and state management:

```typescript
import { createMessageMiddleware } from './middleware/messageMiddleware';

const messageMiddleware = createMessageMiddleware();

// Create a new message
const message = messageMiddleware.createMessage({
  question: "What is AI?"
});

// Update message state
messageMiddleware.updateMessageState(message.id, MessageState.SENT);
```

### ApiMessageMiddleware

Handles API communication:

```typescript
import { createApiMessageMiddleware } from './middleware/apiMessageMiddleware';

const apiMiddleware = createApiMessageMiddleware();

// Send message to API
try {
  const response = await apiMiddleware.sendMessageToAPI(message);
} catch (error) {
  // Handle API errors
  console.error('API Error:', error);
}
```

## Integration with Zustand Store

The middleware is integrated into the Zustand store:

```typescript
// In messagesStore.ts
const messageMiddleware = createMessageMiddleware();
const apiMiddleware = createApiMessageMiddleware();

sendMessage: async (messageObject: any) => {
  const message = messageMiddleware.createMessage(messageObject);
  
  try {
    const response = await apiMiddleware.sendMessageToAPI(message);
    // Handle success
  } catch (error) {
    // Handle errors
  }
}
```

## Testing Strategy

### Unit Tests
Test each middleware function independently:

```typescript
describe('MessageMiddleware', () => {
  it('should validate messages correctly', () => {
    expect(middleware.validateMessage(validMessage)).toBe(true);
    expect(middleware.validateMessage(invalidMessage)).toBe(false);
  });
  
  it('should create messages with correct structure', () => {
    const message = middleware.createMessage(messageObject);
    expect(message).toHaveProperty('id');
    expect(message).toHaveProperty('messageState', MessageState.SENDING);
  });
});
```

### Integration Tests
Test middleware with store integration:

```typescript
describe('MessagesStore with Middleware', () => {
  it('should handle message sending workflow', async () => {
    const store = useMessagesStore.getState();
    await store.sendMessage({ question: "Hello" });
    
    expect(store.messages).toHaveLength(1);
    expect(store.messages[0].messageState).toBe(MessageState.SENT);
  });
});
```

## Future Enhancements

### 1. **Retry Logic** (Removed as requested)
Could be re-added if needed:
```typescript
class RetryMessageMiddleware extends MessageMiddlewareImpl {
  async sendMessageToAPI(message: any): Promise<any> {
    return this.sendMessageWithRetry(message);
  }
}
```

### 2. **Rate Limiting**
```typescript
class RateLimitedMessageMiddleware extends MessageMiddlewareImpl {
  private rateLimiter = new RateLimiter();
  
  async sendMessageToAPI(message: any): Promise<any> {
    await this.rateLimiter.wait();
    return super.sendMessageToAPI(message);
  }
}
```

### 3. **Caching**
```typescript
class CachedMessageMiddleware extends MessageMiddlewareImpl {
  private cache = new MessageCache();
  
  async sendMessageToAPI(message: any): Promise<any> {
    const cached = this.cache.get(message.question);
    if (cached) return cached;
    
    const response = await super.sendMessageToAPI(message);
    this.cache.set(message.question, response);
    return response;
  }
}
```

## Best Practices

1. **Keep middleware pure**: Avoid side effects in middleware functions
2. **Use interfaces**: Define clear contracts for middleware behavior
3. **Test independently**: Each middleware function should be testable in isolation
4. **Compose middleware**: Chain multiple middleware for complex workflows
5. **Handle errors gracefully**: Always provide meaningful error messages

## Migration from Monolithic Approach

### Before (Monolithic)
```typescript
sendMessage: async (messageObject: any) => {
  // All logic mixed together
  let message = { question: messageObject?.question, reqId: nanoid(10) };
  set((state) => { state.messages.push(message); });
  const response = await apiClient.postCall('/api/endpoint', message);
  // Error handling mixed with business logic
}
```

### After (Middleware Pattern)
```typescript
sendMessage: async (messageObject: any) => {
  // Clean separation of concerns
  if (!middleware.validateMessage(messageObject)) return;
  const message = middleware.createMessage(messageObject);
  set((state) => { state.messages.push(message); });
  const response = await middleware.sendMessageToAPI(message);
  // Error handling delegated to middleware
}
```

This pattern makes the code more maintainable, testable, and extensible while keeping the store focused on state management. 