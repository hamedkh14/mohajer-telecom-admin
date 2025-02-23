import request from "@/Api/axios";
import { useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query"

const endpoint = '/collections/service_requests/records';
const key = 'ServiceRequest';


// {
//   user_id,
//   service_id,
//   price,
//   status,
//   type,
//   information
// }
export const useCreateServiceRequest = () => {
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
      const response = await request.post(endpoint, data);

      await request.patch(`/collections/users/records/${user.id}`, {
        wallet_locked_balance: (Number(user.wallet_locked_balance) + Number(data.price))
      })

      await request.post('/collections/transactions/records', {
        user_id: user.id,
        service_request_id: response?.data.id,
        transaction_type: 'withdrawal',
        service_type: data.type,
        price: data.price,
        status: data.status
      });

      // return response.data
    },
    onSuccess: () => {
      client.invalidateQueries({queryKey:[key]})
    },
    onError: (error) => {
      // const rollbackChanges = async () => {
      //   await request.patch(`/collections/users/records/${requestData?.id}`, {
      //     wallet_locked_balance: user_wallet_locked_balance
      //   })

        
      // }
      // rollbackChanges()
      console.log('Error fetching data:', error); 
    },
  })
  
  return {mutate, mutateAsync}
}

export const useGetServiceRequest = (query:string = '') => {
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

export const useInfiniteServiceRequest = (query: string = '') => {
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

export const useApproveServiceRequest = () => {
  const client = useQueryClient();

  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ requestId, userId, price, info }: {requestId: string, userId: string, price: number, info: any}) => {
      const { data: user } = await request.get(`/collections/users/records/${userId}?expand=parentId`);
      const { data: transactionRecord } = await request.get(`/collections/transactions/records?filter=(service_request_id='${requestId}')`);

      await request.patch(`/collections/users/records/${userId}`, {
        wallet_locked_balance: Number(user.wallet_locked_balance) - Number(price),
        wallet_available_balance: Number(user.wallet_available_balance) - Number(price)
      });

      await request.patch(`${endpoint}/${requestId}`, {
        status: "completed"
      });

      await request.patch(`/collections/transactions/records/${transactionRecord.items[0].id}`, {
        status: "completed"
      });

      if(user.role === 'customer') {
        const sellerProfit = Number(price) - Number(info.adminPrice);
        await request.patch(`/collections/users/records/${user.parentId}`, {
          wallet_available_balance: Number(user.expand.parentId.wallet_available_balance) + Number(sellerProfit)
        });

        await request.post('/collections/transactions/records', {
          user_id: user.parentId,
          service_request_id: requestId,
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

export const useRejectServiceRequest = () => {
  const client = useQueryClient();

  const { mutate, mutateAsync } = useMutation({
    mutationFn: async ({ requestId, userId, price, rejectedDesc }: {requestId: string, userId: string, price: number, rejectedDesc: string}) => {
      const { data: user } = await request.get(`/collections/users/records/${userId}`);
      const { data: transactionRecord } = await request.get(`/collections/transactions/records?filter=(service_request_id='${requestId}')`);

      await request.patch(`/collections/users/records/${userId}`, {
        wallet_locked_balance: Number(user.wallet_locked_balance) - Number(price)
      });

      await request.patch(`${endpoint}/${requestId}`, {
        status: "rejected",
        rejected_description: rejectedDesc
      });

      await request.patch(`/collections/transactions/records/${transactionRecord.items[0].id}`, {
        status: "failed",
        description: {
          ...transactionRecord.items[0].description,
          rejected_description: rejectedDesc
        }
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
}

