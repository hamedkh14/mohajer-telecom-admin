import { StyleProp, StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import { Rounded, Sizes, Spacing } from '../../../constants/Styles';
import { ArrowRightIcon } from 'react-native-heroicons/outline';
import React from 'react';
import Button from './../Button';
import ThemedText from '../ThemedText';


interface HeaderProps {
  headerOptions: {
    hasBack?: boolean;
    title?: string;
    customTitle?: React.ReactNode; 
    headerAction?: React.ReactNode | null;
    headerBottom?: React.ReactNode;
    hideActionBox?: boolean;
    hideBackBox?: boolean;
  };
  headerStyle?: StyleProp<any>;
  iconBackColor?: string;
}

const Header = ({
  headerOptions: {
    hasBack = false,
    title = '',
    customTitle = null,
    hideActionBox = false,
    hideBackBox = false,
    headerAction = null,
    headerBottom = null,
  },
  headerStyle = {},
  iconBackColor = ''
}: HeaderProps) => {
  return (
    <View style={[styles.defaultHeader, headerStyle]}>
      <View style={styles.headerTop}>
        {
          !hideBackBox &&
          <View style={styles.headerTopRight}>
            {
              hasBack && 
              <Button varient='iconButton' back>
                <ArrowRightIcon color={iconBackColor || Colors.white} size={Sizes.md} />
              </Button>
            }
          </View>
        }
        <View style={styles.headerTopCenter}>
          {title!='' && <ThemedText type='text'>{title}</ThemedText>}

          {customTitle}
        </View>
        {
          !hideActionBox &&
          <View style={styles.headerTopLeft}>
            {headerAction ? headerAction : ''}
          </View>
        }
      </View>
      {
        headerBottom && 
        <View style={styles.headerBottom}>
          {headerBottom}
        </View>
      }
    </View>
  );
};


const styles = StyleSheet.create({
  defaultHeader: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 0,
    gap: Spacing[1],
    paddingLeft: Spacing[2],
    paddingRight: Spacing[2]
  },
  headerTop: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 72,
    gap: Spacing[1]
  },
  headerBottom: {
    minHeight: 80
  },
  headerTopRight: {
    minWidth: 56,
    alignItems: 'flex-end'
  },
  headerTopCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTopLeft: {
    minWidth: 56,
    flexDirection: 'row',
  }
})

export default Header;
