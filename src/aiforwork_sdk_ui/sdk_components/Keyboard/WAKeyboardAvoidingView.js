import React from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';

const BEHAVIOR = Platform.OS === 'ios' ? 'padding' : undefined;

const WAKeyboardAvoidingView = ({style, ...props}) => {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]}
      behavior={BEHAVIOR}
      keyboardVerticalOffset={headerHeight + StatusBar.currentHeight}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WAKeyboardAvoidingView;
