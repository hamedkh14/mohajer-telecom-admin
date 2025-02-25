import SuccessModal from '@/components/SuccessModal'
import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Input from '@/components/Themes/Input'
import Colors from '@/constants/Colors'
import { Sizes, Spacing } from '@/constants/Styles'
import { useAuth } from '@/context/authContext'
import { useSaveRemittances } from '@/hooks/remittances'
import { useGetSettings } from '@/hooks/setting'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message'


const AddRemittances = () => {
  const {authUser} = useAuth()
  const router = useRouter()
  const {mutate, mutateAsync} = useSaveRemittances()
  const {isLoading, isFetching, isError, error, data:setting} = useGetSettings();
  const [open, setOpen] = useState(false);
  const [citySelected, setCitySelected] = useState(null);
  const [fullName, setFullName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [remittance_cities, setRemittance_cities] = useState([
    {label: 'ایران', value: 'ایران'},
  ]);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [openSuccessModal, setOpenSuccessModal] = useState<boolean>(false);

  useEffect(() => {

    if(isError) {
      Toast.show({
        type: 'error',
        text1: 'خطای سرور',
        text2: 'هنگام اتصال به سرور و بروزرسانی داده ها خطای رخ داده است!'
      })
    }

    const handleItems = () => {
      if(setting) {
        setRemittance_cities([{label: 'ایران', value: 'ایران'}, ...setting?.remittance_cities])
      }
    }

    handleItems()

  }, [isLoading, isFetching, isError, error, setting])
  
  const onSubmit = () => {
    if(fullName === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن نام و نام خانوادگی الزامی است!'
      })

      return;
    }

    if(!citySelected) {
      Toast.show({
        type: 'error',
        text1: 'لطفا انتخاب کنید به کجا حواله می کنید!'
      })

      return;
    }
    
    if(citySelected === 'ایران' && cardNumber === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن شماره کارت گیرنده الزامی است!'
      })

      return;
    }
    
    if(price === '') {
      Toast.show({
        type: 'error',
        text1: 'وارد کردن مبلغ حواله الزامی است!'
      })

      return;
    }

    setFetchLoading(true); 
    const newData = {
      user_id: authUser.user?.id,
      recipient_name: fullName,
      recipient_city: citySelected,
      recipient_cardnumber: cardNumber,
      price,
      description,
      status: 'pending'
    }
    mutateAsync(newData)
    .then((res) => {
      setOpenSuccessModal(true);
    })
    .catch((err) => {
      Toast.show({
        type: 'error',
        text1: 'خطای سرور',
        text2: 'هنگام انجام عملیات خطای رخ داده است!'
      })
    })
    .finally(() => {
      setFetchLoading(false); 
    })
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: 'ثبت حواله جدید'
      }}
    >
      <View style={{paddingHorizontal: Spacing[2], paddingTop: Spacing[2], gap: Spacing[2]}}>
        <Input placeholder='نام و نام خانوادگی گیرنده' value={fullName} onChangeText={(text) => {setFullName(text)}} />
        <DropDownPicker
          rtl={true}
          language='FA'
          open={open}
          value={citySelected}
          items={remittance_cities}
          setOpen={setOpen}
          setValue={setCitySelected}
          setItems={setRemittance_cities}
          searchable
          style={{backgroundColor: Colors.white, height: 56, borderWidth: 0}}
          dropDownContainerStyle={{backgroundColor: Colors.white, borderWidth: 0, borderTopWidth: 1, borderColor: Colors.blackAlpha2}}
          placeholder='به کجا حواله می کنید؟'
          searchPlaceholder='جستجو کنید...'
          placeholderStyle={{
            textAlign: 'right',
            fontSize: Sizes.base,
            fontFamily: 'Yekan-Medium',
            color: 'gray'
          }}
          textStyle={{
            textAlign: 'right',
            fontSize: 16,
            color: '#333333',
            fontFamily: 'Yekan-Medium',
          }}
        />
        {
          citySelected && citySelected === 'ایران' && <Input numeric placeholder='شماره کارت گیرنده' value={cardNumber} onChangeText={(text) => {setCardNumber(text)}} />
        }
        <Input numeric placeholder='مبلغ حواله را به تومان وارد کنید' value={price} onChangeText={(text) => {setPrice(text)}} />
        <Input multiline placeholder='توضیحات' value={description} onChangeText={(text) => {setDescription(text)}} />
        <Button text='ثبت حواله' onPress={onSubmit} loading={fetchLoading} disabled={fetchLoading} cancel={fetchLoading} />
      </View>

      <SuccessModal open={openSuccessModal} onClose={() => {router.back()}} text={`ثبت درخواست حواله شما با موفقیت انجام گردید`} />
    </BaseTheme>
  )
}

export default AddRemittances