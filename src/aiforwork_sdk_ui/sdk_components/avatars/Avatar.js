import React from "react";
import { View } from "react-native";
import UserAvatar from "./UserAvatar";

import { normalize } from "../../utils/CommonFunctions";
const Avatar = (props) => {
  const {
    src,
    name,
    displayFullText = false,
    color,
    profileIcon,
    updateProfile = "",
    userId,
    textSize = null,
    fromProfile = false,
    borderRadius = 30,
  } = props;
  const radius = props.rad ? props.rad : 48;
  const circleStyle = {
    borderColor: "#ffffff",
    borderRadius: borderRadius,
    overflow: "hidden",

    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <View style={circleStyle}>
      <UserAvatar
        src={src}
        name={name}
        style={circleStyle}
        color={color}
        size={radius}
        displayFullText={displayFullText}
        updateProfile={updateProfile}
        borderRadius={radius}
        profileIcon={profileIcon}
        fromProfile={fromProfile}
        userId={userId}
        textStyle={{ fontSize: textSize || normalize(18) }}
      />
    </View>
  );
};

export default Avatar;
