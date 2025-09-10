import React, { useState, useEffect, useCallback } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  BackHandler,
} from "react-native";
import { normalize } from "../utils/CommonFunctions";
import { CloseIcon } from "../icons";
import EvaImageView from "../sdk_components/EvaImageView";
import { useMessagesStore } from "../../aiforwork_sdk_core/store/messagesStore";

interface IntentAmbiguityProps {
  data?: any;
  goBack?: () => void;

  onConfirmCallback?: (payload: any) => void;

  t?: (key: string) => string;
}

const IntentAmbiguity: React.FC<IntentAmbiguityProps> = (props) => {
  const [data, setData] = useState<any | undefined>(props.data);
  const { sendMessage, updateMessageStatus } = useMessagesStore();
  const handleBackButton = useCallback(() => {
    return true;
  }, []);

  const openSheet = useCallback(() => {}, []);

  const closeSheet = useCallback(() => {
    if (props.goBack) {
      props.goBack();
    }
  }, []);

  const discardActionPress = useCallback(
    (data: any | undefined) => {
      let param: any = {
        boardId: data?.boardId,
        messageId: data?.messageId || data?.id,
      };
      let payload = {
        status: "discard",
      };
      // if (data?.localPostObject?.stepId) {
      //   param.localPostObject = data?.localPostObject;
      // }
      console.log(param, " ====param & payload ==>", payload);
      updateMessageStatus(payload, param);
    },
    [props]
  );

  const selectChoice = useCallback(
    (choiceData: any, isMeeting: boolean) => {
      let resolved = [{ intent: [{ ...choiceData }] }];
      let payload: any = {
        question: data?.question,
        resolved: resolved,
        messageId: data?.messageId,
      };
      if (isMeeting) {
        payload.itemsAmbiguity = true;
        payload.resolved = { eventId: choiceData?.id };
      } else {
        payload.intentAmbiguity = true;
      }
      console.log("selectChoice payload==>", payload);

      sendMessage(payload);
      if (props.onConfirmCallback) {
        props.onConfirmCallback(payload);
      }
      // props.navigation.goBack();   HERE COMMENTED
      closeSheet();
    },
    [data, props, closeSheet]
  );

  const renderItem = useCallback(
    (item: any, index: number) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => selectChoice(item, false)}
          style={styles.choiceView}
        >
          {item?.icon && (
            <EvaImageView
              url={item?.icon}
              width={normalize(30)}
              height={normalize(30)}
            />
          )}
          <Text style={styles.headerText} numberOfLines={1}>
            {item?.label}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectChoice]
  );

  const renderMeetingItem = useCallback(
    (item: any, index: number) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() => selectChoice(item, true)}
          style={styles.choiceView}
        >
          <Image
            style={{ width: normalize(30), height: normalize(30) }}
            resizeMode="contain"
            source={{ uri: item?.icon }}
          />
          <View>
            <Text style={styles.headerText} numberOfLines={1}>
              {item?.title}
            </Text>
            <Text style={styles.subtitleText}>{item?.subtitle}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [selectChoice]
  );

  const renderBackdrop = useCallback(() => {
    return <View style={styles.backdrop} />;
  }, []);

  const goBackPress = useCallback(() => {
    discardActionPress(data);

    console.log("=========>", data);
    closeSheet();
  }, [data, discardActionPress, props]);

  useEffect(() => {
    openSheet();
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButton
    );

    return () => {
      subscription?.remove();
    };
  }, [openSheet, handleBackButton]);

  const templateInfo = data?.templateInfo;
  const label =
    templateInfo?.ambiguous?.length && templateInfo.ambiguous.length > 1
      ? "There are conflicts on few inputs. Please confirm"
      : templateInfo?.ambiguous?.[0]?.label;
  const choices = templateInfo?.ambiguous?.[0]?.value?.choices;
  const intent = templateInfo?.intent;
  const isMeeting = intent?.includes("Meeting");

 
  return (
    <View>
      <View style={styles.modalView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={styles.modalHeader}>
            {isMeeting ? "Choose meeting" : "Choose system"}
          </Text>
          <TouchableOpacity
            onPress={goBackPress}
            hitSlop={20}
            style={{
              position: "absolute",
              end: 16,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <CloseIcon width={16} height={16} />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        <View style={styles.content}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          {choices?.map((item: any, index: number) => {
            if (isMeeting) {
              return renderMeetingItem(item, index);
            }
            return renderItem(item, index);
          })}
        </View>
      </View>
    </View>
  );
};

export default IntentAmbiguity;
const styles = StyleSheet.create({
  modalHeader: {
    fontSize: normalize(16),
    color: "#101828",
    alignSelf: "center",
    fontWeight: "600",
    paddingBottom: 16,
  },
  divider: {
    backgroundColor: "#D0D5DD",
    height: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerText: {
    fontSize: normalize(14),
    color: "#344054",
    fontWeight: "500",

    paddingLeft: 10,
  },
  subtitleText: {
    fontSize: normalize(12),
    color: "#98A2B3",
    fontWeight: "500",

    paddingLeft: 10,
  },

  label: {
    fontSize: normalize(15),
    color: "#101828",
    fontWeight: "500",
    paddingBottom: 10,
    paddingTop: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "#8B000000",
  },
  choiceView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,
    paddingBottom: 60,
  },
  modalBackgroundView: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    flex: 1,
  },
});
