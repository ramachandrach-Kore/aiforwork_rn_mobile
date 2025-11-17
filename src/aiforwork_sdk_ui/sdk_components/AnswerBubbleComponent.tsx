import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import MarkDownComponent from "./MarkDownComponent";
import CitationSourcesComponent from "./CitationSourcesComponent";
import { hasMarkdown, isAndroid } from "aiforwork-sdk-core";
import { markdownStyles } from "./MarkDownStyles";
const AnswerBubbleComponent = ({ item }: any) => {
  if (item?.citationAnswers?.length > 0) {
    return (
      <View style={markdownStyles.citationContainer}>
        {item?.citationAnswers?.map((citiation: any, index: number) => {
          let isMarkDown = hasMarkdown(citiation?.answer);
          if (isMarkDown) {
            return (
              <MarkDownComponent
                key={index + citiation?.answer?.[0]}
                answer={citiation?.answer}
                styles={undefined}
              />
            );
          }

          return (
            <View>
              <Text style={markdownStyles.bodyStyle}>
                {citiation.answer}
               
              </Text>
              <CitationSourcesComponent 
                sources={citiation?.sources}    
                item={item}
              />
             
            </View>
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
