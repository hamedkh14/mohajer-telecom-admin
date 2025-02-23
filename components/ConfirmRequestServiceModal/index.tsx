import Button from '@/components/Themes/Button'
import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import React, { useEffect } from 'react'
import { BackHandler, Modal, StyleSheet, View } from 'react-native'
import Input from '../Themes/Input'

interface modalProp {
  open: boolean, 
  onClose: any,
  data: any,
  onSubmit: any,
  submitLoading?: boolean,
  rejectedDesc?: string,
  handleRejectedDesc: any
}

const ConfirmRequestServiceModal = ({
  open, 
  onClose, 
  data, 
  onSubmit, 
  submitLoading,
  rejectedDesc,
  handleRejectedDesc
}: modalProp) => {

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
            <ThemedText type='title'>{data && data[1] === 'completed' ? 'تایید درخواست' : 'رد درخواست'}</ThemedText>
            <ThemedText type='text'>آیا برای {data && data[1] === 'completed' ? 'تایید درخواست' : 'رد درخواست'} مطمئن هستید؟</ThemedText>
            {data && data[1] === 'rejected' && (
              <Input placeholder='دلیل رد درخواست' value={rejectedDesc} onChangeText={(text) => handleRejectedDesc(text)} />
            )}
          </View>
          <View style={{flexDirection: 'row-reverse', gap: Spacing[2], justifyContent: 'center'}}>
            <Button text='خیر' cancel onPress={onClose} />
            <Button text='تایید' style={styles.btnConfirm} onPress={onSubmit} loading={submitLoading} disabled={submitLoading} cancel={submitLoading} />
          </View>
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
    minHeight: 230,
    backgroundColor: Colors.elementBackground,
    borderTopLeftRadius: Rounded['3xl'],
    borderTopRightRadius: Rounded['3xl'],
    padding: Spacing[2],
    justifyContent: 'space-between',
    gap: Spacing[2]
  },
  topContent: {
    alignItems: 'center',
    gap: Spacing[2]
  },
  btnConfirm: {
    flex: 1
  }
})

export default ConfirmRequestServiceModal