import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Input from '@/components/Themes/Input'
import Loading from '@/components/Themes/Loading'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import { useAuth } from '@/context/authContext'
import { useVerifyUser, verifyAndUpdateToken } from '@/hooks/auth'
import { getToken, saveToken } from '@/utils/secureStore'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

const Logo = () => {
  return (
    <View>
      <Image source={require('../assets/images/logo.png')} style={{width: 100, height: 30}} />
    </View>
  )
}

const LoginPage = () => {
  const [userName, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isCheckingLogged, setIsCheckingLogged] = useState<boolean>(true)

  const { isLoading, isError, error, data, verify } = useVerifyUser(userName, password);

  const {authUser, handleAuthUser} = useAuth();
  const router = useRouter();

  // بررسی اینکه آیا کاربر قبلا وارد حساب کاربری شده است. 
  const handleCheckLogged = async () => {
    if(authUser.isAuthenticated && authUser.user && authUser.user.role === 'admin') {
      // console.info('User is Valid');
      setIsCheckingLogged(false)
      router.replace('/(tabs)')
      return;
    }
    
    const oldToken = await getToken('authToken');

    if(oldToken) {
      const result = await verifyAndUpdateToken(oldToken)
      if(!result?.isError && result?.data && result?.data.record.role === 'admin') {
        await saveToken('authToken', result?.data?.token)
        handleAuthUser({
          isAuthenticated: true,
          user: result?.data?.record
        });
        // console.info('Token is Valid');
        router.replace('/(tabs)');
        setIsCheckingLogged(false)
        return;
      }
    }

    setIsCheckingLogged(false)
  }

  const onLogin = () => {
    if(userName === '' || password === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن تمام فیلدها الزامی است!'
      })
      return
    }

    verify();
  }

  const handleLogin = async () => {
    
    if((isError && data === null) || (data && data?.record.role !== 'admin')) {
      if(error[0] == 400) Toast.show({type: 'error', text1: 'اطلاعات وارد شده نا معتبر است!'})
      else Toast.show({type: 'error', text1: 'خطای سرور', text2: 'هنگام ارسال داده ها خطای رخ داده است!'})
      return;
    }

    if(data) {
      Toast.show({type: 'success', text1: 'احراز هویت با موفقیت انجام شد'})
      await saveToken('authToken', data.token);
      handleAuthUser({
        isAuthenticated: true,
        user: data.record
      })

      router.replace('/(tabs)')
    }

  }

  useEffect(() => {

    if(!isLoading ) handleLogin();

    if(isCheckingLogged) handleCheckLogged();

  }, [isLoading, isError, error, data , isCheckingLogged])

  if(isCheckingLogged) return (
    <BaseTheme
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing[2]
      }}
    >
      <Loading size={56} />
    </BaseTheme>
  )

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        customTitle: <Logo />
      }}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing[2],
      }}
    >
      <View style={styles.bottomBox}>
        <Image source={require('../assets/images/login-image.png')} style={styles.floatingImage} />
        <View style={{flex: 1, width: '100%', gap: Spacing[3]}}>
          <Input placeholder='نام کاربری' value={userName} onChangeText={(text) => setUserName(text)} />
          <Input placeholder='کلمه عبور' value={password} onChangeText={(text) => setPassword(text)} />
          <Button text='وارد شوید' varient='primary' onPress={onLogin} loading={isLoading} disabled={isLoading} cancel={isLoading} />
        </View>
      </View>
    </BaseTheme>
  )
}

const styles = StyleSheet.create({
  floatingImage: {
    marginTop: '-85%',
    width: 350,
    height: 320,
    resizeMode: 'contain',
    zIndex: 1,
  },
  bottomBox: {
    width: '100%',
    height: 340,
    backgroundColor: Colors.elementBackground,
    alignItems: 'center',
    borderRadius: Rounded['lg'],
    padding: Spacing[2],
    paddingTop: 68
  },

})

export default LoginPage