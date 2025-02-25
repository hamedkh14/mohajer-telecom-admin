import request from "@/Api/axios";
import { useAuth } from "@/context/authContext";
import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

const endpoint = '/collections/services/records';
const key = 'Services';



export const useGetServices = (query:string = '') => {
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

export const useInfiniteService = (query: string = '') => {
  const {authUser} = useAuth()
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
      // const result = await request.get(`${endpoint}?filter=(user_id='${authUser.user.id}')&expand=remittance_id,service_request_id,subscription_id&sort=-created&page=${pageParam}`)
      
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

export const useCreateService = () => {
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

export const useUpdateService = (id: string) => {
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