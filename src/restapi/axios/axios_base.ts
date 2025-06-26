import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import DeviceInfo from 'react-native-device-info';
import { getTimeZone } from '../../utils/utils';

interface AxiosConfig extends AxiosRequestConfig {
  intercepted?: boolean;
  headers?: Record<string, string>;
}

interface ExtendedInternalConfig extends InternalAxiosRequestConfig {
  intercepted?: boolean;
}

interface ErrorResponse {
  errors?: Array<{
    message: string;
    code?: string;
  }>;
}

class AxiosBase {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    // Create app headers with device information
    const appHeaders = {
      channel: DeviceInfo.getSystemName(),
      version: DeviceInfo.getReadableVersion(),
      deviceId: DeviceInfo.getUniqueIdSync(),
      name: DeviceInfo.getBrand()?.charAt(0).toUpperCase() + DeviceInfo.getBrand()?.slice(1) + ', ' + DeviceInfo.getModel(),
      tz: getTimeZone(),
      manufacturer: DeviceInfo.getManufacturerSync(),
    };
    let applicationHeaders = '';
    Object.entries(appHeaders).forEach(([key, value]) => {
      applicationHeaders = applicationHeaders + `${key}=${value};`;
    });
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-KORA-Client':applicationHeaders,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: ExtendedInternalConfig) => {
        if (this.shouldIntercept(config)) {
          // Add auth token if available
          const token = this.getAuthToken();
          if (token && config.headers) {
            config.headers.Authorization = `bearer ${token}`;
          }
          
          // Resolve URL parameters
          if (config.url) {
            config.url = this.resolveUrlParams(config.url, {
              userId: this.getUserId(),
              accountId: this.getAccountId(),
            });
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response) {
          this.handleErrorResponse(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private shouldIntercept(config: ExtendedInternalConfig): boolean {
    return !(config.hasOwnProperty('intercepted') && !config.intercepted);
  }

  private resolveUrlParams(url: string, params: Record<string, string | number>): string {
    return url.replace(/:([a-zA-Z]+)/g, (match, paramName) => {
      const value = params[paramName];
      return value ? String(value) : match;
    });
  }

  private handleErrorResponse(error: AxiosError<ErrorResponse>): void {
    const { status, data } = error.response || {};

    switch (status) {
      case 401:
        this.handleUnauthorizedError();
        break;
      case 410:
      case 451:
        if (data?.errors && data.errors.length > 0) {
          this.handleServiceError(data.errors[0]);
        }
        break;
      default:
        // Handle other error cases
        break;
    }
  }

  // Abstract methods to be implemented by extending classes
  protected getAuthToken(): string | null {
    throw new Error('getAuthToken must be implemented');
  }

  protected getUserId(): string | number {
    throw new Error('getUserId must be implemented');
  }

  protected getAccountId(): string | number {
    throw new Error('getAccountId must be implemented');
  }

  protected handleUnauthorizedError(): void {
    throw new Error('handleUnauthorizedError must be implemented');
  }

  protected handleServiceError(error: { message: string; code?: string }): void {
    throw new Error('handleServiceError must be implemented');
  }

  // Public methods
  public getInstance(): AxiosInstance {
    return this.instance;
  }

  public get<T = any>(url: string, config?: AxiosConfig): Promise<AxiosResponse<T>> {
    return this.instance.get(url, config);
  }

  public post<T = any>(url: string, data?: any, config?: AxiosConfig): Promise<AxiosResponse<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(url: string, data?: any, config?: AxiosConfig): Promise<AxiosResponse<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete(url, config);
  }
}

export default AxiosBase;
