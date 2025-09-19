import React, {Component} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';
import {normalize} from '../utils/CommonFunctions';


interface KoraToastMessageProps {
  backgroundColor?: string;
  position?: 'top' | 'bottom';
  textColor?: string;
  orientation?: string;
  borderColor?: string;
}

interface KoraToastMessageState {
  renderToast: boolean;
}

class KoraToastMessage extends Component<KoraToastMessageProps, KoraToastMessageState> {
  private animateTranslate: Animated.Value;
  private animateOpacity: Animated.Value;
  private isShownToast: boolean;
  private message: string;
  private timerID?: NodeJS.Timeout;

  static defaultProps: KoraToastMessageProps = {
    backgroundColor: '#666666',
    textColor: 'white',
    orientation: 'xAxis',
  };

  constructor(props: KoraToastMessageProps) {
    super(props);

    this.animateTranslate = new Animated.Value(-10);

    this.animateOpacity = new Animated.Value(0);

    this.state = {renderToast: false};

    this.isShownToast = false;

    this.message = '';
  }

  componentWillUnmount(): void {
    this.timerID && clearTimeout(this.timerID);
  }

  showToast(message: string = 'Custom Toast...', duration: number = 3000): void {
    if (this.isShownToast === false) {
      this.message = message;

      this.isShownToast = true;

      this.setState({renderToast: true}, () => {
        Animated.parallel([
          Animated.timing(this.animateTranslate, {
            toValue: 0,
            duration: 350,
            useNativeDriver: false,
          }),

          Animated.timing(this.animateOpacity, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
          }),
        ]).start(() => this.hideToast(duration));
      });
    }
  }

  hideToast = (duration: number) => {
    this.timerID = setTimeout(() => {
      Animated.parallel([
        Animated.timing(this.animateTranslate, {
          toValue: 10,
          duration: 350,
          useNativeDriver: false,
        }),

        Animated.timing(this.animateOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: false,
        }),
      ]).start(() => {
        this.setState({renderToast: false});
        this.animateTranslate.setValue(-10);
        this.isShownToast = false;
        this.timerID && clearTimeout(this.timerID);
      });
    }, duration);
  };

  render() {
    let {position, backgroundColor, textColor, orientation, borderColor} =
      this.props;

    if (this.state.renderToast) {
      return (
        <Animated.View
          style={[
            styles.animatedToastViewContainer,
            {
              top: position === 'top' ? '8%' : '80%',
              transform: [
                orientation === 'yAxis'
                  ? {
                      translateY: this.animateTranslate,
                    }
                  : {
                      translateX: this.animateTranslate,
                    },
              ],
              opacity: this.animateOpacity,
            },
          ]}
          pointerEvents="none">
          <View style={styles.animatedToastView}>
            <View style={[styles.toastView, {backgroundColor, borderColor}]}>
              {/* <View style={styles.iconView}>
                <SvgIcon name="AlertIcon" width={20} height={20} />
              </View> */}
              <Text style={[styles.feedbackPopUp, {color: textColor}]}>
                {this.message}
              </Text>
            </View>
          </View>
        </Animated.View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  animatedToastViewContainer: {
    width: '100%',
    zIndex: 9999,
    position: 'absolute',
  },
  toastView: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    paddingHorizontal: 12,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  iconView: {
    marginEnd: 10,
  },
  feedbackPopUp: {
    color: '#101828',
    fontSize: normalize(14),
    fontWeight: '500',
   
  },
  animatedToastView: {
    marginHorizontal: 20,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  toastText: {
    fontSize: 15,
    alignSelf: 'stretch',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

export default KoraToastMessage;
