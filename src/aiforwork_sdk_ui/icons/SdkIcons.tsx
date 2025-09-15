import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect, LinearGradient, Stop, Circle, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';
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

export const RightChevron: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M7.5 15L12.5 10L7.5 5" 
        stroke={color} 
        strokeWidth="1.66667" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const LeftChevron: React.FC<IconProps> = ({ 
  width = normalize(24), 
  height = normalize(24), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M15 18L9 12L15 6" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const QueriesIcon: React.FC<IconProps> = ({ 
  width = normalize(16), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 20" fill="none">
      <Path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M10.7011 0.833252H5.29892C4.62812 0.833242 4.07447 0.833233 3.62348 0.870081C3.15506 0.908352 2.72448 0.990489 2.32003 1.19656C1.69283 1.51614 1.18289 2.02608 0.863313 2.65328C0.657237 3.05773 0.5751 3.48832 0.536829 3.95673C0.499982 4.40772 0.49999 4.96135 0.5 5.63216V14.3677C0.49999 15.0385 0.499982 15.5921 0.536829 16.0431C0.5751 16.5115 0.657237 16.9421 0.863313 17.3466C1.18289 17.9738 1.69283 18.4837 2.32003 18.8033C2.72448 19.0093 3.15506 19.0915 3.62348 19.1298C4.07447 19.1666 4.6281 19.1666 5.2989 19.1666H10.7011C11.3719 19.1666 11.9255 19.1666 12.3765 19.1298C12.8449 19.0915 13.2755 19.0093 13.68 18.8033C14.3072 18.4837 14.8171 17.9738 15.1367 17.3466C15.3428 16.9421 15.4249 16.5115 15.4632 16.0431C15.5 15.5921 15.5 15.0385 15.5 14.3677V5.63215C15.5 4.96135 15.5 4.40772 15.4632 3.95673C15.4249 3.48832 15.3428 3.05773 15.1367 2.65328C14.8171 2.02608 14.3072 1.51614 13.68 1.19656C13.2755 0.990489 12.8449 0.908352 12.3765 0.870081C11.9255 0.833233 11.3719 0.833242 10.7011 0.833252ZM4.66667 4.99992C4.20643 4.99992 3.83333 5.37301 3.83333 5.83325C3.83333 6.29349 4.20643 6.66659 4.66667 6.66659H11.3333C11.7936 6.66659 12.1667 6.29349 12.1667 5.83325C12.1667 5.37301 11.7936 4.99992 11.3333 4.99992H4.66667ZM3.83333 9.16658C3.83333 8.70635 4.20643 8.33325 4.66667 8.33325H9.66667C10.1269 8.33325 10.5 8.70635 10.5 9.16658C10.5 9.62682 10.1269 9.99992 9.66667 9.99992H4.66667C4.20643 9.99992 3.83333 9.62682 3.83333 9.16658ZM3.83333 12.4999C3.83333 12.0397 4.20643 11.6666 4.66667 11.6666H6.33333C6.79357 11.6666 7.16667 12.0397 7.16667 12.4999C7.16667 12.9602 6.79357 13.3333 6.33333 13.3333H4.66667C4.20643 13.3333 3.83333 12.9602 3.83333 12.4999Z" 
        fill="url(#paint0_linear_queries)"
      />
      <Defs>
        <LinearGradient id="paint0_linear_queries" x1="2.6967" y1="16.4817" x2="15.4036" y2="6.08516" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#528BFF"/>
          <Stop offset="1" stopColor="#22CCEE"/>
        </LinearGradient>
      </Defs>
    </Svg>
  );
}; 

