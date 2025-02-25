import BaseTheme from '@/components/Themes/BaseTheme'
import { FlatList, StyleSheet, View } from 'react-native';
import { Spacing } from '@/constants/Styles';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import Button from '@/components/Themes/Button';
import { PlusIcon } from 'react-native-heroicons/outline';
import Colors from '@/constants/Colors';
import ThemedText from '@/components/Themes/ThemedText';
import Loading from '@/components/Themes/Loading';
import { useInfiniteSubscription } from '@/hooks/subscriptions';
import SubscriptionItem from '@/components/SubscriptionItem';
import SubscriptionItemMenu from '@/components/SubscriptionItemMenu';
import SubscriptionDelete from '@/components/SubscriptionDelete';

const Subscription = () => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState<any>(null)
  const [deleteOpen, setDeleteOpen] = useState<any>(null)
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
   } = useInfiniteSubscription(`?filter=(isDelete=false)`);
  
  
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
  }, [isError])

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: 'اشتراک',
        headerAction: <Button 
                        varient='iconButton' 
                        Icon={PlusIcon} 
                        iconOptions={{color: Colors.white}} 
                        style={{
                          backgroundColor: Colors.whiteAlpha2
                        }}
                        onPress={() => router.push({
                          pathname: '/subscription/[subForm]' as any,
                          params: {subForm: ['null']}
                        })}
                      />
      }}
    >

      {/* Display Item */}
      {
        flatListData && flatListData.length > 0 ? (
          <FlatList
            data={flatListData}
            renderItem={({ item }) => (
              <SubscriptionItem
                item={item}
                onSelecting={setMenuOpen}
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
        ) : (!isLoading && !isFetchingNextPage && !isFetchingPreviousPage) && (
          <View style={{alignItems: 'center', paddingTop: Spacing[5]}}>
            <ThemedText type='caption'>هیچ موردی یافت نشد!</ThemedText>
          </View>
        )
      }

      {/* نمایش لودینگ */}
      {(isLoading || isFetchingNextPage || isFetchingPreviousPage) && <Loading />}

      <SubscriptionItemMenu 
        open={!!menuOpen}
        onClose={() => setMenuOpen(null)}
        item={menuOpen}
        confirmDelete={setDeleteOpen}
      />

      <SubscriptionDelete 
        open={!!deleteOpen}
        onClose={() => setDeleteOpen(null)}
        item={deleteOpen}
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

export default Subscription