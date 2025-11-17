import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TextInput,
  Keyboard,
  BackHandler,
  Image,
} from "react-native";

import { normalize } from "../utils/CommonFunctions";

import BottomSheet from "../sdk_components/BottomSheet";
import { Colors } from "../utils/Colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CalendarPicker from "react-native-calendar-picker";
import { getTimeline } from "../utils/CommonFunctions";
// import { discardEmail } from "../../../actions/posts.action";

import { People } from "../sdk_components/People";
//import { getAssigneeList } from "../../../actions/jira.action";
import Avatar from "../sdk_components/avatars/Avatar";
import { useMessagesStore } from "aiforwork-sdk-core";

//import { ROUTE_NAMES } from "../../../stacks/RouteNames";

//Test case passed: Try to create meeting with same time slot.

//Didn't got any uttrance for this template, to check remaining code, cross checked with services & Qa team.

// Interface for component props
interface InterruptionProps {
  data?: any;
  params?: any;
  navigation?: any;
  assigneeList?: any;
  isSearching?: boolean;
  onConfirmCallback?: (payload: any) => void;
  sendMessage?: (messageObject: any) => Promise<void>;
  updateMessageStatus?: (payload: any, params: any) => Promise<void>;
}
//import { goBack } from "../../../stacks/NavigationService";
import {
  Calendar,
  CheckBox,
  CheckCircleBlack,
  ChevronDown,
  CloseIcon,
  DisableCheckBox,
  LeftChevron,
  RightChevron,
} from "../icons";

class Interruption extends React.PureComponent<InterruptionProps, any> {
  fileTypesRef: any;
  datePickerRef: any;
  assigneeRef: any;
  backHandlerSubscription: any;

  constructor(props: any) {
    super(props);
    //  console.log('------------------>', props.route.params?.data);
    this.state = {
      type: props?.data?.type || "gmail",
      responseData: [],
      data: {},
      dynamicFooterdata: null,
      allFileTypes: [],
      selectedFiles: [],
      selectedDueDate: "",
      extraPayload: {},
      discardMsgId: "",
      dynamicData: {},
      selectedContactList: [],
    };
    this.fileTypesRef = React.createRef();
    this.datePickerRef = React.createRef();
    this.assigneeRef = React.createRef();
  }

