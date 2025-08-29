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
}

export interface AgentsActions {
  getAgents: () => Promise<void>;
}

const initialState: AgentsState = {
  agentsLoading: false,
  agentsData: null,
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
        console.log("agentsData",agentsData);
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
  }))
);
