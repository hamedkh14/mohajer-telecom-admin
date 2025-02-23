import Colors from '@/constants/Colors'
import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

interface ThemedTextProps {
  type: "extraTitle" | "title" | "subTitle" | "caption" | "text" | "input" | "error" | "success" | "warning",
  children: any,
  style?: StyleProp<TextStyle>
}

const ThemedText = ({children = '', type, style}: ThemedTextProps) => {
  return (
    <Text style={[styles[type], style]}>{children}</Text>
  )
}

const styles = StyleSheet.create({
  extraTitle: {
    fontSize: 36,
    fontFamily: 'Yekan-Bold',
    color: Colors.extarTitle
  },
  title: {
    fontSize: 24,
    fontFamily: 'Yekan-Bold',
    color: Colors.title
  },
  subTitle: {
    fontSize: 20,
    fontFamily: 'Yekan-Bold',
    color: Colors.subTitle
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Yekan-Medium',
    color: Colors.caption
  },
  text: {
    fontSize: 18,
    fontFamily: 'Yekan-Medium',
    color: Colors.text
  },
  input: {
    fontSize: 18,
    fontFamily: 'Yekan-Medium',
    color: Colors.input
  },
  error: {
    fontSize: 18,
    fontFamily: 'Yekan-Medium',
    color: Colors.textError
  },
  success: {
    fontSize: 18,
    fontFamily: 'Yekan-Medium',
    color: Colors.textSuccess
  },
  warning: {
    fontSize: 18,
    fontFamily: 'Yekan-Medium',
    color: Colors.textWarning
  }
})

export default ThemedText