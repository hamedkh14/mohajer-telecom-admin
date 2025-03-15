import request from "@/Api/axios";
import Divider from "@/components/Divider";
import BaseTheme from "@/components/Themes/BaseTheme";
import Loading from "@/components/Themes/Loading";
import LoadingPage from "@/components/Themes/LoadingPage";
import ThemedText from "@/components/Themes/ThemedText";
import Colors from "@/constants/Colors";
import { Rounded, Spacing } from "@/constants/Styles";
import { applyPercentage } from "@/utils/applyPercentage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const MAX_RETRIES = 3;

const ApplyPriceChanges = () => {
  const { applyPriceChanges } = useLocalSearchParams();
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);
  const [changePriceLoading, setChangePriceLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [result, setResult] = useState<any>([
    // {
    //   isError: true,
    //   title: 'تغییرات اعمال شد',
    //   oldPrice: 0,
    //   newPrice: 0,
    // },
    // {
    //   isError: false,
    //   title: 'تغییرات اعمال شد',
    //   oldPrice: 0,
    //   newPrice: 0,
    // }
  ]);
  
  const fetchData = async (page: number = 1, allData: any[] = []) => {
    setFetchLoading(true);
    try {
      let now = new Date();
      let localISOTime = now.getFullYear() + '-' +
                   String(now.getMonth() + 1).padStart(2, '0') + '-' +
                   String(now.getDate()).padStart(2, '0') + ' 00:00:00';

      let filter = `?filter=(type='${applyPriceChanges[1]}'`
      if(applyPriceChanges[2] != 'null') filter += `%26%26operator='${applyPriceChanges[2]}'`
      if(applyPriceChanges[4] != 'all') filter += `%26%26updated<'${localISOTime}'`
      filter += `)`
      const response = await request.get(`/collections/services/records${filter}&perPage=100&page=${page}`);
      const newData = response.data.items;
      const updatedData = [...allData, ...newData];
  
      if (page < response.data.totalPages) { 
        fetchData(page + 1, updatedData);
      } else {
        setData(updatedData);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setFetchLoading(false);
    }
  };

  const updatePrice = async (item: any, attempt = 1) => {
    try {
      const newPrice = applyPercentage(Number(item.price), Number(applyPriceChanges[3]), applyPriceChanges[0] === 'increase');
      const response = await request.patch(`/collections/services/records/${item.id}`, { price: newPrice });
      setResult((prev: any) => [...prev, { isError: false, title: item.title, oldPrice: item.price, newPrice: newPrice }]);
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        await updatePrice(item, attempt + 1);
      } else {
        setResult((prev: any) => [...prev, { isError: true, title: item.title, oldPrice: item.price, newPrice: item.price }]);
      }
    }
  };
  
  const applyPrice = async () => {
    if (!data) return;

    setChangePriceLoading(true);
    await Promise.all(data.map((item: any) => updatePrice(item)));
    setChangePriceLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    if (data && data.length > 0) {
      applyPrice();
    }
  }, [data]);

  if(fetchLoading) return <LoadingPage />;
  
  return (
    <BaseTheme hasHeader headerOptions={{ hasBack: true, title: "تنظیم قیمت" }}>
      {isError && <View style={{alignItems: 'center', paddingTop: 20}}><ThemedText type="error">خطا در دریافت اطلاعات</ThemedText></View>}
      {!isError && !changePriceLoading && (data === null || data.length <= 0) && <View style={{alignItems: 'center', paddingTop: 20}}><ThemedText type="caption">داده ای یافت نشد</ThemedText></View>}
      {changePriceLoading && <Loading />}
      {result.length > 0 && <FlatList 
        data={result}
        renderItem={({item}) => {
          return (
            <>
              <View style={{...styles.item, ...(item.isError ? {backgroundColor: Colors.bgErrorAlphaDark} : {backgroundColor: Colors.bgSuccessAlphaDark})}}>
                <ThemedText type="text">{item.title}</ThemedText>
                {!item.isError && <>
                  <ThemedText type="text">قیمت قبلی: {item.oldPrice}</ThemedText>
                  <ThemedText type="text">قیمت جدید: {item.newPrice}</ThemedText>
                </>}
              </View>
            </>
          )
        }}
        keyExtractor={(item, index) => index.toString()}
        style={{padding: Spacing[1]}}
        ItemSeparatorComponent={() => <Divider />}
      />}
    </BaseTheme>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: Spacing[2], 
    borderRadius: Rounded.md,
    gap: Spacing[1],
    alignItems: 'flex-end'
  }
})
  

export default ApplyPriceChanges;
