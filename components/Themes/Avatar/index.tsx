import Colors from '@/constants/Colors'
import { Sizes } from '@/constants/Styles'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BuildingStorefrontIcon, UserIcon } from 'react-native-heroicons/outline'

const Avatar = ({type='customer'} : {type?: string}) => {
  return (
    <View style={styles.container}>
      {type === 'customer' ? <UserIcon color={Colors.white} size={Sizes.lg} /> : <BuildingStorefrontIcon color={Colors.textWarning} size={Sizes.lg} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteAlpha2,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  }
})

export default Avatar