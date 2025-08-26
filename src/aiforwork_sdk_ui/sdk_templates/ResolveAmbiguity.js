import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";

import { normalize } from "../utils/CommonFunctions";
import Avatar from "../sdk_components/avatars/Avatar";
import ChooseItem from "./ChooseItem";
import { ChevronDown, CloseIcon } from "../icons/SdkIcons";

class ResolveAmbiguity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.route.params?.data,
      disableGoBack: true,
      recentSelectedItem: undefined,
      selectedItemIndex: -1,
      isModalVisible: false,

      screenHeight: Dimensions.get("window").height,
      screenWidth: Dimensions.get("window").width,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("beforeRemove", (e) => {
      if (this.state.disableGoBack) {
        e.preventDefault();
      }
    });

    // Add listener for screen dimension changes
    Dimensions.addEventListener("change", this.handleDimensionChange);
  }

  handleDimensionChange = ({ window }) => {
    this.setState({
      screenHeight: window.height,
      screenWidth: window.width,
    });
  };

  componentWillUnmount() {
    this.props.navigation.removeListener("beforeRemove");
    // Remove dimension change listener
    Dimensions.removeEventListener("change", this.handleDimensionChange);
  }

  get getDataPayload() {
    let payload = {
      messageId: this.state.data?.messageId,
      question: this.state.data?.question,
      clientId: this.state.data?.clientId,
      resolvedAmbiguity: true,
      resolved: [],
    };
    this.state.data.templateInfo?.ambiguous?.map((option) => {
      const selectedChoices = option.value.selectedChoices;

      let id = option?.id;
      let data = {
        [id]:
          selectedChoices && selectedChoices.length > 0
            ? selectedChoices
            : [option.value.choices?.[0]],
      };
      payload?.resolved.push(data);
    });

    return payload;
  }

  onConfirm = () => {
    if (this.props.route.params?.onConfirmCallback) {
      this.props.route.params?.onConfirmCallback(this.getDataPayload);
    }
    this.closeSheet();
    this.setState({ disableGoBack: false });
    setTimeout(() => {
      this.props.navigation.goBack();
    }, 100);
  };

  onItemPress = (item, index) => {
    this.setState(
      {
        recentSelectedItem: item?.value?.choices,
        selectedItemIndex: index,
      },
      () => {
        this.openSheet();
        // Force update to recalculate modal height
        this.forceUpdate();
      }
    );
  };

  removeItem = (item) => {
    const { selectedItemIndex } = this.state;
    if (selectedItemIndex >= 0) {
      let choice =
        this.state.data.templateInfo?.ambiguous?.[selectedItemIndex]?.value
          ?.selectedChoices || [];

      if (choice?.length > 0) {
        const index = choice.findIndex(
          (existingItem) => existingItem.id === item.id
        );

        if (index != -1 && this.state.data.templateInfo?.ambiguous) {
          //remove
          this.state.data.templateInfo.ambiguous[
            selectedItemIndex
          ].value.selectedChoices.splice(index, 1);
        }
      }

      this.forceUpdate();
    }
  };

  renderItem = (item, index) => {
    let isMultiSelect = item?.value?.multi || false;

    let options = !isMultiSelect
      ? item?.value?.selectedChoices?.length > 0
        ? item?.value?.selectedChoices
        : [item?.value?.choices?.[0]]
      : item?.value?.selectedChoices || [];
    let Wrapper = options?.length > 0 ? View : TouchableOpacity;
    return (
      <View>
        <Text style={styles.fieldHeaderText} numberOfLines={1}>
          {item?.label}
        </Text>
        <Wrapper
          style={styles.inputFieldBorder}
          onPress={() => {
            this.onItemPress(item, index);
          }}
        >
          {options?.length > 0 ? (
            <View
              style={[{ flex: 1 }, isMultiSelect && styles.multiSelectGrid]}
            >
              {options?.map((val) => {
                return (
                  <TouchableOpacity
                    disabled={isMultiSelect}
                    onPress={() => {
                      this.onItemPress(item, index);
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
                          this.removeItem(val);
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
            <View >
              <Text style={styles.placeholderText}>Select</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.dropdownChevron}
            onPress={() => {
              this.onItemPress(item, index);
            }}
          >
            <ChevronDown width={24} height={24} />
          </TouchableOpacity>
        </Wrapper>
      </View>
    );
  };

  openSheet = () => {
    this.setState({ isModalVisible: true });
  };

  closeSheet = () => {
    this.setState({ isModalVisible: false });
  };

  done = (selectedItem) => {
    if (this.state.data.templateInfo?.ambiguous) {
      this.state.data.templateInfo.ambiguous[
        this.state.selectedItemIndex
      ].value.selectedChoices = selectedItem;
    }

    this.forceUpdate();
    this.closeSheet();
  };
  onCancelPress = () => {
    this.closeSheet();
  };

  onBackdropPress = () => {
    this.closeSheet();
  };

  renderOption = () => {
    let type =
      this.state.data.templateInfo?.ambiguous?.[this.state.selectedItemIndex]
        ?.value?.multi || false; //dropdown||multiselect
    return (
      <ChooseItem
        recentSelectedItem={this.state.recentSelectedItem}
        selectedChoices={
          this.state.data.templateInfo?.ambiguous?.[
            this.state.selectedItemIndex
          ]?.value?.selectedChoices
        }
        type={type ? "multiselect" : "dropdown"}
        onCancelPress={this.onCancelPress}
        done={this.done}
      ></ChooseItem>
    );
  };
  getModalHeight = () => {
    const { screenHeight, recentSelectedItem } = this.state;

    // Calculate height based on actual content
    const itemHeight = 60; // Approximate height per item
    const headerHeight = 80; // Height for header/padding
    const minHeight = Math.min(200, screenHeight * 0.3); // Minimum 30% of screen or 200px
    const maxHeight = screenHeight * 0.8; // Max 80% of screen height

    // Calculate content height based on number of items
    let contentHeight = minHeight;

    if (recentSelectedItem?.length > 0) {
      // Calculate based on actual items
      contentHeight = recentSelectedItem.length * itemHeight + headerHeight;

      // Add some buffer for better visual appearance
      contentHeight += 20;

      // If content is very small, ensure minimum height
      if (contentHeight < minHeight) {
        contentHeight = minHeight;
      }
    }

    // Ensure height is within bounds and responsive to screen size
    const finalHeight = Math.max(minHeight, Math.min(contentHeight, maxHeight));

    // Round to nearest 10 for better visual consistency
    return Math.round(finalHeight / 10) * 10;
  };

  renderModal = () => {
    const modalHeight = this.getModalHeight();

    return (
      <Modal
        visible={this.state.isModalVisible}
        transparent={true}
        onRequestClose={this.closeSheet}
        animationType="slide"
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={this.onBackdropPress}
        >
          <TouchableOpacity
            style={[styles.modalContent, { maxHeight: modalHeight }]}
            activeOpacity={1}
            onPress={() => {}}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              {this.renderOption()}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  };

  get isConfirmEnable() {
    const enableConfirm = this.state.data?.templateInfo?.ambiguous?.every(
      (item) => {
        return item?.value?.multi === true
          ? item.value &&
              item.value.selectedChoices &&
              item.value.selectedChoices.length > 0
          : true;
      }
    );

    return enableConfirm;
  }

  render() {
    let label =
      this.state.data?.templateInfo?.ambiguous?.length > 1
        ? "There are conflicts on few inputs. Please confirm"
        : "We found more than one result for “" +
          this.state.data?.templateInfo?.ambiguous?.[0]?.label +
          "”. Please confirm ";

    let enableConfirm = this.isConfirmEnable;
    return (
      <View style={styles.container}>
        <View
          style={styles.mainContentWrapper}
          ref={(ref) => (this.viewRef = ref)}
        >
          <Text style={styles.confirmationHeader}>Confirmation</Text>
          <View style={styles.dividerLine} />

          <ScrollView>
            <View style={styles.mainContentArea}>
              <Text style={styles.labelText}>{label}</Text>

              {this.state.data?.templateInfo?.ambiguous?.map((item, index) => {
                return this.renderItem(item, index);
              })}
            </View>
          </ScrollView>
          <TouchableOpacity
            disabled={!enableConfirm}
            style={[
              styles.confirmButton,
              !enableConfirm && { backgroundColor: "#EAECF0" },
            ]}
            onPress={this.onConfirm}
          >
            <Text
              style={[
                styles.confirmButtonText,
                { color: enableConfirm ? "#FFF" : "#98A2B3" },
              ]}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderModal()}
      </View>
    );
  }
}
export default ResolveAmbiguity;

const styles = StyleSheet.create({
  // Header styles
  confirmationHeader: {
    fontSize: normalize(16),
    color: "#101828",
    alignSelf: "center",
    fontWeight: "600",

    paddingVertical: 20,
  },

  // Item removal styles
  removeButton: {
    padding: 3,
    marginStart: 4,
  },

  // Dropdown chevron styles
  dropdownChevron: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginStart: 2,
  },

  // Multi-select grid layout
  multiSelectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },

  // Individual item chip styles
  itemChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingStart: 4,
    marginEnd: 3,
    marginVertical: 3,
    paddingEnd: 10,
  },

  // Root container
  container: { height: "100%" },

  // Main content wrapper
  mainContentWrapper: {
    bottom: 0,
    position: "absolute",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: "#FFF",
    width: "100%",
    maxHeight: Dimensions.get("window").height - 100,
  },

  // Divider line
  dividerLine: {
    backgroundColor: "#D0D5DD",
    height: 1,
  },

  // Confirm button
  confirmButton: {
    backgroundColor: "#101828",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 30,
  },

  // Input field border
  inputFieldBorder: {
    borderRadius: 8,
    borderColor: "#D0D5DD",
    borderWidth: 1,
    marginTop: 6,
    alignItems: "center",
    paddingStart: 12,
    flexDirection: "row",
    paddingVertical: 3,
    width: "100%",
    flex: 1,
  },

  // Main content area
  mainContentArea: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Item text style
  itemText: {
    fontSize: normalize(14),
    color: "#101828",
    marginStart: 8,
    fontWeight: "500",

    flexShrink: 1,
  },

  // Field header text
  fieldHeaderText: {
    fontSize: normalize(14),
    color: "#344054",
    marginTop: 16,
    fontWeight: "500",
  },

  // Confirm button text
  confirmButtonText: {
    fontSize: normalize(15),
    color: "#98A2B3",
    marginStart: 8,
    fontWeight: "500",
  },

  // Label text
  labelText: {
    fontSize: normalize(15),
    color: "#101828",
    fontWeight: "500",
  },

  // Placeholder text
  placeholderText: {
    fontSize: normalize(15),
    color: "#98A2B3",
    fontWeight: "400",
  },

  // Modal backdrop
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  // Modal content container
  modalContent: {
    backgroundColor: "#FFF",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Modal scroll content
  modalScrollContent: {
    flexGrow: 1,
  },
});
