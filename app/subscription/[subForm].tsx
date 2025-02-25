import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Input from '@/components/Themes/Input'
import LoadingPage from '@/components/Themes/LoadingPage'
import { Sizes, Spacing } from '@/constants/Styles'
import { useCreateSubscription, useGetSubscriptions, useUpdateSubscription } from '@/hooks/subscriptions'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import Toast from 'react-native-toast-message'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const SubForm = () => {
  const {subForm} = useLocalSearchParams<any>()
  const isEdit = subForm && subForm !== 'null';

  const {mutateAsync: createSubscription} = useCreateSubscription()
  const {mutateAsync: updateSubscription} = useUpdateSubscription(subForm)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [days, setDays] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const {isLoading, isFetching, isError, data} = useGetSubscriptions(`?filter=(id='${subForm}')`)

  useEffect(() => {
    if(isEdit && data && data[0]) {
      setTitle(data[0].title)
      setPrice(`${data[0].price}`)
      setDays(`${data[0].days}`)
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

    
    const data = {
      title,
      price,
      days
    }

    setSubmitLoading(true)

    if(isEdit) {
      updateSubscription(data)
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: 'ویرایش اشتراک با موفقیت انجام شد!'
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
    createSubscription(data)
    .then((res) => {
      Toast.show({
        type: 'success',
        text1: 'افزودن اشتراک جدید با موفقیت انجام شد!'
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
    setDays('')
  }

  if(isEdit && isLoading) {
    return <LoadingPage />
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: isEdit ? 'ویرایش اشتراک' : 'افزودن اشتراک جدید'
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, gap: Spacing[2], padding: Spacing[2] }}
      >
        <Input 
          placeholder='عنوان اشتراک' 
          value={title}
          onChangeText={(text: string) => setTitle(text)}
        />
        <Input 
          placeholder='تعداد روز' 
          value={days}
          onChangeText={(text: string) => setDays(text)}
          numeric
        />
        
        <Input 
          numeric
          placeholder='قیمت اشتراک به تومان'
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

export default SubForm