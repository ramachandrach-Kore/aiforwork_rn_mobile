import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ComposeBarProps {
  onSend?: (message: string) => void;
  clearComposeBarText?: () => void;
  placeholder?: string;
  sendButton?: React.ReactNode;    
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  sendButtonStyle?: StyleProp<ViewStyle>;
  sendButtonTextStyle?: StyleProp<TextStyle>;
  sendButtonText?: string;
  sendButtonIcon?: React.ReactNode;
  sendButtonIconStyle?: StyleProp<TextStyle>;
  sendButtonIconPosition?: 'left' | 'right';
  sendButtonDisabled?: boolean;
}
