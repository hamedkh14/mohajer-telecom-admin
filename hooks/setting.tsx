import request from "@/Api/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const endpoint = '/collections/settings/records';
const key = 'Settings';

export const useGetSettings = (query: string = '') => {
  const {isLoading, isFetching, isError, error, data} = useQuery({
    queryKey: [key, query],
    queryFn: async ({queryKey}) => {
      const response = await request.get(`${endpoint}${query}`);

      return response.data
    },
    select: (result) => {
      return result.items[0]
    },
    onError: (error) => {
      console.error('Error fetching data:', error); 
    },
    cacheTime: 0
  })

  return {isLoading, isFetching, isError, error, data}
}

export const useCreateSetting = () => {
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

export const useUpdateSetting = () => {
  const client = useQueryClient();

  const {mutate, mutateAsync} = useMutation({
    mutationFn: async (data: any) => {
      const response = await request.patch(`${endpoint}/${data.id}`, data.item);
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