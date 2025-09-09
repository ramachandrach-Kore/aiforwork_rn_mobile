import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import _ from "lodash";
import { normalize, SHEET_ID_LIST } from "../utils/CommonFunctions";
import { renderSourceIcons } from "../utils/SourcesUtils";
// import { FlatList } from "react-native-gesture-handler";
import { Loader } from "./Loader";
import { Colors } from "../utils/Colors";
import FastImage from "react-native-fast-image";
import { isAndroid } from "../utils/CommonFunctions";
import EvaImageView from "./EvaImageView";
import { useAgentsStore } from "../../aiforwork_sdk_core/store/agentsStore";
import { ChevronDown, CloseIcon } from "../icons";


interface SessionData {
  sources?: any[];
}

interface DocSelected {
  files?: any[];
}

interface SourcesHorizontalProps {
  sessionRequestSources?: any[];
  session?: SessionData;
  openSheet?: (item: any) => void;
  isFocussed?: boolean;
  contextCloseAction?: (item: any) => void;
  docSelected?: DocSelected;
  selectedFilters?: any[];
  resetFilters?: () => void;
}

const SourcesHorizontal: React.FC<SourcesHorizontalProps> = (props) => {
  const listRef = useRef<FlatList>(null);
  const { selectedAgent,removeLocalAgentSelection } = useAgentsStore();

  useEffect(() => {
    if (
      props.sessionRequestSources?.length &&
      props.sessionRequestSources?.length > 0
    ) {
      try {
        listRef?.current?.scrollToIndex({
          animated: true,
          index: props.session?.sources?.length || 0,
          viewPosition: 1,
        });
      } catch (e) {}
    }
  }, [props.sessionRequestSources]);

  useEffect(() => {
    if (props.session?.sources?.length && props.session?.sources?.length > 0) {
      try {
        listRef?.current?.scrollToIndex({
          animated: true,
          index: props.session?.sources?.length
            ? props.session?.sources?.length - 1
            : 0,
          viewPosition: 0.5,
        });
      } catch (e) {}
    }
  }, [props.session?.sources?.length]);

  const sheetDropDownClick = (item: any): void => {
    //props.openSheet(item);
  };

  const renderSubIcon = (item: any): JSX.Element => {
    if (item?.extIcon?.length > 0) {
      return (
        <View style={styles.sourceIconBadge}>
          <FastImage
            source={{
              uri: item?.extIcon,
              priority: FastImage.priority.normal,
              cache: isAndroid
                ? FastImage.cacheControl.immutable
                : FastImage.cacheControl.web,
            }}
            style={{
              width: normalize(10),
              height: normalize(10),
              borderRadius: normalize(10),
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      );
    }
    return <View />;
  };

  const renderSource = (item: any, isSignle: boolean): JSX.Element => {
    let type: string = item?.source === "attachment" ? item?.ext : item?.source;

    if (
      (item?.uri && item?.name) ||
      (item?.source === "attachment" && item?.title)
    ) {
      //its attachment
      let name = item?.name || item?.title;
      try {
        type =
          name?.includes(".") &&
          name?.substr(name?.lastIndexOf(".") + 1).split(" ")[0];
      } catch (e) {}
    }

    if (!item?.extIcon && item?.source === "accountKnowledge") {
      type = ""; // Service dependency .
    }

    const contextCloseAction=(item:any)=>{
      removeLocalAgentSelection();
      props.contextCloseAction?.(item);
    }
    const IconComponent = type
      ? (renderSourceIcons(
          type?.toLowerCase(),
          true
        ) as React.ComponentType<any>)
      : null;
    console.log(type, "========IconComponent========>", IconComponent);
    let showLoader = true;

    if (selectedAgent) {
      showLoader = false;
    }

    if (props.session?.sources?.length && props.session?.sources?.length > 0) {
      const index = props.session?.sources?.findIndex(
        (source: any) => source?.docId === item?.docId
      );
      showLoader = index > -1 ? false : true;
    }

    if (
      !showLoader &&
      props.sessionRequestSources?.length &&
      props.sessionRequestSources?.length > 0
    ) {
      let ids = props.sessionRequestSources.map((item: any) => {
        return item?.docId;
      });

      if (ids?.includes(item?.docId)) {
        showLoader = true;
      }
    }

    if (item?.hasOwnProperty("sourceRemoveInProgress")) {
      showLoader = item?.sourceRemoveInProgress;
    }

    return (
      <View
        style={[
          styles.sourceParent,
          styles.parentFlexBox,
          isSignle
            ? { marginHorizontal: 12 }
            : { marginHorizontal: props.isFocussed ? 0 : 4 },
        ]}
      >
        {item?.iconUrl ? (
          <View style={styles.sourceIconWrapper}>
            <View style={styles.sourceIconPositioned}>
              <EvaImageView
                url={item?.iconUrl}
                width={18}
                height={18}
                imageStyle={{ borderRadius: 2 }}
                parentStyles={{
                  marginStart: 0,
                  marginEnd: 6,
                  borderRadius: 2,
                  marginTop: 4,
                }}
              />
            </View>
            {!(item?.source === "attachment" && item?.ext) &&
              renderSubIcon(item)}
          </View>
        ) : item?.icon ? (
          <View style={styles.sourceIconWrapper}>
            <FastImage
              source={{
                uri: item?.icon,
                priority: FastImage.priority.normal,
                cache: isAndroid
                  ? FastImage.cacheControl.immutable
                  : FastImage.cacheControl.web,
              }}
              style={{
                width: normalize(22),
                height: normalize(22),
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        ) : IconComponent ? (
          <View style={styles.sourceIconWrapper}>
            <View style={styles.sourceIconPositioned}>
              <IconComponent width={normalize(18)} height={normalize(18)} />
            </View>
            {!(item?.source === "attachment" && item?.ext) &&
              renderSubIcon(item)}
          </View>
        ) : (
          <></>
        )}
        <Text
          style={[
            styles.sourceItemTitle,
            styles.sourceTypo,
            !isSignle && { maxWidth: 120 },
          ]}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {item?.title || item?.name || "[No subject]"}
        </Text>
        {showLoader ? (
          <View
            style={{
              paddingHorizontal: 5,
            }}
          >
            <Loader size={14} width={14} height={14} />
          </View>
        ) : item?.ext &&
          SHEET_ID_LIST.includes(item?.ext) &&
          item?.sheets?.length > 0 ? (
          <TouchableOpacity
            style={styles.actionIcon}
            hitSlop={30}
            onPress={() => sheetDropDownClick(item)}
          >
            <ChevronDown
              color={"#344054"}
              width={normalize(24)}
              height={normalize(24)}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionIcon}
            hitSlop={30}
            onPress={() => contextCloseAction(item)}
          >
            <CloseIcon
              width={normalize(16)}
              height={normalize(16)}
              color={"#A0A0AB"}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSeparator = (): JSX.Element => (
    <View
      style={{
        minWidth: 4,
      }}
    />
  );

  const renderSelectedSource = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }): JSX.Element => {
    return renderSource(item, false);
  };

  console.log("========Test========>", props.session);
  let allSources: any[] = [
    ...(Array.isArray(props.session?.sources) ? props.session.sources : []),
    ...(Array.isArray(props.docSelected?.files) ? props.docSelected.files : []),
    ...(Array.isArray(props.sessionRequestSources)
      ? props.sessionRequestSources
      : []),
  ];
  if (selectedAgent) {
    allSources.push(selectedAgent);
  }
  console.log("========Selected Agent========>", selectedAgent);
  if (allSources?.length > 0) {
    allSources = _.uniqBy(allSources, "docId");
  }
  let isAgent = false;
  if (
    props.session?.sources?.length &&
    props.session?.sources?.length == 1 &&
    props.session.sources?.[0]?.isAgent === true
  ) {
    isAgent = true;
  }

  if (isAgent == false && allSources?.length > 0) {
    /* if (allSources?.length == 1) {
        return renderSource(allSources[0], true);
      } else { */
    return (
      <View>
        <FlatList
          ref={listRef}
          data={allSources}
          horizontal={true}
          keyboardShouldPersistTaps={"handled"}
          contentContainerStyle={[getContentStyle(props.isFocussed || false)]}
          ItemSeparatorComponent={renderSeparator}
          renderItem={renderSelectedSource}
          showsHorizontalScrollIndicator={false}
          onScrollToIndexFailed={({ index, averageItemLength }) => {
            // Layout doesn't know the exact location of the requested element.
            // Falling back to calculating the destination manually
            try {
              listRef?.current?.scrollToOffset({
                offset: index * averageItemLength,
                animated: true,
              });
            } catch (e) {}
          }}
          /* onLayout={() => listRef.current?.scrollToEnd({animated: true})} */
        />
      </View>
    );
    // }
  } else if (
    props?.selectedFilters?.length &&
    props?.selectedFilters?.length > 0
  ) {
    let count = props.selectedFilters?.length;
    let filterText = "Filters applied";
    if (count === 1) {
      filterText = "Filter applied";
    }
    return (
      <View style={getFilterContainerStyle(props.isFocussed || false)}>
        <View style={[styles.sourceParent, styles.parentFlexBox]}>
          <Text style={[styles.filterCountText, styles.textTypo]}>
            {count + " "}
          </Text>
          <Text
            style={[
              styles.filterDescriptionText,
              styles.textTypo,
              { flexWrap: "wrap", flexShrink: 1 },
            ]}
          >
            {filterText}
          </Text>
          <TouchableOpacity
            style={styles.actionIcon}
            hitSlop={30}
            onPress={props.resetFilters}
          >
            <CloseIcon
              width={normalize(16)}
              height={normalize(16)}
              color={"#A0A0AB"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <></>;
};

const getContentStyle = (isFocussed: boolean) => ({
  marginTop: isFocussed ? 2 : 6,
  paddingStart: isFocussed ? 16 : 8,
  paddingEnd: 8,
});

const getFilterContainerStyle = (isFocussed: boolean) => ({
  flexWrap: "wrap" as const,
  paddingHorizontal: isFocussed ? 0 : 12,
});

const styles = StyleSheet.create({
  sourceIconBadge: {
    bottom: 2,
    right: 5,
    borderColor: "#eaecf0",
    borderRadius: 100,
    position: "absolute",
    flexDirection: "row",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: "#fff",
  },
  parentFlexBox: {
    alignItems: "center",
    flexDirection: "row",
  },

  btn: {
    borderRadius: 100,
    padding: 10,
    backgroundColor: "#FEF3F2",
    borderWidth: 1,
    borderColor: "#FEE4E2",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceTypo: {
    textAlign: "left",
    lineHeight: 20,
    fontSize: normalize(14),
    fontWeight: "400",
  },

  primaryTextColor: {
    color: "#101828",
  },

  sourceIconContainer: {
    width: 28,
    height: 28,
    justifyContent: "center",
  },
  primarySourceText: {
    marginLeft: 4,
    color: "#101828",
    textAlign: "left",
    fontStyle: "normal",
    lineHeight: 20,
    fontSize: normalize(14),
    flex: 1,
    fontWeight: "500",
  },
  closeIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
    overflow: "hidden",
  },

  borderStyle: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderStyle: "solid",

    marginBottom: 10,
  },

  sourceParent: {
    borderRadius: 100,
    backgroundColor: "transparent",
    borderColor: "#E4E4E7",
    paddingHorizontal: 10,

    paddingVertical: 2,
    borderWidth: 1,
    borderStyle: "solid",
    minHeight: normalize(36),
    // marginHorizontal: 16,
    marginVertical: 8,
  },
  sourceTextColor: {
    color: "#101828",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  actionIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceItemTitle: {
    marginLeft: 0,
    color: "#3F3F46",
    flex: 1,
  },
  sourceIconPositioned: {
    top: 0,
    left: 4,
    overflow: "hidden",
    position: "absolute",
    height: 28,
    width: 28,
    marginStart: -2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  sourceIconWrapper: {
    // marginLeft: 8,
    height: 28,
    width: 28,
    justifyContent: "center",
  },

  quickActionsContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 4,
  },

  textTypo: {
    textAlign: "left",
    lineHeight: 20,
    fontSize: normalize(14),
    fontWeight: "500",
    marginStart: 2,
  },
  filterCountText: {
    fontWeight: "400",
    color: Colors?.darkBlack,
  },
  filterDescriptionText: {
    color: Colors?.darkBlack,
    marginLeft: 8,
  },
});

export default SourcesHorizontal;
