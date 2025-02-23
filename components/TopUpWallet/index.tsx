import Button from '@/components/Themes/Button'
import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Sizes, Spacing } from '@/constants/Styles'
import React, { useEffect, useState } from 'react'
import { BackHandler, Modal, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'
import Input from '../Themes/Input'
import { useTopUpWallet } from '@/hooks/wallet'
import DropDownPicker from 'react-native-dropdown-picker'

interface modalProp {
  open: boolean, 
  onClose: any, 
  item?: any,
}

const TopUpWallet = ({open, onClose, item}: modalProp) => {
  const { mutateAsync } = useTopUpWallet();

  const [fetchLoading, setFetchLoading] = useState(false)
  const [price, setPrice] = useState('')
  const [desc, setDesc] = useState('')
  const [actionOpen, setActionOpen] = useState(false);
  const [actionSelected, setActionSelected] = useState<any>(null);
    
  const [action, setAction] = useState([
    {label: 'واریز', value: 'deposit'},
    {label: 'برداشت', value: 'withdrawal'}
  ]);

  const commonDropDownProps: any = {
    rtl: true,
    language: 'FA',
    placeholderStyle: styles.dropDwonPlaceholder,
    textStyle: styles.dropDownText,
  };

  

  const onChange = () => {
    if(price == '') {
      Toast.show({
        type: 'error',
        text1: 'لطفا مبلغ افزایش موجودی را وارد نمایید!'
      })

      return
    }
    if(actionSelected === null) {
      Toast.show({
        type: 'error',
        text1: 'لطفا نوع عملیات را انتخاب کنید!'
      })

      return
    }

    setFetchLoading(true);

    if(item) {
      mutateAsync({
        user_id: item?.id,
        price,
        desc,
        action: actionSelected
      })
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: 'عملیات با موفقیت انجام شد'
        })

        setPrice('')
        setDesc('')
        setActionSelected(null)
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
            <ThemedText type='text' style={{marginBottom: Spacing[4]}}>واریز / برداشت</ThemedText>
            <Input numeric placeholder='مبلغ' value={price} onChangeText={(text: any) => setPrice(text)} />

            <DropDownPicker
              {...commonDropDownProps}
              open={actionOpen}
              value={actionSelected}
              items={action}
              setOpen={setActionOpen}
              setValue={setActionSelected}
              setItems={setAction}
              style={styles.dropDown}
              dropDownContainerStyle={styles.dropDownContainerStyle}
              placeholder='نوع عملیات'
            />
            <Input placeholder='توضیحات' value={desc} onChangeText={(text) => setDesc(text)} />
          </View>
          <View style={{flexDirection: 'row', width: '100%', gap: Spacing[2], justifyContent: 'center', paddingTop: Spacing[1]}}>
            <Button 
              varient='primary' 
              text='تایید' 
              onPress={onChange} 
              disabled={fetchLoading} 
              cancel={fetchLoading} 
              loading={fetchLoading} 
              style={{
                flex: 1
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
    justifyContent: 'flex-end'
  },
  container: {
    width: '100%',
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
  dropDownContainerStyle: {
    backgroundColor: Colors.white, 
    borderWidth: 0, 
    borderTopWidth: 1, 
    borderColor: Colors.blackAlpha2
  },
  dropDown: {
    backgroundColor: Colors.white, 
    height: 56, 
    borderWidth: 0,
    zIndex: 10
  },
  dropDwonPlaceholder: {
    textAlign: 'right',
    fontSize: Sizes.base,
    fontFamily: 'Yekan-Medium',
    color: 'gray'
  },
  dropDownText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Yekan-Medium',
  },
  priceDetails: {

  }
})

export default TopUpWallet