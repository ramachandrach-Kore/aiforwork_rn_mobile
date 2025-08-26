import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import ListItem from "./ListItem";
import Composebar from "../sdk_composebar/Composebar";
import { useMessagesStore } from "../../aiforwork_sdk_core/store/messagesStore";
import { BotChatStyles } from "./styles";
import { MessageState } from "../../aiforwork_sdk_core/utils/MessageStates";
import { TemplateNavigationHandler } from "./TemplateNavigationHandler";

// Constants for FlatList optimization
const FLATLIST_CONFIG = {
  onEndReachedThreshold: 0.5,
  removeClippedSubviews: true,
  maxToRenderPerBatch: 10,
  windowSize: 10,
  initialNumToRender: 10,
  updateCellsBatchingPeriod: 50,
} as const;

// Type definitions
interface BotChatProps {
  navigation: any;
}

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

const BotChat: React.FC<BotChatProps> = ({ navigation }) => {
  const { messages, sendMessage, recentMessage, listenSocket } =
    useMessagesStore();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);

  useEffect(() => {
    //it will listen to the socket
    //when app loads for the first time

    listenSocket();
  }, []);

  // Initialize template navigation handler
  const templateNavigationHandler = useCallback(() => {
    return new TemplateNavigationHandler(navigation);
  }, [navigation]);

  useEffect(() => {
    if (recentMessage) {
      const shouldDisableButton =
        recentMessage.messageState === MessageState.SENDING;
      setIsSendButtonDisabled(shouldDisableButton);

      if (
        recentMessage?.templateType &&
        recentMessage?.status !== "discard" &&
        recentMessage?.status !== "terminated"
      ) {
        // Handle navigation based on template type using the utility class
        const navigationHandler = templateNavigationHandler();
        navigationHandler.handleTemplateNavigation(recentMessage);
      }
    }
  }, [recentMessage, templateNavigationHandler]);

  const keyExtractor = useCallback(
    (item: any) => item?.reqId || item?.messageId || "",
    []
  );

  // Optimized render item function
  const renderItem = useCallback(
    ({ item, index }: { item: any, index: number }) => (
      <ListItem item={item} onPress={handleItemPress} index={index} isLastItem={index === 0} />
    ),
    []
  );

  // Handle item press
  const handleItemPress = useCallback((item: any) => {
    // TODO: Add navigation or action logic here
    // You can add navigation, show modal, or any other action
  }, []);

  // Handle message sending
  const handleSendMessage = useCallback(
    (message: string) => {
      const messagePayload: any = {
        question: message,
        boardId: recentMessage?.boardId,
      };
      sendMessage(messagePayload);
    },
    [recentMessage, sendMessage]
  );

  return (
    <View style={BotChatStyles.container}>
      <ListHeader />
      <FlatList
        data={messages}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={ListFooter}
        onEndReachedThreshold={FLATLIST_CONFIG.onEndReachedThreshold}
        removeClippedSubviews={FLATLIST_CONFIG.removeClippedSubviews}
        maxToRenderPerBatch={FLATLIST_CONFIG.maxToRenderPerBatch}
        windowSize={FLATLIST_CONFIG.windowSize}
        initialNumToRender={FLATLIST_CONFIG.initialNumToRender}
        updateCellsBatchingPeriod={FLATLIST_CONFIG.updateCellsBatchingPeriod}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={BotChatStyles.listContent}
        style={BotChatStyles.flatList}
        inverted
      />
      <Composebar
        onSend={handleSendMessage}
        sendButtonDisabled={isSendButtonDisabled}
      />
    </View>
  );
};

export default BotChat;
