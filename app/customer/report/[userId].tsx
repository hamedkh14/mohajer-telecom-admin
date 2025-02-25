import BaseTheme from '@/components/Themes/BaseTheme'
import Loading from '@/components/Themes/Loading'
import LoadingPage from '@/components/Themes/LoadingPage'
import ThemedText from '@/components/Themes/ThemedText'
import TransactionItem from '@/components/TransactionItem'
import TransactionReportModal from '@/components/TransactionReportModal'
import { Spacing } from '@/constants/Styles'
import { useInfiniteTransactions } from '@/hooks/transactions'
import { useGetOneUser } from '@/hooks/users'
import { transactionServiceList } from '@/utils/servicesList'
import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import Toast from 'react-native-toast-message'

const UserId = () => {
  const {userId} = useLocalSearchParams<any>()
  const [ transactionReportModal, setTransactionReportModal ] = useState(null)
  const {
    data:user
  } = useGetOneUser(userId)
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
  } = useInfiniteTransactions(userId)

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
  
  useEffect(() => {
    if(isError) { 
      Toast.show({
        type: 'error',
        text1: 'خطای سرور',
        text2: 'هنگام اتصال به سرور و بروزرسانی داده ها خطای رخ داده است!'
      })
    }
  })

  if((isLoading && !data && !isError)) {
    return <LoadingPage />
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: user?.name
      }}
    >
      {flatListData.length > 0 ? (
        <FlatList
          data={flatListData}
          renderItem={({ item }) => (
            <TransactionItem 
              position="transaction"
              id={item?.id}
              title={transactionServiceList[item?.transaction_type][item?.service_type] || "نامشخص"}
              price={item?.price}
              service_type={item?.service_type}
              status={item?.status}
              transaction_type={item?.transaction_type}
              date={item?.created}
              onPress={() => setTransactionReportModal({...item})}
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
      ) : !isLoading && (
        <View style={{alignItems: 'center', paddingTop: 30}}><ThemedText type='caption'>هیچ تراکنشی یافت نشد!</ThemedText></View>
      )}

      {(isLoading || isFetchingNextPage || isFetchingPreviousPage) && <Loading />}

      

      <TransactionReportModal 
        open={transactionReportModal != null ? true : false} 
        onClose={() => setTransactionReportModal(null)} 
        data={transactionReportModal} 
      />
    </BaseTheme>
  )
}

const styles = StyleSheet.create({
  flatlist: {
    paddingHorizontal: Spacing[2],
    paddingBottom: Spacing[2],
    gap: Spacing[2]
  }
})

export default UserId