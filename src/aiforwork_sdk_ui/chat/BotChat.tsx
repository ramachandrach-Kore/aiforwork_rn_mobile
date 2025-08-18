import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import ListItem from "./childComponents/ListItem";
import Composebar from "../../aiforwork_sdk_ui/composebar/Composebar";
import { useMessagesStore } from "../../aiforwork_sdk_core/store/messagesStore";
import { BotChatStyles } from "./styles";
import { MessageState } from "../../aiforwork_sdk_core/utils/MessageStates";

// Optimized Header Component
const ListHeader = React.memo(() => (
  <View style={BotChatStyles.headerContainer}>
    <Text style={BotChatStyles.headerTitle}>Ai For Work</Text>
  </View>
));

// Optimized Footer Component
const ListFooter = React.memo(() => (
  <View style={BotChatStyles.footerContainer}>
    <Text style={BotChatStyles.footerText}>End of list</Text>
  </View>
));

const BotChat: React.FC = () => {
  const { messages, sendMessage, recentMessage } = useMessagesStore();
  const [disabledSendBtn, setDisableSendBtn] = useState(false);
  // Optimized key extractor

  useEffect(() => {
    if (recentMessage) {
      if (recentMessage?.messageState === MessageState.SENDING) {
        setDisableSendBtn(true);
      } else {
        setDisableSendBtn(false);
      }
    }
  }, [recentMessage]);

  const keyExtractor = useCallback(
    (item: any) => item?.reqId || item?.messageId,
    []
  );

  // Optimized render item function
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ListItem item={item} onPress={handleItemPress} />
    ),
    []
  );

  // Handle item press
  const handleItemPress = useCallback((item: any) => {
    console.log("Item pressed:", item.title);
    // Add your navigation or action logic here
    // You can add navigation, show modal, or any other action
  }, []);

  // Optimized onSendBtnPress function for Composebar
  const onSend = useCallback(
    (message: string) => {
      console.log("Message sent:", message);
      let messageObject = {
        question: message,
        boardId: recentMessage?.boardId,
      };
      sendMessage(messageObject);
    },
    [recentMessage]
  );

  const renderHeader = () => {
    return <ListHeader />;
  };

  return (
    <View style={BotChatStyles.container}>
      {renderHeader()}
      <FlatList
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={ListFooter}
        // ListEmptyComponent={EmptyComponent}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={BotChatStyles.listContent}
        style={BotChatStyles.flatList}
      />
      <Composebar onSend={onSend} sendButtonDisabled={disabledSendBtn} />
    </View>
  );
};

export default BotChat;
