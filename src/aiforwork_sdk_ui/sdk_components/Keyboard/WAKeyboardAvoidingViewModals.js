import React, {useState} from 'react';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import CommonKeyboardAvoidingView from './WAKeyboardAvoidingView';

const {height: DEVICE_HEIGHT} = Dimensions.get('screen');

const IOSKeyboardAvoidingView = props => {
  const insets = useSafeAreaInsets();
  const [screenHeight, setScreenHeight] = useState(0);

  const modalOffsetFromTop = DEVICE_HEIGHT - screenHeight;

  return (
    <View
      style={styles.container}
      onLayout={event => {
        setScreenHeight(event.nativeEvent.layout.height);
      }}>
      {screenHeight ? (
        <CommonKeyboardAvoidingView
          {...props}
          keyboardVerticalOffset={modalOffsetFromTop - insets.bottom}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const WAKeyboardAvoidingView =
  Platform.OS === 'ios' ? IOSKeyboardAvoidingView : CommonKeyboardAvoidingView;

export default WAKeyboardAvoidingView;
