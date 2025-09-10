import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { normalize } from "../utils/CommonFunctions";
import { isAndroid } from "../utils/CommonFunctions";
import IntentAmbiguity from "./IntentAmbiguity";

const { height: screenHeight } = Dimensions.get("window");

interface IntentAmbiguityModalProps {
  visible?: boolean;
  data?: any;
  goBack?: () => void;
  onConfirmCallback?: (payload: any) => void;
}

const IntentAmbiguityModal: React.FC<IntentAmbiguityModalProps> = ({
  visible = false,
  data,
  goBack,
  onConfirmCallback,
}) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
    }
  }, [visible, slideAnim, backdropOpacity]);

  // Disabled backdrop press - modal is not closable
  const handleBackdropPress = () => {
    // Do nothing - modal cannot be closed
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => {}} // Disable hardware back button on Android
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          {/* Backdrop is not touchable - modal cannot be closed */}
          <View style={styles.backdropTouchable} />
        </Animated.View>

        {/* Sheet Content - No drag functionality */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sheetContent}>
            <IntentAmbiguity
              data={data}
              goBack={goBack}
              onConfirmCallback={onConfirmCallback}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

interface IntentAmbiguityParentProps {
  data?: any;
  isLastItem?: boolean;
  goBack?: () => void;
  onConfirmCallback?: (payload: any) => void;
}

const IntentAmbiguityParent: React.FC<IntentAmbiguityParentProps> = ({
  data,
  isLastItem,
  goBack,
  onConfirmCallback,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(isLastItem);

  const handleGoBack = () => {
    setIsModalVisible(false);
    if (goBack) {
      goBack();
    }
  };

  const handleConfirmCallback = (payload: any) => {
    setIsModalVisible(false);
    if (onConfirmCallback) {
      onConfirmCallback(payload);
    }
  };

  return (
    <View style={styles.parentContainer}>
      <IntentAmbiguityModal
        visible={isModalVisible}
        data={data}
        goBack={handleGoBack}
        onConfirmCallback={handleConfirmCallback}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
  },
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    paddingBottom: 20,
    maxHeight: screenHeight * 0.85,
  },
});

export default IntentAmbiguityParent;
