import React, {useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {LightBulb, RightArrow} from '../icons';
import {normalize} from '../utils/CommonFunctions';
import EvaImageView from './EvaImageView';
import {isAndroid} from '../utils/CommonFunctions';
import Svg, {Path} from 'react-native-svg';

// Type for EvaImageView props
interface EvaImageViewProps {
  url?: string;
  width: number;
  height: number;
  parentStyles?: object;
  imageStyle?: object;
}

interface RequestFlowItem {
  icon?: string;
  content?: string;
}

interface RequestFlowProps {
  reqFlow?: RequestFlowItem[];
  fromMainModal?: boolean;
  onPress?: (obj: { reqFlow: RequestFlowItem[]; onReqlowPressTime: number }) => void;
}

const RequestFlow: React.FC<RequestFlowProps> = props => {
  let reqFlow = props?.reqFlow || [];

  
  const onPressExpand = useCallback(() => {
    if (props.onPress) {
      let obj = {
        reqFlow: reqFlow,
        onReqlowPressTime: new Date().getTime(),
      };
      props.onPress(obj);
    }
  }, [reqFlow, props.onPress]);

  return (
    <>
      {props.fromMainModal === true ? (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerIconBackground}>
              <LightBulb color="#131316" width={20} height={20} />
            </View>
            <Text style={styles.modalHeaderText}>Response Flow</Text>
          </View>

          <View style={{paddingHorizontal: 8}}>
            {reqFlow?.map((item, index) => {
              return (
                <View key={index} style={styles.flowItemContainer}>
                  <View style={styles.iconContainer}>
                    <EvaImageView
                      {...({
                        url: item?.icon,
                        width: 20,
                        height: 20,
                        parentStyles: {
                          marginEnd: 0,
                        },
                      } as EvaImageViewProps)}
                    />
                  </View>
                  <Text style={styles.flowItemText}>
                    {item?.content || ''}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : (
        reqFlow?.length > 0 && (
          <TouchableOpacity style={styles.expandableFlowContainer} onPress={onPressExpand}>
            <Text style={styles.expandableFlowText}>
              {reqFlow?.[reqFlow?.length - 1]?.content}
            </Text>
            <View style={styles.arrowContainer}>
              <RightArrow width={10} height={10} color="#70707B" />
            </View>
          </TouchableOpacity>
        )
      )}
    </>
  );
};

const styles = StyleSheet.create({
  flowItemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  expandableFlowContainer: {
    marginTop: 10,
    flexDirection: 'row',
    marginEnd: 10,
    marginBottom: 10,
  },
  arrowContainer: {marginTop: isAndroid ? 6 : 4, marginEnd: 24},
  expandableFlowText: {
    color: '#3F3F46',
    fontSize: normalize(14),
    fontWeight: '400',
    marginEnd: 10,
    flexShrink: 1,
  },
  modalContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E4E4E7',
    borderBottomWidth: 1,
    paddingBottom: 20,
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  headerIconBackground: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    padding: 6,
    marginEnd: 16,
    marginStart: 4,
  },
  flowItemText: {
    fontSize: normalize(16),
    fontWeight: '400',
    color: '#1A1A1E',
    flexShrink: 1,
    lineHeight: normalize(24),
    marginStart: 16,
  },
  modalHeaderText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: '#1A1A1E',
  },
});

export default RequestFlow;
