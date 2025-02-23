import request from "@/Api/axios";
import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";

const endpoint = '/collections/remittances/records'
const key = 'Remittances'

export const useSaveRemittances = () => {
  const client = useQueryClient()

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

export const useGetRemittances = (query:string = '') => {
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

export const useInfiniteRemittances = (query: string = '') => {
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

export const useApproveRemittance = () => {
  const client = useQueryClient();

  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ remittanceId, userId, price, info, city }: {remittanceId: string, userId: string, price: number, info: any, city: string}) => {
      const { data: user } = await request.get(`/collections/users/records/${userId}?expand=parentId`);

      let finalPrice = 0;

      if(city === 'ایران') {
        finalPrice = price
      }else {
        finalPrice = Number(info?.remittance_price) * Number(price)
      }

      await request.patch(`/collections/users/records/${userId}`, {
        wallet_available_balance: Number(user.wallet_available_balance) - Number(finalPrice)
      });

      await request.patch(`${endpoint}/${remittanceId}`, {
        status: "completed"
      });

      await request.post('/collections/transactions/records', {
        user_id: userId,
        remittance_id: remittanceId,
        transaction_type: 'withdrawal',
        service_type: 'remittances',
        price: finalPrice,
        status: 'completed'
      });

      if(user.role === 'customer' && city !== 'ایران') {
        const sellerProfit = (Number(info?.remittance_price) * Number(price)) - (Number(info?.adminPrice) * Number(price));
        await request.patch(`/collections/users/records/${user.parentId}`, {
          wallet_available_balance: Number(user.expand.parentId.wallet_available_balance) + Number(sellerProfit)
        });

        await request.post('/collections/transactions/records', {
          user_id: user.parentId,
          remittance_id: remittanceId,
          transaction_type: 'deposit',
          service_type: 'sellerProfit',
          price: sellerProfit,
          status: 'completed'
        });
      }
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [key] });
    },
    onError: (error) => {
      console.error("Error approving service request:", error);
    },
  });

  return { mutate, mutateAsync };
}

export const useRejectRemittance = () => {
  const client = useQueryClient();

  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ remittanceId, rejectedDesc }: {remittanceId: string, rejectedDesc: string}) => {
      await request.patch(`${endpoint}/${remittanceId}`, {
        status: "rejected",
        rejected_description: rejectedDesc
      });
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [key] });
    },
    onError: (error) => {
      console.error("Error rejecting service request:", error);
    },
  });

  return { mutate, mutateAsync };
};