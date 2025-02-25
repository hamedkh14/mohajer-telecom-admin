import request from "@/Api/axios";
import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

const endpoint = '/collections/subscriptions/records';
const endpoint2 = '/collections/user_subscriptions/records';
const key = 'Subscriptions'

export const useGetSubscriptions = (query:string = '') => {
  const {isLoading, isFetching, isError, error, data} = useQuery({
    queryKey: [key, query],
    queryFn: async ({queryKey}) => {
      const response = await request.get(endpoint + queryKey[1]);

      return response.data
    },
    select: (result) => {
      return result.items
    },
    onError: (error) => {
      console.error('Error fetching data:', error); 
    },
  })

  return {isLoading, isFetching, isError, error, data}
}

export const useActiveSubscription = (userId: string) => {
  const currentDate = new Date().toISOString();

  const {isLoading, isFetching, isError, error, data} = useQuery({
    queryKey: [key, userId],
    queryFn: async ({queryKey}) => {
      const response = await request.get(`${endpoint2}?filter=(user_id='${queryKey[1]}'%26%26endDate>='${currentDate}')&perPage=1`);

      return response.data
    },
    select: (result) => {
      return result.items.length > 0 ? result.items[0] : null;
    },
    onError: (error) => {
      console.error('Error fetching data:', error); 
    },
  })

  return {isLoading, isFetching, isError, error, data}
}

export const useCreateUserSubscription = () => {
  const client = useQueryClient();
  let user_wallet_available_balance = 0;
  let user_wallet_locked_balance = 0;
  let requestData = {id: ''};

  const {mutate, mutateAsync} = useMutation({
    mutationFn: async (data: any) => {
      requestData = data;
      const { data: user } = await request.get(`/collections/users/records/${data.user_id}`);
      user_wallet_available_balance = user.wallet_available_balance;
      user_wallet_locked_balance = user.wallet_locked_balance;
      const response = await request.post(endpoint2, data);

      await request.patch(`/collections/users/records/${user.id}`, {
        wallet_available_balance: (Number(user.wallet_available_balance) - Number(data.price))
      })

      await request.post('/collections/transactions/records', {
        user_id: user.id,
        subscription_id: response?.data.id,
        transaction_type: 'withdrawal',
        service_type: 'subscriptions',
        price: data.price,
        status: 'completed'
      });

      return response.data
    },
    onSuccess: () => {
      client.invalidateQueries({queryKey:[key]})
    },
    onError: (error) => {
      console.log('Error fetching data:', error); 
    },
  })
  
  return {mutate, mutateAsync}
}

export const useInfiniteSubscription = (query: string = '') => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    data,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage
  } = useInfiniteQuery({
    queryKey: [key, query],
    queryFn: async ({ pageParam = 1 }) => {
      let filter = ``;
      if(query !== '') {
        filter = `${query}&page=${pageParam}`
      }else {
        filter = `?page=${pageParam}`
      }
      const result = await request.get(`${endpoint}${filter}`)
      return result.data; 
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : null;
    },
    getPreviousPageParam: (firstPage) => {
      return firstPage.page > 1 ? firstPage.page - 1 : null;
    },
    select: useCallback((result: any) => {
      return result.pages.flatMap((page: any) => page.items);
    }, [])
  });

  return { isLoading, isFetching, isError, error, data, refetch, fetchNextPage, fetchPreviousPage, hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage };
}

export const useCreateSubscription = () => {
  const client = useQueryClient();

  const {mutate, mutateAsync} = useMutation({
    mutationFn: async (data: any) => {
      const response = await request.post(endpoint, data);
    },
    onSuccess: () => {
      client.invalidateQueries({queryKey:[key]})
    },
    onError: (error) => {
      console.log('Error fetching data:', error); 
    },
  })
  
  return {mutate, mutateAsync}
}

export const useUpdateSubscription = (id: string) => {
  const client = useQueryClient();

  const {mutate, mutateAsync} = useMutation({
    mutationFn: async (data: any) => {
      const response = await request.patch(`${endpoint}/${id}`, data);
      return response.data
    },
    onSuccess: () => {
      client.invalidateQueries({queryKey:[key]})
    },
    onError: (error) => {
      console.log('Error fetching data:', error); 
    },
  })
  
  return {mutate, mutateAsync}
}