import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import RequestFlow from "./RequestFlow";
import { normalize } from "../utils/CommonFunctions";
import { isAndroid } from "../utils/CommonFunctions";
import { LightBulb } from "../icons";

const { height: screenHeight } = Dimensions.get("window");

interface RequestFlowItem {
  icon?: string;
  content?: string;
}

interface RequestFlowSheetProps {
  visible: boolean;
  onClose: () => void;
  reqFlow?: RequestFlowItem[];
  onRequestFlowPress?: (obj: {
    reqFlow: RequestFlowItem[];
    onReqlowPressTime: number;
  }) => void;
}

const RequestFlowSheet: React.FC<RequestFlowSheetProps> = ({
  visible,
  onClose,
  reqFlow = [],
  onRequestFlowPress,
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
  }, [visible, slideAnim, backdropOpacity]);

  const handleBackdropPress = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      
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
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleBackdropPress}
          />
        </Animated.View>

        {/* Sheet Content */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sheetContent}>
            {/* Handle Bar */}
            <View style={styles.handleBar}>
              {/* <View style={styles.handle} /> */}
            </View>

            <View style={styles.modalHeader}>
              <View style={styles.headerIconBackground}>
                <LightBulb color="#131316" width={20} height={20} />
              </View>
              <Text style={styles.modalHeaderText}>Response Flow</Text>
            </View>
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollContent}
              nestedScrollEnabled={true}
              scrollEnabled={true}
              bounces={false}
            >
              <RequestFlow
                reqFlow={reqFlow}
                fromMainModal={true}
              />
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalHeaderText: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#1A1A1E",
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
    maxHeight: screenHeight * 0.85, // Limit to 80% of screen height
  },
  handleBar: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E4E4E7",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomColor: "#E4E4E7",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#1A1A1E",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: normalize(16),
    color: "#6B7280",
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default RequestFlowSheet;
