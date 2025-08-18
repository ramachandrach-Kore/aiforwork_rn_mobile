export enum MessageState {
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  PENDING = 'PENDING'
}

export type MessageStateType = keyof typeof MessageState;

// Helper function to get display text for message states
export const getMessageStateText = (state: MessageState): string => {
  switch (state) {
    case MessageState.SENDING:
      return 'Sending...';
    case MessageState.SENT:
      return 'Sent';
    case MessageState.FAILED:
      return 'Failed';
    case MessageState.DELIVERED:
      return 'Delivered';
    case MessageState.READ:
      return 'Read';
    case MessageState.PENDING:
      return 'Pending';
    default:
      return 'Unknown';
  }
};
