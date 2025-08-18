import { EventEmitter } from "eventemitter3";
import io, { Socket } from "socket.io-client";
import ApiClient from "../restapi/axios/api_client";
import { EMITTER_TYPES, entities } from "../utils/utils";
import { getSDKConfig, isSDKInitialized } from "../sdk.config";

// Type Definitions
interface SocketParams {
    transports: string[];
    'force new connection': boolean;
    reconnect: boolean;
    'connect timeout': number;
    'reconnection delay': number;
    'max reconnection attempts': number | 'Infinity';
    forceNew: boolean;
    reconnection: boolean;
    timeout: number;
    reconnectionDelay: number;
    reconnectionAttempts: number | 'Infinity';
    query: string;
}

interface ConnectionMetrics {
    latency: number;
    packetLoss: number;
    lastMessageTime: number | null;
}

interface Message {
    type: string;
    data: any;
}

interface NotificationMessage {
    customdata?: {
        t?: string;
    };
}

interface LiveMessage {
    entity?: string;
    data?: any;
}

interface TypingMessage {
    userId?: string;
}

interface PresenceResponse {
    sToken: string;
}

// Connection states
enum ConnectionState {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'connected',
    RECONNECTING = 'reconnecting'
}

// Event types for better type safety
enum EventTypes {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    RECONNECT = 'reconnect',
    NOTIFICATION = 'notification',
    LIVE = 'live',
    BOT_MESSAGE = 'botMessage',
    TYPING = 'typing',
    TYPING_SUBSCRIBE = 'typingSubscribe'
}

// Custom event types
enum CustomEvents {
    CONNECTION_STATE_CHANGE = 'connectionStateChange',
    CONNECTION_ERROR = 'connectionError',
    MESSAGE_QUEUE_EMPTY = 'messageQueueEmpty',
    HIGH_LATENCY = 'highLatency',
    RECONNECTION_ATTEMPT = 'reconnectionAttempt',
    PING_PONG = 'pingPong'
}

class WebsocketService extends EventEmitter {
    private _interval: NodeJS.Timeout | null = null;
    private monitorInterval: NodeJS.Timeout | null = null;
    private presence: string = '';
    private sio: Socket | null = null;
    private webSocketReconnected: boolean = false;
    private isConnecting: boolean = false;
    private isNetWorkAvailable: boolean = true;
    private appState: string = 'active';
    private baseUrl: string = '';
    private accessToken: string | null = null;
    private userId: string = '';
    private connectionState: ConnectionState = ConnectionState.DISCONNECTED;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private messageQueue: Message[] = [];
    private eventListeners: Map<string, Function> = new Map();
    private lastPingTime: number | null = null;
    private timeExecuted: number | null = null;
    private lastUser: string | null = null;
    private connectionMetrics: ConnectionMetrics = {
        latency: 0,
        packetLoss: 0,
        lastMessageTime: null
    };

    // Connection Management
    createSocketConnection = (userId: string, sToken: string): Socket | undefined => {

        if (this.sio) {
            this.cleanupExistingConnection();
        }

        this.setConnectionState(ConnectionState.CONNECTING);

        const _param: SocketParams = {
            transports: ['websocket'],
            'force new connection': true,
            reconnect: false,
            'connect timeout': 15000,
            'reconnection delay': this.calculateReconnectDelay(),
            'max reconnection attempts': this.maxReconnectAttempts,
            forceNew: true,
            reconnection: false,
            timeout: 15000,
            reconnectionDelay: 3000,
            reconnectionAttempts: 'Infinity',
            query: this.buildQueryString(userId, sToken),
        };

        try {
            console.log('creating socket connection with params : ', this.presence, _param);
            this.sio = io.connect(this.presence, _param);
            this.setupEventListeners();
            this.startConnectionMonitoring();
            return this.sio;
        } catch (e) {
            this.handleConnectionError(e as Error);
            console.log('error in creating socket connection : ', e);
            return undefined;
        }
    };

