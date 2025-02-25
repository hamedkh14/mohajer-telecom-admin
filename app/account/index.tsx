import React, { useState } from 'react'
import BaseTheme from '@/components/Themes/BaseTheme'
import ThemedText from '@/components/Themes/ThemedText'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Rounded, Sizes, Spacing } from '@/constants/Styles'
import { ArrowLeftEndOnRectangleIcon, ArrowLeftIcon } from 'react-native-heroicons/outline'
import Colors from '@/constants/Colors'
import { Link } from 'expo-router'
import ConfirmLogoutModal from '@/components/ConfirmLogoutModal'
import { useAuth } from '@/context/authContext'

const ProfileItemComponent = ({title, link='/', style}: any) => {
  return (
    <Link href={link || '/'}>
      <View style={[styles.profileItem, style]}>
        <View style={styles.textProfileItem}>
          <ThemedText type='text'>{title}</ThemedText>
        </View>
        <ArrowLeftIcon color={Colors.gray[600]} size={Sizes.md} />
      </View>
    </Link>
  )
}

const LogoutBotton = ({onPress}: any) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.6} 
      onPress={onPress}
      style={[styles.profileItem, styles.logoutButton]}
    >
      <ArrowLeftEndOnRectangleIcon color={Colors.textError} size={Sizes.lg} />
      <ThemedText type='error'>خروج از حساب کاربری</ThemedText>
    </TouchableOpacity>
  )
}

const Account = () => {
  const {authUser} = useAuth()
  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogoutModal = () => {

    setLogoutModal(!logoutModal)
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        title: 'حساب کاربری',
        hasBack: true,
        headerBottom: <>
          <View style={{width: '100%', alignItems: 'center', gap: Spacing[2]}}>
            <Image 
              source={require('../../assets/images/user-avatar.jpg')} 
              style={{width: 100, height: 100, borderRadius: 100}} 
            />
            <View style={{width: '100%', alignItems: 'center', gap: Spacing[1]}}>
              <ThemedText type='text'>{authUser.user.name}</ThemedText>
              <ThemedText type='text'>0{authUser.user.phoneNumber}</ThemedText>
            </View>
          </View>
        </>
      }}
    >
      <View style={styles.itemsContainer}>
        <ProfileItemComponent title='تغییر کلمه عبور' link='/account/changePassword' />
        <ProfileItemComponent title='تنظیمات' link='/account/settings' />
        <LogoutBotton onPress={handleLogoutModal} />
      </View>

      <ConfirmLogoutModal open={logoutModal} onClose={handleLogoutModal} />
    </BaseTheme>
  )
}


const styles = StyleSheet.create({
  profileTopContainer: {
    alignItems: 'center',
    gap: Spacing[2],
    paddingBottom: Spacing[2]
  },
  userInfo: {
    alignItems: 'center',
    gap: 4
  },
  userName: {
    color: Colors.white
  },
  userMobile: {
    color: Colors.gray[300],
    letterSpacing: 2
  },
  itemsContainer: {
    width: '100%',
    padding: Spacing[2],
    paddingTop: 40,
    paddingBottom: 205,
    gap: Spacing[2]
  },  
  profileItem: {
    width: '100%',
    height: 64,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.elementBackground,
    paddingHorizontal: Spacing[1],
    borderRadius: Rounded.md,
    marginBottom: Spacing[2]
  },
  textProfileItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing[2],
    height: '100%'
  },
  titleProfileItem: {
    color: Colors.white
  },
  iconProfileItem: {
    color: Colors.white
  },
  logoutButton: {
    backgroundColor: '#7f1d1d4e',
    justifyContent: 'center',
    gap: Spacing[2]
  }
})

export default Account