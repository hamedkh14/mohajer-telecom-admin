import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Input from '@/components/Themes/Input'
import LoadingPage from '@/components/Themes/LoadingPage'
import { Spacing } from '@/constants/Styles'
import { useAuth } from '@/context/authContext'
import { useCreateSetting, useGetSettings, useUpdateSetting } from '@/hooks/setting'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import Toast from 'react-native-toast-message'

const Settings = () => {
  const {authUser} = useAuth()
  const [afghaniToToman, setAfghaniToToman] = useState('')
  const [remittancePrice, setRemittancePrice] = useState('')
  const [remittancePriceText, setRemittancePriceText] = useState('')
  const [numberCard, setNumberCard] = useState('')
  const [whatsappPhoneNumber, setWhatsappPhoneNumber] = useState('')
  const [remittanceCities, setRemittanceCities] = useState('')
  const [fetchLoading, setFetchLoading] = useState<boolean>(false)
  const {mutateAsync: createSetting} = useCreateSetting()
  const {mutateAsync: updateSetting} = useUpdateSetting()

  const {
    isLoading,
    isError,
    data
  } = useGetSettings(`?filter=(user_id='${authUser.user.id}')`)

  const onSubmit = () => {
    if(afghaniToToman === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن قیمت هر افغانی به تومان الزامی است!'
      })
      return
    }
    if(remittancePrice === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن قیمت هر افغانی به تومان برای حواله الزامی است!'
      })
      return
    }
    if(whatsappPhoneNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن شماره واتساپ پشتیبانی الزامی است!'
      })
      return
    }
    if(remittanceCities === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن لیست شهرها الزامی است!'
      })
      return
    }

    const citiesArray = remittanceCities
      .split("\n")
      .map(city => city.trim())
      .filter(city => city)
      .map(city => ({ label: city, value: city }));
    
    setFetchLoading(true)

    if(data) {
      const newData = {
        id: data?.id,
        item: {
          afghani_to_toman: afghaniToToman,
          remittance_cities: citiesArray,
          remittance_price: remittancePrice,
          remittance_price_text : remittancePriceText,
          numberCard: numberCard,
          whatsappPhoneNumber: whatsappPhoneNumber
        }
      }

      updateSetting(newData)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'ثبت تنظیمات با موفقیت انجام شد!'
        })
      })
      .catch(() => {

        Toast.show({
          type: 'error',
          text1: 'خظایی سرور',
          text2: 'هنگام انجام عملیات خطایی رخ داده است!'
        })
      })
      .finally(() => {
        setFetchLoading(false)
      })

      return;
    }

    const newData = {
      user_id: authUser.user.id,
      afghani_to_toman: afghaniToToman,
      remittance_cities: citiesArray,
      remittance_price: remittancePrice,
      remittance_price_text : remittancePriceText,
      numberCard: numberCard,
      whatsappPhoneNumber: whatsappPhoneNumber,
      isAdmin: true
    }

    createSetting(newData)
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'ثبت تنظیمات با موفقیت انجام شد!'
      })
    })
    .catch(() => {
      Toast.show({
        type: 'error',
        text1: 'خظایی سرور',
        text2: 'هنگام انجام عملیات خطایی رخ داده است!'
      })
    })
    .finally(() => {
      setFetchLoading(false)
    })
  }

  useEffect(() => {
    if(isError) {
      Toast.show({
        type: 'error',
        text1: 'خطای سرور',
        text2: 'هنگام اتصال به سرور و بروزرسانی داده ها خطای رخ داده است!'
      })
    }
    if(data) {
      const formattedCities = data?.remittance_cities
          .map((city: any) => city.label)
          .join("\n");

      setAfghaniToToman(`${data?.afghani_to_toman}`)
      setNumberCard(`${data?.numberCard > 0 ? data?.numberCard : ''}`)
      setRemittanceCities(`${formattedCities}`)
      setRemittancePrice(`${data?.remittance_price}`)
      setRemittancePriceText(`${data?.remittance_price_text}`)
      setWhatsappPhoneNumber(`0${data?.whatsappPhoneNumber}`)
    }
  }, [isError, data])

  if(isLoading) return <LoadingPage />
  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: 'تنظیمات'
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={{ gap: Spacing[2], paddingHorizontal: Spacing[2], paddingBottom: Spacing[2] }}>
            <Input label='قیمت هر افغانی به تومان' value={afghaniToToman} onChangeText={(text) => setAfghaniToToman(text)} />
            <Input label='قیمت هر افغانی به تومان (حواله)' value={remittancePrice} onChangeText={(text) => setRemittancePrice(text)} />
            <Input label='قیمت حواله برای نمایش به مشتری' value={remittancePriceText} onChangeText={(text) => setRemittancePriceText(text)} />
            <Input label='شماره کارت' numeric value={numberCard} onChangeText={(text) => setNumberCard(text)} />
            <Input label='شماره واتساپ پشتیبانی' numeric value={whatsappPhoneNumber} onChangeText={(text) => setWhatsappPhoneNumber(text)} />
            <Input label='لیست شهرها' multiline value={remittanceCities} onChangeText={(text) => setRemittanceCities(text)} />
            <Button text={'ثبت'} loading={fetchLoading} disabled={fetchLoading} cancel={fetchLoading} onPress={onSubmit} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </BaseTheme>
  )
}

export default Settings