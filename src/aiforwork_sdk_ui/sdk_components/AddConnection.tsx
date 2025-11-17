import React from "react";
import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import { normalize } from "../utils/CommonFunctions";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import * as Scopes from "../utils/Scopes";
import { Loader } from "./Loader";
//import { addConnection } from "../../actions/posts.action";
import { isIOS } from "../utils/CommonFunctions";
import { Colors } from "../utils/Colors";
import KoraToastMessage from "./KoraToastMessage";
import { useAgentsStore } from "aiforwork-sdk-core";

interface AddConnectionProps {
  loadUrl: string;
  data: any;
  onConnectionDone?: (question: any) => void;
  goBack: () => void;
}

interface AddConnectionState {
  addingApiAgentConnection: boolean;
  connectionAdded: any;
  connectionAddError: string | null;
}

class AddConnection extends React.Component<
  AddConnectionProps,
  AddConnectionState
> {
  toastRef: React.RefObject<any> = React.createRef();
  urlListener: any;
  unsubscribe: (() => void) | null = null;

  // Selective store accessors - only get what we need
  private getAddingConnection = () =>
    useAgentsStore.getState().addingApiAgentConnection;
  private getConnectionAdded = () => useAgentsStore.getState().connectionAdded;
  private getConnectionError = () =>
    useAgentsStore.getState().connectionAddError;

  // Efficient state updater - only updates if values actually changed
  private updateConnectionState = () => {
    const newAdding = this.getAddingConnection();
    const newConnectionAdded = this.getConnectionAdded();
    const newConnectionError = this.getConnectionError();

    // Only call setState if values actually changed
    if (
      this.state.addingApiAgentConnection !== newAdding ||
      this.state.connectionAdded !== newConnectionAdded ||
      this.state.connectionAddError !== newConnectionError
    ) {
      this.setState({
        addingApiAgentConnection: newAdding,
        connectionAdded: newConnectionAdded,
        connectionAddError: newConnectionError,
      });
    }
  };

  constructor(props: AddConnectionProps) {
    super(props);
    this.state = {
      addingApiAgentConnection: this.getAddingConnection(),
      connectionAdded: this.getConnectionAdded(),
      connectionAddError: this.getConnectionError(),
    };
  }

  get isReconnect() {
    return this.props.data?.isReconnect || false;
  }
  get getConnectionId() {
    return this.props.data?.connectionId || undefined;
  }
  get getProvider() {
    return this.props?.data?.provider;
  }
  get getQuestion() {
    return this.props?.data?.question;
  }

  get clientIdLocal() {
    return this.props?.data?.clientIdLocal;
  }

  get labelName() {
    return this.props?.data?.labelName;
  }
  componentDidMount() {
    // Subscribe to store changes using our efficient updater
    // This avoids holding references to unnecessary data
    this.unsubscribe = useAgentsStore.subscribe(() => {
      this.updateConnectionState();
    });

    const { loadUrl } = this.props;
    console.log("loadUrl", loadUrl);
    this.launchInAppBrowser(loadUrl);
  }

  componentWillUnmount() {
    if (this.urlListener && this.urlListener.remove) {
      this.urlListener.remove();
    }
    // Unsubscribe from store changes
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
  showCustomToast = (msg: string) => {
    this.toastRef?.current?.showToast(msg, 2000);
  };

  // Helper methods to access store actions
  getApiAgentsConnectionsByProvider = (provider: string) => {
    const { getApiAgentsConnectionsByProvider } = useAgentsStore.getState();
    return getApiAgentsConnectionsByProvider(provider);
  };

  addApiAgentConnection = (payload: any) => {
    const { addApiAgentConnection } = useAgentsStore.getState();
    return addApiAgentConnection(payload);
  };

  // Helper method to check connection status
  isConnectionReady = () => {
    const { addingApiAgentConnection, connectionAdded } = this.state;
    return !addingApiAgentConnection && connectionAdded !== null;
  };

  componentDidUpdate(prevProps: any, prevState: AddConnectionState) {
    // Handle connection state changes
    const { addingApiAgentConnection, connectionAdded, connectionAddError } =
      this.state;

    if (
      prevState.addingApiAgentConnection !== addingApiAgentConnection ||
      prevState.connectionAdded !== connectionAdded ||
      prevState.connectionAddError !== connectionAddError
    ) {
      // Handle when connection is successfully added
      if (this.isConnectionReady() && !prevState.connectionAdded) {
        this.handleConnectionAdded(connectionAdded);
      }

      // Handle connection error
      if (connectionAddError && !prevState.connectionAddError) {
        this.error(connectionAddError);
      }
    }
  }

  handleConnectionAdded = (connectionResult: any) => {
    // Process connection result when connection is successfully added

    // Handle successful connection
    if (connectionResult) {
      // Call the callback if provided
      if (this.props.onConnectionDone) {
        this.props.onConnectionDone(connectionResult);
      }
      //
      // Show success message
      this.showCustomToast("Connection added successfully!");

      // Navigate back after a delay
      setTimeout(() => {
        this.goToBack();
      }, 1000);
    }
  };

  launchInAppBrowser = async (url: any) => {
    try {
      // Check if InAppBrowser is available and properly linked
      if (!InAppBrowser) {
        this.error(
          "InAppBrowser module not found. Please reinstall and link the library.",
          true
        );
        return;
      }

      // Check if isAvailable method exists
      if (typeof InAppBrowser.isAvailable !== "function") {
        this.error("InAppBrowser not properly configured.", true);
        return;
      }

      const isAvailable = await InAppBrowser.isAvailable();

      if (isAvailable) {
        const result = await InAppBrowser.openAuth(
          url,
          Scopes.REDIRECT_URL,
          {}
        );

        if (result.type === "success" && result.url) {
          this._onLoad(result);
        } else if (result.type === "cancel") {
          this.error("Authentication cancelled by user");
        } else {
          this.error("Connection failed");
        }
      } else {
        this.error("InAppBrowser not supported on this device", true);
      }
    } catch (error) {
      this.error("Connection failed", true);
    }
  };

  error = (message: any, shouldClose: boolean = false) => {
    this.showCustomToast(message);

    setTimeout(() => {
      this.goToBack();
    }, 1000);
  };

  goToBack = () => {
    this.props.goBack();
    InAppBrowser.close();
  };

  onAgentAuthSuccess = async (data: any) => {
    try {
      await this.addApiAgentConnection(data);
    } catch (error) {
      this.error(error);
    }
  };

  _onLoad = (e: any) => {
    if (e && e.url && e.url.startsWith(Scopes.REDIRECT_URL)) {
      let idTokenAndEmail = e.url.substring(
        e.url.indexOf(Scopes.REDIRECT_URL) + Scopes.REDIRECT_URL.length + 1
      );
      let token = idTokenAndEmail.split("&")[0];

      let payload: any = {
        //Authentication successful with URL: workassist://iphoneapp#error=unauthorized
        id_token: token.split("=")[1],
        allowedCapabilities: ["searches", "actions"],
      };
      if (payload.id_token.includes("unauthorized")) {
        this.error("Authentication failed");
        return false;
      }

      if (!this.isReconnect) {
        payload.label = this.labelName || this.getProvider;
      }
      let data = {
        payload: payload,
        clientIdLocal: this.clientIdLocal,
        isReconnect: this.isReconnect,
        connectionId: this.getConnectionId, ////only for reconnect
        provider: this.getProvider, //only for reconnect
      };
      this.onAgentAuthSuccess?.(data);

      return false;
    }

    return true;
  };

  render() {
    const { addingApiAgentConnection, connectionAdded } = this.state;

    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.loaderContainer}>
          <Loader height={40} size={40} width={40} />
          {addingApiAgentConnection && (
            <Text style={styles.loadingText}>Adding connection...</Text>
          )}
          {connectionAdded && (
            <Text style={styles.loadingText}>
              Connection added successfully!
            </Text>
          )}
        </View>
        <KoraToastMessage
          ref={this.toastRef}
          backgroundColor="#FFFFFF"
          position="top"
          textColor="#101828"
          borderColor="#D0D5DD"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  overflowContainer: {
    paddingBottom: 3,
    overflow: "hidden",
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  safeAreaContainer: { flex: 1 },

  chevronLeftParent: {
    borderRadius: 100,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",

    color: "#fff",
    textAlign: "center",
  },
  loadingText: {
    fontSize: normalize(14),

    fontWeight: "500",

    color: Colors.darkBlack,
    textAlign: "center",
    marginTop: 10,
  },
  badgeBase: {
    borderRadius: 16,
    backgroundColor: "#667085",
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: -2,
    flexDirection: "row",
  },
  chevronFlexBox: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  titleView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#101828",
    shadowOffset: {
      width: 0,
      height: isIOS ? 1 : 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    backgroundColor: "#ffffff",
    minHeight: 48,
  },
});

export default AddConnection;
