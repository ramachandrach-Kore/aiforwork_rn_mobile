import React, {useState, useMemo, useCallback} from 'react';
import {SvgUri} from 'react-native-svg';     
import {View, Image} from 'react-native';
import { isAndroid, normalize } from '../utils/CommonFunctions';
import { DefaultImage  } from '../icons/SdkIcons';
const EvaImageView = React.memo((props) => {
  const [imageError, setImageError] = useState(false);
  const [svgError, setSvgError] = useState(false);
  const [fallback, setFallback] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleSvgError = useCallback(() => {
    setSvgError(true);
  }, []);

  const {url, width, height, parentStyles, imageStyle} = props;

  // Memoize styles to prevent unnecessary recalculations
  const containerStyle = useMemo(() => [
    {
      borderRadius: 8,
      marginEnd: 14,
      width: normalize(width),
      height: normalize(height),
    },
    parentStyles,
  ], [width, height, parentStyles]);

  const imageStyleMemo = useMemo(() => [
    {
      height: normalize(height),
      width: normalize(width),
      borderRadius: 8,
    },
    imageStyle,
  ], [width, height, imageStyle]);

  const imageSource = useMemo(() => ({
    uri: url,
  }), [url]);

  // Early return if no URL provided
  if (!url) {
    return (
      <View style={containerStyle}>
        <DefaultImage
          width={normalize(width)}
          height={normalize(height)}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {!imageError && !fallback ? (
        <Image
          style={imageStyleMemo}
          source={imageSource}
          onError={handleImageError}
          resizeMode="contain"
        />
      ) : !svgError && !fallback ? (
        <SvgUri
          width={normalize(width)}
          height={normalize(height)}
          uri={url}
          onError={handleSvgError}
        />
      ) : (
        <DefaultImage
          width={normalize(width)}
          height={normalize(height)}
        />
      )}
    </View>
  );
});

EvaImageView.displayName = 'EvaImageView';

export default EvaImageView;
