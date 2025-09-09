import React from 'react';
import {ActivityIndicator} from 'react-native';

export const Loader = props => {
  return (
    <ActivityIndicator
      animating={true}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: props?.height || 80,
      }}
      size={props.size || 'large'}
      color={props?.color || '#517BD2'}
    />
  );
};
