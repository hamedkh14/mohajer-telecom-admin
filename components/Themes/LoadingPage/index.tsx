import React from 'react'
import BaseTheme from '../BaseTheme'
import { Spacing } from '@/constants/Styles'
import Loading from '../Loading'
import { View } from 'react-native'
import ThemedText from '../ThemedText'

const LoadingPage = (props: any) => {
  return (
    <BaseTheme>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing[3]}}>
        <Loading size={56} />
        <ThemedText type='text'>درحال بارگزاری</ThemedText>
      </View>
    </BaseTheme>
  )
}

export default LoadingPage