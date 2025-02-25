import Button from '@/components/Themes/Button'
import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import { useAuth } from '@/context/authContext'
import { deleteToken } from '@/utils/secureStore'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { BackHandler, Modal, StyleSheet, View } from 'react-native'

interface modalProp {
  open: boolean, 
  onClose: any,
}

const ConfirmLogoutModal = ({open, onClose}: modalProp) => {
  const router = useRouter()
  const {handleAuthUser} = useAuth()

  const onLogout = async () => {
    await deleteToken('authToken');
    handleAuthUser({
      isAuthenticated: false,
      user: null
    })
    router.replace('/')
  }

  useEffect(() => {
    const handleBackPress = () => {
      if (open) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [open])

  return (
    <Modal  
      animationType="slide" 
      transparent
      visible={open}
      onRequestClose={() => onClose()}
    >
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <View style={styles.topContent}>
            <ThemedText type='title'>خروج از حساب کاربری</ThemedText>
            <ThemedText type='text'>آیا برای خروج از حساب کاربری خود مطمئن هستید؟</ThemedText>
            
          </View>
          <View style={{flexDirection: 'row-reverse', gap: Spacing[2], justifyContent: 'center'}}>
            <Button text='خیر' cancel onPress={onClose} />
            <Button text='بله و خارج شوم' style={styles.btnConfirm} onPress={onLogout} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    // backgroundColor: Colors.blackAlpha3,
    justifyContent: 'flex-end'
  },
  container: {
    width: '100%',
    height: 230,
    backgroundColor: Colors.elementBackground,
    borderTopLeftRadius: Rounded['3xl'],
    borderTopRightRadius: Rounded['3xl'],
    padding: Spacing[2],
    justifyContent: 'space-between'
  },
  topContent: {
    alignItems: 'center',
    gap: Spacing[2]
  },
  btnConfirm: {
    backgroundColor: '#7f1d1d9e'
  }
})

export default ConfirmLogoutModal