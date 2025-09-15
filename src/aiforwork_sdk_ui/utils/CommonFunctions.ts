import { Dimensions, Platform, PixelRatio, Linking } from "react-native";
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// based on iphone X's scale
let NEW_SCREEN_WIDTH =
  SCREEN_WIDTH > SCREEN_HEIGHT ? SCREEN_HEIGHT : SCREEN_WIDTH;
const scale = NEW_SCREEN_WIDTH / 375;

export function normalize(size: number) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.ceil(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const openMessage = (messageId: string, redirectUrl: any) => {
  let mobUrl = redirectUrl?.mob || redirectUrl?.dweb;
  console.log(messageId, "mobUrl", mobUrl);
  switch (Platform.OS) {
    case "ios": {
      if (messageId?.length > 0) {
        const messageUrl = "message://" + messageId;

        Linking.canOpenURL(messageUrl).then((supported) => {
          if (supported) {
            console.log(messageUrl, "openURL");
          } else {
            redirect(mobUrl);
          }
        });
      } else if (mobUrl?.length > 0) {
        redirect(mobUrl);
      }
      break;
    }
    case "android": {
      if (mobUrl?.length > 0) {
        redirect(mobUrl);
      }
      break;
    }
    default:
      break;
  }
};
export const redirect = (url: string) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      try {
        Linking.openURL(url);
      } catch (e) {}
    }
  });
};


export const SHEET_ID_LIST = ['gsheet', 'xls', 'xlsx'];



// Constants moved outside functions for better performance
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
] as const;

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const DAYS_FULL = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
  'Thursday', 'Friday', 'Saturday'
] as const;

// Time constants for better readability
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_MONTH = 30; // Approximate
const MONTHS_PER_YEAR = 12;

type DateInput = string | number | Date;
type TimelineType = 
  | 'time'
  | 'monthNameDateFullyear'
  | 'M/DD/YYYY'
  | 'DD/M/YYYY'
  | 'YYYY-MM-DD'
  | 'DD-MM-YYYY'
  | 'numberDateTime'
  | 'fulldate'
  | 'source'
  | 'notify'
  | 'dateTime';

/**
 * Optimized function to format time in 12-hour format
 * @param time - Date input (string, number, or Date object)
 * @returns Formatted time string (e.g., "02:30 PM")
 */
function getTime(time: DateInput): string {
  if (!time) return '';
  
  const date = new Date(time);
  if (isNaN(date.getTime())) return '';
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12 || 12;
  
  // Format with leading zeros using padStart for better performance
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Helper function to format date parts with leading zeros
 */
const formatDatePart = (value: number): string => value.toString().padStart(2, '0');

/**
 * Helper function to get relative time for notifications
 */
const getRelativeTime = (givenDate: Date, currentDate: Date): string => {
  const diffMs = currentDate.getTime() - givenDate.getTime();
  const diffSeconds = diffMs / MILLISECONDS_PER_SECOND;
  const diffMinutes = diffSeconds / SECONDS_PER_MINUTE;
  const diffHours = diffMinutes / MINUTES_PER_HOUR;
  const diffDays = diffHours / HOURS_PER_DAY;

  // Check if dates are on the same day
  const todayStart = new Date(currentDate);
  const givenStart = new Date(givenDate);
  todayStart.setHours(0, 0, 0, 0);
  givenStart.setHours(0, 0, 0, 0);

  if (todayStart.getTime() === givenStart.getTime()) {
    if (diffSeconds < SECONDS_PER_MINUTE) {
      return 'now';
    } else if (diffMinutes < MINUTES_PER_HOUR) {
      const minutes = Math.floor(diffMinutes);
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
  } else {
    if (diffDays < DAYS_PER_MONTH) {
      let days = Math.floor(diffDays);
      if (days <= 0) days = 1;
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffDays / DAYS_PER_MONTH);
      if (months < MONTHS_PER_YEAR) {
        return `${months} month${months > 1 ? 's' : ''} ago`;
      } else {
        const years = Math.floor(months / MONTHS_PER_YEAR);
        return `${years} year${years > 1 ? 's' : ''} ago`;
      }
    }
  }
};

/**
 * Optimized timeline formatting function with better performance and type safety
 * @param time - Date input (string, number, or Date object)
 * @param type - Format type for the output
 * @returns Formatted date string based on type
 */
export const getTimeline = (time: DateInput, type: TimelineType): string => {
  if (!time) return '';
  
  const givenDate = new Date(time);
  if (isNaN(givenDate.getTime())) return '';

  // Pre-calculate commonly used values
  const day = DAYS_SHORT[givenDate.getDay()];
  const month = MONTHS[givenDate.getMonth()];
  const date = givenDate.getDate();
  const year = givenDate.getFullYear();
  const monthIndex = givenDate.getMonth() + 1;
  
  // Format date parts with leading zeros
  const dd = formatDatePart(date);
  const mm = formatDatePart(monthIndex);

  // Use a switch statement for better performance than if-else chain
  switch (type) {
    case 'time':
      return getTime(time);

    case 'monthNameDateFullyear':
      return `${month} ${date}, ${year}`;

    case 'M/DD/YYYY':
      return `${mm}/${dd}/${year}`;

    case 'DD/M/YYYY':
    case 'DD-MM-YYYY': // Both formats return the same pattern
      return `${dd}/${mm}/${year}`;

    case 'YYYY-MM-DD':
      return `${year}-${mm}-${dd}`;

    case 'numberDateTime':
      return `${dd}/${mm}/${year} - ${getTime(time)}`;

    case 'fulldate':
      return `${day}, ${month} ${date}, ${year}, ${getTime(time)}`;

    case 'source':
      return `${getTime(time)}, ${date} ${month} ${year}`;

    case 'notify':
      return getRelativeTime(givenDate, new Date());

    case 'dateTime':
      return `${month} ${date}, ${year}, ${getTime(time)}`;

    default:
      return '';
  }
};

