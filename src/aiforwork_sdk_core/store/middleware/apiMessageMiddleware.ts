import ApiClient from "../../restapi/axios/api_client";

export interface ApiMessageMiddleware {
  sendMessageToAPI: (message: any) => Promise<any>;
}

export class ApiMessageMiddlewareImpl implements ApiMessageMiddleware {
  
  async sendMessageToAPI(message: any): Promise<any> {
    const apiClient = ApiClient.getInstance();
    const response = await apiClient.postCall(
      `/api/kora/users/:userId/advancedsearch?reqId=${message.reqId}`,
      message
    );
    return response;
  }


  
}

// Factory function to create API middleware instance
export const createApiMessageMiddleware = (): ApiMessageMiddleware => {
  return new ApiMessageMiddlewareImpl();
}; 