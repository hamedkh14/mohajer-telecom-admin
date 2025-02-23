import request from "@/Api/axios";
import { useAuth } from "@/context/authContext";
import { deleteToken } from "@/utils/secureStore";
import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

const endpoint = '/collections/users/records'
const key = 'Users'

export const useGetOneUser = (userId: string = '') => {
  const {isLoading, isFetching, isError, error, data} = useQuery({
    queryKey: [key, userId],
    queryFn: async ({queryKey}) => {
      const response = await request.get(`${endpoint}/${queryKey[1]}`);

      return response.data
    },
    onError: (error) => {
      console.error('Error fetching data:', error); 
    },
    cacheTime: 0
  })

  return {isLoading, isFetching, isError, error, data}
}

export const useGetUsers = (query: string = '') => {
  const {isLoading, isFetching, isError, error, data} = useQuery({
    queryKey: [key, query],
    queryFn: async ({queryKey}) => {
      const response = await request.get(endpoint + queryKey[1]);

      return response.data
    },
    select: useCallback((result: any) => {
      return result.items
    }, []),
    onError: (error) => {
      console.error('Error fetching data:', error); 
    },
    cacheTime: 0
  })

  return {isLoading, isFetching, isError, error, data}
}

export const useCreateUser = () => {
  const client = useQueryClient();

  const {mutate, mutateAsync} = useMutation({
    mutationFn: async (data: any) => {
      const response = await request.post(endpoint, data);

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

export const useUpdateUser = () => {
  const {authUser, handleAuthUser} = useAuth()
  const client = useQueryClient();

  const {mutate, mutateAsync} = useMutation({
    mutationFn: async (data: any) => {
      const response = await request.patch(`${endpoint}${data.filter}`, data.item);
      if(data.position === 'changePassword') {
        await deleteToken('authToken')
        handleAuthUser({
          isAuthenticated: false,
          user: authUser
        })
      }
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

export const useInfiniteUsers = (query: string = '') => {
  const {authUser} = useAuth()
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
    queryKey: [key, query],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await request.get(`${endpoint}?${query}page=${pageParam}`)
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

  return { isLoading, isError, error, data, refetch, fetchNextPage, fetchPreviousPage, hasNextPage, hasPreviousPage, isFetchingNextPage, isFetchingPreviousPage };
};