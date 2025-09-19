import ApiClient from "../../restapi/axios/api_client";

export interface ApiAgentsMiddleware {
  getAgents: () => Promise<any>;
  getApiAgentsConnectionsByProvider: (provider: string) => Promise<any>;
  addApiAgentConnection: (payload: any) => Promise<any>;
}

export class ApiAgentsMiddlewareImpl implements ApiAgentsMiddleware {
  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  async getAgents(): Promise<any> {
    const apiClient = ApiClient.getInstance();
    const response = await apiClient.getCall(`/api/1.1/users/:userId/agents`);
    return response;
  }
  async getApiAgentsConnectionsByProvider(provider: string): Promise<any> {
    const apiClient = ApiClient.getInstance();
    const response = await apiClient.getCall(
      `/api/1.1/ka/users/:userId/connectors/${provider}`
    );
    return response;
  }

  async addApiAgentConnection(data: any): Promise<any> {
    const apiClient = ApiClient.getInstance();
    let isReconnect = data?.isReconnect || false;
    let connectionId = data?.connectionId;
    let provider = data?.provider;

    let url =
      isReconnect == true
        ? "/api/users/:userId/connections/" + provider + "/" + connectionId
        : "/api/users/:userId/connections";

    const response = isReconnect
      ? await apiClient.putCall(url, data?.payload)
      : await apiClient.postCall(url, data?.payload);


    return response;
  }

  // Singleton instance
  private static instance: ApiAgentsMiddlewareImpl | null = null;

  // Static method to get the singleton instance
  public static getInstance(): ApiAgentsMiddlewareImpl {
    if (!ApiAgentsMiddlewareImpl.instance) {
      ApiAgentsMiddlewareImpl.instance = new ApiAgentsMiddlewareImpl();
    }
    return ApiAgentsMiddlewareImpl.instance;
  }
}

// Factory function to create API middleware instance - now returns singleton
export const apiAgentsMiddleware = (): ApiAgentsMiddleware => {
  return ApiAgentsMiddlewareImpl.getInstance();
};
