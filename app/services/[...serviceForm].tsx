import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Input from '@/components/Themes/Input'
import LoadingPage from '@/components/Themes/LoadingPage'
import { Sizes, Spacing } from '@/constants/Styles'
import { useCreateService, useGetServices, useUpdateService } from '@/hooks/services'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Toast from 'react-native-toast-message'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const ServiceForm = () => {
  const {serviceForm} = useLocalSearchParams()
  const isEdit = serviceForm && serviceForm[0] !== 'null';

  const {mutateAsync: createService} = useCreateService()
  const {mutateAsync: updateService} = useUpdateService(serviceForm[0])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const [serviceTypeOpen, setServiceTypeOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [operatorOpen, setOperatorOpen] = useState(false);
  const [isSpecialOpen, setIsSpecialOpen] = useState(false);

  const [serviceTypeSelected, setServiceTypeSelected] = useState<any>(null);
  const [countrySelected, setCountrySelected] = useState<any>(null);
  const [operatorSelected, setOperatorSelected] = useState<any>(null);
  const [isSpecialSelected, setIsSpecialSelected] = useState<any>(null);

  const [serviceType, setServiceType] = useState([
    {label: 'شارژ سیم کارت', value: 'recharge'},
    {label: 'بسته اینترنت', value: 'internet'},
    {label: 'بسته الماس', value: 'almas'},
    {label: 'بسته برقرار', value: 'bargarar'},
    {label: 'یوسی پابجی', value: 'uc-pubg'},
  ]);
  const [country, setCountry] = useState([
    {label: 'ایران', value: 'iran'},
    {label: 'افغانستان', value: 'afghanistan'},
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
  const [isSpecial, setIsSpecial] = useState([
    {label: 'بله', value: true},
    {label: 'خیر', value: false},
  ]);
  const {isLoading, isFetching, isError, data} = useGetServices(`?filter=(id='${serviceForm?.[0]}')`)
  const commonDropDownProps: any = {
    rtl: true,
    language: 'FA',
    searchable: true,
    searchPlaceholder: 'جستجو کنید...',
    placeholderStyle: styles.dropDwonPlaceholder,
    textStyle: styles.dropDownText,
  };

  useEffect(() => {
    if(isEdit && data && data[0]) {
      setTitle(data[0].title)
      setPrice(`${data[0].price}`)
      setServiceTypeSelected(data[0].type || null)
      setCountrySelected(data[0].country || null)
      setOperatorSelected(data[0].operator || null)
      setIsSpecialSelected(data[0].isSpecial || null)
    }
  }, [data, isEdit])


  const onSubmit = () => {
    if(title === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن عنوان بسته الزامی است'
      })
      return
    }
    if(price === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن قیمت بسته الزامی است'
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
    if((serviceTypeSelected === 'recharge' || serviceTypeSelected === 'internet') && countrySelected === null) {
      Toast.show({
        type: 'error',
        text1: 'انتخاب کشور الزامی است'
      })
      return
    }
    if((serviceTypeSelected === 'recharge' || serviceTypeSelected === 'internet') && operatorSelected === null) {
      Toast.show({
        type: 'error',
        text1: 'انتخاب اپراتور الزامی است'
      })
      return
    }

    let newCountry = countrySelected
    let newOperator = operatorSelected
    if(serviceTypeSelected !== 'recharge' && serviceTypeSelected !== 'internet') {
      newCountry = null
      newOperator = null
    }

    const data = {
      title,
      type: serviceTypeSelected || '',
      price,
      country: newCountry || '',
      operator: newOperator || '',
      isSpecial: isSpecialSelected || false
    }

    setSubmitLoading(true)

    if(isEdit) {
      updateService(data)
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: 'ویرایش بسته با موفقیت انجام شد!'
        })
  
        resetForm()
      })
      .catch((err) => {
        Toast.show({
          type: 'error',
          text1: 'خطایی سرور',
          text2: 'هنگام انجام عملیات خطایی رخ داده است!'
        })
      })
      .finally(() => {
        setSubmitLoading(false)
      })
      return
    }

    // Create package service
    createService(data)
    .then((res) => {
      Toast.show({
        type: 'success',
        text1: 'افزودن بسته جدید با موفقیت انجام شد!'
      })

      resetForm()
    })
    .catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'خطایی سرور',
        text2: 'هنگام انجام عملیات خطایی رخ داده است!'
      })
    })
    .finally(() => {
      setSubmitLoading(false)
    })
  }

  const resetForm = () => {
    setTitle('')
    setPrice('')
    setServiceTypeSelected(null)
    setCountrySelected(null)
    setOperatorSelected(null)
    setIsSpecialSelected(null)
  }

  if(isEdit && isLoading) {
    return <LoadingPage />
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: isEdit ? 'ویرایش بسته' : 'افزودن بسته جدید'
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, gap: Spacing[2], padding: Spacing[2] }}
      >
        <Input 
          placeholder='عنوان بسته' 
          value={title}
          onChangeText={(text: string) => setTitle(text)}
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
              open={countryOpen}
              value={countrySelected}
              items={country}
              setOpen={setCountryOpen}
              setValue={setCountrySelected}
              setItems={setCountry}
              style={styles.dropDown}
              dropDownContainerStyle={styles.dropDownContainerStyle}
              placeholder='کشور را انتخاب کنید'
            />
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
          open={isSpecialOpen}
          value={isSpecialSelected}
          items={isSpecial}
          setOpen={setIsSpecialOpen}
          setValue={setIsSpecialSelected}
          setItems={setIsSpecial}
          style={styles.dropDown}
          dropDownContainerStyle={styles.dropDownContainerStyle}
          placeholder='بسته ویژه است؟'
        />
        <Input 
          numeric
          placeholder='قیمت بسته به تومان'
          value={price}
          onChangeText={(text: string) => setPrice(text)}
        />
        <Button text={isEdit ? 'ویرایش' : 'افزودن'} onPress={onSubmit} cancel={submitLoading} loading={submitLoading} disabled={submitLoading} />
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

export default ServiceForm