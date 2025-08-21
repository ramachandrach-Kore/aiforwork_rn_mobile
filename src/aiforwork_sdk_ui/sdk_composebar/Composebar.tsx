import React, { useState, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { ComposeBarProps } from './types/ComposeBarProps';

export interface ComposebarRef {
  clearComposeBarText: () => void;
  focus: () => void;
  blur: () => void;
}

const Composebar = forwardRef<ComposebarRef, ComposeBarProps>(({
  onSend,
  clearComposeBarText,
  placeholder = 'Type a message...',
  sendButton,
  containerStyle,
  inputStyle,
  sendButtonStyle,
  sendButtonTextStyle,
  sendButtonText = 'Send',
  sendButtonIcon,
  sendButtonIconStyle,
  sendButtonIconPosition = 'right',
  sendButtonDisabled = false,
}, ref) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    clearComposeBarText: () => {
      setMessage('');
      if (clearComposeBarText) {
        clearComposeBarText();
      }
    },
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
  }));

  // Optimized onSendBtnPress function using useCallback
  const onSendBtnPress = useCallback(() => {
    if (message.trim() && !sendButtonDisabled) {
      if (onSend) {
        onSend(message.trim());
      }
      setMessage('');
      inputRef.current?.blur();
    }
  }, [message, sendButtonDisabled, onSend]);



  const handleKeyPress = useCallback((e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      onSendBtnPress();
    }
  }, [onSendBtnPress]);

  const renderSendButton = useCallback(() => {
    if (sendButton) {
      return sendButton;
    }

    return (
      <TouchableOpacity
        style={[
          styles.sendButton,
          sendButtonDisabled && styles.sendButtonDisabled,
          sendButtonStyle,
        ]}
        onPress={onSendBtnPress}
        disabled={sendButtonDisabled || !message.trim()}
        activeOpacity={0.7}
      >
        {sendButtonIcon && sendButtonIconPosition === 'left' && (
          <View style={[styles.iconContainer, sendButtonIconStyle]}>
            {sendButtonIcon}
          </View>
        )}
        
        <Text
          style={[
            styles.sendButtonText,
            sendButtonDisabled && styles.sendButtonTextDisabled,
            sendButtonTextStyle,
          ]}
        >
          {sendButtonText}
        </Text>
        
        {sendButtonIcon && sendButtonIconPosition === 'right' && (
          <View style={[styles.iconContainer, sendButtonIconStyle]}>
            {sendButtonIcon}
          </View>
        )}
      </TouchableOpacity>
    );
  }, [sendButton, sendButtonDisabled, sendButtonStyle, onSendBtnPress, message, sendButtonIcon, sendButtonIconPosition, sendButtonIconStyle, sendButtonText, sendButtonTextStyle]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <View style={[styles.container, containerStyle]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, inputStyle]}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
         
          onKeyPress={handleKeyPress}
          blurOnSubmit={false}
          returnKeyType="send"
          onSubmitEditing={onSendBtnPress}
        />
        {renderSendButton()}
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
   
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#e9ecef',
    color: '#333',
   
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#999',
  },
  iconContainer: {
    marginHorizontal: 4,
  },
});

export default Composebar;
