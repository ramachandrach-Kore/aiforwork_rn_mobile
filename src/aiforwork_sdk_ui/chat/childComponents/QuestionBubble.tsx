import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { getMessageStateText } from "../../../aiforwork_sdk_core/utils/MessageStates";
import { useState } from "react";
interface QuestionItemProps {
  item: any;
  onPress?: (item: any) => void;
}
const QuestionBubble: React.FC<QuestionItemProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item?.question}</Text>
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <Text style={styles.itemTimestamp}>
          {getMessageStateText(item?.messageState)}
        </Text>
      )}
    </View>
  );
};

export default QuestionBubble;
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  itemContainer: {
    backgroundColor: "white",

    borderRadius: 30,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    marginEnd: 16,
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  itemContent: {
    padding: 16,
  },
  itemTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter-Medium",
    color: "#0F0F0F",
    alignSelf: "flex-end",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  itemTimestamp: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    alignSelf: "flex-end",
    marginEnd: 20,
  },
});
