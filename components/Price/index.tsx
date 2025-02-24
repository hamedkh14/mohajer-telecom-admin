import React from 'react'
import ThemedText from '../Themes/ThemedText'
import { StyleProp, StyleSheet, Text } from 'react-native'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import toPersion from '@/utils/toPersion'
import numberFormat from '@/utils/numberFormat'

interface PriceProp {
  type?: string,
  price?: number,
  isToman?: boolean,
  style?: StyleProp<any>
}

const Price = ({type='text', price=0, isToman=true, style}: PriceProp) => {

  const allStyle = {
    ...(type === 'text' && {}),
    ...(type === 'deposit' && styles.deposit),
    ...(type === 'withdrawal' && styles.withdrawal),
  }

  return (
    <ThemedText type={(type === 'deposit' ? 'success' : type === 'withdrawal' ? 'error' : 'text')} style={[allStyle, style]}>

      {toPersion(numberFormat(price))} 

      {isToman ? <Text style={{fontSize: 10}}>  تومان</Text> : <Text style={{fontSize: 10}}>  افغانی</Text>}

    </ThemedText>
  )
}

const styles = StyleSheet.create({
  deposit: {
    backgroundColor: Colors.bgSuccessAlphaDark,
    paddingHorizontal: Spacing[1],
    borderRadius: Rounded.lg,
  },
  withdrawal: {
    backgroundColor: Colors.bgErrorAlphaDark,
    paddingHorizontal: Spacing[1],
    borderRadius: Rounded.lg
  },
  text: {

  }
});

export default Price