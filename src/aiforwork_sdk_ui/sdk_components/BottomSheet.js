import React from 'react';
import {StyleSheet, Text, View, AccessibilityInfo, Modal, TouchableOpacity, Dimensions} from 'react-native';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';
import {normalize} from '../utils/CommonFunctions';
class BottomSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      reduceMotionEnabled: false,
      isVisible: false,
    };
  }

  componentDidMount() {
    this.checkReduceMotion();
    this.reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      this.handleReduceMotionChange,
    );
  }
  checkReduceMotion = async () => {
    const isReduceMotionEnabled =
      await AccessibilityInfo.isReduceMotionEnabled();
    this.setState({reduceMotionEnabled: isReduceMotionEnabled});
  };
  handleReduceMotionChange = enabled => {
    this.setState({reduceMotionEnabled: enabled});
  };

  componentWillUnmount() {
    this.reduceMotionListener.remove();
  }

  open() {
    this.setState({ isVisible: true });
    this.props.onOpen && this.props.onOpen();
  }

  snapToIndex(index) {
    // For Modal, we don't have snap functionality, but we can still trigger callbacks
    this.props.snapToIndex && this.props.snapToIndex(index);
  }

  close() {
    this.setState({ isVisible: false });
    this.props.onClose && this.props.onClose();
  }

  renderBackdrop = () => {
    return (
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={() => {
          if (this.props?.pressBehavior === 'close' || !this.props?.pressBehavior) {
            this.close();
          }
        }}>
        {this.props.renderBackdrop ? (
          this.props.renderBackdrop()
        ) : null}
      </TouchableOpacity>
    );
  };

  render() {
    const {isLoading = false, isVisible} = this.state;
    
    if (isLoading) {
      return (
        <View style={styles.loading}>
          <Text>{'Loading Properties...'}</Text>
        </View>
      );
    }
    
    return (
      <SafeAreaInsetsContext.Consumer>
        {insets => (
          <Modal
            visible={isVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => this.close()}
            {...this.props.extraProps}>
            {this.renderBackdrop()}
            <View style={[styles.modalContainer, { paddingBottom: insets?.bottom || 0 }]}>
              <View style={[styles.bottomSheet, this.props.containerStyle]}>
                {/* Handle indicator */}
                <View style={[styles.handleIndicator, this.props.handleIndicatorStyle]} />
                {this.props.children}
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaInsetsContext.Consumer>
    );
  }
}

export default BottomSheet;

BottomSheet.defaultProps = {
  snapPoints: ['1%', '92%'],
  containerStyle: {},
  handleIndicatorStyle: {},
  renderComponent: () => {},
  renderBackdrop: () => {},
  bottomInset: 0,
  detached: false,
  keyboardBehavior: 'interactive',
  keyboardBlurBehavior: 'restore',
  onOpen: () => {},
  onClose: () => {},
  extraProps: {},
  snapToIndex: () => {},
  pressBehavior: 'close',
  fromParentModule: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '92%',
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});
