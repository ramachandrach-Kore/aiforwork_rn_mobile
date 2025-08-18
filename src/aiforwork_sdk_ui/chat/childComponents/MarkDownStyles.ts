import { StyleSheet, Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

// Helper function for font normalization (since we don't have the normalize package)
const normalize = (size: number) => size;

export const markdownStyles = StyleSheet.create({
  citationContainer:{ 
    
      marginBottom: 6,
      marginTop: isAndroid ? -3 : 0,         
      width:'100%'
    
  },
  h1Style:{
    fontSize: normalize(24),
    lineHeight: normalize(32),
    fontWeight: isIOS ? '600' : 'bold',
    paddingBottom: 4,
  },
  h2Style:{
    fontSize: normalize(20),
    lineHeight: normalize(28),
    fontWeight: isIOS ? '600' : 'bold',
    paddingBottom: 4,
  },
  h3Style:{
    fontSize: normalize(16),
    lineHeight: normalize(24),
    fontWeight: isIOS ? '600' : 'bold',
    paddingBottom: 4,
    marginTop: isAndroid ? 10 : 2,
  },
  h4Style:{
    fontSize: normalize(14),
    lineHeight: normalize(22),
    fontWeight: isIOS ? '600' : 'bold',
    paddingBottom: 4,
  },
  h5Style:{
    fontSize: normalize(13),
    lineHeight: normalize(21),
    fontWeight: isIOS ? '600' : 'bold',
  },
  h6Style:{
    fontSize: normalize(11),
    lineHeight: normalize(19),
    fontWeight: isIOS ? '600' : 'bold',
  },
  bulletStyle:{
    marginTop: 5,
  },
  orderStyle:{
    marginTop: 5,
  },
  listItemStyle:{
    marginTop: 5,
  },
  bodyStyle: {
    color: '#101828',
    fontSize: normalize(16),
    lineHeight: normalize(24),
  },
  textTypo: {
    textAlign: 'left',
    fontSize: normalize(14),
    lineHeight: normalize(22),
  },
  markdown_img_container: {
    width: normalize(160),
    height: normalize(160),
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#344054',
  },
  markdown_img: {
    width: normalize(150),
    height: normalize(150),
  },
  badge: {
    flexDirection: 'row',
    paddingHorizontal: 2,
    marginBottom: -2,
  },
  text1: {
    fontSize: normalize(12),
    fontWeight: '500',

    color: '#344054',
    textAlign: 'center',
  },
  badgeBase: {
    borderRadius: normalize(16),
    backgroundColor: '#eaecf0',
    paddingHorizontal: 5,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
}); 