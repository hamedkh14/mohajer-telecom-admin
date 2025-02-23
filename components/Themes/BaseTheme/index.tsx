import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ViewStyle,
  StatusBarStyle,
} from 'react-native';
import Colors from '../../../constants/Colors';
import Header from '../Header';

interface BaseThemeProps {
  children?: React.ReactNode;
  hasList?: boolean;
  hasHeader?: boolean;
  hasTabBar?: boolean;
  headerOptions?: {
    hasBack?: boolean;
    title?: string;
    customTitle?: React.ReactNode;
    headerAction?: React.ReactNode | null;
    headerBottom?: React.ReactNode;
    hideActionBox?: boolean;
    hideBackBox?: boolean;
  };
  headerStyle?: ViewStyle;
  statusBarColor?: string | null;
  statusBarStyle?: StatusBarStyle;
  iconBackColor?: string;
  style?: ViewStyle;
  [key: string]: any;
}

const BaseTheme = ({
  children,
  hasList = false,
  hasHeader = false,
  hasTabBar = false,
  headerOptions = {
    hasBack: false,
    title: '',
    customTitle: null,
    headerAction: null,
    headerBottom: null,
    hideActionBox: false,
    hideBackBox: false,
  },
  headerStyle = {},
  statusBarColor = null,
  statusBarStyle = 'light-content',
  iconBackColor = '',
  style = {},
  ...props
}: BaseThemeProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={statusBarColor || Colors.baseBackground} barStyle={statusBarStyle} />

      {hasList ? (
        <ScrollView style={{ flex: 1, ...style }}>
          {/* Header */}
          {hasHeader && (
            <Header 
              headerOptions={headerOptions} 
              headerStyle={headerStyle}
              iconBackColor={iconBackColor}
            />
          )}
          {children}
          {hasTabBar && <View style={styles.tabBar} />}
        </ScrollView>
      ) : (
        <View style={{ flex: 1, ...style }}>
          {/* Header */}
          {hasHeader && (
            <Header 
              headerOptions={headerOptions} 
              headerStyle={headerStyle}
              iconBackColor={iconBackColor}
            />
          )}
          {children}
          {hasTabBar && <View style={styles.tabBar} />}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.baseBackground || '#fff',
  },
  tabBar: {
    flex: 1,
    height: 100,
  },
});

export default BaseTheme;
