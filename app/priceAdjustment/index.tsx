import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Input from '@/components/Themes/Input'
import { Sizes, Spacing } from '@/constants/Styles'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Toast from 'react-native-toast-message'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const PriceAdjustmentForm = () => {
  const router = useRouter()

  const [percentage, setPercentage] = useState<string>('');

  const [serviceTypeOpen, setServiceTypeOpen] = useState(false);
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [whichPackageOpen, setWhichPackageOpen] = useState(false);

  const [serviceTypeSelected, setServiceTypeSelected] = useState<any>(null);
  const [operatorSelected, setOperatorSelected] = useState<any>(null);
  const [actionSelected, setActionSelected] = useState<any>(null);
  const [whichPackageSelected, setWhichPackageSelected] = useState<any>(null);

  const [serviceType, setServiceType] = useState([
    {label: 'شارژ سیم کارت', value: 'recharge'},
    {label: 'بسته اینترنت', value: 'internet'},
    {label: 'بسته الماس', value: 'almas'},
    {label: 'بسته برقرار', value: 'bargarar'},
    {label: 'یوسی پابجی', value: 'uc-pubg'},
  ]);
  const [operator, setOperator] = useState([
    {label: 'ایرانسل', value: 'irancell'},
    {label: 'همراه اول', value: 'hamrahaval'},
    {label: 'رایتل', value: 'rightel'},
    {label: 'اتصالات', value: 'etisalat'},
    {label: 'روشن', value: 'roshan'},
    {label: 'سلام', value: 'salaam'},
    {label: 'MTN', value: 'mtn'},
    {label: 'افغانستان بی سیم', value: 'afghanWireless'},
  ]);
  const [action, setAction] = useState([
    {label: 'افزایش', value: 'increase'},
    {label: 'کاهش', value: 'decrease'}
  ]);
  const [whichPackage, setWhichPackage] = useState([
    {label: 'همه', value: 'all'},
    {label: 'بروز نشده اند', value: 'notUpdated'},
  ]);

  const commonDropDownProps: any = {
    rtl: true,
    language: 'FA',
    searchable: true,
    searchPlaceholder: 'جستجو کنید...',
    placeholderStyle: styles.dropDwonPlaceholder,
    textStyle: styles.dropDownText,
  };

  const onSubmit = () => {
    let operatorSelect = operatorSelected;
    if(actionSelected === null) {
      Toast.show({
        type: 'error',
        text1: 'لطفا نوع عملیات را انتخاب کنید!'
      })

      return
    }
    if(percentage === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن درصد افزایش قیمت الزامی است'
      })
      return
    }
    if(parseInt(percentage) <= 0 || parseInt(percentage) > 100) {
      Toast.show({
        type: 'error',
        text1: 'درصد افزایش قیمت باید بین 0 الی 100 باشد'
      })
      return
    }
    if(serviceTypeSelected === null) {
      Toast.show({
        type: 'error',
        text1: 'انتخاب نوع بسته الزامی است'
      })
      return
    }
    if((serviceTypeSelected === 'recharge' || serviceTypeSelected === 'internet') && operatorSelect === null) {
      Toast.show({
        type: 'error',
        text1: 'انتخاب اپراتور الزامی است'
      })
      return
    }
    if(whichPackageSelected === null) {
      Toast.show({
        type: 'error',
        text1: 'انتخاب کدام بسته الزامی است'
      })
      return
    }
    if( serviceTypeSelected !== 'recharge' && serviceTypeSelected !== 'internet' ) {
      operatorSelect = 'null'
    }

    router.push({
      pathname: '/priceAdjustment/[...applyPriceChanges]',
      params:  {applyPriceChanges: [`${actionSelected}`, `${serviceTypeSelected}`, `${operatorSelect}`, `${percentage}`, `${whichPackageSelected}`]}
    })
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: 'تنظیم قیمت',
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, gap: Spacing[2], padding: Spacing[2] }}
      >
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
        <DropDownPicker
          {...commonDropDownProps}
          open={serviceTypeOpen}
          value={serviceTypeSelected}
          items={serviceType}
          setOpen={setServiceTypeOpen}
          setValue={setServiceTypeSelected}
          setItems={setServiceType}
          style={styles.dropDown}
          dropDownContainerStyle={styles.dropDownContainerStyle}
          placeholder='نوع بسته'
        />
        {
          (serviceTypeSelected === 'recharge' || serviceTypeSelected === 'internet') && (<>
            <DropDownPicker
              {...commonDropDownProps}
              open={operatorOpen}
              value={operatorSelected}
              items={operator}
              setOpen={setOperatorOpen}
              setValue={setOperatorSelected}
              setItems={setOperator}
              style={styles.dropDown}
              dropDownContainerStyle={styles.dropDownContainerStyle}
              placeholder='اپراتور را انتخاب کنید'
            />
          </>) 
        }
        <DropDownPicker
          {...commonDropDownProps}
          open={whichPackageOpen}
          value={whichPackageSelected}
          items={whichPackage}
          setOpen={setWhichPackageOpen}
          setValue={setWhichPackageSelected}
          setItems={setWhichPackage}
          style={styles.dropDown}
          dropDownContainerStyle={styles.dropDownContainerStyle}
          placeholder='کدام بسته'
        />
        <Input 
          numeric
          placeholder='درصد افزایش قیمت'
          value={percentage}
          onChangeText={(text: string) => setPercentage(text)}
        />
        <Button text={'اعمال شود'} onPress={onSubmit} />
      </KeyboardAvoidingView>

    </BaseTheme>
  )
}

const styles = StyleSheet.create({
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
  }
})

export default PriceAdjustmentForm