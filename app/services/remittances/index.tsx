import ServiceRequestReportModal from '@/components/ServiceRequestReportModal'
import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import LoadingPage from '@/components/Themes/LoadingPage'
import TransactionItem from '@/components/TransactionItem'
import Colors from '@/constants/Colors'
import { Spacing } from '@/constants/Styles'
import { useAuth } from '@/context/authContext'
import { useGetRemittances } from '@/hooks/remittances'
import React, { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { PlusIcon } from 'react-native-heroicons/outline'
import Toast from 'react-native-toast-message'

const RemittancesService = () => {
  const {authUser} = useAuth()
  const [ serviceRequestReportModal, setServiceRequestReportModal ] = useState(null)
  const {isLoading, isFetching, isError, error, data} = useGetRemittances(`?filter=user_id='${authUser.user.id}'&sort=-created`)

  if(isError) {
    Toast.show({
      type: 'error',
      text1: 'خطای سرور',
      text2: 'هنگام اتصال به سرور و بروزرسانی داده ها خطای رخ داده است!'
    })
  }

  if((isLoading && !data && !isError)) {
    return <LoadingPage />
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: 'حواله',
        headerAction: <Button 
                        varient='iconButton' 
                        Icon={PlusIcon} 
                        iconOptions={{color: Colors.white}}
                        style={{
                          backgroundColor: Colors.whiteAlpha2
                        }}
                        href={'/services/remittances/addRemittances'}
                      />
      }}
    >
      <FlatList 
        data={data ?? []}
        renderItem={({item}) => <TransactionItem
                                  position='report' 
                                  id={item?.id} 
                                  title={item?.recipient_name}
                                  price={item?.price} 
                                  service_type='remittances'
                                  status={item?.status}
                                  transaction_type='withdrawal'
                                  date={item?.created}
                                  onPress={() => setServiceRequestReportModal({...item, title: 'حواله', type:'remittances'})}
                                />}
        keyExtractor={item => item.id}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true} 
        contentContainerStyle={{paddingHorizontal: Spacing[2], paddingBottom: Spacing[2]}}
      />

      <ServiceRequestReportModal 
        open={serviceRequestReportModal != null ? true : false} 
        onClose={() => setServiceRequestReportModal(null)} 
        data={serviceRequestReportModal} 
        confirmOpen={() => {}}
      />
    </BaseTheme>
  )
}

const styles = StyleSheet.create({
})
export default RemittancesService