import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import QuestionBubble from "../sdk_components/QuestionBubble";
import AnswerBubbleComponent from "../sdk_components/AnswerBubbleComponent";
import SourcesComponent from "../sdk_components/SourcesComponent";
import RequestFlow from "../sdk_components/RequestFlow";

interface ListItemProps {
  item: any;
  onPress: (item: any) => void;
}

const renderQuestionBubble = (item: any) => {
  return <QuestionBubble item={item} />;
};

const renderSuggestion = (item: any) => {
  return (
    <View>
      {/* Add your suggestion rendering logic here */}
      <RequestFlow reqFlow={item?.reqFlow} />
    </View>
  );
};

const renderAnswerBubble = (item: any) => {
  return (
    <View>
      {item?.reqFlow && item?.reqFlow?.length > 0 && renderSuggestion(item)}
      <AnswerBubbleComponent item={item} />
    </View>
  );
};

const renderSources = (item: any) => {
  return (
    <View>
      <SourcesComponent item={item} />
    </View>
  );
};
// Optimized Item Component using React.memo
const ListItem: React.FC<ListItemProps> = React.memo(({ item, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]); 

  return (
    <View style={{ flex: 1, width: "100%", paddingHorizontal: 16 }}>
      {renderQuestionBubble(item)}
      {renderAnswerBubble(item)}
      {item?.sources?.length > 0 && renderSources(item)}
    </View>
  );
});

const styles = StyleSheet.create({});

export default ListItem;
