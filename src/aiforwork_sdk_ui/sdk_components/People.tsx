import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Keyboard,
} from "react-native";
import React, { useState } from "react";

import { Colors } from "../utils/Colors";
import SearchBar from "../sdk_components/SearchBar";
import WAKeyboardAvoidingView from "../sdk_components/Keyboard/WAKeyboardAvoidingViewModals";
import Avatar from "../sdk_components/avatars/Avatar";
// import { BottomSheetFlatList } from "@gorhom/bottom-sheet"; // Replaced with regular FlatList
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import LinearGradient from "react-native-linear-gradient";

import { normalize } from "../utils/CommonFunctions";
import { CheckMark, CloseIcon, SearchIcon } from "../icons";

export const ModalHeader = ({
  title = "Data filters",
  onCancelPress = () => {},
}) => {
  return (
    <View style={styles.modalHeaderView}>
      <View style={styles.modalTextView}>
        <Text style={styles.modalHeaderText}>{title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onCancelPress()}
        style={styles.crossIconView}
      >
        <CloseIcon width={normalize(20)} height={normalize(20)} />
      </TouchableOpacity>
    </View>
  );
};

export const People = ({
  headerTitle,
  recentContactList,
  selectedContact,
  selectedContactList,
  multi,
  cancelClicked,
  searchContact,
  contactSuggestions,
  isSearching,
}: any) => {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(selectedContactList || []);

  const onButtonPress = () => {
    Keyboard.dismiss();
    if (cancelClicked) {
      setTimeout(() => {
        cancelClicked();
      }, 500);
    }
  };

  const searchLeft = () => {
    return (
      <View style={styles.searchLeftView}>
        <SearchIcon
          width={normalize(20)}
          height={normalize(20)}
          color={Colors.darkBlack}
        />
      </View>
    );
  };

  const renderProfileIcon = (item: any) => {
    if (item?.color && item?.icon === "no-avatar") {
      return (
        <Avatar
          rad={32}
          // updateProfile={profileRefresh}
          name={item?.fN}
          color={item?.color}
          profileIcon={item?.icon}
          textSize={normalize(14)}
          userId={item?.id}
          fromProfile={false}
        />
      );
    } else {
      return (
        <Avatar
          rad={32}
          // updateProfile={profileRefresh}
          name={item?.fN || item?.emailId}
          color={"#F79009"}
          profileIcon={"no-avatar"}
          textSize={normalize(14)}
          userId={item?._id}
          fromProfile={false}
        />
      );
    }
  };

  const addUser = (contact) => {
    let selectedList = [...selectedUsers];

    let foundIndex = selectedUsers.findIndex((obj2) => contact.id === obj2.id);
    if (foundIndex >= 0) {
      selectedList.splice(foundIndex, 1);
    } else {
      selectedList.push(contact);
    }
    setSelectedUsers(selectedList);
  };

  const renderContactItem = ({ item, index }: any) => {
    var name: string = item?.label || "";
    if (item?.fN && item?.lN) {
      name = item?.fN + " " + item?.lN;
    } else if (item?.fN || item?.lN) {
      name = item?.fN || item?.lN;
    } else if (item?.emailId) {
      name = item?.emailId;
    } else if (item?.label) {
      name = item?.label;
    }
    let isSelected = false;
    let exist = selectedUsers.findIndex((p) => p?.id === item?.id);
    if (exist >= 0) {
      isSelected = true;
    }
    return (
      <TouchableOpacity
        style={styles.mainView}
        onPress={() => {
          if (multi) {
            addUser(item);
          } else {
            selectedContact(item);
          }
        }}
      >
        {renderProfileIcon(item)}
        <View style={styles.subView}>
          <Text style={styles.nameText}>{name}</Text>
          {name !== item?.emailId && item?.emailId ? (
            <Text style={styles.emailText}>{item?.emailId}</Text>
          ) : null}
        </View>
        {multi && isSelected ? (
          <View style={styles.iconView}>
            <CheckMark
              width={normalize(16)}
              height={normalize(16)}
              color={"#155EEF"}
            />
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  const onChange = (value: string) => {
    if (value?.length > 0) {
      let payload = {
        query: value,
      };
      searchContact(payload);
    }
    setTimeout(() => {
      setValue(value);
    }, 200);
  };

  const onSubmitEditing = (value: string) => {
    setValue(value);
  };

  const emptyPlaceHolder = () => {
    const views = [];
    for (let i = 0; i < 4; i++) {
      views.push(
        <View style={styles.shimmerRow}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.shimmerCircle}
          />
          <View>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.longShimmerLine}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.shortShimmerLine}
            />
          </View>
        </View>
      );
    }
    if (isSearching) {
      return (
        <View style={{ flex: 1 }}>
          <View style={styles.emptyPlaceholderView}>{views}</View>
        </View>
      );
    }
    if (value !== "" && contactSuggestions?.length === 0) {
      return (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text>{"No matching results !!!"}</Text>
        </View>
      );
    }
    return <></>;
  };

  return (
    <WAKeyboardAvoidingView style={styles.selectedSourceView}>
      {multi ? (
        <View style={styles.modalHeaderView}>
          <TouchableOpacity
            onPress={() => onButtonPress()}
            style={{
              flex: 1,
              paddingHorizontal: 20,
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.modalHeaderText, styles.selectedSourceView]}>
            {headerTitle}
          </Text>
          <TouchableOpacity
            style={{ paddingHorizontal: 16 }}
            onPress={() => {
              selectedContact(selectedUsers);
            }}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ModalHeader
          title={headerTitle}
          onCancelPress={() => onButtonPress()}
        />
      )}
      <View style={{ paddingLeft: 20, paddingVertical: 12, flex: 1 }}>
        <Text style={styles.searchText}>{"Search"}</Text>
        <SearchBar
          placeholder="Search member"
          searchBarStyle={styles.searchBarView}
          isShowCancelLable={true}
          onCancelClicked={() => {}}
          setSearchValue={onChange}
          maxLength={128}
          renderLeft={searchLeft}
          initialValue={value}
          renderRight={() => {}}
          onSubmitEditing={onSubmitEditing}
          clearOnSubmit={false}
          clearText={"Cross"}
        />
        <FlatList
          style={{ flex: 1, paddingTop: 8, marginEnd: 20 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={"handled"}
          data={value?.length > 0 ? contactSuggestions : recentContactList}
          ListEmptyComponent={emptyPlaceHolder}
          renderItem={renderContactItem}
        />
      </View>
    </WAKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: Colors?.darkBlack,
  },
  selectedSourceView: {
    flex: 1,
  },
  searchText: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: Colors?.darkGrey,
    marginBottom: 6,
  },
  modalHeaderView: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: Colors?.grey200,
    paddingBottom: 12,
  },
  modalTextView: {
    flexDirection: "row",
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",

    paddingVertical: 4,
  },
  modalHeaderText: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: Colors.darkBlack,
    paddingVertical: 0,

    textAlignVertical: "center",
  },
  crossIconView: {
    justifyContent: "flex-end",
    paddingVertical: 4,
    paddingHorizontal: 12,
    position: "absolute",
    right: 1,
  },
  searchBarView: {
    borderColor: Colors.lightestGrey,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: Colors.pureWhite,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
    marginEnd: 20,
  },
  searchLeftView: { marginEnd: 5, marginStart: 14 },
  nameText: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: Colors?.darkBlack,
  },
  emailText: {
    fontSize: normalize(12),
    fontWeight: "400",
    color: Colors?.mediumGrey,
  },
  quickFilterView: {
    backgroundColor: Colors.grey50,
    borderRadius: 100,
    padding: 3.33,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  mainView: {
    paddingVertical: 9,
    minHeight: normalize(38),
    flexDirection: "row",
  },
  subView: {
    alignContent: "center",
    justifyContent: "center",
    marginLeft: 10,
    flex: 1,
  },
  iconView: {
    marginEnd: 10,
    justifyContent: "center",
  },
  cancelText: {
    fontSize: normalize(16),
    fontWeight: "400",
    color: Colors.darkBlack,
    textAlignVertical: "center",
  },
  doneText: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#2970FF",
  },
  shimmerRow: { flexDirection: "row", marginVertical: 12 },
  shimmerCircle: { width: 32, height: 32, borderRadius: 100, marginRight: 12 },
  longShimmerLine: {
    borderRadius: 100,
    width: 156,
    height: 10,
    marginBottom: 6,
  },
  shortShimmerLine: { borderRadius: 100, width: 92, height: 10 },
  emptyPlaceholderView: {
    paddingBottom: 12,
    flexShrink: 1,
    backgroundColor: Colors?.pureWhite,
    borderRadius: 16,
  },
});