  componentDidMount() {
    this.getData();
    this.backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButton
    );
  }

  componentWillUnmount() {
    if (this.backHandlerSubscription) {
      this.backHandlerSubscription.remove();
    }
  }

  handleBackButton = (): boolean => {
    return true;
  };

  getData = (): any => {
    let sections: any = {},
      dynamicFooterdata: any = null;
    let data: any = undefined;
    try {
      data = JSON.parse(this.props?.params?.data);
    } catch (e) {
      data = this.props?.data;
    }
    data?.templateInfo?.interruptionFields?.forEach((interrupt: any) => {
      let key = interrupt?.key || "";
      if (key === "actionId") {
        dynamicFooterdata = interrupt;
      } else {
        sections[key] = interrupt;
      }
    });
    this.setState({
      data: sections,
      responseData: data,
      dynamicFooterdata,
    });
    return sections;
  };
  renderBackdrop = () => {
    return <View style={styles.backdropOverlay} />;
  };

  renderFooter = (
    enabled: any,
    footerText: any,
    onPressFunc: any = () => {},
    onCancel: any = () => {}
  ) => {
    return (
      <View style={[styles.footerContainer, { paddingHorizontal: 4 }]}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>{"Cancel"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!enabled}
          onPress={onPressFunc}
          style={enabled ? styles.primaryButton : styles.disabledButton}
        >
          <Text
            style={
              enabled ? styles.primaryButtonText : styles.disabledButtonText
            }
          >
            {footerText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderDynamicFooter = (onPressFunc: any = () => {}) => {
    let buttons = this.state?.dynamicFooterdata?.value?.buttons;
    let lastItemIndex = buttons?.length - 1;
    return (
      <View style={styles.dynamicFooterContainer}>
        {buttons?.map((item: any, index: any) => (
          <TouchableOpacity
            onPress={() => {
              onPressFunc(item);
            }}
            style={
              index === lastItemIndex
                ? styles.primaryButton
                : styles.cancelButton
            }
          >
            <Text
              style={
                index === lastItemIndex
                  ? styles.primaryButtonText
                  : styles.cancelButtonText
              }
            >
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  sectionSeperator = (leadingItem: any) => {
    return <View style={styles.horizontalSeparator(leadingItem)} />;
  };

  renderSectionHeader = (item: any) => {
    let type = item?.value?.type || "";
    if (type === "groupedCheckbox") {
      return <></>;
    }
    return (
      <View style={{ paddingVertical: 8 }}>
        <Text style={styles.sectionHeaderTextStyle}>{item?.label}</Text>
      </View>
    );
  };

  onClickItem = (key: any, index: any, item: any) => {
    let interactions: any = { ...this.state.data };

    if (interactions?.[key]) {
      let section: any = interactions?.[key] || {};

      if (section?.value?.choices?.length > 0) {
        if (key === "keywords" || key === "person") {
          let selectedItem = section?.value?.choices[index];
          selectedItem.checked = !selectedItem.checked;
          interactions[key].value.choices[index] = selectedItem;
        } else if (key === "source") {
          let selectedCount = 0;
          interactions[key].value.choices.map((item: any) => {
            if (item.checked) {
              selectedCount++;
            }
          });

          if (selectedCount <= 1 && item?.checked) {
            return;
          } else {
            let selectedItem = section?.value?.choices[index];
            selectedItem.checked = !selectedItem.checked;
            interactions[key].value.choices[index] = selectedItem;
          }
        } else {
          let selectedItem = section?.value?.choices[index];
          let allChoices = interactions[key].value.choices.map((item: any) => {
            item.checked = false;
            return item;
          });

          selectedItem.checked = true;
          interactions[key].value.choices = allChoices;
          interactions[key].value.choices[index] = selectedItem;
        }
        this.setState({ data: interactions });
      }
    }
  };

  onCancelType = () => {
    //goBack(); //Commented for now
  };

  onSubmitType = (allTypes: any) => {
    this.setState({ selectedFiles: allTypes, allFileTypes: allTypes });
    //goBack(); //Commented for now
  };

  renderDropDown = (item: any, highlight: any, filesLabel: any) => {
    return (
      <View style={styles.dropdownContainer}>
        <View style={styles.verticalSeparator} />
        <TouchableOpacity
          style={styles.dropdownInnerContainer(highlight)}
          onPress={() => {
            //open file type selection modal
            let allChoices = item?.nested?.value?.choices;
            if (this.state.allFileTypes?.length == 0) {
              this.setState({ allFileTypes: allChoices });
            }
            setTimeout(() => {
              //Commented for now
              // this.props.navigation.navigate(ROUTE_NAMES.SELECT_FILE, {
              //   data: this.state.allFileTypes,
              //   onSubmit: this.onSubmitType,
              //   onCancel: this.onCancelType,
              // });
            }, 500);
          }}
        >
          <Text
            style={[
              styles.itemTextStyle,
              { paddingRight: 8, color: highlight ? "#004EEB" : "#344054" },
            ]}
          >
            {filesLabel}
          </Text>
          <ChevronDown width={20} height={20} color={"#667085"} />
        </TouchableOpacity>
      </View>
    );
  };

  renderNestedCheckBox = (data: any) => {
    return (
      <FlatList
        style={{
          marginLeft: 38,
          marginVertical: 8,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
        data={data?.nested?.value?.choices}
        renderItem={({ item, index }: any) => {
          return (
            <TouchableOpacity
              style={styles.nestedItemContainer}
              onPress={() => {
                const name = data.id;
                const value = [...data?.nested?.value?.choices];
                let index = value.findIndex((t: any) => t?.id === item?.id);
                value[index].checked = !item?.checked;
                this.setState({ [name]: value });
              }}
            >
              <View style={styles.nestedItemSubContainer}>
                {item?.checked ? (
                  <View style={styles.iconContainer}>
                    {data?.nested?.value?.multi ? (
                      <CheckCircleBlack width={20} height={20} />
                    ) : (
                      <CheckBox width={20} height={20} />
                    )}
                  </View>
                ) : (
                  <View style={styles.iconContainer}>
                    <DisableCheckBox width={20} height={20} />
                  </View>
                )}
                <View style={styles.textContainer}>
                  <Text style={styles.itemTextStyle}>{item?.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    );
  };
  meetingSlotPress = (selectedSlot: any, data: any) => {
    let interactions: any = { ...this.state.data };
    console.log("Hello", selectedSlot, data);
    let groupData = { ...interactions[data?.key] };

    if (groupData?.value?.groups?.length > 0) {
      groupData.value = {
        ...groupData.value,
        groups: groupData.value.groups.map((item: any) => ({
          ...item,
          choices:
            item?.choices?.length > 0
              ? item.choices.map((choice: any) => ({
                  ...choice,
                  checked: selectedSlot?.id === choice?.id,
                }))
              : item.choices,
        })),
      };
    }
    interactions[data?.key] = groupData;
    this.setState({ data: interactions });
  };
  renderSectionItem = (item: any, index: any, data: any) => {
    if (data?.value?.type === "groupedCheckbox") {
      return (
        <View>
          <View>
            <Text style={styles.slotHeaderText}>{item?.label}</Text>

            <View>
              {item?.choices?.map((slot: any) => (
                <View style={{ flexWrap: "wrap" }}>
                  <TouchableOpacity
                    style={[
                      styles.slotItemContainer,
                      { backgroundColor: slot?.checked ? "#F9FAFB" : "#FFF" },
                    ]}
                    onPress={() => this.meetingSlotPress(slot, data)}
                  >
                    {slot?.checked ? (
                      <CheckCircleBlack width={20} height={20} />
                    ) : (
                      <DisableCheckBox width={20} height={20} />
                    )}

                    <Text numberOfLines={1} style={styles.slotLabelText}>
                      {slot?.label}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }
    let filesLabel = "All file types" || "";
    let selectedCount = 0;
    let highlight = false;
    this.state.selectedFiles.map((item: any) => {
      if (item?.checked) {
        selectedCount++;
      }
    });

    if (
      item?.nested?.key === "fileTypes" &&
      selectedCount < this.state.selectedFiles?.length
    ) {
      highlight = true;
      filesLabel = selectedCount + " file types";
    }
    return (
      <View style={{}}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => this.onClickItem(data?.key, index, item)}
        >
          <View style={styles.nestedItemSubContainer}>
            {item?.checked ? (
              <View style={styles.iconContainer}>
                {data?.value?.multi ? (
                  <CheckCircleBlack width={20} height={20} />
                ) : (
                  <CheckBox width={20} height={20} />
                )}
              </View>
            ) : (
              <View style={styles.iconContainer}>
                <DisableCheckBox width={20} height={20} />
              </View>
            )}
            <View style={styles.textContainer}>
              <Text style={[styles.itemTextStyle, { paddingRight: 10 }]}>
                {item?.label}
              </Text>
            </View>
            {item?.nested?.value?.type === "dropdown"
              ? this.renderDropDown(item, highlight, filesLabel)
              : null}
          </View>
        </TouchableOpacity>
        {item?.nested?.value?.type === "checkbox" && item?.checked
          ? this.renderNestedCheckBox(item)
          : null}
      </View>
    );
  };

  onChangeText = (text: any, data: any) => {
    let statePayload = this.state.extraPayload;
    statePayload[data.key] = text;
    this.setState({ extraPayload: statePayload });
  };

  onDateChange = (date: any) => {
    this.setState({ selectedStartDate: date });
  };

  deleteUser = (user: any) => {
    let selectedList = [...this.state?.selectedContactList];

    let foundIndex = this.state?.selectedContactList.findIndex(
      (obj2: any) => user.id === obj2.id
    );
    if (foundIndex >= 0) {
      selectedList.splice(foundIndex, 1);
    }
    this.setState({ selectedContactList: selectedList });
  };

  renderPlaceholder = (data: any, value: any, type: any) => {
    if (type === "dropdown" && this.state.selectedContactList?.length > 0) {
      return (
        <TouchableOpacity
          style={styles.assigneeMainContainer}
          onPress={() => {
            this.assigneeRef.current?.open();
            if (data?.dynamic) {
              this.setState({ dynamicData: data });
            }
          }}
        >
          <View style={styles.assigneeSubContainer}>
            {this.state.selectedContactList?.map((user: any) => {
              let fullName = user?.label || user?.id || user?.name;
              return (
                <TouchableOpacity key={user.id} style={styles.tagContainer}>
                  <Avatar
                    profileIcon={user?.icon}
                    color={user?.color}
                    textSize={normalize(13)}
                    userId={user?.id}
                    name={fullName}
                    type={"offline"}
                    rad={normalize(20)}
                  />
                  <Text numberOfLines={1} style={styles.tagText}>
                    {fullName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.deleteUser(user)}
                    style={styles.iconTouchArea}
                  >
                    <CloseIcon width={normalize(18)} height={normalize(18)} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
          <ChevronDown width={20} height={20} color={"#667085"} />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => {
          if (type === "dropdown") {
            this.assigneeRef.current?.open();
            if (data?.dynamic) {
              this.setState({ dynamicData: data });
            }
          } else {
            this.setState({
              selectedStartDate: this.state.selectedDueDate,
            });
            this.datePickerRef?.current?.open();
          }
        }}
      >
        <Text
          style={[
            value === data?.value?.placeholder
              ? styles.placeholderText
              : styles.alertTextStyle,
            ,
            { flex: 1 },
          ]}
        >
          {value}
        </Text>

        {type === "dropdown" ? (
          <ChevronDown width={20} height={20} color={"#667085"} />
        ) : (
          <Calendar width={20} height={20} color={"#667085"} />
        )}
      </TouchableOpacity>
    );
  };

  onSubmit = (data: any, key: any, currentFormIndex: any) => {
    console.log("On submit", data, key, this.state.data[key]);
    let fieldData: any = { ...this.state.data } || {};
    if (fieldData?.[key]) {
      fieldData[key].value.currentSelected = data;
    }
    this.setState({
      data: fieldData,
    });
  };

  renderContent = () => {
    let answer = this.props?.data?.answer || "";
    return (
      <ScrollView style={styles.scrollContainer}>
        {answer?.length > 0 && (
          <View style={styles.alertContainer}>
            <Text style={styles.alertTextStyle}>{answer}</Text>
          </View>
        )}
        {Object.entries(this.state?.data).map((entry: any) => {
          let data = entry[1];
          let type = data?.value?.type;
          let value = data?.value?.placeholder;
          if (type === "date" && this.state.selectedDueDate) {
            value = getTimeline(
              new Date(this.state.selectedDueDate),
              "DD-MM-YYYY"
            );
          }
          if (type === "heading") {
            value = data?.value?.value || "";
          }

          let itemList =
            data?.value?.type === "groupedCheckbox"
              ? data?.value?.groups
              : data?.value?.choices;
          return (
            <View style={{ paddingHorizontal: 20 }}>
              {this.renderSectionHeader(data)}
              <FlatList
                data={itemList}
                scrollEnabled={false}
                contentContainerStyle={
                  data?.value?.type === "groupedCheckbox"
                    ? { flexDirection: "column" }
                    : { flexDirection: "row", flexWrap: "wrap" }
                }
                renderItem={({ item, index }: any) =>
                  this.renderSectionItem(item, index, data)
                }
              />
              {type === "text" || type === "number" ? (
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text: any) => this.onChangeText(text, data)}
                  placeholderTextColor="#667085"
                  maxLength={1000}
                  keyboardType={type === "number" ? "numeric" : "default"}
                  placeholder={data?.value?.placeholder}
                />
              ) : type === "dropdown" || type === "date" ? (
                this.renderPlaceholder(data, value, type)
              ) : type === "textarea" ? (
                <TouchableOpacity
                  style={styles.textAreaContainer}
                  onPress={() => {
                    //Commented for now
                    // this.props.navigation.navigate(
                    //   ROUTE_NAMES.TEXT_INPUT_MODAL,
                    //   {
                    //     data: data,
                    //     index: 0,
                    //     onSubmit: this.onSubmit,
                    //   }
                    // );
                  }}
                >
                  <Text
                    style={styles.messageText(data?.value?.currentSelected)}
                  >
                    {data?.value?.currentSelected || data?.value?.placeholder}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {type === "heading" && value ? (
                <View>
                  <Text>{value}</Text>
                </View>
              ) : null}
              {this.sectionSeperator(data?.value?.type !== "groupedCheckbox")}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  onClickType = (item: any) => {
    let type = [...this.state.allFileTypes];
    let index = type.findIndex((t: any) => t?.id === item?.id);
    type[index].checked = !item?.checked;
    this.setState({ allFileTypes: type });
  };

  renderEachFileItem = ({ item, index }: any) => {
    let isSelected = item?.checked;
    return (
      <TouchableOpacity
        onPress={() => this.onClickType(item)}
        style={styles.fileItemContainer}
      >
        <BouncyCheckbox
          style={styles.checkboxBaseStyle}
          size={normalize(16)}
          isChecked={isSelected}
          fillColor={isSelected ? "#344054" : "#d0d5dd"}
          unfillColor="#FFFFFF"
          iconStyle={styles.checkboxIcon}
          innerIconStyle={styles.checkboxInnerIcon(isSelected)}
          disableBuiltInState={true}
          onPress={() => this.onClickType(item)}
        />
        {item?.icon !== "url" ? (
          <Image
            source={{
              uri: item?.icon,
            }}
            style={styles.fileIcon}
            resizeMode="contain"
            onError={() => {}}
          />
        ) : null}
        <Text style={styles.fileTextStyle}>{item?.label}</Text>
      </TouchableOpacity>
    );
  };

  renderFileType = () => {
    let enabled = true;
    return (
      <BottomSheet
        renderBackdrop={this.renderBackdrop}
        ref={this.fileTypesRef}
        extraProps={{
          topInset: 70,
          bottomInset: 0,
          handleIndicatorStyle: styles.bottomSheetHandle,
          enableHandlePanningGesture: true,
          enableContentPanningGesture: false,
        }}
        pressBehavior={"close"}
        snapPoints={["60%", "60%"]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.fileHeaderText}>Select file type</Text>
          <View style={styles.separatorLine} />
          <FlatList
            style={styles.flatListContainer}
            data={this.state.allFileTypes}
            renderItem={this.renderEachFileItem}
          />
          {this.renderFooter(
            enabled,
            "Done",
            () => {
              let selectedFiles = [...this.state.allFileTypes];
              this.setState({ selectedFiles, allFileTypes: [] });
              this.fileTypesRef?.current?.close();
            },
            () => {
              this.fileTypesRef?.current?.close();
            }
          )}
        </View>
      </BottomSheet>
    );
  };
  selectFromPeople = (selectedUsers: any) => {
    Keyboard.dismiss();
    this.setState({ selectedContactList: selectedUsers });

    this.assigneeRef?.current?.close();
  };

  searchAssignee = (query: any) => {
    //api call
    let payload2 = {
      dataType: this.state.dynamicData?.dataType,
      fieldId: this.state.dynamicData?.key,
      connectionId: this.state?.responseData?.connId,
      params: {
        q: query,
      },
      meta: {
        page: 0,
      },
    };
    let resolveField =
      this.state.responseData?.templateInfo?.endpoints?.resolveFields;
    let param = {
      resolveFields: resolveField,
    };
    // this.props.getAssigneeList(payload2, param); //Commented for now
  };

  renderSelectAssignee = () => {
    return (
      <BottomSheet
        renderBackdrop={this.renderBackdrop}
        ref={this.assigneeRef}
        extraProps={{
          topInset: 0,
          bottomInset: 0,
          handleIndicatorStyle: styles.bottomSheetHandle,
        }}
        snapPoints={["90%", "90%"]}
      >
        <People
          headerTitle={"Add"}
          recentContactList={[]}
          selectedContact={this.selectFromPeople}
          selectedContactList={this.state.selectedContactList}
          multi={true}
          cancelClicked={() => {
            this.assigneeRef?.current?.close();
            this.setState({ dynamicData: {} });
          }}
          searchContact={(payload: any) => this.searchAssignee(payload?.query)}
          contactSuggestions={this.props.assigneeList}
          isSearching={this.props.isSearching}
        />
      </BottomSheet>
    );
  };
  discardActionPress = (data: any) => {
    let param: any = {
      messageId: data?.messageId || data?.id,
    };
    if (data?.boardId) {
      param.boardId = data?.boardId;
    }

    console.log(param, "===discardActionPress==param===>", data);
    let payload = {
      status: "discard",
    };
    // if (data?.localPostObject?.stepId) {
    //   (param as any).localPostObject = data?.localPostObject;
    // }
    this.setState({ discardMsgId: data?.messageId || data?.id });
    if (this.props.updateMessageStatus) {
      this.props.updateMessageStatus(payload, param);
    }

    if (this.props?.goBack) {
      this.props?.goBack();
    }

    // this.props.discardEmail(param, payload); //Commented for now
  };

  renderDatePicker = () => {
    let enabled = true;
    return (
      <BottomSheet
        renderBackdrop={this.renderBackdrop}
        ref={this.datePickerRef}
        extraProps={{
          topInset: 70,
          bottomInset: 0,
          handleIndicatorStyle: styles.hiddenHandle,
          enableHandlePanningGesture: false,
          enableContentPanningGesture: false,
        }}
        pressBehavior={"close"}
        snapPoints={["60%", "60%"]}
      >
        <View style={{ flex: 1 }}>
          <CalendarPicker
            onDateChange={this.onDateChange}
            weekdays={["Mo", "Tu", "We", "Th", "Fr", "Sat", "Su"]}
            startFromMonday={true}
            showDayStragglers={true}
            previousComponent={
              <LeftChevron color={"#667085"} width={20} height={20} />
            }
            selectedStartDate={this.state.selectedStartDate}
            nextComponent={
              <RightChevron width={20} height={20} color={"#667085"} />
            }
            // todayTextStyle={{fontWeight: 'bold', color: 'blue'}}
            // todayBackgroundColor={'red'}
            selectedDayStyle={{
              backgroundColor: "#101828",
              borderRadius: 20,
            }}
            selectedDayTextStyle={{ color: "#FFFFFF" }}
            dayLabelsWrapper={{
              borderBottomWidth: 0,
              borderTopWidth: 0,
              paddingTop: 18,
            }}
            customDayHeaderStyles={() => {
              return {
                textStyle: {
                  fontSize: normalize(14),
                  color: "#344054",
                  fontWeight: "500",
                },
              };
            }}
          />
          <View
            style={[styles.separatorLine, { marginTop: 20, marginBottom: 14 }]}
          />
          {this.renderFooter(
            enabled,
            "Done",
            () => {
              this.setState({ selectedDueDate: this.state.selectedStartDate });
              this.datePickerRef?.current?.close();
            },
            () => {
              this.datePickerRef?.current?.close();
              this.setState({ selectedStartDate: "" });
            }
          )}
        </View>
      </BottomSheet>
    );
  };

  apiCall = (id: any = "") => {
    let resolved: any = {};
    // map list of interruptions
    Object.keys(this.state?.data)?.forEach((k: any, index: any) => {
      let item = this.state?.data[k];
      let key = item?.key || index || "";
      if (key) {
        resolved[key] = [];
      }

      if (item?.value?.type === "groupedCheckbox") {
        if (item?.value?.groups?.length > 0) {
          item?.value?.groups?.forEach((slotGroup: any, index: any) => {
            if (slotGroup?.choices?.length > 0) {
              slotGroup?.choices?.forEach((choice: any, index: any) => {
                if (choice?.checked === true) {
                  resolved[key].push(choice);
                }
              });
            }
          });
        }
      } else if (
        item?.value?.type === "textarea" &&
        item?.value?.currentSelected
      ) {
        resolved[key] = item?.value?.currentSelected || "";
      } else {
        let choices = item?.value?.choices || [];
        if (choices?.length > 0) {
          //map choices in each interruption
          choices?.forEach((c: any, index: any) => {
            if (c?.checked === true) {
              if (item?.value?.type === "checkbox") {
                if (item?.value?.multi) {
                  resolved[key].push(c?.id);
                } else {
                  resolved[key] = c?.id;
                }
              } else if (item?.value?.type === "nestedCheckbox") {
                resolved[key].push({ id: c?.id });
              }

              let nestedChoices = c?.nested?.value?.choices || [];
              let nestedKey = c?.nested?.key || "";
              let ds = resolved[key];
              let existingData = ds[ds?.length - 1];

              if (nestedChoices?.length > 0) {
                let fileTypes: any = [];
                //   //map nested choices in each choice of an interruption Example filetypes for gdrive
                nestedChoices?.forEach((nc: any, index: any) => {
                  if (nc?.checked) {
                    fileTypes.push(nc?.id);
                  }
                });
                existingData[nestedKey] = fileTypes;
                ds[ds?.length - 1] = existingData;
                resolved[key] = ds;
              }
            }
          });
        }
      }
    });

    Object.keys(this.state.extraPayload)?.forEach((key: any, index: any) => {
      let item = this.state?.extraPayload[key];
      resolved[key] = item;
    });
    if (this.state.selectedDueDate) {
      resolved["date"] = this.state.selectedDueDate;
    }
    if (this.state.selectedContactList?.length > 0) {
      let listOfIds: any = [];
      listOfIds = this.state.selectedContactList?.map((item: any) => item?.id);
      resolved["assignee"] = listOfIds;
    }
    let payload = {
      question: this.state?.responseData?.question || "",
      resolved: resolved,
      messageId: this.state.responseData?.messageId,
      resolvedInterruption: true,
      boardId: this.state.responseData?.boardId,
    };
    console.log("id==>", id);
    if (typeof id === "string" && id.trim() !== "") {
      payload.resolved.actionId = id;
    }

    // Use sendMessage from MessagesStore via props
    if (this.props.sendMessage) {
      this.props.sendMessage(payload);
    } else {
      console.warn("sendMessage not available in props");
    }
    console.log("payload==>", payload);
    if (this.props?.onConfirmCallback) {
      this.props?.onConfirmCallback(payload);
    }
    const { navigation } = this.props;
    //navigation.goBack(); //Commented for now
  };
  cancelClicked = () => {
    this.discardActionPress(this.state.responseData);
    const { navigation } = this.props;
    console.log("cancelClicked");
    // navigation.goBack(); //Commented for now
  };
  onPressFunc = (button: any) => {
    if (button?.type === "continue") {
      this.apiCall(button?.id || "");
    } else {
      this.cancelClicked();
    }
  };

  render() {
    let enabled = true;
    return (
      <>
        <View style={styles.listContainerStyle}>
          <View style={[styles.mainContainer]}>
            <Text style={styles.headerText}>Confirmation</Text>
            {this.renderContent()}

            {this.state.dynamicFooterdata
              ? this.renderDynamicFooter(this.onPressFunc)
              : this.renderFooter(
                  enabled,
                  "Continue",
                  this.apiCall,
                  this.cancelClicked
                )}
          </View>
        </View>
        {this.renderFileType()}
        {this.renderDatePicker()}
        {this.renderSelectAssignee()}
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  const { postsState, jira } = state;
  return {
    // discardMessageId: postsState?.discardMessageId,
    // discardFail: postsState?.discardFail,
    assigneeList: jira?.assigneeList,
    isSearching: jira?.isSearching,
  };
};

// export default connect(mapStateToProps, {
//   discardEmail,
//   getAssigneeList,
// })(withTranslation()(Interruption));

// Wrapper component to connect Zustand store to class component
const InterruptionWithStore: React.FC<any> = (props) => {
  const { sendMessage, updateMessageStatus } = useMessagesStore();

  return (
    <Interruption
      {...props}
      sendMessage={sendMessage}
      updateMessageStatus={updateMessageStatus}
    />
  );
};

export default InterruptionWithStore;

const styles = StyleSheet.create({
  listContainerStyle: {
    // flex: 1,
    // marginTop: 40,

    justifyContent: "flex-end",
    alignContent: "flex-end",
  },
  slotHeaderText: {
    fontSize: normalize(14),
    color: "#667085",

    fontWeight: "500",
    marginVertical: 12,
  },
  slotItemContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  slotLabelText: {
    marginStart: 10,
    fontSize: normalize(14),
    color: "#344054",
    fontWeight: "500",

    flexShrink: 1,
  },
  mainContainer: {
    // flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopStartRadius: 12,
    borderTopEndRadius: 12,
    paddingTop: 18,
  },
  headerText: {
    fontSize: normalize(16),
    color: "#101828",
    alignSelf: "center",
    fontWeight: "600",

    paddingBottom: 12,
  },
  separatorLine: {
    backgroundColor: "#D0D5DD",
    height: 1,
  },
  backdropOverlay: {
    flex: 1,
    backgroundColor: "#8B000000",
  },
  sheetHandle: {
    backgroundColor: "#D0D5DD",
    width: 52,
    height: 4,
    marginVertical: 10,
    borderRadius: 100,
    alignSelf: "center",
  },
  bottomSheetHandle: {
    backgroundColor: "#D0D5DD",
    width: 52,
    height: 4,
    borderRadius: 100,
  },
  hiddenHandle: {
    width: 0,
    height: 0,
  },
  alertContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
  },
  alertTextStyle: {
    fontSize: normalize(14),
    fontWeight: "400",
    color: "#101828",
  },
  sectionHeaderTextStyle: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: "#667085",
  },
  scrollContainer: {
    // flex: 1,
    paddingBottom: 20,
  },
  footerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    marginBottom: 28,
    borderTopColor: "#EAECF0",
  },
  dynamicFooterContainer: {
    flexGrow: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 12,
    marginBottom: 28,
    borderTopColor: "#EAECF0",
  },
  cancelButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors?.lightestGrey,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
    marginBottom: 16,
    minWidth: normalize(110),
    flexGrow: 1,
  },
  primaryButton: {
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors?.darkBlack,
    marginBottom: 16,
    marginHorizontal: 3,

    minWidth: normalize(110),
    flexGrow: 1,
  },
  primaryButtonText: {
    fontSize: normalize(16),
    fontWeight: "500",
    color: Colors?.pureWhite,
  },
  disabledButtonText: {
    fontSize: normalize(16),
    fontWeight: "500",
    color: Colors?.lightestGrey,
  },
  disabledButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors?.grey200,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: Colors?.grey200,
  },
  cancelButtonText: {
    fontSize: normalize(16),
    fontWeight: "500",
    color: Colors.darkGrey,
  },
  itemContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 100,
    marginEnd: 8,
    marginBottom: 8,
    alignItems: "center",
    paddingLeft: 10,
  },
  nestedItemContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 100,
    marginEnd: 8,
    marginBottom: 8,
    alignItems: "center",
    paddingHorizontal: 10,
    flexWrap: "wrap",
  },
  nestedItemSubContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: { paddingRight: 8 },
  itemTextStyle: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: "#344054",
    paddingVertical: 8,
    flexWrap: "wrap",
  },
  verticalSeparator: {
    width: 1,
    height: 32,
    backgroundColor: "#D0D5DD",
    marginLeft: 6,
  },
  horizontalSeparator: (leadingItem: any) => ({
    height: leadingItem ? 1 : 0,
    backgroundColor: "#EAECF0",
    marginTop: leadingItem ? 10 : 0,
    marginBottom: leadingItem ? 6 : 2,
  }),
  fileHeaderText: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: Colors?.darkBlack,
    alignSelf: "center",
    paddingBottom: 10,
  },
  fileTextStyle: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: Colors?.darkBlack,
    paddingLeft: 12,
  },
  checkboxInnerIcon: (isSelected: any) => ({
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: isSelected ? "#495465" : "#FFFFFF",
  }),
  checkboxBaseStyle: {
    borderRadius: 4,
    borderColor: "#344054",
    width: 16,
    height: 16,
    marginEnd: 10,
  },
  fileItemContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  checkboxIcon: {
    borderColor: "#d0d5dd",
    backgroundColor: "white",
  },
  fileIcon: {
    width: normalize(16),
    height: normalize(16),
    borderRadius: 4,
  },
  flatListContainer: { flex: 1, paddingTop: 10 },
  dropdownContainer: { alignItems: "center", flexDirection: "row" },
  dropdownInnerContainer: (highlight: any) => ({
    flexDirection: "row",
    backgroundColor: highlight ? "#EFF4FF" : "#FFFFFF",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 10,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
  }),
  textInput: {
    borderColor: "#D0D5DD",
    borderWidth: 1,
    borderRadius: 8,
    textAlignVertical: "center",
    flex: 1,
    paddingVertical: 0,
    minHeight: normalize(64),
    fontSize: normalize(14),
    paddingHorizontal: 14,
    color: "#101828",
    backgroundColor: "#FFFFFF",
    lineHeight: normalize(24),
    maxHeight: normalize(90),
  },
  dropdownTrigger: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderColor: "#D0D5DD",
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
  },
  assigneeMainContainer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderColor: "#D0D5DD",
    borderWidth: 1,
    borderRadius: 8,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  assigneeSubContainer: {
    flexWrap: "wrap",
    flex: 1,
    flexShrink: 1,
    flexDirection: "row",
  },
  placeholderText: {
    color: "#667085",
    flex: 1,
  },
  tagContainer: {
    height: 32,
    marginBottom: 4,
    paddingEnd: 4,
    backgroundColor: "#F2F4F7",
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    marginRight: 4,
    flexShrink: 1,
  },
  tagText: {
    color: Colors.darkBlack,
    flexShrink: 1,
    fontSize: normalize(14),
    paddingLeft: 8,
    fontWeight: "500",
  },
  iconTouchArea: { paddingHorizontal: 8 },
  textContainer: { flexShrink: 1 },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 64,
  },
  messageText: (hasContent: any) => ({
    fontSize: normalize(16),
    color: hasContent ? Colors?.darkBlack : "#D0D5DD",
    fontWeight: "400",
  }),
});
