import React from 'react'
import { StyleSheet, View } from 'react-native'
import ThemedText from '../Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Sizes, Spacing } from '@/constants/Styles'
import { CalendarDaysIcon, EllipsisVerticalIcon } from 'react-native-heroicons/outline'
import Price from '../Price'
import Button from '../Themes/Button'

const SubscriptionItem = ({item, onSelecting}: {item: any, onSelecting: any}) => {


  
  return (
    <View style={styles.container}>
      <View style={styles.rightBox}>
        <View style={styles.icon}>
          <CalendarDaysIcon color={Colors.caption} size={Sizes['xl']} />
        </View>
        <View style={{height: '100%', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <ThemedText type='text' style={{fontSize: Sizes.sm}}>{item.title}</ThemedText>
          <Price price={item.price} style={{color: Colors.caption}} />
        </View>
      </View>
      <Button varient='iconButton' Icon={EllipsisVerticalIcon} iconOptions={{color: Colors.white}} onPress={() => {onSelecting(item)}} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.elementBackground,
    paddingVertical: Spacing[1],
    paddingRight: Spacing[1],
    borderRadius: Rounded.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80
  },
  icon: {
    width: 64,
    height: 64,
    backgroundColor: Colors.blackAlpha,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightBox: {
    flexDirection: 'row-reverse',
    gap: Spacing[2],
    height: '100%'
  },
  button: {
    height: 40,
    minWidth: 30
  }
})

export default SubscriptionItem