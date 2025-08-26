import { nanoid } from "nanoid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { MessageState } from "../utils/MessageStates";
import {
  createMessageMiddleware,
  MessageMiddleware,
} from "./middleware/messageMiddleware";
import {
  createApiMessageMiddleware,
  ApiMessageMiddleware,
} from "./middleware/apiMessageMiddleware";
import "react-native-get-random-values";
import socketService from "../socket/socket.service";

export interface MessagesState {
  messages: any[];
  loading: boolean;
  moreAvailable: boolean;
  currentBoard: any;
  recentMessage: any;
}

export interface MessagesActions {
  fetchMessages: () => Promise<void>;
  sendMessage: (messageObject: any) => Promise<void>;
  resetStore: () => void;
  listenSocket: () => void;
}

export type MessagesStore = MessagesState & MessagesActions;

const initialState: MessagesState = {
  messages: [],
  loading: false,
  moreAvailable: false,
  currentBoard: null,
  recentMessage: null,
};

// Create separate middleware instances
const messageMiddleware: MessageMiddleware = createMessageMiddleware();
const apiMiddleware: ApiMessageMiddleware = createApiMessageMiddleware();

export const useMessagesStore = create<MessagesStore>()(
  immer((set, get) => ({
    ...initialState,
    fetchMessages: async () => {
      // Placeholder implementation
      console.log("fetchMessages called");
    },
    sendMessage: async (messageObject: any) => {
      let message = undefined;
      if (messageObject?.messageId) {
        message = messageObject;
        message.messageState = MessageState.SENDING;
        //message = messageMiddleware.createMessage(messageObject);
      } else {
        message = messageMiddleware.createMessage(messageObject);
      }
      try {
        // Add message to state with SENDING state
        set((state) => {
          //state.messages.push(message);
          if (message?.messageId) {
            const messageIndex = state.messages.findIndex(
              (m) =>
                m.reqId === message.reqId ||
                (message.messageId && m.messageId === message.messageId)
            );
            if (messageIndex !== -1) {
              state.messages[messageIndex] = message;
            } else {
              state.messages = [...state.messages, message];
              state.recentMessage = message;
            }
          } else {
            state.messages = [message, ...state.messages];
            state.recentMessage = message;
          }
        });

        // Use API middleware to send message
        const response = await apiMiddleware.sendMessageToAPI(message);

        // Update message state to SENT on success
        set((state) => {
          const messageIndex = state.messages.findIndex(
            (m) =>
              m.reqId === message.reqId ||
              (message.messageId && m.messageId === message.messageId)
          );
          if (messageIndex !== -1) {
            state.messages[messageIndex].messageState = MessageState.SENT;
            state.messages[messageIndex] = {
              ...state.messages[messageIndex],
              ...response,
            }; // Store response data
            state.recentMessage = state.messages[messageIndex];
          }
        });
      } catch (error) {
        console.log("=====error======>", error);

        set((state) => {
          const messageIndex = state.messages.findIndex(
            (m) => m?.reqId === message?.reqId
          );
          if (messageIndex !== -1) {
            state.messages[messageIndex].messageState = MessageState.FAILED;
            state.messages[messageIndex]['status'] = "terminated"
            state.messages[messageIndex].error = {
              ...state.messages[messageIndex],
              message: (error as Error).message || "Unknown error",
              timestamp: Date.now(),
              retryCount: 0,
            };
            state.recentMessage = state.messages[messageIndex];
          }
        });
      }
    },

    resetStore: () => {
      set((state) => {
        Object.assign(state, initialState);
      });
    },
    listenSocket: () => {
      console.log("listenSocket called ");
      socketService.on("answersuggestion", (message: any) => {
        console.log("answersuggestion:", message);
      });

      socketService.on("reqFlow", (message: any) => {
        if (
          message?.data?.reqId === get().recentMessage?.reqId ||
          message?.data?.msgId === get().recentMessage?.messageId
        ) {
          console.log("reqFlow: matched:-->", message);

          // Find the message by msgId or reqId
          const messageIndex = get().messages?.findIndex(
            (msg) =>
              msg?.messageId === message?.data?.msgId ||
              msg?.reqId === message?.data?.reqId
          );

          if (messageIndex !== -1) {
            set((state) => {
              let suggestion = {
                icon: message?.data?.suggestion?.icon,
                content: message?.data?.suggestion,
              };
              state.messages[messageIndex]["reqFlow"] = [suggestion];
            });
          }
        }
      });

      socketService.on("answerChunk", (message: any) => {
        //console.log("answerChunk:", message);

        if (
          message?.data?.reqId === get().recentMessage?.reqId ||
          message?.data?.msgId === get().recentMessage?.messageId
        ) {
          console.log("reqFlow: matched:-->", message);

          // Find the message by msgId or reqId
          const messageIndex = get().messages?.findIndex(
            (msg) =>
              msg?.messageId === message?.data?.msgId ||
              msg?.reqId === message?.data?.reqId
          );

          if (messageIndex !== -1) {
            set((state) => {
              state.messages[messageIndex]["answer"] =
                (state.messages[messageIndex]["answer"] || "") +
                message?.data?.chunk;
            });
          }
        }
      });
    },
  }))
);
