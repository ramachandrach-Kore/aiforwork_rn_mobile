import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import ListItem from "./ListItem";
import Composebar from "../sdk_composebar/Composebar";
import { useMessagesStore } from "aiforwork-sdk-core";
import { BotChatStyles } from "./styles";
import { MessageState } from "aiforwork-sdk-core";
import { TemplateNavigationHandler } from "./TemplateNavigationHandler";
import { useAgentsStore } from "aiforwork-sdk-core";
import SourcesHorizontal from "../sdk_components/SourcesHorizontal";
// import SourcesHorizontal from "../sdk_components/SourcesHorizontal";

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
  const { messages, sendMessage, recentMessage, listenSocket, failedMessage } =
    useMessagesStore();
  const { selectedAgent } = useAgentsStore();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [failed, setFailed] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    //it will listen to the socket
    //when app loads for the first time

    listenSocket();
  }, []);

  useEffect(() => {
    // Auto-scroll when a message is being sent
    if (recentMessage?.messageState === MessageState.SENDING) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  }, [recentMessage?.messageState]);

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

  useEffect(() => {
    setFailed((prev) => prev + 1);
  }, [failedMessage]);

  const keyExtractor = useCallback(
    (item: any) => item?.reqId || item?.messageId || "",
    []
  );

  // Optimized render item function
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <ListItem
        item={item}
        onPress={handleItemPress}
        index={index}
        isLastItem={index === 0}
      />
    ),
    []
  );

  // Handle item press
  const handleItemPress = useCallback((item: any) => {
    // TODO: Add navigation or action logic here
    // You can add navigation, show modal, or any other action
  }, []);

  // Handle context close action for SourcesHorizontal - commented out for testing
  /* const handleContextCloseAction = (item: any) => {
    // TODO: Implement logic to remove source from context
    console.log('Remove source:', item);
  };

  // Handle sheet open action for SourcesHorizontal
  const handleOpenSheet = (item: any) => {
    // TODO: Implement sheet opening logic
    console.log('Open sheet:', item);
  };

  // Handle reset filters for SourcesHorizontal
  const handleResetFilters = () => {
    // TODO: Implement filter reset logic
    console.log('Reset filters');
  }; */

  // Handle message sending
  const handleSendMessage = useCallback(
    (message: string) => {
      const messagePayload: any = {
        question: message,
        boardId: recentMessage?.boardId,
      };

      if (
        selectedAgent &&
        selectedAgent !== null &&
        selectedAgent !== undefined
      ) {
        const source = {
          name: selectedAgent?.name,
          docId: selectedAgent?.id,
          source: selectedAgent?.id,
          title: selectedAgent?.name,
          icon: selectedAgent?.icon,
          isAgent: true,
        };

        let context = {
          sources: [source],
        };

        messagePayload.context = context;
      }

      sendMessage(messagePayload);
    },
    [recentMessage, sendMessage, selectedAgent]
  );

  return (
    <View style={BotChatStyles.container}>
      <ListHeader />

      <FlatList
        ref={flatListRef}
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
      <SourcesHorizontal />
      <Composebar
        onSend={handleSendMessage}
        sendButtonDisabled={
          messages?.[0]?.messageState === MessageState.SENDING
        }
      />
    </View>
  );
};

export default BotChat;
