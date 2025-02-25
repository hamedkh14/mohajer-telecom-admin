import Button from '@/components/Themes/Button'
import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import React, { useEffect, useState } from 'react'
import { BackHandler, Modal, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useUpdateService } from '@/hooks/services'
import { useUpdateSubscription } from '@/hooks/subscriptions'

interface modalProp {
  open: boolean, 
  onClose: any, 
  item?: any,
}

const SubscriptionDelete = ({open, onClose, item}: modalProp) => {
    const { mutateAsync: updateSubscription } = useUpdateSubscription(item?.id);

  const [fetchLoading, setFetchLoading] = useState(false)

  

  const onDelete = () => {
    setFetchLoading(true);

    if(item) {
      updateSubscription({isDelete: true})
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: 'عملیات حذف اشتراک با موفقیت انجام شد!'
        })
      })
      .catch((err) => {
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
            <ThemedText type='text' style={{marginBottom: Spacing[4]}}>حذف اشتراک</ThemedText>
            <ThemedText type='caption' style={{textAlign: 'center'}}>شما می خواهید {item?.title} را حذف کنید. آیا مطمئن هستید؟</ThemedText>
          </View>
          <View style={{flexDirection: 'row', width: '100%', gap: Spacing[2], justifyContent: 'center'}}>
            <Button 
              varient='primary' 
              text='تایید و حذف کردن' 
              onPress={onDelete} 
              disabled={fetchLoading} 
              cancel={fetchLoading} 
              loading={fetchLoading} 
              style={{
                backgroundColor: Colors.bgErrorAlphaDark,
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

export default SubscriptionDelete