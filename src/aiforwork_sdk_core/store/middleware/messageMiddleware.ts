import { nanoid } from "nanoid";
import { MessageState } from "../../utils/MessageStates";

export interface MessageMiddleware {
  createMessage: (messageObject: any) => any;
  updateMessageState: (messageId: string, state: MessageState) => void;
 
}

export class MessageMiddlewareImpl implements MessageMiddleware {
  
 
  createMessage(messageObject: any): any {
    let id=nanoid(10);
    let messagePayload:any={
      question: messageObject.question.trim(),
      reqId: id,
      messageState: MessageState.SENDING,
      timestamp: Date.now(),
      clientId: id // Add unique ID for tracking
    }
    if(messageObject.boardId){
      messagePayload.boardId=messageObject.boardId;
    }
    return messagePayload
  }

  updateMessageState(messageId: string, state: MessageState): void {
    // This will be handled by the store's set function
    // The middleware just provides the logic
    console.log(`Updating message ${messageId} state to: ${state}`);
  }
}

// Factory function to create middleware instance
export const createMessageMiddleware = (): MessageMiddleware => {
  return new MessageMiddlewareImpl();
}; 