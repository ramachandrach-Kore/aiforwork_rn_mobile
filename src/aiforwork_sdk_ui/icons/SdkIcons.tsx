import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect, LinearGradient, Stop } from 'react-native-svg';
import { normalize } from '../utils/CommonFunctions';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

const DEFAULT_WIDTH = 14;
const DEFAULT_HEIGHT = 14;

export const RightArrow: React.FC<IconProps> = ({ 
  width = normalize(DEFAULT_WIDTH), 
  height = normalize(DEFAULT_HEIGHT), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 7 12" fill="none">
      <Path 
        d="M1 11L6 6L1 1" 
        stroke={color} 
        strokeWidth="1.66667" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const LightBulb: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(21), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 21" fill="none">
      <G clipPath="url(#clip0_2116_49564)">
        <Path 
          d="M8.33317 15.6299V17.5811C8.33317 18.5015 9.07936 19.2477 9.99984 19.2477C10.9203 19.2477 11.6665 18.5015 11.6665 17.5811V15.6299M9.99984 2.58105V3.41439M2.49984 10.9144H1.6665M4.58317 5.49772L4.08309 4.99764M15.4165 5.49772L15.9167 4.99764M18.3332 10.9144H17.4998M14.9998 10.9144C14.9998 13.6758 12.7613 15.9144 9.99984 15.9144C7.23841 15.9144 4.99984 13.6758 4.99984 10.9144C4.99984 8.15296 7.23841 5.91439 9.99984 5.91439C12.7613 5.91439 14.9998 8.15296 14.9998 10.9144Z" 
          stroke={color} 
          strokeWidth="1.67" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_2116_49564">
          <Rect width="20" height="20" fill="white" transform="translate(0 0.914062)"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
}; 

export const DefaultImage: React.FC<IconProps> = ({ 
  width = normalize(28), 
  height = normalize(28), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <Rect width="28" height="28" rx="4" fill="url(#paint0_linear_1663_5908)"/>
      <Path 
        d="M18.0002 7.33333C16.5274 7.33333 15.3335 8.52724 15.3335 9.99999C15.3335 11.4728 16.5274 12.6667 18.0002 12.6667C19.4729 12.6667 20.6668 11.4728 20.6668 9.99999C20.6668 8.52724 19.4729 7.33333 18.0002 7.33333Z" 
        fill="#98A2B3"
      />
      <Path 
        d="M17.8443 13.9702C17.5173 13.8346 17.1498 13.8346 16.8228 13.9702C16.5754 14.0728 16.4062 14.2511 16.2843 14.4023C16.1771 14.5352 16.0624 14.705 15.9394 14.8892L14.0771 12.1991C13.9426 12.0049 13.8173 11.8239 13.7011 11.6847C13.579 11.5385 13.4113 11.3679 13.1689 11.2694C12.847 11.1385 12.4867 11.1385 12.1647 11.2694C11.9224 11.3679 11.7547 11.5385 11.6326 11.6847C11.5163 11.8239 11.391 12.0049 11.2566 12.1991L7.261 17.9706C7.0875 18.2211 6.93196 18.4458 6.82427 18.6364C6.717 18.8262 6.59278 19.0884 6.60738 19.3965C6.62599 19.7891 6.81695 20.1536 7.12922 20.3924C7.37418 20.5798 7.66045 20.6269 7.87762 20.6468C8.09562 20.6667 8.36883 20.6667 8.67359 20.6667L18.6668 20.6667C18.6692 20.6667 18.6716 20.6667 18.674 20.6666L19.3693 20.6666C19.6682 20.6667 19.937 20.6667 20.1519 20.647C20.367 20.6273 20.6492 20.5805 20.8922 20.3966C21.2032 20.1614 21.3956 19.8019 21.4188 19.4128C21.437 19.1085 21.3194 18.8478 21.2164 18.6579C21.1136 18.4682 20.9645 18.2445 20.7986 17.9958L18.761 14.9393C18.6254 14.7359 18.4996 14.5471 18.3828 14.4023C18.2608 14.2511 18.0917 14.0728 17.8443 13.9702Z" 
        fill="#98A2B3"
      />
      <Defs>
        <LinearGradient id="paint0_linear_1663_5908" x1="14" y1="0" x2="14" y2="28" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#F2F4F7"/>
          <Stop offset="1" stopColor="#D0D5DD"/>
        </LinearGradient>
      </Defs>
    </Svg>
  );
}; 

export const CloseIcon: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M15 5L5 15M5 5L15 15" 
        stroke={color} 
        strokeWidth="1.66667" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const ChevronDown: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M5 7.5L10 12.5L15 7.5" 
        stroke={color} 
        strokeWidth="1.66667" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const CheckMark: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M16.6666 5L7.49998 14.1667L3.33331 10" 
        stroke={color} 
        strokeWidth="1.67" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const SearchIcon: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M9.58335 1.66669C5.2111 1.66669 1.66669 5.2111 1.66669 9.58335C1.66669 13.9556 5.2111 17.5 9.58335 17.5C11.4693 17.5 13.2012 16.8405 14.5611 15.7396L16.9108 18.0893C17.2362 18.4147 17.7638 18.4147 18.0893 18.0893C18.4147 17.7638 18.4147 17.2362 18.0893 16.9108L15.7396 14.5611C16.8405 13.2012 17.5 11.4693 17.5 9.58335C17.5 5.2111 13.9556 1.66669 9.58335 1.66669ZM3.33335 9.58335C3.33335 6.13157 6.13157 3.33335 9.58335 3.33335C13.0351 3.33335 15.8334 6.13157 15.8334 9.58335C15.8334 13.0351 13.0351 15.8334 9.58335 15.8334C6.13157 15.8334 3.33335 13.0351 3.33335 9.58335Z" 
        fill={color}
      />
    </Svg>
  );
}; 

export const NoResultSearch: React.FC<IconProps> = ({ 
  width = normalize(56), 
  height = normalize(56), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 56 56" fill="none">
      <Rect x="4" y="4" width="48" height="48" rx="24" fill="#F5F5F5"/>
      <Rect x="4" y="4" width="48" height="48" rx="24" stroke="#FAFAFA" strokeWidth="8"/>
      <Path 
        d="M37 37L33.5001 33.5M36 27.5C36 32.1944 32.1944 36 27.5 36C22.8056 36 19 32.1944 19 27.5C19 22.8056 22.8056 19 27.5 19C32.1944 19 36 22.8056 36 27.5Z" 
        stroke="#737373" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const AgenticAppEmptyState: React.FC<IconProps> = ({ 
  width = normalize(56), 
  height = normalize(56), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 56 56" fill="none">
      <Rect x="4" y="4" width="48" height="48" rx="24" fill="#F5F5F5"/>
      <Rect x="4" y="4" width="48" height="48" rx="24" stroke="#FAFAFA" strokeWidth="8"/>
      <Path 
        d="M29 18L20.0934 28.6879C19.7446 29.1064 19.5702 29.3157 19.5676 29.4925C19.5652 29.6461 19.6337 29.7923 19.7532 29.8889C19.8907 30 20.1632 30 20.708 30H28L27 38L35.9065 27.3121C36.2553 26.8936 36.4297 26.6843 36.4324 26.5075C36.4347 26.3539 36.3663 26.2077 36.2467 26.1111C36.1092 26 35.8368 26 35.292 26H28L29 18Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 