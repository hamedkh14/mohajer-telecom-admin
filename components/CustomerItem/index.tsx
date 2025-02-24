import Colors from '@/constants/Colors'
import { Rounded, Sizes, Spacing } from '@/constants/Styles'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Divider from '../Divider'
import Button from '../Themes/Button'
import { EllipsisVerticalIcon, LockClosedIcon } from 'react-native-heroicons/outline'
import Avatar from '../Themes/Avatar'
import ThemedText from '../Themes/ThemedText'
import Price from '../Price'

const CustomerItem = ({item, openMenu}: {item: any, openMenu: any}) => {
  return (
      <View style={[styles.container, (item?.isDelete && styles.deleted),]}>
        <View style={styles.topContainer}>
          <View style={{flexDirection: 'row-reverse', gap: Spacing[1]}}>
            <Avatar />
            <View style={{justifyContent: 'space-between', alignItems: 'flex-end'}}>
              <View style={{flexDirection: 'row-reverse', alignItems: 'center', gap: 4}}><ThemedText type='text'>{item?.name}</ThemedText>{item?.status === false && <LockClosedIcon color={Colors.bgWarning} size={Sizes.base} />}</View>
              <ThemedText type='caption'>0{item?.phoneNumber}</ThemedText>
            </View>
          </View>
          <Button varient='iconButton' Icon={EllipsisVerticalIcon} iconOptions={{color: Colors.white}} onPress={() => openMenu(item)} />
        </View>
        <Divider lineStyle={{backgroundColor: Colors.whiteAlpha2}} style={{marginVertical: 0}} />
        <View style={styles.bottomContainer}>
          <ThemedText type='caption'>موجودی کیف پول</ThemedText>
          <Price price={Number(item?.wallet_available_balance) - Number(item?.wallet_locked_balance)} />
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 130,
    backgroundColor: Colors.elementBackground,
    borderRadius: Rounded.lg,
    justifyContent: 'space-between'
  },
  deleted: {
    backgroundColor: Colors.bgErrorAlphaDark,
  },
  topContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    padding: Spacing[1],
    paddingLeft: 0
  },
  bottomContainer: {
    height: 36,
    paddingHorizontal: Spacing[1],
    justifyContent: 'space-between',
    flexDirection: 'row-reverse'
  }
})

export default CustomerItem