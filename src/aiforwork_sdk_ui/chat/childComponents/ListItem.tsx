import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import QuestionBubble from "./QuestionBubble";
import AnswerBubbleComponent from "./AnswerBubbleComponent";
import SourcesComponent from "./SourcesComponent";

interface ListItemProps {
  item: any;
  onPress: (item: any) => void;
}

const renderQuestionBubble = (item: any) => {
  return <QuestionBubble item={item} />;
};

const renderAnswerBubble = (item: any) => {
  return (
    <View>
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
      {item?.sources?.length>0&&renderSources(item)}
    </View>
  );
});

const styles = StyleSheet.create({});

export default ListItem;
