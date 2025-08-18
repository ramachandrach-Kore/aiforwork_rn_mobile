import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import MarkDownComponent from "./MarkDownComponent";
import {
  hasMarkdown,
  isAndroid,
} from "../../../aiforwork_sdk_core/utils/utils";
import { markdownStyles } from "./MarkDownStyles";
const AnswerBubbleComponent = ({ item }: any) => {
  console.log("==item===>", item?.item);
  if (item?.citationAnswers?.length > 0) {
    return (
      <View style={markdownStyles.citationContainer}>
        {item?.citationAnswers?.map((citiation: any) => {
          let isMarkDown = hasMarkdown(citiation?.answer);
          if (isMarkDown) {
            return (
              <MarkDownComponent
                answer={citiation?.answer}
                styles={undefined}
              />
            );
          }

          return (
            <Text key={citiation.answer} style={markdownStyles.bodyStyle}>
              {citiation.answer}

              {citiation?.sources?.map((source: any, index: number) => (
                <TouchableOpacity
                  style={markdownStyles.badge}
                  onPress={() => {
                    // if (this.props.citationClicked) {
                    //   this.props?.citationClicked(this.props.item, source);
                    // }
                  }}
                >
                  <View style={markdownStyles.badgeBase}>
                    <Text style={markdownStyles.text1}>{source?.position}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Text>
          );
        })}
      </View>
    );
  } else if (item?.answer?.length > 0) {
    return <MarkDownComponent answer={item?.answer} styles={undefined} />;
  }

  return <></>;
};
export default AnswerBubbleComponent;