export const Calendar: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M17.5 8.33335H2.5M13.3333 1.66669V5.00002M6.66667 1.66669V5.00002M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33335C17.5 5.93322 17.5 5.23316 17.2275 4.69838C16.9878 4.22797 16.6054 3.84552 16.135 3.60584C15.6002 3.33335 14.9001 3.33335 13.5 3.33335H6.5C5.09987 3.33335 4.3998 3.33335 3.86502 3.60584C3.39462 3.84552 3.01217 4.22797 2.77248 4.69838C2.5 5.23316 2.5 5.93322 2.5 7.33335V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z" 
        stroke={color} 
        strokeWidth="1.67" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const CalendarCheck: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M17.5 8.33335H2.5M13.3333 1.66669V5.00002M6.66667 1.66669V5.00002M7.5 13.3334L9.16667 15L12.9167 11.25M6.5 18.3334H13.5C14.9001 18.3334 15.6002 18.3334 16.135 18.0609C16.6054 17.8212 16.9878 17.4387 17.2275 16.9683C17.5 16.4336 17.5 15.7335 17.5 14.3334V7.33335C17.5 5.93322 17.5 5.23316 17.2275 4.69838C16.9878 4.22797 16.6054 3.84552 16.135 3.60584C15.6002 3.33335 14.9001 3.33335 13.5 3.33335H6.5C5.09987 3.33335 4.3998 3.33335 3.86502 3.60584C3.39462 3.84552 3.01217 4.22797 2.77248 4.69838C2.5 5.23316 2.5 5.93322 2.5 7.33335V14.3334C2.5 15.7335 2.5 16.4336 2.77248 16.9683C3.01217 17.4387 3.39462 17.8212 3.86502 18.0609C4.3998 18.3334 5.09987 18.3334 6.5 18.3334Z" 
        stroke={color} 
        strokeWidth="1.67" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const CalendarDown: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M6.66667 10L10 13.3333M10 13.3333L13.3333 10M10 13.3333V6.66667M6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5Z" 
        stroke={color} 
        strokeWidth="1.67" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const CalendarLeft: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = 'currentColor' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        d="M10 6.66667L6.66667 10M6.66667 10L10 13.3333M6.66667 10H13.3333M6.5 17.5H13.5C14.9001 17.5 15.6002 17.5 16.135 17.2275C16.6054 16.9878 16.9878 16.6054 17.2275 16.135C17.5 15.6002 17.5 14.9001 17.5 13.5V6.5C17.5 5.09987 17.5 4.3998 17.2275 3.86502C16.9878 3.39462 16.6054 3.01217 16.135 2.77248C15.6002 2.5 14.9001 2.5 13.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5Z" 
        stroke={color} 
        strokeWidth="1.67" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 

export const CheckBox: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = '#475467' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <G clipPath="url(#clip0_283_956)">
        <Rect width="20" height="20" rx="10" fill={color}/>
        <G filter="url(#filter0_d_283_956)">
          <Circle cx="10" cy="10" r="4" fill="white"/>
        </G>
      </G>
      <Rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke={color}/>
      <Defs>
        <Filter id="filter0_d_283_956" x="2" y="6" width="16" height="16" filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix"/>
          <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <FeOffset dy="4"/>
          <FeGaussianBlur stdDeviation="2"/>
          <FeComposite in2="hardAlpha" operator="out"/>
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_283_956"/>
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_283_956" result="shape"/>
        </Filter>
        <ClipPath id="clip0_283_956">
          <Rect width="20" height="20" rx="10" fill="white"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
}; 

export const CheckCircleBlack: React.FC<IconProps> = ({ 
  width = normalize(20), 
  height = normalize(20), 
  color = '#101828' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M9.99992 0.833332C4.93731 0.833332 0.833252 4.93739 0.833252 10C0.833252 15.0626 4.93731 19.1667 9.99992 19.1667C15.0625 19.1667 19.1666 15.0626 19.1666 10C19.1666 4.93739 15.0625 0.833332 9.99992 0.833332ZM14.3392 8.08925C14.6646 7.76382 14.6646 7.23618 14.3392 6.91074C14.0137 6.58531 13.4861 6.58531 13.1607 6.91074L8.74992 11.3215L6.83917 9.41074C6.51374 9.08531 5.9861 9.08531 5.66066 9.41074C5.33523 9.73618 5.33523 10.2638 5.66066 10.5893L8.16066 13.0893C8.4861 13.4147 9.01374 13.4147 9.33917 13.0893L14.3392 8.08925Z" 
        fill={color}
      />
    </Svg>
  );
}; 

export const CheckCircleWhite: React.FC<IconProps> = ({ 
  width = normalize(21), 
  height = normalize(21), 
  color = '#131316' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 21 21" fill="none">
      <G clipPath="url(#clip0_1495_7259)">
        <Path 
          d="M7.19189 10.9115L9.69189 13.4115L14.6919 8.41146M19.2752 10.9115C19.2752 15.5138 15.5443 19.2448 10.9419 19.2448C6.33952 19.2448 2.60856 15.5138 2.60856 10.9115C2.60856 6.30909 6.33952 2.57812 10.9419 2.57812C15.5443 2.57812 19.2752 6.30909 19.2752 10.9115Z" 
          stroke={color} 
          strokeWidth="1.66667" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_1495_7259">
          <Rect width="20" height="20" fill="white" transform="translate(0.941895 0.912109)"/>
        </ClipPath>
      </Defs>
    </Svg>
  );
}; 

export const DisableCheckBox: React.FC<IconProps> = ({ 
  width = normalize(16), 
  height = normalize(16), 
  color = '#D0D5DD' 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <Rect x="0.5" y="0.5" width="15" height="15" rx="7.5" fill="#F9FAFB"/>
      <Rect x="0.5" y="0.5" width="15" height="15" rx="7.5" stroke={color}/>
    </Svg>
  );
}; 