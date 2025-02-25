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

const ErrorModal = ({open, onClose, text}: modalProp) => {
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
              <CheckIcon size={Sizes['4xl']} color={Colors.white} />
            </View>
          </View>
          <View style={styles.topContent}>
            <ThemedText type='error' style={{textAlign: 'center'}}>{text}</ThemedText>
            
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
    backgroundColor: Colors.bgErrorAlphaDark,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: Colors.bgErrorAlphaLight
  }
})

export default ErrorModal