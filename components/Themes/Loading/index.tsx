import Colors from '@/constants/Colors'
import React from 'react'
import { ActivityIndicator } from 'react-native'

interface loadingProp {
  size?: 'small' | 'large' | number,
  color?: string
}

const Loading = ({size='large', color=Colors.white}: loadingProp) => {
  return (
    <ActivityIndicator size={size} color={color} />
  )
}

export default Loading