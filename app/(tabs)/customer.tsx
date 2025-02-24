import ChangeStatusUser from '@/components/ChangeStatusUser'
import CustomerItem from '@/components/CustomerItem'
import DeleteUser from '@/components/DeleteUser'
import SearchForm from '@/components/SearchForm'
import BaseTheme from '@/components/Themes/BaseTheme'
import Button from '@/components/Themes/Button'
import Loading from '@/components/Themes/Loading'
import LoadingPage from '@/components/Themes/LoadingPage'
import ThemedText from '@/components/Themes/ThemedText'
import TopUpWallet from '@/components/TopUpWallet'
import UserItemMenu from '@/components/UserItemMenu'
import Colors from '@/constants/Colors'
import { Spacing } from '@/constants/Styles'
import { useInfiniteUsers } from '@/hooks/users'
import { useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { PlusIcon } from 'react-native-heroicons/outline'
import Toast from 'react-native-toast-message'

const Customer = () => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState<any>('')
  const [searchLoading, setSearchLoading] = useState<boolean>(false)
  const [filter, setFilter] = useState(`filter=(role!='admin')&`)
  const {
    isLoading,
    data: users,
    isError,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage
  } = useInfiniteUsers(filter)

  const [confirmDeleteUser, setConfirmDeleteUser] = useState<any>(null)
  const [confirmChangeStatusUser, setConfirmChangeStatusUser] = useState<any>(null)
  const [topUpWallet, setTopUpWallet] = useState<any>(null)
  const [userItemMenu, setUserItemMenu] = useState<any>(null)

  const flatListData: any = users || [];
  
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

  const onSearch = () => {
    let newFilter = '';
    if(!isNaN(searchValue)) newFilter = `filter=(role!='admin'%26%26phoneNumber='${searchValue}')&`
    else newFilter = `filter=(role!='admin'%26%26name ~ '${searchValue}')&`

    if(
        (searchValue === '' && filter === `filter=(role!='admin')&`) || 
        (searchValue !== '' && filter === newFilter)
    ) {
      return
    }
    
    setSearchLoading(true)

    if(searchValue === '') {
      setFilter(`filter=(role!='admin')&`)
    }else {
      setFilter(newFilter)
    }

    refetch()
  }

  useEffect(() => {
    if (!isLoading && !isFetchingNextPage && !isFetchingPreviousPage ) {
      setSearchLoading(false);
    }
  }, [isLoading, isFetchingNextPage, isFetchingPreviousPage , flatListData]);

  useEffect(() => {
    if(isError) { 
      Toast.show({
        type: 'error',
        text1: 'خطای سرور',
        text2: 'هنگام اتصال به سرور و بروزرسانی داده ها خطای رخ داده است!'
      })
    }
  }, [isError])

  if((isLoading && !users && !isError)) {
    return <LoadingPage />
  }

  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        title: 'مشتریان',
        headerAction: <Button 
          varient='iconButton' 
          Icon={PlusIcon}
          iconOptions={{color: Colors.white}}
          style={{backgroundColor: Colors.whiteAlpha2}}
          // onPress={() => {router.push({
          //   pathname: '/customer/[...userForm]',
          //   params: {userForm: ['null']}
          // })}}
        />
      }}
    >
      <SearchForm 
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={onSearch}
        searchLoading={searchLoading}
      />
      {flatListData.length > 0 ? (
        <FlatList
          data={flatListData}
          renderItem={({ item }) => (
            <CustomerItem 
              item={item}
              openMenu={setUserItemMenu}
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
        <View style={{alignItems: 'center', paddingTop: Spacing[5]}}>
          <ThemedText type='caption'>هیچ کاربری یافت نشد!</ThemedText>
        </View>
      )}

      {(isLoading || isFetchingNextPage || isFetchingPreviousPage) && <Loading />}

      <DeleteUser 
        open={!!confirmDeleteUser}
        onClose={() => {setConfirmDeleteUser(null)}}
        item={confirmDeleteUser || ''}
      />

      <ChangeStatusUser 
        open={!!confirmChangeStatusUser}
        onClose={() => {setConfirmChangeStatusUser(null)}}
        item={confirmChangeStatusUser || ''}
      />

      <TopUpWallet 
        open={!!topUpWallet}
        onClose={() => {setTopUpWallet(null)}}
        item={topUpWallet || ''}
      />
      <UserItemMenu 
        open={!!userItemMenu}
        onClose={() => setUserItemMenu(null)}
        item={userItemMenu}
        confirmDelete={setConfirmDeleteUser}
        confirmChangeStatusUser={setConfirmChangeStatusUser}
        topUpWallet={setTopUpWallet}
      />
    </BaseTheme>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[1],
    gap: Spacing[4]
  },
  flatlist: {
    paddingHorizontal: Spacing[2],
    paddingBottom: Spacing[2],
    gap: Spacing[2]
  },
})

export default Customer