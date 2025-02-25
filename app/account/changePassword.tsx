import ErrorModal from '@/components/ErrorModal'
import SuccessModal from '@/components/SuccessModal'
import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Input from '@/components/Themes/Input'
import { Spacing } from '@/constants/Styles'
import { useAuth } from '@/context/authContext'
import { useUpdateUser } from '@/hooks/users'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

const ChangePassword = () => {
  const router = useRouter()
  const {authUser} = useAuth()
  const [oldPassword, setOldPassword] = useState<string>()
  const [newPassword, setNewPassword] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);

  const {
    mutateAsync
  } = useUpdateUser()

  const onSubmit = () => {
    if(!oldPassword) {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن کلمه عبور قبلی الزامی است!'
      })

      return;
    }

    if(!newPassword) {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن کلمه عبور جدید الزامی است!'
      })

      return;
    }

    const data = {
      item: {
        oldPassword,
        password: newPassword,
        passwordConfirm: newPassword
      },
      filter: `/${authUser.user.id}`,
      position: 'changePassword'
    }

    setLoading(true)
    mutateAsync(data)
      .then(() => {
        setOpenSuccessModal(true);
      })
      .catch((err) => {
        if(err.status == '400') {
          setOpenErrorModal(true)
        }else {
          Toast.show({
            type: 'error',
            text1: 'هنگام انجام عملیات خطای رخ داده است!'
          })
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: 'تغییر کلمه عبور'
      }}
    >
      <View style={{padding: Spacing[2], gap: Spacing[2]}}>
        <Input label='کلمه عبور قبلی' value={oldPassword} onChangeText={(text) => setOldPassword(text)} />
        <Input label='کلمه عبور جدید' value={newPassword} onChangeText={(text) => setNewPassword(text)} />
        <Button text={'تغییر کلمه عبور'} onPress={onSubmit} loading={loading} disabled={loading} cancel={loading}  />
      </View>
      <SuccessModal open={openSuccessModal} onClose={() => {router.replace('/')}} text={`کلمه عبور شما با موفقیت تغییر کرد. لطفا دوباره وارد حساب کاربری خود شوید!`} />
      <ErrorModal open={openErrorModal} onClose={() => {setOpenErrorModal(false)}} text={`کلمه عبور قبلی شما اشتباه است`} />
    </BaseTheme>
  )
}

export default ChangePassword