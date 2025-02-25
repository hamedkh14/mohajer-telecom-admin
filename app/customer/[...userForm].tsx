import request from '@/Api/axios';
import SuccessModal from '@/components/SuccessModal';
import BaseTheme from '@/components/Themes/BaseTheme';
import Button from '@/components/Themes/Button';
import Input from '@/components/Themes/Input';
import LoadingPage from '@/components/Themes/LoadingPage';
import { Spacing } from '@/constants/Styles';
import { useAuth } from '@/context/authContext';
import { useCreateUser, useGetUsers, useUpdateUser } from '@/hooks/users';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

const UserForm = () => {
  const { userForm } = useLocalSearchParams();
  const isEdit = userForm && userForm[0] !== 'null';

  const router = useRouter();
  const { authUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const { isLoading, isFetching, isError, data } = useGetUsers(`?filter=(id='${userForm?.[0]}')`);
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    fullName: '',
    phone: '',
  });

  useEffect(() => {
    if (isEdit && data && data[0]) {
      setFormData({
        userName: data[0]?.username || '',
        password: '',
        fullName: data[0]?.name || '',
        phone: `0${data[0]?.phoneNumber || ''}`,
      });
    }
  }, [data, isEdit]);

  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const onSubmit = async () => {
    if (formData.userName === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن نام کاربری الزامی است!',
      });
      return;
    }
    if (formData.password === '' && !isEdit) {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن کلمه عبور الزامی است!',
      });
      return;
    }
    if (formData.fullName === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن نام و نام خانوادگی الزامی است!',
      });
      return;
    }
    if (formData.phone === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن شماره تلفن همراه الزامی است!',
      });
      return;
    }
  
    try {
      setLoading(true);
  
      let isDuplicate = false;

      if (!isEdit || (formData.userName !== data[0]?.username || formData.phone !== `0${data[0]?.phoneNumber}`)) {
        const existingUsers = await request.get(
          `/collections/users/records?filter=(username='${formData.userName}' || phoneNumber='${formData.phone}')`
        );

        if (existingUsers.data?.items?.length > 0 && existingUsers.data?.items[0]?.id !== data[0]?.id) {
          isDuplicate = true;
        }
      }
  
      if (isDuplicate) {
        Toast.show({
          type: 'error',
          text1: 'نام کاربری یا شماره تلفن قبلاً ثبت شده است!',
        });
        setLoading(false);
        return;
      }

      // Update User
      if(isEdit) {
        let newData = {
          name: formData.fullName,
          phoneNumber: formData.phone,
          status: true,
          role: 'seller'
        }

        if(formData.password != '') {
          newData = {
            ...newData,
            ...{
              password: formData.password,
              passwordConfirm: formData.password,
            }
          }
        }
        await updateUser({
          item: newData,
          filter: `/${data[0]?.id}`,
          position: 'updateUser',
        });

        setOpenSuccessModal(true);
        return
      }
  

      // Create User
      await createUser({
        username: formData.userName,
        email: `${formData.userName}@mohajertelecom.ir`,
        password: formData.password,
        passwordConfirm: formData.password,
        name: formData.fullName,
        phoneNumber: formData.phone,
        status: true,
        role: 'seller',
        parentId: authUser.user.id,
      });

      setFormData({
        userName: '',
        password: '',
        fullName: '',
        phone: '',
      });
  
      setOpenSuccessModal(true);
    } catch (error) {
      console.error('Error creating/updating user:', error);
      Toast.show({ type: 'error', text1: 'خطا در عملیات!' });
    } finally {
      setLoading(false);
    }
  };
  

  if (isEdit && isError) {
    Toast.show({
      type: 'error',
      text1: 'خطای سرور',
      text2: 'هنگام اتصال به سرور خطایی رخ داده است!',
    });

    router.back();
  }

  if (isEdit && (isLoading || isFetching) && !data) {
    return <LoadingPage />;
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: !isEdit ? 'افزودن مشتری جدید' : (data && data[0]?.name) || '',
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, gap: Spacing[2], padding: Spacing[2] }}
      >
        {
          !isEdit && (
          <>
            <Input
              placeholder='نام کاربری'
              value={formData.userName}
              onChangeText={(text) => setFormData({ ...formData, userName: text })}
            />
            <Input
              placeholder='کلمه عبور'
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
          </>
          )
        }
        
        <Input
          placeholder='نام و نام خانوادگی'
          value={formData.fullName}
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
        />
        <Input
          placeholder='شماره تلفن همراه'
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
        />
        <Button
          text={!isEdit ? 'افزودن' : 'ویرایش'}
          loading={loading}
          cancel={loading}
          disabled={loading}
          onPress={onSubmit}
        />
      </KeyboardAvoidingView>
      <SuccessModal
        open={openSuccessModal}
        onClose={() => {
          !isEdit ? setOpenSuccessModal(false) : router.back()
        }}
        text={isEdit ? `اطلاعات مشتری با موفقیت ویرایش شد!` : `مشتری با موفقیت اضافه شد!`}
      />
    </BaseTheme>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing[2],
    gap: Spacing[3],
  }
});

export default UserForm;