    // Improved reconnection logic with exponential backoff
    private calculateReconnectDelay = (): number => {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);
        this.emit(CustomEvents.RECONNECTION_ATTEMPT, {
            attempt: this.reconnectAttempts,
            delay
        });
        return delay;
    };

    // Proper cleanup of existing connection
    private cleanupExistingConnection = (): void => {
        if (this.sio) {
            this.sio.disconnect();
            this.removeEventListeners();
            this.sio = null;
        }
        this.stopSendingPingPong();
        this.stopConnectionMonitoring();
    };

    // Centralized event listener management
    private setupEventListeners = (): void => {
        const events = {
            [EventTypes.CONNECT]: this.handleConnect,
            [EventTypes.DISCONNECT]: this.handleDisconnect,
            [EventTypes.RECONNECT]: this.handleReconnect,
            [EventTypes.NOTIFICATION]: this.handleNotification,
            [EventTypes.LIVE]: this.handleLiveUpdate,
            [EventTypes.BOT_MESSAGE]: this.handleBotMessage,
            [EventTypes.TYPING]: this.handleTyping,
            [EventTypes.TYPING_SUBSCRIBE]: this.handleTypingSubscribe
        };

        Object.entries(events).forEach(([event, handler]) => {
            if (this.sio) {
                this.sio.on(event, handler);
                this.eventListeners.set(event, handler);
            }
        });
    };

    // Event Handlers
    private handleConnect = (): void => {
        console.log('socket connected');
        this.setConnectionState(ConnectionState.CONNECTED);
        this.reconnectAttempts = 0;
        this.startSendingPingPong();
        this.processMessageQueue();
    };

    private handleDisconnect = (msg: string): void => {
        console.log('socket disconnected',msg);
        this.setConnectionState(ConnectionState.DISCONNECTED);
        this.webSocketReconnected = true;
        this.stopSendingPingPong();
        if (this.shouldAttemptReconnect(msg)) {
            this.scheduleReconnection();
        }
    };

    private handleReconnect = (): void => {
        this.setConnectionState(ConnectionState.RECONNECTING);
        this.webSocketReconnected = true;
    };

    private handleNotification = (msg: NotificationMessage): void => {
        if (msg?.customdata?.t === 'aar' || msg?.customdata?.t === 'an') {
            //TODO: handle notification
        }
    };

    private handleLiveUpdate = (msg: LiveMessage): void => {
        if (msg?.entity && entities.includes(msg?.entity)) {
            switch (msg?.entity) {
                case 'answersuggestion':
                    //TODO: handle answer suggestion
                    break;
                case 'answerChunk':
                    //TODO: handle answer chunk
                    break;
            }
        }
    };

    

    private handleBotMessage = (msg: any): void => {
        //TODO: handle sync response
    };

    private handleTyping = (msg: TypingMessage): void => {
        if (this.shouldProcessTyping(msg)) {
            this.timeExecuted = new Date().getTime();
            this.lastUser = msg?.userId || null;
        }
    };

    private handleTypingSubscribe = (msg: any): void => {
        console.log('Received typingSubscribe');
    };

    // Connection Monitoring
    private startConnectionMonitoring = (): void => {
        this.monitorInterval = setInterval(() => {
            this.monitorConnection();
        }, 5000);
    };

    private monitorConnection = (): void => {
        if (this.sio) {
            this.connectionMetrics.latency = this.sio.latency;
            this.connectionMetrics.packetLoss = this.sio.packetLoss;
            this.connectionMetrics.lastMessageTime = new Date().getTime();

            if (this.connectionMetrics.latency > 1000) {
                this.emit(CustomEvents.HIGH_LATENCY, this.connectionMetrics);
            }
        }
    };

    // Message Queue Management
    queueMessage = (type: string, data: any): void => {
        if (this.connectionState !== ConnectionState.CONNECTED) {
            this.messageQueue.push({ type, data });
            return;
        }
        this.sendMessage(type, data);
    };

    private processMessageQueue = (): void => {
        while (this.messageQueue.length > 0) {
            const { type, data } = this.messageQueue.shift()!;
            this.sendMessage(type, data);
        }
        if (this.messageQueue.length === 0) {
            this.emit(CustomEvents.MESSAGE_QUEUE_EMPTY);
        }
    };

    // Utility Methods
    private shouldAttemptReconnect = (msg: string): boolean => {
        return (
            this.appState === 'active' &&
            !this.isConnecting &&
            this.isNetWorkAvailable &&
            !(msg && msg === 'io client disconnect')
        );
    };

    private shouldProcessTyping = (msg: TypingMessage): boolean => {
        return (
            !this.timeExecuted ||
            !this.lastUser ||
            this.lastUser !== msg?.userId ||
            new Date().getTime() - this.timeExecuted > 2000
        );
    };

    private buildQueryString = (userId: string, sToken: string): string => {
        return `userid=${userId}&channels=7&sToken=${sToken}&rnd=${new Date().getTime()}&EIO=3&transport=websocket`;
    };

    // Existing Methods with Improvements
    startSendingPingPong = (): void => {
        this._interval = setInterval(() => {
            this.lastPingTime = new Date().getTime();
            this.sio?.emit('pong from the client');
            this.emit(CustomEvents.PING_PONG, {
                time: this.lastPingTime
            });
        }, 10000);
    };

    stopSendingPingPong = (): void => {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
    };

    disconnect = (): void => {
        this.cleanupExistingConnection();
        this.setConnectionState(ConnectionState.DISCONNECTED);
    };

    isConnected = (): boolean => {
        return this.sio !== null && this.sio.connected && this.connectionState === ConnectionState.CONNECTED;
    };

    isWSConnecting = (): boolean => {
        return this.isConnecting;
    };

    setAppState = (_appState: string): void => {
        this.appState = _appState;
        if (_appState !== 'active' && this.sio) {
            this.disconnect();
        }
    };

    sendDataToSocket = (type: string, subscriptions: any): void => {
        if (!this.isConnected()) {
            this.queueMessage(type, subscriptions);
            return;
        }

        if (type === 'typingSubscribe') {
            this.sio?.emit('typingSubscribe', {
                args: [
                    {
                        resourceIds: subscriptions,
                    },
                ],
            });
        } else if (type === 'typing') {
            this.sio?.emit('typing', {
                args: [subscriptions],
            });
        }
    };

    // Cleanup
    private removeEventListeners = (): void => {
        this.eventListeners.forEach((handler, event) => {
            if (this.sio) {
                this.sio.off(event, handler);
            }
        });
        this.eventListeners.clear();
    };

    // Error Handling
    private handleConnectionError = (error: Error): void => {
        this.setConnectionState(ConnectionState.DISCONNECTED);
        this.emit(CustomEvents.CONNECTION_ERROR, error);
        this.cleanupExistingConnection();
        this.scheduleReconnection();
    };

    private scheduleReconnection = (): void => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                if (this.shouldAttemptReconnect('')) {
                    this.connectToWebSocket();
                }
            }, this.calculateReconnectDelay());
        }
    };

    // New method to handle connection state changes
    private setConnectionState = (newState: ConnectionState): void => {
        const oldState = this.connectionState;
        this.connectionState = newState;
        if (oldState !== newState) {
            this.emit(CustomEvents.CONNECTION_STATE_CHANGE, {
                oldState,
                newState,
                timestamp: new Date().getTime()
            });
        }
    };

    // Private method to send messages
    private sendMessage = (type: string, data: any): void => {
        if (this.sio) {
            this.sio.emit(type, data);
        }
    };

    connectToWebSocket = (): void => {
        if (isSDKInitialized()) {
            const config = getSDKConfig();
            this.presence = config.presenceUrl;
            this.baseUrl = config.apiUrl;
            this.accessToken = config.accessToken;
            this.userId = config.userId;
        }
        this.isConnecting = true;
        const axios = ApiClient.getInstance();
        axios.post<PresenceResponse>('api/1.1/presence/start')
            .then(response => {
                if (response.data) {
                    console.log('Presence Response', response.data, this.userId);
                    this.createSocketConnection(
                        this.userId,
                        response.data.sToken,
                    );
                }
                this.isConnecting = false;
            })
            .catch(error => {
                console.log('ERROR ---->', error);
                this.isConnecting = false;
                this.scheduleReconnection();
            });
    };
    private stopConnectionMonitoring = (): void => {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
            this.monitorInterval = null;
            console.log('Stopping connection monitoring...');
            console.log('--------------------------------');
        }
    };
}

export default new WebsocketService(); 