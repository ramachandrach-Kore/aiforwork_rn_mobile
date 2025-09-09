import React, { useState, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  View,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
} from "react-native";
import { normalize, isAndroid } from "../utils/CommonFunctions";
import AllAgents from "./AllAgents";

const { height: screenHeight } = Dimensions.get("window");

/**
 * AgentsBtn Component
 *
 * A button component that displays "Agents" text and opens a bottom sheet modal with the AllAgents component when clicked.
 *
 * Usage:
 * <AgentsBtn
 *   agents={agentsList}
 *   agenticApps={agenticAppsList}
 *   commonAgents={commonAgentsList}
 *   onClickAgent={(agent) => console.log('Agent selected:', agent)}
 *   onClickCustomAgent={(customAgent) => console.log('Custom agent selected:', customAgent)}
 *   session={currentSession}
 * />
 */

const AgentsBtn: React.FC<any> = ({}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    console.log("openModal called, setting isModalVisible to true");
    setIsModalVisible(true);
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
  };

  const closeModal = () => {
    console.log("closeModal called, setting isModalVisible to false");
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
    ]).start(() => {
      setIsModalVisible(false);
    });
  };

  const handleBackdropPress = () => {
    closeModal();
  };

  const callbackAgentPress = (agent: any) => {
    closeModal();
  };

  // Pan responder for drag gestures
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy > 5; // Only respond to downward drags
      },
      onPanResponderGrant: (evt, gestureState) => {
        // Pan responder granted
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow downward movement
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.3) {
          // Close modal if dragged down enough
          closeModal();
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

  return (
    <View style={styles.container}>
      {/* Agents Button */}
      <TouchableOpacity style={styles.button} onPress={openModal}>
        <Text style={styles.buttonText}>Agents</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          >
            <TouchableWithoutFeedback onPress={handleBackdropPress}>
              <View style={styles.backdropTouchable} />
            </TouchableWithoutFeedback>
          </Animated.View>

          {/* Modal Content */}
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Draggable Handle Bar */}
            <View style={styles.handleBar} {...panResponder.panHandlers}>
              <View style={styles.handle} />
            </View>

            <View style={styles.modalBody}>
              <AllAgents callbackAgentPress={callbackAgentPress} />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: normalize(16),
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
  modalContainer: {
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
    zIndex: 999,
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    height: screenHeight * 0.85,
    zIndex: 1001,
  },
  modalBody: {
    flex: 1,
  },
  handleBar: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 54,
    height: 4,
    backgroundColor: "#D0D5DD",
    borderRadius: 2,
  },
  debugText: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 5,
    borderRadius: 5,
  },
});

export default AgentsBtn;
