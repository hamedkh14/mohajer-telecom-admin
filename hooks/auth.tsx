import request from "@/Api/axios";
import { useState } from "react";

const endpoint = '/collections/users/records';
const key = 'Auth';

export const useVerifyUser = (userName: string, password: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const verify = async () => {
    setIsLoading(true);
    setIsError(false);
    setError('');
    setData(null);
    try {
      const authResponse = await request.post('/collections/users/auth-with-password', {identity: `${userName}`, password: password});
      setData(authResponse.data);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setIsError(true);
      setError([err.status, err.message]);
      console.log('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, error, verify };
}

export const verifyAndUpdateToken = async (token: string) => {
  try {
    const response = await request.post('/collections/users/auth-refresh', {}, {
      headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
          'Content-Type': 'application/json',
      },
    });

    return {
      data: response.data,
      isError: false,
    }
  } catch (err: any) {
    return {
      data: null,
      isError: true,
      status: err.status,
      message: err.message
    };
  }
}
