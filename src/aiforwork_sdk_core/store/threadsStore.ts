import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import ApiClient from '../restapi/axios/api_client';



export interface Response {
    boards:any[],
    lastBoardSortTime:boolean,
    moreAvailable: boolean;
  };
export interface RenameData{
    name:String
}
export interface ThreadsState {
  boards: any[];
  loading: boolean;
  error: string | null;
  moreAvailable: boolean;
  currentBoard: any;
}

export interface ThreadsActions {
  fetchThreads: () => Promise<void>;
  renameThread: (boardId: string, newName: RenameData) => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
}

export type ThreadsStore = ThreadsState & ThreadsActions;

const initialState: ThreadsState = {
  boards: [],
  loading: false,
  error: null,
  moreAvailable: false,
  currentBoard: null,
};

export const useThreadsStore = create<ThreadsStore>()(
  immer((set, get) => ({
    ...initialState,

    fetchThreads: async () => {
        console.log('Calling threads fetched');
      try {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        const apiClient = ApiClient.getInstance();
        const response = await apiClient.getCall<Response>(
          '/api/1.1/kora/boards?type=history&limit=50'
        )
        set((state) => {
          state.boards = response.boards || [];
          state.moreAvailable = response.moreAvailable || false;
          state.loading = false;
          state.error = null;
        });
      } catch (error: any) {
        set((state) => {
          state.loading = false;
          state.error = error.message || 'Failed to fetch threads';
          console.error('Error fetching threads:', error);
        });
      }
    },

    renameThread: async (boardId: string, data: RenameData) => {
      console.log('Renaming thread/board:', boardId, 'to:', data);
      try {
        set((state) => {
          state.loading = true;
          state.error = null;
        });

        const apiClient = ApiClient.getInstance();
        const response = await apiClient.putCall(
          `/api/1.1/ka/boards/${boardId}`,
          data
        );

        set((state) => {
          // Update the board name in the local state
          const boardIndex = state.boards.findIndex(board => board.id === boardId);
          if (boardIndex !== -1) {
            state.boards[boardIndex].name = response?.name;
          }
          state.loading = false;
          state.error = null;
        });

        console.log('Thread renamed successfully:', response);
      } catch (error: any) {
        set((state) => {
          state.loading = false;
          state.error = error.message || 'Failed to rename thread';
          console.error('Error renaming thread:', error);
        });
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },

    resetStore: () => {
      set(() => initialState);
    },
  }))
);

export default useThreadsStore;
