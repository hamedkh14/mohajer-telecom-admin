import ThemedText from '@/components/Themes/ThemedText'
import Colors from '@/constants/Colors'
import { Rounded, Spacing } from '@/constants/Styles'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { BackHandler, Modal, ScrollView, StyleSheet, View } from 'react-native'
import convertDate from '@/utils/convertDate'
import Price from '../Price'
import Button from '../Themes/Button'

interface modalProp {
  open: boolean, 
  onClose: any,
  data: any,
  confirmOpen: any
}

const RemittanceReportModal = ({data, open, onClose, confirmOpen}: modalProp) => {
  const router = useRouter()

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
          <ThemedText type='title' style={{marginBottom: 24}}>جزئیات</ThemedText>
          <ScrollView
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>تاریخ و زمان:</ThemedText>
              <ThemedText type='text'>{convertDate(data?.created)}</ThemedText>
            </View>
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>درخواست کننده:</ThemedText>
              <ThemedText type='text'>{data?.expand?.user_id?.name || 'نامشخص'}</ThemedText>
            </View>
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>{data?.type === 'remittances' ? 'مبلغ' : 'قیمت:'}</ThemedText>
              <Price type='text' price={data?.price || 0} isToman={data?.recipient_city === 'ایران' ? true : false} />
            </View>
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>گیرنده:</ThemedText>
              <ThemedText type='text'>{data?.recipient_name}</ThemedText>
            </View>
            <View style={styles.item}>
              <ThemedText type='caption' style={{fontSize: 16}}>شهر گیرنده:</ThemedText>
              <ThemedText type='text'>{data?.recipient_city}</ThemedText>
            </View>
            {
              data?.recipient_city === 'ایران' &&
              <View style={styles.item}>
                <ThemedText type='caption' style={{fontSize: 16}}>شماره کارت گیرنده:</ThemedText>
                <ThemedText type='text'>{data?.recipient_cardnumber}</ThemedText>
              </View>
            }
          </ScrollView> 
          <View style={{flexDirection: 'row', gap: Spacing[2]}}>
            <Button text={'قبول درخواست'} style={{flex: 1}} onPress={() => confirmOpen([data?.id, 'completed'])} />
            <Button text={'رد درخواست'} cancel onPress={() => confirmOpen([data?.id, 'rejected'])} />
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
    height: '100%',
    backgroundColor: Colors.baseBackground,
    padding: Spacing[2],
    alignItems: 'center',
    gap: Spacing[1]
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

export default RemittanceReportModal