import Button from '@/components/Themes/Button'
import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Sizes, Spacing } from '@/constants/Styles'
import React, { useEffect } from 'react'
import { BackHandler, Modal, StyleSheet, View } from 'react-native'
import { CheckIcon } from 'react-native-heroicons/outline'

interface modalProp {
  open: boolean, 
  onClose: any,
  text: string
}

const SuccessModal = ({open, onClose, text}: modalProp) => {
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
          <View style={styles.iconContainer}>
            <View style={styles.iconShadow}>
              <View style={styles.iconBackground}>
                <CheckIcon size={Sizes['4xl']} color={Colors.white} />
              </View>
            </View>
          </View>
          <View style={styles.topContent}>
            <ThemedText type='text' style={{textAlign: 'center', color: Colors.primary}}>{text}</ThemedText>
            
          </View>
          <Button text='بازگشت' varient='outline' onPress={onClose} />
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
    height: 280,
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
  },
  iconContainer: {
    width: '100%',
    height: 100,
    marginTop: -60,
    alignItems: 'center'
  },
  iconShadow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00def2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconBackground: {
    width: '80%',
    height: '80%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default SuccessModal