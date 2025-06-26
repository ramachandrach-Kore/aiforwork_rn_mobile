export const entities = ['answersuggestion', 'answerChunk'];
export const EMITTER_TYPES = {
    LIVE_STREAMING: 'liveStreaming',
  };

// Function to get the device timezone
export const getTimeZone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Failed to get timezone:', error);
    return 'UTC'; // fallback to UTC if timezone detection fails
  }
};