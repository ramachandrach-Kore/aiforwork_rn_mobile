import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';
import { isAndroid } from '../utils/CommonFunctions';
import {Colors} from '../utils/Colors';

export const EmptyState = ({
  emptyText,
  showButton,
  onButtonClick,
  textStyle,
  buttonText,
  buttonTextStyle,
  iconRender = false,
  iconUrl,
  descText = undefined,
  descTextStyle,
  SvgIcon,
  DirectImage = undefined,
}: any) => {
  const onClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <View style={styles.keyboardContainer}>
      <View style={styles.subView}>
        {DirectImage && <DirectImage />}
        {/* {SvgIcon && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <SvgIcon  />
          </View>
        )} */}
        {iconRender && (
          <View
            style={{
              width: 80,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              backgroundColor: '#FFF',
              borderRadius: 40,
              marginBottom: 20,
            }}>
            <FastImage
              source={{
                uri: iconUrl,
                cache: isAndroid
                  ? FastImage.cacheControl.immutable
                  : FastImage.cacheControl.web,
                priority: FastImage.priority.normal,
              }}
              style={{width: 32, height: 32}}
              resizeMode="contain"
              onError={() => {}}
            />
          </View>
        )}
        <Text style={textStyle}>{emptyText}</Text>

        {descText && <Text style={descTextStyle}>{descText}</Text>}

        {showButton ? (
          <TouchableOpacity onPress={onClick} style={styles.buttonView}>
            <Text style={buttonTextStyle}>{buttonText}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonView: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors?.lightestGrey,
    flexShrink: 1,
    backgroundColor: Colors?.pureWhite,
    marginTop: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  subView: {flex: 1, justifyContent: 'center'},
  keyboardContainer: {flex: 1},
});
