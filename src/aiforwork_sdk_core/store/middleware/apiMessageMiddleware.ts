import ApiClient from "../../restapi/axios/api_client";

export interface ApiMessageMiddleware {
  sendMessageToAPI: (message: any) => Promise<any>;
  updateMessageStatus: (payload: any,params: any) => Promise<any>;
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


  async updateMessageStatus(payload: any,params: any): Promise<any> {
    const apiClient = ApiClient.getInstance();
    const response = await apiClient.putCall(
      `/api/1.1/kora/boards/${params.boardId}/messages/${params.messageId}`,
      payload
    );
    return response;
  }


  
}

// Factory function to create API middleware instance
export const createApiMessageMiddleware = (): ApiMessageMiddleware => {
  return new ApiMessageMiddlewareImpl();
}; 