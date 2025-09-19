import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";

import { normalize, isAndroid } from "../utils/CommonFunctions";
import { CheckMark, LightBulb } from "../icons";
import { QueriesIcon } from "../icons/SdkIcons";
import { useMessagesStore } from "../../aiforwork_sdk_core/store/messagesStore";
import { useAgentsStore } from "../../aiforwork_sdk_core/store/agentsStore";

const { height: screenHeight } = Dimensions.get("window");

interface Utterance {
  label: string;
}

interface Suggestion {
  title: string;
  utterances: Utterance[];
}

interface ConversationsProps {
  suggestions?: Suggestion[];
  onQueryPress: (isMore: boolean, query: string | Suggestion) => void;
  boardId: string;
}

const Conversations: React.FC<ConversationsProps> = (props) => {
  const { sendMessage } = useMessagesStore();
  const { selectedAgent } = useAgentsStore();

  const [utterances] = React.useState<Utterance[]>(
    props?.suggestions?.[0]?.utterances || []
  );

  // Modal state and animations
  const [modalVisible, setModalVisible] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  // Modal animation effect
  React.useEffect(() => {
    if (modalVisible) {
      // Slide up animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible, slideAnim, backdropOpacity]);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleBackdropPress = () => {
    handleCloseModal();
  };

  // Pan responder for drag gestures - simplified approach
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        console.log("onStartShouldSetPanResponder triggered");
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        console.log("onMoveShouldSetPanResponder - dy:", gestureState.dy);
        return gestureState.dy > 5; // Only respond to downward drags
      },
      onPanResponderGrant: (evt, gestureState) => {
        console.log("Pan responder granted");
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log("Pan move - dy:", gestureState.dy);
        // Only allow downward movement
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log(
          "Pan release - dy:",
          gestureState.dy,
          "vy:",
          gestureState.vy
        );
        if (gestureState.dy > 100 || gestureState.vy > 0.3) {
          // Close modal if dragged down enough
          handleCloseModal();
        } else {
          // Snap back to original position
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderItemSeperator = () => {
    return <View style={styles.itemSeparator} />;
  };

  const getUttrances = (): Utterance[] => {
    let uttrances = [...utterances];
    return uttrances?.splice(0, 3);
  };

  const onQueryPressItem = (query: string) => {
    let payload: any = {
      question: query,
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
        type: "agent",
      };

      payload.context = context;
    
    }
    if(props.boardId){
      payload.boardId = props.boardId;
    }
    sendMessage(payload);

    
  };

  const renderSourceItem = ({
    item,
    index,
  }: {
    item: Utterance;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          onQueryPressItem(item?.label);
        }}
        style={styles.utteranceItem}
      >
        <CheckMark
          height={normalize(16)}
          width={normalize(16)}
          color={"#98A2B3"}
        />
        <Text style={styles.utteranceLabel}>{item?.label}</Text>
      </TouchableOpacity>
    );
  };

  const onMoreBtnPress = () => {
    setModalVisible(true);
  };

  return (
    <>
      <View style={styles.conversationsContainer}>
        <View style={styles.conversationHeader}>
          <QueriesIcon width={16} height={16} />
          <Text
            style={[styles.suggestionTitle, { marginStart: 10, marginEnd: 10 }]}
          >
            {props?.suggestions?.[0]?.title}
          </Text>
        </View>
        <FlatList
          data={getUttrances()}
          ItemSeparatorComponent={renderItemSeperator}
          renderItem={renderSourceItem}
        />
        {utterances?.length > 3 && (
          <View style={{ flexWrap: "wrap" }}>
            <TouchableOpacity
              style={styles.moreButton}
              onPress={onMoreBtnPress}
            >
              <Text style={styles.moreButtonText}>
                +{utterances?.length - 3} more
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modal for showing all conversations */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
        statusBarTranslucent
      >
        <View style={modalStyles.container}>
          {/* Backdrop */}
          <Animated.View
            style={[
              modalStyles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          >
            <TouchableOpacity
              style={modalStyles.backdropTouchable}
              activeOpacity={1}
              onPress={handleBackdropPress}
            />
          </Animated.View>

          {/* Sheet Content */}
          <Animated.View
            style={[
              modalStyles.sheetContainer,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={modalStyles.sheetContent}>
              {/* Draggable Header Area */}
              <View 
                style={modalStyles.draggableArea}
                {...panResponder.panHandlers}
              >
                {/* Handle Bar */}
                <View style={modalStyles.handleBar}>
                  <View style={modalStyles.handle} />
                </View>

                {/* Modal Header */}
                <View style={modalStyles.modalHeader}>
                  <View style={modalStyles.headerIconBackground}>
                    <QueriesIcon width={20} height={20} />
                  </View>
                  <Text style={modalStyles.modalHeaderText}>
                    {props?.suggestions?.[0]?.title}
                  </Text>
                </View>
              </View>

              {/* Modal Content */}
              <FlatList
                data={utterances}
                ItemSeparatorComponent={renderItemSeperator}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      onQueryPressItem(item?.label);
                      handleCloseModal();
                    }}
                    style={modalStyles.modalUtteranceItem}
                  >
                    <CheckMark
                      height={normalize(16)}
                      width={normalize(16)}
                      color={"#98A2B3"}
                    />
                    <Text style={modalStyles.modalUtteranceLabel}>
                      {item?.label}
                    </Text>
                  </TouchableOpacity>
                )}
                style={modalStyles.content}
                contentContainerStyle={modalStyles.scrollContent}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

export default Conversations;

const styles = StyleSheet.create({
  conversationsContainer: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: 16,
    padding: 16,
    flex: 1,
  },
  utteranceItem: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  conversationHeader: { flexDirection: "row", alignItems: "center" },
  utteranceLabel: {
    fontSize: normalize(14),
    fontWeight: "400",
    color: "#101828",
    marginStart: 10,
  },
  moreButton: {
    backgroundColor: "#F2F4F7",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  moreButtonText: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: "#344054",
  },
  suggestionTitle: {
    color: "#101828",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: normalize(14),
  },
  itemSeparator: {
    alignSelf: "stretch",
    borderStyle: "solid",
    borderColor: "#d0d5dd",
    borderTopWidth: 1,
    flex: 1,
    height: 1,
    opacity: 0.5,
  },
});

// Modal Styles
const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  sheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: isAndroid ? 20 : 40, // Safe area for iOS
    maxHeight: screenHeight * 0.85, // Limit to 85% of screen height
  },
  draggableArea: {
    // This area contains the handle and header - all draggable
  },
  handleBar: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomColor: "#E4E4E7",
    borderBottomWidth: 1,
    paddingBottom: 16,
  },
  headerIconBackground: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    padding: 6,
    marginEnd: 12,
    marginStart: 4,
  },
  modalHeaderText: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#1A1A1E",
  },
  content: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modalUtteranceItem: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#E4E4E7",
    borderBottomWidth: 0.5,
  },
  modalUtteranceLabel: {
    fontSize: normalize(14),
    fontWeight: "400",
    color: "#101828",
    marginStart: 10,
    flex: 1,
  },
});
