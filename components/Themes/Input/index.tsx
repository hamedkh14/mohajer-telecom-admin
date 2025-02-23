import React, { useState, useMemo } from 'react'
import { StyleProp, StyleSheet, TextInput, View } from 'react-native'
import Colors from '../../../constants/Colors';
import {Rounded, Sizes, Spacing} from '../../../constants/Styles';
import ThemedText from '../ThemedText';

interface InputProps {
  placeholder?: string;
  label?: string | null;
  multiline?: boolean;
  numeric?: boolean;
  value?: string;
  Icon?: React.FC<{ color: string; size: number }> | null;
  iconPosition?: 'start' | 'end';
  inputValuePosition?: 'start' | 'end';
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  error?: boolean;
  style?: StyleProp<any>;
  [key: string]: any;
}

const Input = ({
  placeholder = '', 
  label = null,
  multiline = false,
  numeric = false,
  value = '', 
  Icon = null,
  iconPosition = 'start',
  inputValuePosition = 'start',
  onChangeText = () => {},
  disabled = false, 
  error = false,
  style = {},
  ...props 
}: InputProps) => {
  const inputOnBlurStyle = useMemo(() => ({
    ...styles.input,
    ...StyleSheet.flatten(style || {}),
    ...(inputValuePosition === 'start' ? styles.inputRightAlign : styles.inputLeftAlign),
    ...(Icon && (iconPosition === 'start' ? {paddingRight: Spacing[6]} : {paddingLeft: Spacing[6]})),
    ...(multiline && {textAlignVertical: 'top', height: 164, paddingVertical: Spacing[1]})
  }), [style, inputValuePosition, Icon, iconPosition, multiline]);

  const [inputStyle, setInputStyle] = useState(inputOnBlurStyle);

  const handleChange = (text: string) => {
    onChangeText(text);
  }

  const handleFocus = () => {
    setInputStyle({
      ...inputOnBlurStyle,
      ...styles.inputFocus
    });
  }

  const handleBlur = () => {
    setInputStyle(inputOnBlurStyle);
  }

  // icon styles
  const iconStyle = useMemo(() => ({
    ...styles.defaultIcon, 
    ...(iconPosition === 'start' ? styles.iconPositionStart : styles.iconPositionEnd)
  }), [iconPosition]);
  
  return (
    <View style={{width: '100%', gap: Spacing[1], alignItems: 'flex-end'}}>
      {label && <ThemedText type='input'>{label}</ThemedText>}
      <TextInput 
        style={inputStyle} 
        value={value} 
        onChangeText={handleChange} 
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={numeric ? 'numeric' : 'default'}
        editable={!disabled}
        {...props}
      />

      {
        Icon && 
        <Icon 
          color={Colors.white}
          size={Sizes.lg} 
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    minHeight: 56,
    borderColor: Colors.black,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing[1],
    fontFamily: 'Yekan-Medium',
    color: Colors.black,
    fontSize: Sizes.base,
  },
  inputFocus: {
    borderColor: Colors.primary
  },
  inputLeftAlign: {
    textAlign: 'left'
  },
  inputRightAlign: {
    textAlign: 'right'
  },
  defaultIcon: {
    position: 'absolute',
    top: 12
  },
  iconPositionStart: {
    right: 8,
  },
  iconPositionEnd: {
    left: 8
  }
})

export default Input;
