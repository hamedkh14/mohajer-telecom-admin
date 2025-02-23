import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import BaseTheme from '../Themes/BaseTheme'
import { useApproveServiceRequest, useInfiniteServiceRequest, useRejectServiceRequest } from '@/hooks/serviceRequest'
import Toast from 'react-native-toast-message'
import LoadingPage from '../Themes/LoadingPage'
import { Spacing } from '@/constants/Styles'
import Loading from '../Themes/Loading'
import ServiceRequestItem from '../ServiceRequestItem'
import ThemedText from '../Themes/ThemedText'
import ServiceRequestReportModal from '../ServiceRequestReportModal'
import ConfirmRequestServiceModal from '../ConfirmRequestServiceModal'

const ServiceRequests = () => {
  const [ serviceRequestReportModal, setServiceRequestReportModal ] = useState<any>(null)
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
  } = useInfiniteServiceRequest(`?filter=(status='pending')&expand=user_id,service_id`)
  const {mutateAsync: approveServiceRequest} = useApproveServiceRequest()
  const {mutateAsync: rejectServiceRequest} = useRejectServiceRequest()

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
    if(!confirmOpen || !serviceRequestReportModal) return;

    setSubmitLoading(true)

    if(confirmOpen[1] === 'completed') {
      approveServiceRequest({
        requestId: serviceRequestReportModal?.id, 
        userId: serviceRequestReportModal?.user_id, 
        price: serviceRequestReportModal?.price,
        info: serviceRequestReportModal?.information
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
        setServiceRequestReportModal(null)
      })
    }else {
      if(rejectedDesc === '') {
        setSubmitLoading(false)
        return;
      }
      rejectServiceRequest({
        requestId: serviceRequestReportModal?.id, 
        userId: serviceRequestReportModal?.user_id, 
        price: serviceRequestReportModal?.price,
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
        setServiceRequestReportModal(null)
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
              title={item?.title || "نامشخص"}
              price={item?.price}
              service_type={item?.type}
              user={item?.expand?.user_id?.name}
              date={item?.created}
              onPress={() => setServiceRequestReportModal({...item})}
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
        <View style={{alignItems: 'center', paddingHorizontal: Spacing[2], flex: 1, justifyContent: 'center'}}><ThemedText type='caption'>درخواست سرویس جدید ندارید!</ThemedText></View>
      )}
      
      {/* نمایش لودینگ */}
      {(isLoading || isFetchingNextPage || isFetchingPreviousPage) && <Loading />}

      <ServiceRequestReportModal 
        open={!!serviceRequestReportModal}
        onClose={() => setServiceRequestReportModal(null)}
        data={serviceRequestReportModal}
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

export default ServiceRequests