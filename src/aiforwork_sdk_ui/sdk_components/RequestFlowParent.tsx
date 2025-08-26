import React, { useCallback, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { RightArrow } from "../icons";
import { normalize } from "../utils/CommonFunctions";
import EvaImageView from "./EvaImageView";
import { isAndroid } from "../utils/CommonFunctions";
import RequestFlowSheet from "./RequestFlowSheet";
import { MessageState } from "../../aiforwork_sdk_core/utils/MessageStates";
import RequestFlow from "./RequestFlow";

// Type for EvaImageView props
interface EvaImageViewProps {
  url?: string;
  width: number;
  height: number;
  parentStyles?: object;
  imageStyle?: object;
}

interface RequestFlowItem {
  icon?: string;
  content?: string;
}

interface RequestFlowParentProps {
  reqFlow?: RequestFlowItem[];
  messageState?: string;
  fromMainModal?: boolean;
  onPress?: (obj: {
    reqFlow: RequestFlowItem[];
    onReqlowPressTime: number;
  }) => void;
}

const RequestFlowParent: React.FC<RequestFlowParentProps> = (props) => {
  let reqFlow = props?.reqFlow || [];
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const onPressExpand = useCallback(() => {
    // Open the sheet when expand is pressed
    setIsSheetVisible(true);

    // Also call the original onPress if provided
    if (props.onPress) {
      let obj = {
        reqFlow: reqFlow,
        onReqlowPressTime: new Date().getTime(),
      };
      props.onPress(obj);
    }
  }, [reqFlow, props.onPress]);

  const handleSheetClose = useCallback(() => {
    setIsSheetVisible(false);
  }, []);

  const handleRequestFlowPress = useCallback(
    (obj: { reqFlow: RequestFlowItem[]; onReqlowPressTime: number }) => {
      // Handle any interactions within the sheet
      if (props.onPress) {
        props.onPress(obj);
      }
    },
    [props.onPress]
  );

  const onArowFlowPress = useCallback(
    () => {
        setIsSheetVisible(true)
    },
    [props.onPress]
  );


  return (
    <>
    

      <RequestFlow
        reqFlow={reqFlow}
        messageState={props.messageState}
        fromMainModal={props.fromMainModal}
        onPress={onArowFlowPress}
      />

      {/* RequestFlowSheet Modal */}
      <RequestFlowSheet
        visible={isSheetVisible}
        onClose={handleSheetClose}
        reqFlow={reqFlow}
        onRequestFlowPress={handleRequestFlowPress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  flowItemContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  expandableFlowContainer: {
    marginTop: 10,
    flexDirection: "row",
    marginEnd: 10,
    marginBottom: 10,
  },
  arrowContainer: { marginTop: isAndroid ? 6 : 4, marginEnd: 24 },
  expandableFlowText: {
    color: "#3F3F46",
    fontSize: normalize(14),
    fontWeight: "400",
    marginEnd: 10,
    flexShrink: 1,
  },
  modalContainer: {
    paddingTop: 20,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 24,
  },
  flowItemText: {
    fontSize: normalize(16),
    fontWeight: "400",
    color: "#1A1A1E",
    flexShrink: 1,
    lineHeight: normalize(24),
    marginStart: 16,
  },
});

export default RequestFlowParent;
