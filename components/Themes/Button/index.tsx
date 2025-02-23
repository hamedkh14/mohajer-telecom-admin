import React from 'react'
import { ActivityIndicator, GestureResponderEvent, StyleProp, StyleSheet, TouchableOpacity } from "react-native"
import { Rounded, Sizes, Spacing } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { ReactNode } from "react";
import ThemedText from '../ThemedText';
import { LinkProps, usePathname, useRouter } from 'expo-router';

interface ButtonProps {
  children?: ReactNode;
  text?: string | null;
  Icon?: React.FC<{ color: string; size: number }> | null;
  iconOptions?: {
    position?: "start" | "end";
    size?: number;
    color?: string;
  }
  onPress?: ((e: GestureResponderEvent) => void) | null;
  disabled?: boolean; 
  loading?: boolean;
  block?: boolean;
  cancel?: boolean;
  style?: StyleProp<any>;
  varient?: "primary" | "iconButton" | "outline" | "transparent";
  href?: LinkProps['href'] | any
  back?: boolean;
  replace?: boolean;
}

const Button = ({
  children = false,
  text = null, 
  Icon = null,
  iconOptions,
  onPress = null, 
  disabled = false, 
  loading = false,
  block = false,
  cancel = false,
  style = {},
  varient = 'primary',
  href,
  back,
  replace
}: ButtonProps) => {
  const router = useRouter();
  const iconPosition = iconOptions?.position || 'start'
  const iconColor = iconOptions?.color || Colors.primary
  const iconSize = iconOptions?.size || Sizes.md
  const isBack = back || false
  const isReplace = replace || false
  
  const handlePress = (e:any) => {
    if(loading) return;

    if(!href && onPress) {
      onPress(e);
      return;
    }

    if(isBack) {
      router.back();
      return;
    }

    if(isReplace) {
      router.replace(href)
      return;
    }

    if(href) {
      router.push(href)
    }
  }
  const customStyle = {
    ...styles[varient],
    ...(block && {width: '100%'}),
    ...(cancel && styles[`${varient}_cancel`]),
    ...StyleSheet.flatten(style || {}),
  }

  const textCustomStyle = {
    ...styles[`text${varient}`],
    ...(cancel && styles[`text_${varient}_cancel`]),
  }

  const ButtonContent = () => {
    if(loading) {
      return <ActivityIndicator size="large" color={Colors.white} />
    }

    return (
      children || 
      <>
        {
          Icon && iconPosition === 'start' && 
          <Icon color={iconColor} size={iconSize || 0} />
        }

        {text && <ThemedText type='text' style={textCustomStyle}>{text}</ThemedText>}

        {
          Icon && iconPosition === 'end' && 
          <Icon color={iconColor} size={iconSize || 0} />
        }
      </>
    )
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.6} 
      onPress={handlePress}
      disabled={disabled} 
      style={[styles.default, customStyle]}
    >
      <ButtonContent />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  default: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[1],
    fontFamily: 'Yekan-Medium',
    flexShrink: 0,
    height: 56,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 48,
    flexShrink: 0,
  },
  primary: {
    backgroundColor: Colors.primary,
    minWidth: 128,
    maxWidth: '100%',
    paddingLeft: Spacing[3],
    paddingRight: Spacing[3],
    borderRadius: Rounded.md
  },
  outline: {
    borderColor: Colors.primary,
    borderWidth: 2,
    minWidth: 128,
    maxWidth: '100%',
    paddingLeft: Spacing[3],
    paddingRight: Spacing[3],
    borderRadius: Rounded.md
  },
  transparent: {
    backgroundColor: 'transparent'
  },
  iconButton_cancel: {
    backgroundColor: 'transparent'
  },
  primary_cancel: {
    backgroundColor: Colors.gray[600]
  },
  outline_cancel: {
    borderColor: Colors.gray[600]
  },
  transparent_cancel: {
    borderColor: 'transparent'
  },
  text_iconButton_cancel: {
  },
  text_primary_cancel: {
  },
  text_outline_cancel: {
    color: Colors.gray[600]
  },
  text_transparent_cancel: {
  },
  texticonButton: {},
  textprimary: {
    color: Colors.white
  },
  textoutline: {
    color: Colors.primary
  },
  texttransparent: {

  }
})
export default Button