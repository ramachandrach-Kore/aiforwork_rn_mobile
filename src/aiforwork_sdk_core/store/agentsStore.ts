import { nanoid } from "nanoid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { MessageState } from "../utils/MessageStates";

import "react-native-get-random-values";
import socketService from "../socket/socket.service";
import { apiAgentsMiddleware } from "./middleware/apiAgentsMiddleware";

export interface AgentsState {
  agentsLoading: boolean;
  agentsData: any;
  selectedAgent: any;
  apiAgentsConnectionsLoading: boolean;
  apiAgentsConnectionsData: any;

  addingApiAgentConnection :boolean;
  connectionAdded :any;
  connectionAddError: string | null;
  
}

export interface AgentsActions {
  getAgents: () => Promise<void>;
  setLocalAgentSelection: (agent: any) => Promise<void>;
  removeLocalAgentSelection: () => Promise<void>;
  getApiAgentsConnectionsByProvider: (provider: string) => Promise<void>;
  addApiAgentConnection: (payload: any) => Promise<void>;
  cleanApiAgentConnection: (payload: any) => Promise<void>;
}

const initialState: AgentsState = {
  agentsLoading: false,
  agentsData: null,
  selectedAgent: null,
  apiAgentsConnectionsLoading: false,
  apiAgentsConnectionsData: null,

  addingApiAgentConnection: false,
  connectionAdded: null,
  connectionAddError: null,
};

export type AgentsStore = AgentsState & AgentsActions;

const apiMiddleware = apiAgentsMiddleware();

export const useAgentsStore = create<AgentsStore>()(
  immer((set, get) => ({
    ...initialState,
    getAgents: async () => {
      try {
        set((state) => {
          state.agentsLoading = true;
        });

        const response = await apiMiddleware.getAgents();

        let mappedAgents: any = {};
        let allAgents: any[] = [],
          recentAgents: any[] = [],
          agenticApp: any[] = [];
        response?.agents?.map((item: any) => {
          let field = item;
          if (field?.enabled) {
            if (field?.type === "agenticApp") {
              agenticApp.push(field);
            } else {
              allAgents.push(field);
            }
            mappedAgents[field?.id] = field;
          }
        });
        response?.recents?.map((i: string | number) => {
          if (mappedAgents[i]?.enabled) {
            recentAgents.push(mappedAgents[i]);
          }
        });
        const enabledCommonAgents =
          response?.commonAgents?.filter(
            (item: { disabled: any }) => !item?.disabled
          ) || [];
        let agentsData = {
          recents: recentAgents || [],
          agents: allAgents || [],
          agenticApps: agenticApp || [],
          commonAgents: enabledCommonAgents,
        };
       
        set((state) => {
          state.agentsData = agentsData;
          state.agentsLoading = false;
        });

        // Placeholder implementation
        // console.log("fetchMessages called");
      } catch (error) {
        console.error("Error fetching agents:", error);

        // Reset loading state and handle error
        set((state) => {
          state.agentsLoading = false;
          state.agentsData = null;
          // You can add error state handling here if needed
          // state.agentsError = error.message || 'Failed to fetch agents';
        });

        // Re-throw the error if you want calling code to handle it
        throw error;
      }
    },

    getApiAgentsConnectionsByProvider: async (provider: string) => {
      try {
        set((state) => {
          state.apiAgentsConnectionsLoading = true;
          state.apiAgentsConnectionsData = null;
          state.connectionAdded = null;
          state.connectionAddError = null;
        });

        const response = await apiMiddleware.getApiAgentsConnectionsByProvider(provider);
        set((state) => {
          state.apiAgentsConnectionsData = response;
          state.apiAgentsConnectionsLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.apiAgentsConnectionsLoading = false;
        });
        console.error("Error fetching agents connections:", error);
      }
    },

    addApiAgentConnection: async (payload: any) => {
      try {
        set((state) => {
          state.addingApiAgentConnection = true;
          state.connectionAdded = null;
          state.connectionAddError = null;
        });
        const response = await apiMiddleware.addApiAgentConnection(payload);
         set((state) => {
          state.connectionAdded = response;
          state.addingApiAgentConnection = false;
          state.connectionAddError = null;
        });
      } catch (error: any) {
        console.error("Error adding API agent connection:", error);
        
        let errorMessage = 'Failed to add connection';
        if (error?.response?.status === 401) {
          errorMessage = 'Authentication failed';
        } else if (error?.response?.status === 400) {
          errorMessage = 'Invalid connection data';
        } else if (error?.response?.status === 404) {
          errorMessage = 'Connection endpoint not found';
        } else if (error?.response?.status === 500) {
          errorMessage = 'Server error occurred';
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        set((state) => {
          state.addingApiAgentConnection = false;
          state.connectionAdded = null;
          state.connectionAddError = errorMessage;
        });
        
        // Re-throw the error if you want calling code to handle it
        throw error;
      }
    },
    cleanApiAgentConnection: async () => {
      set((state) => {
          state.connectionAdded = null;
          state.addingApiAgentConnection = false;
          state.connectionAddError = null;
      });
    },

    setLocalAgentSelection: async (agent: any) => {
      set((state) => {
       
        state.selectedAgent = agent;
      });
    },

    removeLocalAgentSelection: async () => {
      set((state) => {
      
        state.selectedAgent = null;
      });
    },
  }))
);
