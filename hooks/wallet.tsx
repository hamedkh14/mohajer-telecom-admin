import request from "@/Api/axios";
import { useAuth } from "@/context/authContext";
import { useMutation, useQuery, useQueryClient } from "react-query"

const endpoint = '/collections/users/records';
const key = 'Wallet';

export const useGetUserWalletBalance = (id:string = '') => {
  const {isLoading, isFetching, isError, error, data} = useQuery({
    queryKey: [key, id],
    queryFn: async ({queryKey}) => {
      const response = await request.get(`${endpoint}/${queryKey[1]}`);

      return response.data
    },
    select: (result) => {
      return {
        wallet_available_balance: result.wallet_available_balance,
        wallet_locked_balance: result.wallet_locked_balance
      }
    },
    onError: (error) => {
      // console.error('Error fetching data:', error); 
    },
    cacheTime: 0
  })
  return {isLoading, isFetching, isError, error, data}
}

export const useTopUpWallet = () => {
  const {authUser} = useAuth()
  const client = useQueryClient();

  const {mutate, mutateAsync} = useMutation({
    mutationFn: async (data: any) => {
      const { data: user } = await request.get(`/collections/users/records/${data.user_id}`);
      await request.post('/collections/transactions/records', {
        user_id: data.user_id,
        transaction_type: data.action,
        service_type: data.action === 'deposit' ? 'depositByAdmin' : 'withdrawalByAdmin',
        price: data.price,
        status: 'completed',
        description: {
          desc: data.desc
        }
      });
      
      let wallet_available_balance = user.wallet_available_balance
      if(data.action === 'deposit') {
        wallet_available_balance = (Number(user.wallet_available_balance) + Number(data.price))
      }else {
        wallet_available_balance = (Number(user.wallet_available_balance) - Number(data.price))
      }

      await request.patch(`/collections/users/records/${user.id}`, { wallet_available_balance })

      if(authUser.user.role === 'seller') {
        const { data: seller } = await request.get(`/collections/users/records/${authUser.user.id}`);

        await request.post('/collections/transactions/records', {
          user_id: authUser.user.id,
          transaction_type: 'withdrawal',
          service_type: 'subCustomerWalletTopUp',
          price: data.price,
          status: 'completed',
          description: {
            customerId: data.user_id
          }
        });

        await request.patch(`/collections/users/records/${authUser.user.id}`, {
          wallet_available_balance: (Number(seller.wallet_available_balance) - Number(data.price))
        })
      }
    },
    onSuccess: () => {
      client.invalidateQueries({queryKey:[key]})
      client.invalidateQueries({queryKey:['Users']})
    },
    onError: (error) => {
      // console.log('Error fetching data:', error); 
    },
  })
  
  return {mutate, mutateAsync}
}