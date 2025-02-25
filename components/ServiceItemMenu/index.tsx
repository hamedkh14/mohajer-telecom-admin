import Button from '@/components/Themes/Button'
import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Sizes, Spacing } from '@/constants/Styles'
import numberFormat from '@/utils/numberFormat'
import toPersion from '@/utils/toPersion'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { BackHandler, Image, Modal, StyleSheet, View } from 'react-native'
import { CreditCardIcon, PencilSquareIcon, ShieldExclamationIcon, TrashIcon } from 'react-native-heroicons/outline'

interface modalProp {
  open: boolean, 
  onClose: any, 
  item?: any,
  confirmDelete: any
}

const ServiceItemMenu = ({open, onClose, item, confirmDelete}: modalProp) => {
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
              text={'ویرایش'} 
              Icon={PencilSquareIcon} 
              iconOptions={{position: 'end', color: Colors.white}} 
              style={styles.button} 
              onPress={() => {
                onClose()
                router.push({pathname: '/services/[...serviceForm]', params: {serviceForm: [item.id]}})
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
    // backgroundColor: Colors.blackAlpha3,
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

export default ServiceItemMenu