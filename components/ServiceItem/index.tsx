import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import ThemedText from '../Themes/ThemedText'
import Price from '../Price'
import Colors from '@/constants/Colors'
import { Rounded, Sizes, Spacing } from '@/constants/Styles'
import toPersion from '@/utils/toPersion'
import Button from '../Themes/Button'
import { EllipsisVerticalIcon } from 'react-native-heroicons/outline'

const operator: any = {
  irancell: require('../../assets/images/irancell.png'),
  hamrahaval: require('../../assets/images/hamrahaval.png'),
  rightel: require('../../assets/images/rightel.png'),
  etisalat: require('../../assets/images/etisalat.png'),
  roshan: require('../../assets/images/roshan.png'),
  salaam: require('../../assets/images/salaam.png'),
  mtn: require('../../assets/images/mtn.png'),
  afghanWireless: require('../../assets/images/afghanWireless.png'),
}

const ServiceItem = ({item, price, openMenu}: {item: any, price?: number, openMenu: any}) => {
  const handlePress = () => {
  }
  return (
    <View 
      style={styles.itemContainer}
    >
      <View style={{flexDirection: 'row-reverse', gap: Spacing[1]}}>
        <View style={styles.imageContainer}><Image source={operator[item?.operator]} style={styles.itemImage} /></View>
        <View style={{alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <ThemedText type='text' style={{fontSize: Sizes.sm}}>{toPersion(item.title)} {item.isSpecial && '(ویژه)'}</ThemedText>
          <Price type='text' price={price || item.price} style={{color: Colors.caption}} />
        </View>
      </View>
      <Button varient='iconButton' Icon={EllipsisVerticalIcon} iconOptions={{color: Colors.white}} onPress={() => {openMenu(item)}} />
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.elementBackground,
    padding: Spacing[1],
    paddingLeft: 0,
    borderRadius: Rounded.md,
    marginBottom: Spacing[2]
  },
  imageContainer: {
    borderRadius: Rounded.md,
    width: 64,
    height: 64,
    backgroundColor: Colors.whiteAlpha2,
    alignItems: 'center'
    ,
    justifyContent: 'center'
  },
  itemImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: Rounded.md
  }
})

export default ServiceItem