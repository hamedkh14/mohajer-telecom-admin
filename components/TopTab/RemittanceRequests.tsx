import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import BaseTheme from '../Themes/BaseTheme'
import Toast from 'react-native-toast-message'
import LoadingPage from '../Themes/LoadingPage'
import { Spacing } from '@/constants/Styles'
import Loading from '../Themes/Loading'
import ServiceRequestItem from '../ServiceRequestItem'
import ThemedText from '../Themes/ThemedText'
import ConfirmRequestServiceModal from '../ConfirmRequestServiceModal'
import { useApproveRemittance, useInfiniteRemittances, useRejectRemittance } from '@/hooks/remittances'
import RemittanceReportModal from '../RemittanceReportModal'

const RemittanceRequests = () => {
  const [ remittanceReportModal, setRemittanceReportModal ] = useState<any>(null)
  const [confirmOpen, setConfirmOpen] = useState(null)
  const [rejectedDesc, setRejectedDesc] = useState('')
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const {
    isLoading,
    data,
    isError,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage
  } = useInfiniteRemittances(`?filter=(status='pending')&expand=user_id,service_id`)
  const {mutateAsync: approveRemittance} = useApproveRemittance()
  const {mutateAsync: rejectRemittance} = useRejectRemittance()

  const flatListData: any = data || [];

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const onStartReached = useCallback(() => {
    if (hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage()
    }
  }, [hasPreviousPage, isFetchingPreviousPage, fetchPreviousPage])

  const onSubmit = () => {
    if(!confirmOpen || !remittanceReportModal) return;

    setSubmitLoading(true)

    if(confirmOpen[1] === 'completed') {
      approveRemittance({
        remittanceId: remittanceReportModal?.id, 
        userId: remittanceReportModal?.user_id, 
        price: remittanceReportModal?.price,
        info: remittanceReportModal?.information,
        city: remittanceReportModal?.recipient_city
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'عملیات با موفقیت انجام شد!'
        })
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'هنگام انجام عملیات خطایی رخ داد!'
        })
      })
      .finally(() => {
        setSubmitLoading(false)
        setConfirmOpen(null)
        setRemittanceReportModal(null)
      })
    }else {
      if(rejectedDesc === '') {
        setSubmitLoading(false)
        return;
      }
      
      rejectRemittance({
        remittanceId: remittanceReportModal?.id, 
        rejectedDesc
      })
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'عملیات با موفقیت انجام شد!'
        })
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: 'هنگام انجام عملیات خطایی رخ داد!'
        })
      })
      .finally(() => {
        setSubmitLoading(false)
        setConfirmOpen(null)
        setRemittanceReportModal(null)
      })
    }
  }

  useEffect(() => {
    if(isError) {
      Toast.show({
        type: 'error',
        text1: 'خطای سرور',
        text2: 'هنگام اتصال به سرور خطای رخ داده است!'
      })
    }
  }, [])

  if((isLoading)) {
    return <LoadingPage />
  }

  return (
    <BaseTheme>
      {flatListData && flatListData.length > 0 ? (
        <FlatList
          data={flatListData}
          renderItem={({ item }) => (
            <ServiceRequestItem
              id={item?.id}
              title={item?.expand?.user_id?.name}
              price={item?.price}
              isToman={item?.recipient_city === 'ایران' ? true : false}
              service_type={item?.type}
              user={''}
              date={item?.created}
              onPress={() => setRemittanceReportModal({...item})}
            />
          )}
          keyExtractor={(item, index) => `${item.id}-${index}-${item.created}`}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatlist}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          onRefresh={() => {refetch()}}
          refreshing={isFetchingNextPage || isFetchingPreviousPage}
          onScrollToTop={onStartReached}
        />
      ) : (
        <View style={{alignItems: 'center', paddingHorizontal: Spacing[2], flex: 1, justifyContent: 'center'}}><ThemedText type='caption'>درخواست حواله جدید ندارید!</ThemedText></View>
      )}
      
      {/* نمایش لودینگ */}
      {(isLoading || isFetchingNextPage || isFetchingPreviousPage) && <Loading />}

      <RemittanceReportModal 
        open={!!remittanceReportModal}
        onClose={() => setRemittanceReportModal(null)}
        data={remittanceReportModal}
        confirmOpen={setConfirmOpen}
      />
      <ConfirmRequestServiceModal 
        open={!!confirmOpen}
        onClose={() => {setConfirmOpen(null)}}
        data={confirmOpen}
        onSubmit={onSubmit}
        submitLoading={submitLoading}
        rejectedDesc={rejectedDesc}
        handleRejectedDesc={setRejectedDesc}
      />
    </BaseTheme>
  )
}

const styles = StyleSheet.create({
  flatlist: {
    paddingHorizontal: Spacing[1],
    paddingVertical : Spacing[2]
  }
})

export default RemittanceRequests