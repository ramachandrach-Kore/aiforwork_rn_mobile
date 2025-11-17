import * as React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  Dimensions,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

import { normalize } from "../utils/CommonFunctions";

import * as Scopes from "../utils/Scopes";

import API_URL from "../env.constants";
//import * as UsersDao from "../../../lib/dao/UsersDao";
import { PlusIcon } from "../icons/sources";
import EvaImageView from "../sdk_components/EvaImageView";
import { useAgentsStore } from "aiforwork-sdk-core";
import { useCallback, useEffect, useState } from "react";
import AddConnection from "../sdk_components/AddConnection";
import { useMessagesStore } from "aiforwork-sdk-core";
const ConnectionProvider = (props: any) => {
  const {
    apiAgentsConnectionsData,
    apiAgentsConnectionsLoading,
    getApiAgentsConnectionsByProvider,
    addApiAgentConnection,
    cleanApiAgentConnection
  } = useAgentsStore();
  const { sendMessage } = useMessagesStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [connectionData, setConnectionData] = useState<any>(null);
  const authenticationText = (type: any) => {
    return (
      "Please complete the " +
      type +
      " authentication so we can proceed with your request."
    );
  };
  const onConnectionDone = (question: any, localPostObject?: any) => {
    let payload = {
      question: props?.data?.question || "",

      messageId: props?.data?.messageId,

      boardId: props?.data?.boardId,
    };
    sendMessage(payload);
    //Give callback to the parent if required 

   };

  useEffect(()=>{

    return ()=>{
      cleanApiAgentConnection(null);
    }
  },[])


  useEffect(() => {
    if (
      props.isLastItem &&
      apiAgentsConnectionsData !== null &&
      apiAgentsConnectionsData !== undefined
    ) {
      let url =
        API_URL?.appServer +
        "api/serviceProvider/" +
        props?.data?.provider +
        "/login?redirect_url=" +
        Scopes.REDIRECT_URL;
      let data = {
        provider: props?.data?.provider,
        question: props?.data?.question,
        clientIdLocal:
          props?.data?.clientId || props?.data?.messageId || props?.data?.id,
        connectionId: props?.data?.connectionId || props?.data?.connId,
        isReconnect: props?.data?.templateInfo?.action === "renew",
        labelName: "Connection 1",
        localPostObject: props?.data?.localPostObject,
      };

     
      let authType = apiAgentsConnectionsData?.authProfiles?.[0]?.type || "";
      if (authType === "basic") {
        let inputFields =
          apiAgentsConnectionsData?.authProfiles?.[0]?.inputFields;
        // For basic auth, we would need a different component
        // For now, using the same modal approach
        // setConnectionData({
        //   loadUrl: url,
        //   data: data,
        //   inputFields: inputFields,
        //   onConnectionDone: onConnectionDone,
        // });
        // setModalVisible(true);
        
        // This one need to handle refer aiforworkapp
      } else if (authType === "oauth2") {
        setConnectionData({
          loadUrl: url,
          data: data,
          onConnectionDone: (question: any) => {
            onConnectionDone(question, data?.localPostObject);
          },
        });
        setModalVisible(true);
      }
    }
  }, [apiAgentsConnectionsData]);

 

  const connectionPress = useCallback(() => {
    getApiAgentsConnectionsByProvider(props?.data?.provider);
  }, [props?.data?.provider, props.isLastItem]);

  const handleCloseModal = useCallback(() => {
    //Here it handing addconnection/reconnection failed or success
    setModalVisible(false);
    setConnectionData(null);
  }, []);

 
  const headerLabel = () => {
    return (
      <View style={styles.providerHeaderContainer}>
        <EvaImageView
          {...({
            url: props?.data?.templateInfo?.icon,
            width: normalize(32),
            height: normalize(32),
          } as any)}
        />
        <Text style={styles.labelText}>{props?.data?.templateInfo?.label}</Text>
      </View>
    );
  };

  const renewHeaderder = () => {
    return (
      <View style={styles.authExpiredContainer}>
        <View style={styles.authExpiredHeader}>
          <EvaImageView
            {...({
              url: props?.data?.templateInfo?.icon,
              width: normalize(32),
              height: normalize(32),
            } as any)}
          />
          <Text style={styles.labelText}>
            {props?.data?.templateInfo?.label}
          </Text>
        </View>

        <View style={styles.lineView} />
        <Text style={styles.expiredText}>Authentication failed</Text>
      </View>
    );
  };

  const connectionButton = () => {
    let disabled = props.isLastItem === false;
    return (
      <TouchableOpacity
        style={styles.addConnectionButtonContainer}
        onPress={connectionPress}
        disabled={disabled}
      >
        <PlusIcon
          width={normalize(16)}
          height={normalize(16)}
          color={disabled ? "#66708533" : "#155EEF"}
        />

        <Text
          style={[
            styles.addButtonText,
            { color: disabled ? "#66708533" : "#155EEF" },
          ]}
        >
          {"Add connection"}
        </Text>
      </TouchableOpacity>
    );
  };
  let connId = props?.data?.connectionId || props?.data?.connId;
  let disabled = props.isLastItem === false && connId === undefined;
 
  return (
    <>
      {props?.data?.templateInfo?.action === "renew" ? (
        <View style={styles.authRenewalContainer}>
          {renewHeaderder()}
          {/* <Text style={styles.expiredLabel}>
            Authentication expired for the connection {UsersDao.getEmailId()}.
          </Text> */}
          <Text style={styles.expiredLabel}>
            Authentication expired for the connection.
          </Text>
          <View style={styles.retryView}>
            <TouchableOpacity onPress={connectionPress} disabled={disabled}>
              <Text
                style={[
                  styles.retryText,
                  { color: disabled ? "#66708533" : "#D92D20" },
                ]}
              >
                Reconnect
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.connectionSetupContainer}>
          {headerLabel()}
          <Text style={styles.authText}>
            {authenticationText(props?.data?.provider)}
          </Text>
          {connectionButton()}
        </View>
      )}

      {/* Modal for AddConnection */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
        statusBarTranslucent
      >
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modalContainer}>
            {connectionData && (
              <AddConnection {...connectionData} goBack={handleCloseModal} />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  connectionSetupContainer: {
    borderWidth: 1,
    borderColor: "#EAECF0",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
  },
  retryText: {
    fontSize: normalize(14),
    fontWeight: "500",

    color: "#D92D20",
  },
  retryView: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 10,
  },
  authRenewalContainer: {
    borderColor: "#FECDCA",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#FFFBFA",
  },
  authText: { fontWeight: "400", fontSize: normalize(14), color: "#667085" },
  addButtonText: {
    color: "#155EEF",
    fontWeight: "500",
    fontSize: normalize(14),
    paddingLeft: 4,
  },
  addConnectionButtonContainer: {
    flexDirection: "row",
    paddingTop: 8,
    alignItems: "center",
  },
  lineView: {
    height: 1,
    backgroundColor: "#EAECF0",
    marginTop: 2,
    marginBottom: 8,
  },
  providerIcon: { width: normalize(32), height: normalize(32), marginRight: 8 },
  labelText: {
    fontWeight: "600",
    fontSize: normalize(15),
    color: "#101828",
    paddingLeft: 4,
  },

  expiredText: {
    fontWeight: "500",
    fontSize: normalize(14),
    color: "#B42318",
  },
  expiredLabel: {
    fontWeight: "400",
    fontSize: normalize(14),
    color: "#475467",
  },
  providerHeaderContainer: {
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 14,
    alignItems: "center",
  },
  authExpiredContainer: {
    alignContent: "center",
    marginBottom: 6,
  },
  authExpiredHeader: {
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 6,
    alignItems: "center",
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flexShrink: 1,
  },
  modalContainer: {
    width: "96%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,

    minHeight: 200,
    marginVertical: screenHeight / 2.5,
    alignSelf: "center",
  },
});

export default ConnectionProvider;
