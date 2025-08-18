// SDK Configuration Interface
export interface SDKConfig {
    accessToken: string;
    apiUrl: string;
    presenceUrl: string;
    userId: string;
}

// SDK Configuration
let sdkConfig: SDKConfig | null = null;

// Initialize SDK with configuration
export const initializeSDK = (config: SDKConfig): void => {
    if (!config.accessToken || !config.apiUrl || !config.presenceUrl || !config.userId) {
        throw new Error('SDK configuration is incomplete. Please provide all required parameters.');
    }
    console.log('initializing sdk with config',config);
    sdkConfig = config;
};

// Get SDK configuration
export const getSDKConfig = (): SDKConfig => {
    if (!sdkConfig) {
        throw new Error('SDK not initialized. Please call initializeSDK() first.');
    }
    return sdkConfig;
};

// Check if SDK is initialized
export const isSDKInitialized = (): boolean => {
    console.log('checking isSDKInitialized',sdkConfig!=null,sdkConfig);
    return sdkConfig !== null;
}; 