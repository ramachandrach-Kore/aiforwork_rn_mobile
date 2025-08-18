import { getSDKConfig } from '../../sdk.config';
import AxiosBase from './axios_base';


interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface PresenceResponse {
  sToken: string;
}

class ApiClient extends AxiosBase {
  private static instance: ApiClient;
  private token: string | null = null;
  private userId: string | null = null;
  private accountId: string | null = null;

  private constructor() {
    const config = getSDKConfig();
    super(config.apiUrl);
    this.token = config.accessToken;
    this.userId = config.userId;
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  protected getAuthToken(): string | null {
    return this.token;
  }

  protected getUserId(): string | number {
    return this.userId || '';
  }

  protected getAccountId(): string | number {
    return this.accountId || '';
  }

  protected handleUnauthorizedError(): void {
    // Clear stored credentials
    this.token = null;
    this.userId = null;
    this.accountId = null;
  }

  protected handleServiceError(error: { message: string; code?: string }): void {
    console.error('Service Error:', error.message);
  }

  // API methods - return data directly without response wrapper
  public async postCall<T>(subUrl: string, payload: any): Promise<T> {
    try {
      const response = await this.post<T>(subUrl, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getCall<T>(subUrl: string): Promise<T> {
    try {
      const response = await this.get<T>(subUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async putCall<T>(subUrl: string, data: any): Promise<T> {
    try {
      const response = await this.put<T>(subUrl, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiClient; 