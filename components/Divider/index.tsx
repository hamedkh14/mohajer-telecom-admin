import { StyleSheet, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors'
import { Spacing } from '@/constants/Styles'

const Divider = ({style = {}, lineStyle = {}}) => {
  return (
    <View style={[styles.dividerContainer, style]}>
      <View style={[styles.line, lineStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  dividerContainer: {
    width: '100%',
    height: 1,
    paddingHorizontal: Spacing[1],
    marginVertical: Spacing[2]
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.elementBackground
  }
})

export default Divider
