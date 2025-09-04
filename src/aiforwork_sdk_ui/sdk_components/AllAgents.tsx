import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  TextInput,
  SafeAreaView,
} from "react-native";

import { Colors } from "../utils/Colors";
import { normalize } from "../utils/CommonFunctions";
import { EmptyState } from "./EmptyState";
import { isAndroid } from "../utils/CommonFunctions";

import { CheckMark, CloseIcon, NoResultSearch, SearchIcon } from "../icons";

import EvaImageView from "./EvaImageView";
import { AgenticAppEmptyState } from "../icons/SdkIcons";
import { useMessagesStore } from "../../aiforwork_sdk_core/store/messagesStore";
import { useAgentsStore } from "../../aiforwork_sdk_core/store/agentsStore";

// Type declaration for EvaImageView to fix TypeScript issues
declare module "./EvaImageView" {
  interface EvaImageViewProps {
    url?: string;
    width: number;
    height: number;
    parentStyles?: any;
    imageStyle?: any;
  }
}

let FlatList: any;
let ScrollView: any;
//added condtional import due to scroll issue in android, if screen gesture enabled android flatlist scroll not working.
if (isAndroid) {
  //https://github.com/react-navigation/react-navigation/issues/10889
  // Import FlatList from react-native-gesture-handler for Android
  FlatList = require("react-native-gesture-handler").FlatList;
  ScrollView = require("react-native-gesture-handler").ScrollView;
} else {
  // Import FlatList from react-native for iOS
  FlatList = require("react-native").FlatList;
  ScrollView = require("react-native").ScrollView;
}

interface Agent {
  id?: string;
  name?: string;
  icon?: string;
  description?: string;
  config?: {
    executionPipeline?: Array<{
      intents?: Array<{
        agentMeta?: {
          icon?: string;
        };
      }>;
    }>;
  };
}

interface CommonAgent {
  id?: string;
  name?: string;
  icon?: string;
  description?: string;
}

interface Session {
  sources?: Array<{
    isAgent?: boolean;
    docId?: string;
  }>;
}

interface PropsData {
  callbackAgentPress?: (agent: any) => void;
  // route?: {
  //   params?: {
  //     agents?: any[];
  //     agenticApps?: any[];
  //     onClickAgent?: (item: any) => void;
  //     onClickCustomAgent?: (item: CommonAgent) => void;
  //   };
  // };
  commonAgents?: CommonAgent[];
  session?: Session;
  t?: (key: string) => string;
}

