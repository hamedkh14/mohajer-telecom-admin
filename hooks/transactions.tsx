import { useCallback } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import request from "@/Api/axios";

const endpoint = '/collections/transactions/records';
const key = 'Transactions';

export const useGetTransactions = (query:string = '') => {
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

export const useInfiniteTransactions = (userId: string = '') => {
  const {
    isLoading,
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
    queryKey: [key],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await request.get(`${endpoint}?filter=(user_id='${userId}')&expand=remittance_id.user_id,service_request_id.user_id,subscription_id&sort=-created&page=${pageParam}`)
      return result.data; 
    },
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return null;
    },    
    getPreviousPageParam: (firstPage) => {
      return firstPage.page > 1 ? firstPage.page - 1 : null;
    },
    select: useCallback((result: any) => {
      return result.pages.flatMap((page: any) => page.items);
    }, [])
  });

  return { isLoading, isError, error, data, refetch, fetchNextPage, fetchPreviousPage, hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage };
};
