import React, { useState } from "react";
import {
  View,
  Button,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { CheckMark, DefaultImage } from "../icons";
import { normalize, openMessage } from "../utils/CommonFunctions";
//CitationPopUp
const openContextMenuItem = {
  text: "Open",
  id: "openSource",
  renderIcon: () => {
    return (
      <DefaultImage
        // name={'OpenContext'}
        width={normalize(20)}
        height={normalize(20)}
      />
    );
  },
};

const setAsSourceMenuItem = {
  text: "Set as Context",
  id: "setSource",
  renderIcon: () => {
    return (
      <CheckMark
        // name={'FileSearch'}
        width={normalize(20)}
        height={normalize(20)}
        color={"#737373"}
      />
    );
  },
};
const CitationOpenView = ({ selectedSource }: { selectedSource: any }) => {
  console.log('=== CitationOpenView Rendered ===');
  console.log('selectedSource:', selectedSource);
  
  let menuOptions: any[] = [];
  let allSources = selectedSource?.item?.sources || [];
  let results = allSources?.filter((s: any) => {
    return s?.chunkId === selectedSource?.citation?.chunkId;
  });
  let source = results[0];
  
  console.log('allSources:', allSources);
  console.log('results:', results);
  console.log('source:', source);
  console.log('menuOptions:', menuOptions);
  if (source?.msgId?.length > 0 || source?.redirectUrl) {
    menuOptions.push(openContextMenuItem);
  }

  let canSetAsSourceContext =
    source?.canSetAsSourceContext == undefined
      ? true
      : source?.canSetAsSourceContext;
  if (canSetAsSourceContext) {
    menuOptions.push(setAsSourceMenuItem);
  }

  const menuClick = (action: string) => {
    console.log("menuClick", action);
    if (action === "openSource") {
      const messageId = source?.msgId;
      openMessage(messageId, source?.redirectUrl);
    }
  };
  return (
    <View style={styles.centeredContainer}>
      <View style={styles.citationContainer}>
        <Text numberOfLines={2} style={styles.citationTitle}>
          {source?.title || "[No subject]"}
        </Text>
      </View>
      <TouchableWithoutFeedback>
        <View style={styles.menuContainer}>
          {menuOptions?.map((item, index) => {
            return (
              <TouchableOpacity
                key={`menu-item-${index}`}
                style={styles.menuItemContainer}
                onPress={() => menuClick(item?.id)}
              >
                <Text style={styles.menuItemText}>{item?.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
   
    backgroundColor:'#FFFFFF'
   
  },
  citationTitle: {
    fontSize: normalize(14),
    lineHeight: 22,
    fontWeight: "600",
    color: "#101828",
    flexShrink: 1,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
   
    borderRadius: 12,
    marginTop: 10,
  },
  menuItemText: {
    color: "#000000",
    fontWeight: "500",
    fontSize: normalize(14),
  },
  citationContainer: {
   
    paddingVertical: 6,

    
    borderBottomColor:'#E4E7EC',
    paddingBottom:16,
    borderBottomWidth:1
  },
  menuItemContainer: {
   
    paddingVertical: 10,
    flexDirection: "row",
  },
});

export default CitationOpenView;
