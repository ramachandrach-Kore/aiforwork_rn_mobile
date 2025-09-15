import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { View, Image } from "react-native";
import TextAvatar from "./TextAvatar";

import { isAndroid, isIOS } from "../../utils/CommonFunctions";
import API_URL from "../../env.constants";
import { generateBackgroundStyle, getColor } from "./helpers";

const colors = [
  {
    bgColor: "#2ecc71",
    textColor: "#fff",
  },
  {
    bgColor: "#3498db",
    textColor: "#fff",
  },

  {
    bgColor: "#8e44ad",
    textColor: "#fff",
  },
  {
    bgColor: "#e67e22",
    textColor: "#fff",
  },
];

const UserAvatar = (props) => {
  let {
    name,
    color,
    size,
    style,
    height,
    width,
    textStyle,
    backgroundColor,
    displayFullText,
    twoLettersText = null,
    profileIcon = null,
    updateProfile = null,
    userId = null,
    isSecond = false,
    fromProfile = false,
  } = props;
  if (typeof size === "string") {
    console.log("size prop should be a number");
    size = parseInt(size);
  }
  let textColor = color || getColor(name, colors).textColor;
  const val = displayFullText;
  height = height || size;
  width = width || size;
  const [inner, setInner] = useState(
    <TextAvatar
      size={size}
      height={height}
      width={width}
      name={name}
      textColor={backgroundColor ? textColor : "white"}
      displayFullText={val}
      textStyle={textStyle}
      twoLettersText={twoLettersText}
    />
  );

  useEffect(() => {
    if (profileIcon && userId && profileIcon === "profile.png") {
      var cId = Math.random().toString(36).slice(2);

      let uniqueURL =
        API_URL?.appServer +
        "api/1.1/getMediaStream/profilePictures/" +
        userId +
        "/d_128x128_profile.png" +
        "?test=" +
        cId;

      let url =
        API_URL?.appServer +
        "api/1.1/getMediaStream/profilePictures/" +
        userId +
        "/d_64x64_profile.png";
      setInner(
        <Image
          source={{
            uri: fromProfile ? uniqueURL : url,
          }}
          style={{ height, width }}
          resizeMode="contain"
          onError={() => {
            setInner(
              <TextAvatar
                size={size}
                height={height}
                width={width}
                name={name}
                textColor={backgroundColor ? textColor : "white"}
                displayFullText={val}
                textStyle={textStyle}
              />
            );
          }}
        />
      );
    } else if (profileIcon && profileIcon?.startsWith("https://")) {
      var cId = Math.random().toString(36).slice(2);

      let uniqueURL = profileIcon;

      setInner(
        <Image
          source={{
            uri: uniqueURL,
          }}
          style={{ height, width }}
          resizeMode="contain"
          onError={() => {
            setInner(
              <TextAvatar
                size={size}
                height={height}
                width={width}
                name={name}
                textColor={backgroundColor ? textColor : "white"}
                displayFullText={val}
                textStyle={textStyle}
              />
            );
          }}
        />
      );
    } else {
      setInner(
        <TextAvatar
          size={size}
          height={height}
          width={width}
          name={name}
          textColor={backgroundColor ? textColor : "white"}
          displayFullText={val}
          textStyle={textStyle}
        />
      );
    }

    return function cleanup() {
      setInner(null);
    };
  }, [name, updateProfile, profileIcon]);

  let _color = null;
  if (color) {
    _color = {
      bgColor: color,
    };
  }

  return (
    <View
      style={[
        fromProfile && profileIcon === "profile.png"
          ? { backgroundColor: "transparent" }
          : generateBackgroundStyle(name, _color, colors),
        style,
        isIOS ? { borderWidth: 1.5, borderColor: "white" } : {},
        isSecond ? { paddingLeft: 5 } : {},
      ]}
    >
      {inner}
    </View>
  );
};

UserAvatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  bgColor: PropTypes.string,
  bgColors: PropTypes.array,
  size: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  imageStyle: PropTypes.object,
  borderRadius: PropTypes.number,
  component: PropTypes.any,
  textStyle: PropTypes.object,
};

UserAvatar.defaultProps = {
  size: 32,
  name: "User",
  height: undefined,
  width: undefined,
  textStyle: {},
  bgColors: [],
  colors: [],
};

export default UserAvatar;
