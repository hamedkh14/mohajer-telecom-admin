import ServiceRequests from '@/components/TopTab/ServiceRequests';
import { Spacing } from '@/constants/Styles'
import React, { useState } from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import RemittanceRequests from '@/components/TopTab/RemittanceRequests';
import Colors from '@/constants/Colors';

const RequestsPage = () => {
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "services", title: "خدمات" },
    { key: "transfers", title: "حواله" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        services: ServiceRequests,
        transfers: RemittanceRequests,
      })}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props) => (
        <TabBar 
          {...props} 
          style={{ backgroundColor: "#1c2037" }} 
          indicatorStyle={{ backgroundColor: Colors.white }} 
          
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  inventoryContainer: {
    width: '100%',
    height: 250,
    alignItems: 'flex-end',
    paddingVertical: Spacing[1]
  },
  inventoryTitle: {
    margin: Spacing[2]
  },
  inventoryPrice: {
    width: '100%',
    textAlign: 'center',
    marginTop: Spacing[2],
    fontSize: 36
  },
  inventoryDetails: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[2],
    marginTop: Spacing[4]
  },
  flatlist: {
    paddingHorizontal: Spacing[2],
    paddingBottom: Spacing[2]
  },
})

export default RequestsPage