const AllAgents: React.FC<PropsData> = (propsData) => {
  const {agentsData,agentsLoading,getAgents,selectedAgent,setLocalAgentSelection} = useAgentsStore();
  const { sendMessage } = useMessagesStore();
  const [keyword, setKeyword] = useState("");
  const [isFocused, setFocus] = useState(false);
  const [currentTab, setCurrentTab] = useState("agents");
  const [searchEnabled, setSearchMode] = useState(false);
  // Use agentsData from store instead of props
  const allAgents = agentsData?.agents || [];
  const allAgenticApps = agentsData?.agenticApps  || [];
  const [agents, setAgents] = useState(allAgents.slice(0, 20));
  const [enabledCommonAgents, setCommonAgents] = useState([
    ...(agentsData?.commonAgents  || []),
  ]);
  //const { sendMessage } = useMessagesStore();

  useEffect(() => {
    getAgents();
  }, []);

  useEffect(() => {
    // Update agents when agentsData changes
    if (agentsData) {
     
      const currentAgents = currentTab === "agents" ? agentsData?.agents : agentsData?.agenticApps;
      setAgents(currentAgents?.slice(0, 20) || []);
      setCommonAgents([...(agentsData?.commonAgents || [])]);
    }
  }, [agentsData, currentTab]);

  useEffect(() => {
    setCommonAgents([...(propsData?.commonAgents || [])]);
  }, [propsData?.commonAgents]);

  const emptyStatesView = () => {
    let header = "No Apps Shared";
    if (currentTab === "agents") {
      header = "No Agents Found!";
    }
    return (
      <EmptyState
        emptyText={header}
        iconRender={false}
        buttonText={""}
        onButtonClick={() => {}}
        textStyle={styles.emptyTextStyle}
        buttonTextStyle={{}}
        SvgIcon={<AgenticAppEmptyState/>}
        descText={
          "There are no " + currentTab + " available to you at the moment."
        }
        descTextStyle={styles.emptyDescStyle}
      />
    );
  };

  const onClickAgent = (item: any) => {
    // if (props.route?.params?.onClickAgent) {
    //   props.route.params?.onClickAgent(item);
    // }else{
     // onAgentPress(item);
    }


  const onClickCustomAgent = (itemData: any) => {
    // if (propsData.route?.params?.onClickCustomAgent) {
    //   propsData.route.params?.onClickCustomAgent(item);
    // }
    let item = {
      ...itemData,
      isAgent: true,
    }
    setLocalAgentSelection(item);
    if(propsData.callbackAgentPress){
    propsData.callbackAgentPress?.(item);
    }
    
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight?.trim()) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) => {
      const isMatch = part.toLowerCase() === highlight.toLowerCase();
      return isMatch ? (
        <Text key={index} style={styles.highlightedText}>
          {part}
        </Text>
      ) : (
        <Text key={index} style={styles.lightText}>
          {part}
        </Text>
      );
    });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    let icons: string[] = [],
      count = 0;
    item?.config?.executionPipeline?.map((i) => {
      if (i?.intents?.[0]?.agentMeta?.icon && icons?.length < 2) {
        icons.push(i?.intents?.[0]?.agentMeta?.icon);
      } else if (i?.intents?.[0]?.agentMeta?.icon && icons?.length >= 2) {
        count = count + 1;
      }
    });
    return (
      <TouchableOpacity
        style={styles.agentItemView}
        onPress={() => {
          onAgentPress(item);
        }}
      >
        {currentTab === "agents" ? (
          <EvaImageView
            url={item?.icon}
            width={normalize(24)}
            height={normalize(24)}
            parentStyles={styles.EvaImageStyle}
            imageStyle={styles.EvaImageStyle}
          />
        ) : null}
        <View style={styles.agentItemView2(currentTab)}>
          <Text numberOfLines={1} style={styles.agentItemText}>
            {getHighlightedText(item?.name?.trim() || "", keyword)}
          </Text>
          {currentTab === "apps" && icons?.length > 0 ? (
            <View style={styles.appIconView}>
              {icons?.map((i, iconIndex) => (
                <EvaImageView
                  key={iconIndex}
                  url={i}
                  width={normalize(14)}
                  height={normalize(14)}
                  parentStyles={styles.EvaImageStyle}
                  imageStyle={styles.EvaImageStyle}
                />
              ))}
              {count > 0 ? (
                <Text style={styles.countStyle}>{"+" + count}</Text>
              ) : null}
            </View>
          ) : currentTab === "apps" ? (
            <View style={{ height: 34 }} />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const onChangeText = (text: string) => {
    let agents =
      currentTab === "agents"
        ? (agentsData?.agents )
        : (agentsData?.agenticApps );
    setKeyword(text);
    if (text?.length === 0) {
      setAgents(agents || []);
    } else {
      let filteredAgents = agents?.filter((item: any) => {
        let name = item?.name?.toLowerCase();
        return name?.includes(text?.trim()?.toLowerCase());
      });
      setAgents(filteredAgents || []);
    }
  };

  const renderSearchBar = () => {
    return (
      <View
        style={[
          styles.parentTextInputView(isFocused),
          { opacity: agents?.length > 0 ? 1 : keyword?.length === 0 ? 0.5 : 1 },
        ]}
      >
        <View style={styles.textInputView(isFocused)}>
          {!isFocused ? (
            <View style={{ paddingRight: 8 }}>
              <SearchIcon
                width={normalize(16)}
                height={normalize(16)}
                color={"#A3A3A3"}
              />
            </View>
          ) : null}
          <TextInput
            style={styles.textInputStyle1}
            autoCorrect={false}
            onChangeText={(text) => onChangeText(text)}
            placeholderTextColor={isFocused ? "#D6D6D6" : "#A3A3A3"}
            placeholder={"Search " + currentTab}
            value={keyword}
            onFocus={() => {
              setSearchMode(true);
              setFocus(true);
            }}
            onBlur={() => {
              setSearchMode(false);
              setFocus(false);
            }}
          />
          {keyword?.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                let agents =
                  currentTab === "agents"
                    ? (agentsData?.agents )
                    : (agentsData?.agenticApps );
                setKeyword("");
                setAgents(agents || []);
              }}
            >
              <CloseIcon
                width={normalize(18)}
                height={normalize(18)}
                color={"#A3A3A3"}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const renderTabs = () => {
    return (
      <View style={styles.flexParentView}>
        <View style={styles.tabMainView}>
          <TouchableOpacity
            style={styles.tabView(currentTab === "agents")}
            onPress={() => {
              const agentsToSet = agentsData?.agents  || [];
              setAgents(agentsToSet.slice(0, 20));
              setCurrentTab("agents");
            }}
          >
            <Text style={styles.tabName(currentTab === "agents")}>Agents</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabView(currentTab === "apps")}
            onPress={() => {
              const appsToSet = agentsData?.agenticApps || [];
              setAgents(appsToSet.slice(0, 20));
              setCurrentTab("apps");
            }}
          >
            <Text style={styles.tabName(currentTab === "apps")}>Apps</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCommonAgents = () => {
    let agents = enabledCommonAgents;
    console.log("enabledCommonAgents in scroll---", enabledCommonAgents);
    console.log("selectedAgent in scroll---", selectedAgent);
    return (
      <View style={styles.commonAgentsView}>
        <ScrollView
          scrollEnabled={agents?.length > 1}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
        >
          {agents?.map((item: any, agentIndex: number) => {
            let isSelected = false;
            //let sessionSource = propsData?.session?.sources;

            if (
              selectedAgent && selectedAgent !== null && selectedAgent !== undefined&&
              selectedAgent?.isAgent === true
            ) {
              isSelected = selectedAgent?.id === item?.id;
            }
            return (
              <TouchableOpacity
                key={agentIndex}
                style={styles.agentView}
                onPress={() => {
                  onClickCustomAgent(item);
                }}
              >
                {item?.icon ? (
                  <EvaImageView
                    url={item?.icon}
                    width={normalize(18)}
                    height={normalize(18)}
                    parentStyles={styles.EvaImageStyleT}
                    imageStyle={styles.EvaImageStyleT}
                  />
                ) : null}
                <View style={styles.agentsSubview}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.agentText}>{item?.name || ""}</Text>
                    {isSelected && (
                      <CheckMark
                        color={"#12B76A"}
                        width={normalize(16)}
                        height={normalize(16)}
                      />
                    )}
                  </View>
                  <Text style={styles.descText} numberOfLines={3}>
                    {item?.description || ""}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const toggleSearch = () => {
    let agents =
      currentTab === "agents"
        ? (agentsData?.agents )
        : (agentsData?.agenticApps );
    setSearchMode(!searchEnabled);
    setKeyword("");
    setAgents(agents || []);
  };

  const emptyComponent = () => {
    return (
      <View style={styles.noDataView}>
        <NoResultSearch width={48} height={48} />
        <Text style={styles.noResult}>{"No Search Results Found!"}</Text>
        <Text style={styles.noResultDesc}>
          {"No results found based on your search criteria"}
        </Text>
      </View>
    );
  };

  const onAgentPress = (agent: any) => {
    setLocalAgentSelection(agent);
    let question = `How can the ${agent?.name} bot agent assist me`;
    const sources = {
      name: agent?.name,
      docId: agent?.id,
      source: agent?.id,
      title: agent?.name,
      icon: agent?.icon,
      isAgent: true,
    };

    let payload={
      question:question,
      source:agent?.id,
      intent:'welcome',
      context:{
        sources:sources
      },
    
     
    }
    sendMessage(payload)
    propsData.callbackAgentPress?.(agent);
  }



  

  return (
    <View style={styles.container}>
      {renderCommonAgents()}
      <View style={styles.frameParent}>{renderTabs()}</View>
      {renderSearchBar()}
      <View style={styles.flexContainer}>
        {agentsLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading agents...</Text>
          </View>
        ) : agents?.length === 0 && keyword?.length === 0 ? (
          emptyStatesView()
        ) : (
          <FlatList
            contentContainerStyle={styles.contentStyle}
            style={styles.listStyle}
            data={agents}
            keyboardShouldPersistTaps={"handled"}
            renderItem={renderItem}
            ListEmptyComponent={emptyComponent}
            onEndReached={() => {
              let allAgents =
                currentTab === "agents"
                  ? (agentsData?.agents )
                  : (agentsData?.agenticApps );
              if (
                allAgents?.length &&
                allAgents.length > agents?.length &&
                !searchEnabled
              ) {
                const remainingAgents = allAgents?.length - agents?.length;

                if (remainingAgents > 20) {
                  const next20Agents = allAgents?.slice(
                    agents?.length,
                    agents?.length + 20
                  );
                  setAgents((prevAgents) => [...prevAgents, ...next20Agents]);
                } else {
                  const nextRemainingAgents = allAgents?.slice(agents?.length);
                  setAgents((prevAgents) => [
                    ...prevAgents,
                    ...nextRemainingAgents,
                  ]);
                }
              }
            }}
          />
        )}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors?.pureWhite,
  },
  emptyTextStyle: {
    fontSize: normalize(14),
    fontWeight: "600",
    color: "#0F0F0F",
    marginHorizontal: 60,
    textAlign: "center",
  },
  emptyDescStyle: {
    fontSize: normalize(12),
    fontWeight: "400",
    color: "#737373",
    textAlign: "center",
    marginTop: 12,
    marginHorizontal: 70,
  },
  frameParent: {
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 4,
    marginTop: 6,
  },
  flexContainer: {
    flex: 1,
    justifyContent: "center",
  },
  agentItemView: {
    flexDirection: "row",
    paddingLeft: 24,
  },
  imageStyle: {
    width: normalize(24),
    height: normalize(24),
    alignSelf: "center",
    marginRight: 16,
  },
  commonAgentIcon: {
    width: normalize(18),
    height: normalize(18),
  },
  appImageStyle: {
    width: normalize(14),
    height: normalize(14),
    alignSelf: "center",
    marginHorizontal: 2,
  },
  EvaImageStyle: {
    alignSelf: "center",
    marginHorizontal: 2,
    borderRadius: 0,
  },
  EvaImageStyleT: {
    borderRadius: 0,
    marginEnd: 0,
  },
  appIconView: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: 100,
    marginRight: 24,
    flexDirection: "row",
  },
  countStyle: {
    fontSize: normalize(12),
    fontWeight: "500",
    color: "#344054",
    paddingLeft: 8,
  },
  agentItemView2: (tab: string) => ({
    flexShrink: 1,
    width: "100%",
    flexDirection: "row",
    flex: 1,
    borderBottomWidth: 1,
    borderColor: Colors?.grey200,
    paddingVertical: tab === "agents" ? 16 : 8,
    alignItems: "center",
  }),
  agentItemText: {
    fontSize: normalize(14),
    fontWeight: "500",
    color: "#101828",
    flex: 1,
    paddingRight: 12,
  },
  parentTextInputView: (isFocused: boolean) => ({
    borderRadius: 12,
    backgroundColor: isFocused ? "#F2F4F7" : "transparent",
    margin: 16,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginBottom: 0,
  }),
  textInputView: (isFocused: boolean) => ({
    borderWidth: 1,
    borderRadius: 12,
    borderColor: isFocused ? "#D6D6D6" : "#F5F5F5",
    paddingVertical: isAndroid ? 6 : 11,
    paddingHorizontal: 14,
    flexDirection: "row",
    shadowRadius: 12,
    elevation: 2,
    shadowOpacity: isFocused ? 1 : 0,
    shadowColor: "#EFF4FF",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    alignItems: "center",
    backgroundColor: isFocused ? "#FFFFFF" : "#FAFAFA",
  }),
  textInputStyle1: {
    flex: 1,
    fontSize: normalize(14),
    fontWeight: "400",
    color: "#0F0F0F",
    paddingVertical: 0,
  },
  cancelView: { paddingLeft: 12 },
  noDataView: { alignItems: "center", marginTop: 60 },
  noResult: {
    color: "#0F0F0F",
    fontSize: normalize(14),
    fontWeight: "600",
    marginTop: 10,
  },
  noResultDesc: {
    color: "#737373",
    fontSize: normalize(12),
    fontWeight: "400",
    marginTop: 12,
    textAlign: "center",
    marginHorizontal: 70,
  },
  tabName: (isFocused: boolean) => ({
    color: isFocused ? "#0F0F0F" : "#737373",
    fontSize: normalize(14),
    fontWeight: isFocused ? "600" : "500",
  }),
  tabView: (isFocused: boolean) => ({
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: isFocused ? 2 : 0,
    borderBottomColor: "#0F0F0F",
  }),
  tabMainView: {
    flexDirection: "row",
  },
  circleView: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#EAECF0",
    borderRadius: 100,
    justifyContent: "center",
  },
  flexParentView: {
    flexDirection: "row",
    flex: 1,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  cancelText: {
    fontSize: normalize(14),
    fontWeight: "400",
    color: "#344054",
  },
  highlightedText: {
    fontWeight: "500",
    color: "#101828",
  },
  lightText: {
    fontWeight: "400",
    color: "#667085",
  },
  contentStyle: { paddingBottom: 12 },
  listStyle: { paddingTop: 12 },
  commonAgentsView: { marginVertical: 14 },
  agentView: {
    width: 204,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    padding: 12,
    flexDirection: "row",
  },
  agentText: {
    color: "#0F0F0F",
    fontSize: normalize(14),
    fontWeight: "500",
    lineHeight: 20,
    flex: 1,
  },
  descText: {
    color: "#737373",
    fontSize: normalize(12),
    fontWeight: "400",
    lineHeight: 16,
  },
  agentsSubview: { marginLeft: 12, flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    color: '#0F0F0F',
    fontSize: normalize(14),
    fontWeight: '600',
  },
});

interface StateProps {
  session: Session;
  commonAgents: CommonAgent[];
}

const mapStateToProps = (state: any): StateProps => {
  let { suggestions, agents } = state;
  return {
    session: suggestions.session,
    commonAgents: agents?.agentsData?.commonAgents || [],
  };
};

export default AllAgents;
