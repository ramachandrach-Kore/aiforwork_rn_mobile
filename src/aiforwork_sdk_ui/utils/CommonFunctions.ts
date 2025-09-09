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
