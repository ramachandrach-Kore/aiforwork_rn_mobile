import React, { Component } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  Text,
} from "react-native";

import { Colors } from "../utils/Colors";
import { normalize } from "../utils/CommonFunctions";
import { CloseIcon } from "../icons";

type SearchProps = {
  placeholder: string;
  searchBarStyle: {};
  isShowCancelLable: boolean;
  onCancelClicked: Function;
  setSearchValue: Function;
  maxLength: number;
  renderLeft: Function;
  renderRight: Function;
  onSubmitEditing: Function;
  initialValue: String;
  clearOnSubmit: boolean;
  clearText: String;
};

type SearchState = {
  value: String;
};
class SearchBar extends Component<SearchProps, SearchState> {
  state = {
    value: "",
  };

  componentDidMount(): void {
    const { initialValue } = this.props;
    if (initialValue?.length > 0) {
      this.setState({ value: initialValue });
    }
  }

  onSubmitEditing = () => {
    const { value } = this.state;
    if (this.props.onSubmitEditing && value?.length > 0) {
      this.props.onSubmitEditing(value);
    }
    if (this.props.clearOnSubmit) {
      this.setState({ value: "" });
    }
  };

  textInput = React.createRef<TextInput>();

  render() {
    const { value } = this.state;
    const { autoFocus = true } = this.props;
    return (
      <TouchableOpacity
        style={this.props.searchBarStyle}
        onPress={() => {
          this.textInput?.current?.focus();
        }}
      >
        {this.props.renderLeft ? this.props.renderLeft() : null}
        <View style={{ flex: 1 }}>
          <TextInput
            value={value}
            ref={this.textInput}
            style={styles.input}
            placeholder={this.props.placeholder}
            // value={this.value}
            onChangeText={(text) => {
              this.setState(
                {
                  value: text,
                },
                () => {
                  this.props?.setSearchValue(text);
                }
              );
            }}
            maxLength={this.props.maxLength}
            onFocus={() => {
              // this.props?.setClicked(true);
            }}
            returnKeyType={"search"}
            onSubmitEditing={this.onSubmitEditing}
            autoFocus={autoFocus}
            placeholderTextColor={"#98A2B3"}
          />
        </View>
        {this.props.isShowCancelLable && this.state.value?.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              this.props?.onCancelClicked();
              this.textInput?.current?.clear();
              this.setState(
                {
                  value: "",
                },
                () => {
                  this.props?.setSearchValue("");
                }
              );
            }}
            style={styles.close_icon}
          >
            {this.props.clearText === "Clear" ? (
              <Text style={styles.clearTextStyle}>{this.props.clearText}</Text>
            ) : (
              <CloseIcon width={normalize(20)} height={normalize(20)} />
            )}
          </TouchableOpacity>
        ) : (
          this.props.renderRight && this.props.renderRight()
        )}
      </TouchableOpacity>
    );
  }
}

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 0,
    marginLeft: 3,
    color: Colors?.darkBlack,
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: normalize(14),
    paddingEnd: 5,
  },
  close_icon: {
    paddingVertical: 6,
    paddingEnd: 10,
    paddingStart: 5,
    marginRight: 2,
  },
  clearTextStyle: {
    fontWeight: "400",
    fontSize: normalize(14),
    color: Colors?.mediumGrey,
  },
});
