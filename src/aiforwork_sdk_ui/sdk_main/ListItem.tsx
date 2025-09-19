import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import QuestionBubble from "../sdk_components/QuestionBubble";
import AnswerBubbleComponent from "../sdk_components/AnswerBubbleComponent";
import SourcesComponent from "../sdk_components/SourcesComponent";
import RequestFlowParent from "../sdk_components/RequestFlowParent";
import ResolveAmbiguityParent from "../sdk_templates/ResolveAmbiguityParent";
import { AllTemplates } from "../sdk_templates/AllTemplatesConst";
import Conversations from "../sdk_templates/Conversations";
import IntentAmbiguityParent from "../sdk_templates/IntentAmbiguityParent";
import InterruptionParent from "../sdk_templates/InterruptionParent";
import ConnectionProvider from "../sdk_templates/ConnectionProvider";

interface ListItemProps {
  item: any;
  onPress: (item: any) => void;
  index: number;
  isLastItem: boolean;
}

const renderQuestionBubble = (item: any) => {
  return <QuestionBubble item={item} />;
};

const renderSuggestion = (item: any) => {
  return (
    <View>
      {/* Add your suggestion rendering logic here */}
      <RequestFlowParent
        reqFlow={item?.reqFlow}
        messageState={item?.messageState}
      />
    </View>
  );
};
const renderTemplate = (item: any, isLastItem: boolean) => {
  switch (item?.templateType) {
    case AllTemplates.RESOLVE_AMBIGUITY:
      return (
        <ResolveAmbiguityParent
          data={item}
          onClose={() => {}}
          onConfirmCallback={() => {}}
          isLastItem={isLastItem}
        />
      );

    case AllTemplates.AGENT_WELCOME_TEMPLATE:
      return (
        <Conversations
          suggestions={item?.templateInfo?.suggestions}
          onQueryPress={() => {}}
          boardId={item?.boardId}
        />
      );

    case AllTemplates.INTENT_AMBIGUITY:
    case AllTemplates.ITEMS_AMBIGUITY_TEMPLATE:
      return <IntentAmbiguityParent data={item} isLastItem={isLastItem} />;

    case AllTemplates.INTERRUPTION_TEMPLATE:
      return <InterruptionParent data={item} isLastItem={isLastItem} />;

    case AllTemplates.CONNECTION_PROVIDER:
      return <ConnectionProvider data={item} isLastItem={isLastItem} />;
    default:
      return <Text>{item?.templateType} : Under Development</Text>;
  }
};

const renderAnswerBubble = (item: any, index: number, isLastItem: boolean) => {
  return (
    <View>
      {item?.reqFlow && item?.reqFlow?.length > 0 && renderSuggestion(item)}
      {item?.status !== "discard" && item?.status !== "terminated" && (
        <AnswerBubbleComponent item={item} />
      )}
      {item?.templateType &&
        item?.templateType !== "search_answer" &&
        renderTemplate(item, isLastItem)}
    
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
const ListItem: React.FC<ListItemProps> = ({
  item,
  onPress,
  index,
  isLastItem,
}) => {
  // console.log(index," ", isLastItem," isLastItem", item?.templateType);
  const handlePress = useCallback(() => {
    onPress(item);
  }, [item, onPress]);

  return (
    <View style={styles.container}>
      {renderQuestionBubble(item)}
      {item?.status === "discard" || item?.status === "terminated" ? (
        <Text style={styles.discardedText}>
          Discarded, I see you interrupted the action. Please let me know how I
          can assist you further.
        </Text>
      ) : (
        renderAnswerBubble(item, index, isLastItem)
      )}

      {item?.sources?.length > 0 && renderSources(item)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
  },
  discardedText: {
    fontSize: 16,
   
    color: "red",
    marginVertical: 16,
  },
});

export default ListItem;
