import Button from '@/components/Themes/Button'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { BackHandler, Modal, StyleSheet, View } from 'react-native'
import { CreditCardIcon, CurrencyDollarIcon, PencilSquareIcon, ShieldExclamationIcon, TrashIcon } from 'react-native-heroicons/outline'

interface modalProp {
  open: boolean, 
  onClose: any, 
  item?: any,
  confirmDelete: any,
  confirmChangeStatusUser: any,
  topUpWallet: any
}

const UserItemMenu = ({open, onClose, item, confirmDelete, confirmChangeStatusUser, topUpWallet}: modalProp) => {
  const router = useRouter()
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
            <Button 
              varient='transparent' 
              text={'واریز / برداشت'} 
              Icon={CreditCardIcon} 
              iconOptions={{position: 'end', color: Colors.white}} 
              style={styles.button} 
              onPress={() => {
                onClose()
                topUpWallet(item)
              }} 
            />
            <Button 
              varient='transparent' 
              text={'ویرایش'} 
              Icon={PencilSquareIcon} 
              iconOptions={{position: 'end', color: Colors.white}} 
              style={styles.button} 
              onPress={() => {
                onClose()
                // router.push({pathname: '/customer/[...userForm]', params: {userForm: [item.id]}})
              }} 
            />
            <Button 
              varient='transparent' 
              text={item?.status ? 'غیرفعال کردن' : 'فعال کردن'} 
              Icon={ShieldExclamationIcon} 
              iconOptions={{position: 'end', color: Colors.white}} 
              style={styles.button} 
              onPress={() => {
                onClose()
                confirmChangeStatusUser(item)
              }} 
            />
            <Button 
              varient='transparent' 
              text={'گزارش تراکنش های کاربر'} 
              Icon={CurrencyDollarIcon} 
              iconOptions={{position: 'end', color: Colors.white}} 
              style={styles.button} 
              onPress={() => {
                onClose()
                // router.push({pathname: '/customer/report/[userId]', params: {userId: item.id}})
              }}
            />
            <Button 
              varient='transparent' 
              text={'حذف'} 
              Icon={TrashIcon} 
              iconOptions={{position: 'end', color: Colors.white}} 
              style={styles.buttonDelete} 
              onPress={() => {
                onClose()
                confirmDelete(item)
              }} 
            />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  container: {
    width: '100%',
    backgroundColor: Colors.elementBackground,
    borderTopLeftRadius: Rounded['3xl'],
    borderTopRightRadius: Rounded['3xl'],
    padding: Spacing[2],
    paddingTop: 50,
    gap: Spacing[2]
  },
  button: {
    backgroundColor: Colors.whiteAlpha2, 
    borderRadius: 8
  },
  buttonDelete: {
    borderRadius: 8,
    backgroundColor: Colors.bgErrorAlphaDark,
  }
})

export default UserItemMenu