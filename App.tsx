import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { initializeSDK, WebsocketService as socketService, useThreadsStore } from 'aiforwork-sdk-core'; 
import BotChat from './src/aiforwork_sdk_ui/sdk_main/BotChat';


// Simple component for fetching threads
const FetchThreadsButton: React.FC = () => {
  const { boards, fetchThreads } = useThreadsStore();

  const handleFetchThreads = () => {
    console.log('-----> Fetch Threads clicked <------');
    fetchThreads();
  };

  // Log boards whenever they change
  useEffect(() => {
    if (boards.length > 0) {
      console.log('Boards fetched:', boards);
      console.log('Total boards count:', boards.length);
    }
  }, [boards]);

  return (
    <TouchableOpacity
      onPress={handleFetchThreads}
      style={[styles.button, styles.fetchButton]}>
      <Text style={styles.buttonText}>
        Fetch Threads
      </Text>
    </TouchableOpacity>
  );
};

// Simple component for renaming threads
const RenameThreadButton: React.FC = () => {
  const { boards, renameThread } = useThreadsStore();

  const handleRenameThread = () => {
    console.log('-----> Rename Thread clicked <------');
    
    if (boards.length > 0) {
      const firstBoard = boards[0];
      const newName = `Changing Thread Name`;
      renameThread(firstBoard.id, {name : newName});
    } else {
      console.log('No boards available to rename. Fetch threads first.');
    }
  };

  return (
    <TouchableOpacity
      onPress={handleRenameThread}
      style={[styles.button, styles.renameButton]}
      disabled={boards.length === 0}>
      <Text style={styles.buttonText}>
        Rename Thread
      </Text>
    </TouchableOpacity>
  );
};

interface AppProps {
  navigation?: any; // Add navigation property
}

interface AppState {
  connectionStatus: string;
  connectionColor: string;
  text: string;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      connectionStatus: 'Disconnected',
      connectionColor: '#dc3545', // Red
      text: '',
    };
  }

  componentDidMount() {
    // Initialize SDK with your configuration
    initializeSDK({
      accessToken: 'sxUMd-up4tqhe4eMYse1DUG_feCOuVwSpfFxLTpZ4Qs_T90QMdynvdGd679AqL9d',
      apiUrl: 'https://work-qa.kore.ai/',
      presenceUrl: 'https://work-qa.kore.ai/',
      userId: 'u-62c57d2f-0457-5594-94d4-dc711b816dd1'
    });

    this.setupSocketListeners();
    this.onConnect();
  }

  componentWillUnmount() {
    // Clean up event listeners
    socketService.removeAllListeners('connectionStateChange');
    socketService.removeAllListeners('connectionError');
    socketService.removeAllListeners('connect');
    socketService.removeAllListeners('disconnect');
    socketService.removeAllListeners('reconnect');
    
    // Disconnect if connected
    socketService.disconnect();
  }

  private updateConnectionStatus = (status: string, color: string) => {
    this.setState({
      connectionStatus: status,
      connectionColor: color,
    });
  };

  private setupSocketListeners = () => {
    // Listen for connection state changes
    socketService.on('connectionStateChange', (data: any) => {
      console.log('Connection state changed:', data);
      switch (data.newState) {
        case 'connecting':
          this.updateConnectionStatus('Connecting...', '#ffc107'); // Yellow
          break;
        case 'connected':
          this.updateConnectionStatus('Connected', '#28a745'); // Green
          break;
        case 'reconnecting':
          this.updateConnectionStatus('Reconnecting...', '#fd7e14'); // Orange
          break;
        case 'disconnected':
          this.updateConnectionStatus('Disconnected', '#dc3545'); // Red
          break;
        default:
          this.updateConnectionStatus('Unknown', '#6c757d'); // Gray
      }
    });

    // Listen for connection errors
    socketService.on('connectionError', (error: any) => {
      console.log('Connection error:', error);
      this.updateConnectionStatus('Connection Error', '#dc3545'); // Red
    });

    // Listen for reconnection attempts
    socketService.on('reconnectionAttempt', (data: any) => {
      console.log('Reconnection attempt:', data);
      this.updateConnectionStatus(`Reconnecting... (${data.attempt})`, '#fd7e14'); // Orange
    });

    // Listen for high latency warnings
    socketService.on('highLatency', (metrics: any) => {
      console.log('High latency detected:', metrics);
    });

    // Listen for ping pong events
    socketService.on('pingPong', (data: any) => {
      console.log('Ping pong:', data);
    });
  };

  private onConnect = () => {
    console.log('-----> Connect clicked <------');
    this.updateConnectionStatus('Connecting...', '#ffc107'); // Yellow
    
    try {
      socketService.connectToWebSocket();
    } catch (error) {
      console.log('Error connecting:', error);
      this.updateConnectionStatus('Connection Error', '#dc3545'); // Red
    }
  };

  private onDisconnect = () => {
    console.log('-----> Disconnect clicked <------');
    this.updateConnectionStatus('Disconnecting...', '#ffc107'); // Yellow
    
    socketService.disconnect();
    
    setTimeout(() => {
      this.updateConnectionStatus('Disconnected', '#dc3545'); // Red
    }, 500);
  };
 renderButtons=()=>{
  return(
    <View style={styles.contentContainer}>
    <Text style={styles.titleText}>
      {'Kore.ai Inc, Socket Service Module'}
    </Text>

    {/* Text Input */}
    <TextInput
      style={styles.textInputStyle1}
      autoFocus={true}
      onChangeText={newText => this.setState({ text: newText })}
      value={this.state.text}
      placeholderTextColor="#98A2B3"
      placeholder={'Enter your message'}
    />
    
    {/* Connection Status Display */}
    <View
      style={[
        styles.statusContainer,
        { backgroundColor: this.state.connectionColor }
      ]}>
      <Text style={styles.statusText}>
        Status: {this.state.connectionStatus}
      </Text>
    </View>

    {/* Control Buttons */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={this.onConnect}
        style={[styles.button, styles.connectButton]}>
        <Text style={styles.buttonText}>
          {'Connect'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={this.onDisconnect}
        style={[styles.button, styles.disconnectButton]}>
        <Text style={styles.buttonText}>
          {'Disconnect'}
        </Text>
      </TouchableOpacity>
    </View>

    {/* Fetch Threads Button */}
    <FetchThreadsButton />

    {/* Rename Thread Button */}
    <RenameThreadButton />
  </View>
  )
}
  render() {
    return (
      <SafeAreaView style={styles.container}>
      
        <StatusBar barStyle="default" />
        <BotChat navigation={this.props.navigation}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
   
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInputStyle1: {
    paddingLeft: 8,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#98A2B3',
    borderRadius: 5,
    minWidth: 250,
    marginBottom: 20,
  },
  statusContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  button: {
    padding: 10,
    marginTop: 30,
    minHeight: 40,
    minWidth: 100,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectButton: {
    backgroundColor: '#007bff',
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  fetchButton: {
    backgroundColor: '#28a745',
  },
  renameButton: {
    backgroundColor: '#007bff',
  },
});

export default App;