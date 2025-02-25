import BaseTheme from '@/components/Themes/BaseTheme'
import { FlatList, StyleSheet, View } from 'react-native';
import ThemedText from '@/components/Themes/ThemedText';
import { Spacing } from '@/constants/Styles';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useCallback, useEffect, useState } from 'react';
import DeleteService from '@/components/DeleteService';
import ServiceItemMenu from '@/components/ServiceItemMenu';
import Loading from '@/components/Themes/Loading';
import ServiceItem from '@/components/ServiceItem';
import SearchForm from '@/components/SearchForm';
import Button from '@/components/Themes/Button';
import { PlusIcon } from 'react-native-heroicons/outline';
import { useInfiniteService } from '@/hooks/services';

const InternetService = () => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState<any>(null)
  const [deleteOpen, setDeleteOpen] = useState<any>(null)
  const [searchValue, setSearchValue] = useState<any>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [filter, setFilter] = useState(`?filter=(type='internet'%26%26isDelete=false)`)
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
   } = useInfiniteService(filter);
  
  
  const flatListData: any = data || [];

  const onSearch = () => {
    if(
        (searchValue === '' && filter === `?filter=(type='internet'%26%26isDelete=false)`) || 
        (searchValue !== '' && filter === `?filter=(type='internet'%26%26isDelete=false%26%26title ~ '${searchValue}')`)
    ) {
      return
    }
    
    setSearchLoading(true)

    if(searchValue === '') {
      setFilter(`?filter=(type='internet'%26%26isDelete=false)`)
    }else {
      setFilter(`?filter=(type='internet'%26%26isDelete=false%26%26title ~ '${searchValue}')`)
    }

    refetch()
  }

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && !isFetchingPreviousPage ) {
      setSearchLoading(false);
    }
  }, [isLoading, isFetchingNextPage, isFetchingPreviousPage , flatListData]);



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
        title: 'بسته اینترنت',
        headerAction: <Button 
                        varient='iconButton' 
                        Icon={PlusIcon} 
                        iconOptions={{color: Colors.white}} 
                        style={{
                          backgroundColor: Colors.whiteAlpha2
                        }}
                        onPress={() => router.push({
                          pathname: '/services/[...serviceForm]' as any,
                          params: {serviceForm: ['null']}
                        })}
                      />
      }}
    >
      <SearchForm 
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={onSearch}
        searchLoading={searchLoading}
      />

      {/* Display Item */}
      {
        flatListData && flatListData.length > 0 ? (
          <FlatList
            data={flatListData}
            renderItem={({ item }) => (
              <ServiceItem
                price={item?.price}
                item={item}
                openMenu={setMenuOpen}
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
        ) : !searchLoading && (
          <View style={{alignItems: 'center', paddingTop: Spacing[5]}}>
            <ThemedText type='caption'>هیچ بسته ای یافت نشد!</ThemedText>
          </View>
        )
      }

      {/* نمایش لودینگ */}
      {!searchLoading && (isLoading || isFetchingNextPage || isFetchingPreviousPage) && <Loading />}

      <ServiceItemMenu 
        open={!!menuOpen}
        onClose={() => setMenuOpen(null)}
        item={menuOpen}
        confirmDelete={setDeleteOpen}
      />

      <DeleteService 
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
    paddingBottom: Spacing[2]
  },
})

export default InternetService