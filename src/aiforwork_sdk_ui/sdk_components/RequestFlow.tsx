import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { RightArrow } from "../icons";
import { normalize } from "../utils/CommonFunctions";
import EvaImageView from "./EvaImageView";
import { isAndroid } from "../utils/CommonFunctions";
import { MessageState } from "../../aiforwork_sdk_core/utils/MessageStates";

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

interface RequestFlowProps {
  reqFlow?: RequestFlowItem[];
  messageState?: string;
  fromMainModal?: boolean;
  onPress?: () => void;
}

const RequestFlow: React.FC<RequestFlowProps> = (props) => {
  let reqFlow = props?.reqFlow || [];

  return (
    <>
      {props.fromMainModal === true ? (
        <View style={styles.modalContainer}>
          <View style={{ paddingHorizontal: 8 }}>
            {reqFlow?.map((item, index) => {
              return (
                <View key={index} style={styles.flowItemContainer}>
                  <View style={styles.iconContainer}>
                    <EvaImageView
                      {...({
                        url: item?.icon,
                        width: 20,
                        height: 20,
                        parentStyles: {
                          marginEnd: 0,
                        },
                      } as EvaImageViewProps)}
                    />
                  </View>
                  <Text style={styles.flowItemText}>{item?.content || ""}</Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        reqFlow?.length > 0 && (
          <TouchableOpacity
            style={styles.expandableFlowContainer}
            onPress={props.onPress}
            disabled={props.messageState === MessageState.SENDING}
          >
            <View style={{flexDirection: "row", alignItems: "center"}}>
            <Text style={styles.expandableFlowText}>
              {reqFlow?.[reqFlow?.length - 1]?.content}
            </Text>
            {props.messageState !== MessageState.SENDING && (
              <View style={styles.arrowContainer}>
                <RightArrow width={10} height={10} color="#70707B" />
              </View>
            )}
            </View>
          </TouchableOpacity>
        )
      )}
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

export default RequestFlow;
