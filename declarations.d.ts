declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'redux-saga';
declare module 'redux-saga/effects';
declare module 'react-native-sqlite-storage';
declare module 'react-native-config' {
  export interface NativeConfig {
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
  }

  const Config: NativeConfig;
  export default Config;
}
declare module '*.json' {
  const value: any;
  export default value;
}
