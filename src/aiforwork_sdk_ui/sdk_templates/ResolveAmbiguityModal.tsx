import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
  PanResponder,
} from "react-native";
import { normalize } from "../utils/CommonFunctions";
import { isAndroid } from "../utils/CommonFunctions";
import { LightBulb, ChevronDown, CloseIcon } from "../icons";
import Avatar from "../sdk_components/avatars/Avatar";
import ChooseItem from "./ChooseItem";

const { height: screenHeight } = Dimensions.get("window");

interface ResolveAmbiguityModalProps {
  visible: boolean;
  onClose: () => void;
  data?: any;
  onConfirmCallback?: (payload: any) => void;
}

// Simplified ResolveAmbiguityContent component for modal use
const ResolveAmbiguityContent: React.FC<{
  data?: any;
  onConfirm: (payload: any) => void;
}> = ({ data, onConfirm }) => {
  const [isChooseModalVisible, setIsChooseModalVisible] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(-1);
  const [currentChoices, setCurrentChoices] = useState<any[]>([]);
  const [localData, setLocalData] = useState<any | undefined>(data);

  // Update localData when data prop changes
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  // Animation values for drag functionality
  const translateY = useRef(new Animated.Value(0)).current;

  // PanResponder for drag functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow vertical dragging
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();

        // If dragged down more than 100px, close the modal
        if (gestureState.dy > 100) {
          setIsChooseModalVisible(false);
          // Reset position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        } else {
          // Snap back to original position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleItemPress = (item: any, index: number) => {
    setCurrentItemIndex(index);
    setCurrentChoices(item.value.choices || []);
    setIsChooseModalVisible(true);
    // Reset translateY when modal opens
    translateY.setValue(0);
  };

  const handleChoiceSelection = (choices: any[]) => {
    if (currentItemIndex >= 0 && localData?.templateInfo?.ambiguous) {
      // Create a deep copy of the data to avoid mutating props
      const updatedData = JSON.parse(JSON.stringify(localData));
      updatedData.templateInfo.ambiguous[
        currentItemIndex
      ].value.selectedChoices = choices;

      // Update local state to trigger re-render
      setLocalData(updatedData);
    }
    setIsChooseModalVisible(false);
  };

  const removeItem = (item: any) => {
    if (currentItemIndex >= 0 && localData?.templateInfo?.ambiguous) {
      let choice =
        localData.templateInfo.ambiguous[currentItemIndex]?.value
          ?.selectedChoices || [];

      if (choice?.length > 0) {
        const index = choice.findIndex(
          (existingItem: any) => existingItem.id === item.id
        );

        if (
          index !== -1 &&
          localData.templateInfo.ambiguous[currentItemIndex]?.value
            ?.selectedChoices
        ) {
          // Create a deep copy to avoid mutating props
          const updatedData = JSON.parse(JSON.stringify(localData));
          updatedData.templateInfo.ambiguous[
            currentItemIndex
          ].value.selectedChoices.splice(index, 1);

          // Update local state to trigger re-render
          setLocalData(updatedData);
        }
      }
    }
  };

  const getConfirmPayload = () => {
    const payload = {
      messageId: localData?.messageId,
      question: localData?.question,
      clientId: localData?.clientId,
      resolvedAmbiguity: true,
      resolved: [] as any[],
    };

    localData?.templateInfo?.ambiguous?.forEach((option) => {
      const selectedChoices = option.value.selectedChoices;
      let id = option?.id;
      let data = {
        [id]:
          selectedChoices && selectedChoices.length > 0
            ? selectedChoices
            : [option.value.choices?.[0]],
      };
      payload.resolved.push(data);
    });

    return payload;
  };

  const isConfirmEnabled = () => {
    return (
      localData?.templateInfo?.ambiguous?.every((item) => {
        return item?.value?.multi === true
          ? item.value &&
              item.value.selectedChoices &&
              item.value.selectedChoices.length > 0
          : true;
      }) ?? false
    );
  };

  const getSelectedChoicesForCurrentItem = (): any[] => {
    if (currentItemIndex >= 0 && localData?.templateInfo?.ambiguous) {
      return (
        localData.templateInfo.ambiguous[currentItemIndex]?.value
          ?.selectedChoices || []
      );
    }
    return [];
  };

  const getCurrentItemType = (): "multiselect" | "dropdown" => {
    if (currentItemIndex >= 0 && localData?.templateInfo?.ambiguous) {
      return localData.templateInfo.ambiguous[currentItemIndex]?.value?.multi
        ? "multiselect"
        : "dropdown";
    }
    return "dropdown";
  };

  const renderItem = (item: any, index: number) => {
    const isMultiSelect = item?.value?.multi || false;

    // Get options based on multi-select logic like ResolveAmbiguity.js
    let options = !isMultiSelect
      ? item?.value?.selectedChoices?.length > 0
        ? item?.value?.selectedChoices
        : [item?.value?.choices?.[0]]
      : item?.value?.selectedChoices || [];

    let Wrapper = options?.length > 0 ? View : TouchableOpacity;

    return (
      <View key={item.id + index}>
        <Text style={styles.fieldHeaderText}>{item.label}</Text>
        <Wrapper
          style={styles.inputFieldBorder}
          onPress={() => handleItemPress(item, index)}
        >
          {options?.length > 0 ? (
            <View
              style={[{ flex: 1 }, isMultiSelect && styles.multiSelectGrid]}
            >
              {options?.map((val: any, choiceIndex: number) => {
                return (
                  <TouchableOpacity
                    key={choiceIndex}
                    disabled={isMultiSelect}
                    onPress={() => {
                      handleItemPress(item, index);
                    }}
                    style={[
                      styles.itemChip,
                      isMultiSelect && {
                        backgroundColor: "#F2F4F7",
                        borderRadius: 100,
                      },
                    ]}
                  >
                    <Avatar
                      rad={26}
                      name={val?.emailId ? val?.fN || val?.emailId : val?.label}
                      color={val?.color}
                      profileIcon={val?.icon}
                      textSize={normalize(14)}
                      userId={val?.id}
                      fromProfile={false}
                    />
                    <Text style={styles.itemText} numberOfLines={1}>
                      {val?.fN ? val?.fN + " " + val?.lN : val?.label}
                    </Text>
                    {isMultiSelect && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => {
                          removeItem(val);
                        }}
                      >
                        <CloseIcon height={20} width={20} color={"#98A2B3"} />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View>
              <Text style={styles.placeholderText}>Select</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.dropdownChevron}
            onPress={() => {
              handleItemPress(item, index);
            }}
          >
            <ChevronDown width={24} height={24} />
          </TouchableOpacity>
        </Wrapper>
      </View>
    );
  };
  return (
    <View style={styles.contentContainer}>
      <Text style={styles.confirmationText}>
        {localData?.templateInfo?.ambiguous?.length === 1
          ? `We found more than one result for "${localData.templateInfo.ambiguous[0]?.label}". Please confirm`
          : "There are conflicts on few inputs. Please confirm"}
      </Text>

      <ScrollView style={styles.scrollView}>
        {localData?.templateInfo?.ambiguous?.map((item, index) =>
          renderItem(item, index)
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          !isConfirmEnabled() && styles.confirmButtonDisabled,
        ]}
        disabled={!isConfirmEnabled()}
        onPress={() => onConfirm(getConfirmPayload())}
      >
        <Text
          style={[
            styles.confirmButtonText,
            !isConfirmEnabled() && styles.confirmButtonTextDisabled,
          ]}
        >
          Confirm
        </Text>
      </TouchableOpacity>

      {/* Choose Item Modal */}
      <Modal
        visible={isChooseModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsChooseModalVisible(false)}
      >
        <View style={styles.chooseModalBackdrop}>
          <TouchableOpacity
            style={styles.chooseModalBackdropTouchable}
            activeOpacity={1}
            onPress={() => setIsChooseModalVisible(false)}
          />
          <Animated.View
            style={[
              styles.chooseModalContent,
              {
                transform: [{ translateY: translateY }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Drag handle */}
            <View style={styles.dragHandle}>
              <View style={styles.dragHandleBar} />
            </View>

            <ChooseItem
              recentSelectedItem={currentChoices as any}
              selectedChoices={getSelectedChoicesForCurrentItem() as any}
              type={getCurrentItemType()}
              onCancelPress={() => setIsChooseModalVisible(false)}
              done={handleChoiceSelection}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const ResolveAmbiguityModal: React.FC<ResolveAmbiguityModalProps> = ({
  visible,
  onClose,
  data,
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
    //onClose();
  };

  const handleConfirm = (payload: any) => {
    if (onConfirmCallback) {
      onConfirmCallback(payload);
    }
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
            {/* Remove or comment out the handle bar to disable drag */}
            {/* <View style={styles.handleBar}>
              <View style={styles.handle} />
            </View> */}

            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Confirmation</Text>
            </View>

            <ResolveAmbiguityContent data={data} onConfirm={handleConfirm} />
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
    paddingTop: 16,
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
    maxHeight: screenHeight * 0.9, // Limit to 90% of screen height for ambiguity resolution
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
  contentContainer: {
    paddingHorizontal: 20,
  },
  confirmationText: {
    fontSize: normalize(15),
    color: "#101828",
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 20,
  },
  scrollView: {},
  fieldHeaderText: {
    fontSize: normalize(14),
    color: "#344054",
    marginTop: 16,
    fontWeight: "500",
  },
  inputFieldBorder: {
    borderRadius: 8,
    borderColor: "#D0D5DD",
    borderWidth: 1,
    marginTop: 6,
    alignItems: "center",
    paddingStart: 12,
    flexDirection: "row",
    paddingVertical: 12,
    width: "100%",
  },

  confirmButton: {
    backgroundColor: "#101828",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
  },
  confirmButtonDisabled: {
    backgroundColor: "#EAECF0",
  },
  confirmButtonText: {
    fontSize: normalize(15),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  confirmButtonTextDisabled: {
    color: "#98A2B3",
  },
  chooseModalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  chooseModalContent: {
    backgroundColor: "#FFF",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: screenHeight * 0.8,
    flex: 1,
  },
  chooseModalBackdropTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dragHandle: {
    alignItems: "center",

    paddingBottom: 8,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E4E4E7",
    borderRadius: 2,
  },
  multiSelectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },
  itemChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingStart: 4,
    marginEnd: 3,
    marginVertical: 3,
    paddingEnd: 10,
  },
  itemText: {
    fontSize: normalize(14),
    color: "#101828",
    marginStart: 8,
    fontWeight: "500",
    flexShrink: 1,
  },
  removeButton: {
    padding: 3,
    marginStart: 4,
  },
  placeholderText: {
    fontSize: normalize(15),
    color: "#98A2B3",
    fontWeight: "400",
  },
  dropdownChevron: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginStart: 2,
  },
});

export default ResolveAmbiguityModal;
