import Button from '@/components/Themes/Button'
import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import React, { useEffect, useState } from 'react'
import { BackHandler, Modal, StyleSheet, View } from 'react-native'
import { useUpdateUser } from '@/hooks/users'
import Toast from 'react-native-toast-message'

interface modalProp {
  open: boolean, 
  onClose: any, 
  item?: any,
}

const ChangeStatusUser = ({open, onClose, item}: modalProp) => {
    const { mutateAsync: updateUser } = useUpdateUser();

  const [fetchLoading, setFetchLoading] = useState(false)

  

  const onChange = () => {
    setFetchLoading(true);

    if(item) {
      updateUser({
        item: {
          status: !item?.status
        },
        filter: `/${item?.id}`,
        position: 'changeStatusUser'
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: item?.status ? 'حساب کاربری مشتری با موفقیت غیر فعال شد!' : 'حساب کاربری مشتری با موفقیت فعال شد!'
        })
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'هنگام انجام عملیات خطایی رخ داده است!'
        })
      })
      .finally(() => {
        setFetchLoading(false)
        onClose()
      })
    }
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
            <ThemedText type='text' style={{marginBottom: Spacing[4]}}>تغییر وضعیت حساب کاربری</ThemedText>
            {
              item?.status ? (
                <ThemedText type='caption' style={{textAlign: 'center'}}>شما می خواهید حساب کاربری مشتری {item?.name} را غیرفعال کنید. آیا مطمئن هستید؟</ThemedText>
              ) : (
                <ThemedText type='caption' style={{textAlign: 'center'}}>شما می خواهید حساب کاربری مشتری {item?.name} را فعال کنید. آیا مطمئن هستید؟</ThemedText>
              )
            }
          </View>
          <View style={{flexDirection: 'row', width: '100%', gap: Spacing[2], justifyContent: 'center'}}>
            <Button 
              varient='primary' 
              text={item?.status ? 'تایید و غیرفعال کردن' : 'تایید و فعال کردن'}
              onPress={onChange} 
              disabled={fetchLoading} 
              cancel={fetchLoading} 
              loading={fetchLoading} 
              style={{
                width: '55%'
              }} 
            />
            <Button 
              text='انصراف' 
              onPress={onClose} 
              cancel={true}
              style={{
                width: '35%'
              }} 
            />
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
    height: 250,
    backgroundColor: Colors.elementBackground,
    borderTopLeftRadius: Rounded['3xl'],
    borderTopRightRadius: Rounded['3xl'],
    padding: Spacing[2],
    justifyContent: 'space-between'
  },
  topContent: {
    alignItems: 'center',
    gap: Spacing[1]
  },
  mobileOperatorContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing[1],
  },
  priceDetails: {

  }
})

export default ChangeStatusUser