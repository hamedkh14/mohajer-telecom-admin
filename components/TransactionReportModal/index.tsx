import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import React, { useEffect, useState } from 'react'
import { BackHandler, Modal, ScrollView, StyleSheet, View } from 'react-native'
import convertDate from '@/utils/convertDate'
import Price from '../Price'
import { TransactionStatus } from '../TransactionStatus'
import request from '@/Api/axios'
import { transactionServiceList } from '@/utils/servicesList'

interface modalProp {
  open: boolean, 
  onClose: any,
  data: any
}

const handleTitle = (data: any) => {
  let title = 'نامشخص';

  if (!data || !data?.expand || (!data.expand.service_request_id && !data.expand.remittance_id && !data.expand.subscription_id)) {
    title = transactionServiceList?.[data?.transaction_type]?.[data?.service_type] || 'نامشخص';
  } else {
    if (data.expand?.service_request_id?.title) {
      title = data.expand.service_request_id.title;
    } else if (data.expand?.remittance_id) {
      title = 'حواله';
    } else if (data.expand?.subscription_id?.title) {
      title = data.expand.subscription_id.title;
    } else {
      title = 'نامشخص';
    }
  }

  return title;
}

const Details = ({data, userInfo}: {data: any, userInfo: any}) => {
  if(data?.service_type === 'uc-pubg') {
    return (
      <>
        <View style={styles.item}>
          <ThemedText type='caption' style={{fontSize: 16}}>نام اکانت:</ThemedText>
          <ThemedText type='text'>{data?.expand.service_request_id.information.accountName}</ThemedText>
        </View>
        <View style={styles.item}>
          <ThemedText type='caption' style={{fontSize: 16}}>آیدی اکانت:</ThemedText>
          <ThemedText type='text'>{data?.expand.service_request_id.information.accountId}</ThemedText>
        </View>
      </>
    )
  }

  if(data?.service_type === 'recharge' || data?.service_type === 'internet' || data?.service_type === 'almas' || data?.service_type === 'bargarar') {
    return (
      <View style={styles.item}>
        <ThemedText type='caption' style={{fontSize: 16}}>شماره موبایل:</ThemedText>
        <ThemedText type='text'>{data?.expand?.service_request_id?.information?.mobile}</ThemedText>
      </View>
    )
  }

  if(data?.service_type === 'remittances') {
    return (
      <>
        <View style={styles.item}>
          <ThemedText type='caption' style={{fontSize: 16}}>گیرنده:</ThemedText>
          <ThemedText type='text'>{data?.expand.remittance_id.recipient_name}</ThemedText>
        </View>
        <View style={styles.item}>
          <ThemedText type='caption' style={{fontSize: 16}}>شهر گیرنده:</ThemedText>
          <ThemedText type='text'>{data?.expand.remittance_id.recipient_city}</ThemedText>
        </View>
        {
          data?.recipient_city === 'ایران' &&
          <View style={styles.item}>
            <ThemedText type='caption' style={{fontSize: 16}}>شماره کارت گیرنده:</ThemedText>
            <ThemedText type='text'>{data?.recipient_cardnumber}</ThemedText>
          </View>
        }
      </>
    )
  }

  if(data?.service_type === 'subCustomerWalletTopUp' && userInfo) {
    return (
      <View style={styles.item}>
        <ThemedText type='caption' style={{fontSize: 16}}>نام و نام خانوادگی مشتری:</ThemedText>
        <ThemedText type='text'>{userInfo?.name}</ThemedText>
      </View>
    )
  }

  if(data?.service_type === 'sellerProfit' && data?.remittance_id) {
    return (
      <View style={styles.item}>
        <ThemedText type='caption' style={{fontSize: 16}}>مشتری:</ThemedText>
        <ThemedText type='text'>{data?.expand?.remittance_id?.expand?.user_id?.name}</ThemedText>
      </View>
    )
  }

  if(data?.service_type === 'sellerProfit' && data?.service_request_id) {
    return (<>
      <View style={styles.item}>
        <ThemedText type='caption' style={{fontSize: 16}}>مشتری:</ThemedText>
        <ThemedText type='text'>{data?.expand?.service_request_id?.expand?.user_id?.name}</ThemedText>
      </View>
      <View style={styles.item}>
        <ThemedText type='caption' style={{fontSize: 16}}>بابت:</ThemedText>
        <ThemedText type='text'>{data?.expand?.service_request_id?.title}</ThemedText>
      </View>
    </>)
  }

  return (
    <View style={{alignItems: 'flex-end', gap: Spacing[2]}}></View>
  )
}

const TransactionReportModal = ({data, open, onClose}: modalProp) => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const getUserInfo = async () => {
    if(data?.service_type === 'subCustomerWalletTopUp') {
      try {
        const res = await request.get(`/collections/users/records/${data?.description.customerId}`)

        if(res.data) {
          setUserInfo(res.data)
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }
  }

  useEffect(() => {
    getUserInfo()

    const handleBackPress = () => {
      if (open) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [open, data])

  return (
    <Modal  
      animationType="slide" 
      transparent
      visible={open}
      onRequestClose={() => onClose()}
    >
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <ThemedText type='title' style={{marginBottom: 24}}>جزئیات</ThemedText>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>تاریخ و زمان:</ThemedText>
              <ThemedText type='text'>{convertDate(data?.created)}</ThemedText>
            </View>
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>عنوان:</ThemedText>
              <ThemedText type='text'>{handleTitle(data)}</ThemedText>
            </View>
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>{data?.type === 'remittances' ? 'مبلغ' : 'قیمت:'}</ThemedText>
              <Price type={data?.transaction_type} price={data?.price || 0} />
            </View>
            {
              data?.transaction_type === 'withdrawal' && (
                <View style={styles.item}>
                  <ThemedText type='caption' style={{fontSize: 16}}>وضعیت درخواست:</ThemedText>
                  <TransactionStatus status={data?.status} style={styles.status} />
                </View>
              )
            }

            <Details data={data} userInfo={userInfo} />

            {data?.description?.desc && (
              <View style={{alignItems: 'flex-end', gap: Spacing[2]}}>
                <ThemedText type='caption'>توضیحات:</ThemedText>
                <ThemedText type='caption' style={{textAlign: 'right', color: Colors.text}}>{data?.description?.desc}</ThemedText>
              </View>
            )}
          </ScrollView> 
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
    maxHeight: '60%',
    backgroundColor: Colors.elementBackground,
    borderTopLeftRadius: Rounded['3xl'],
    borderTopRightRadius: Rounded['3xl'],
    padding: Spacing[2],
    alignItems: 'center',
    gap: Spacing[3]
  },
  item: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing[2]
  },
  status: {
    backgroundColor: Colors.whiteAlpha2, 
    borderRadius: Rounded['2xl'], 
    paddingHorizontal: Spacing[1], 
    paddingVertical: 3
  }
})

export default TransactionReportModal