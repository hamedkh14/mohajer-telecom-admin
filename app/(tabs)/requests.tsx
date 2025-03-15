import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ServiceRequests from '@/components/TopTab/ServiceRequests';
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

export default RequestsPage
