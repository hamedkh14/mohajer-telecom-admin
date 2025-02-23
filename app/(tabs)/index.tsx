import AccountButton from '@/components/AccountButton';
import BaseTheme from '@/components/Themes/BaseTheme';
import ThemedText from '@/components/Themes/ThemedText';
import Colors from '@/constants/Colors';
import { Rounded, Spacing } from '@/constants/Styles';
import { useAuth } from '@/context/authContext';
import { Link } from 'expo-router';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const CustomTitle = ({name}: {name: string}) => {
  return (
    <View style={styles.titleContainer}>
      <ThemedText type='text' style={{color: Colors.whiteAlpha}}>خوش آمدید</ThemedText>
      <ThemedText type='title'>{name}</ThemedText>
    </View>
  )
}

const Item = ({item, itemSize}: any) => {
  return (
    <Link href={item.href} style={[styles.item, {width: itemSize, height: itemSize}]}>
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.itemImage} />
        <ThemedText type='caption'>{item.title}</ThemedText>
      </View>
    </Link>
  )
}


export default function HomeScreen() {
  const {authUser} = useAuth()
  const screenWidth = Dimensions.get('window').width;
  const itemSize = screenWidth / 3 - 13;

  const data = [
    {title: 'بسته الماس', image: require('../../assets/images/imo.png'), href: '/services/almas'},
    {title: 'بسته اینترنت', image: require('../../assets/images/wifi.png'), href: '/services/internet'},
    {title: 'شارژ سیم کارت', image: require('../../assets/images/sim.png'), href: '/services/recharge'},
    {title: 'اشتراک', image: require('../../assets/images/subscription.png'), href: '/subscription'},
    {title: 'یوسی پابچی', image: require('../../assets/images/pubg.png'), href: '/services/uc-pubg'},
    {title: 'برقرار', image: require('../../assets/images/bargarar.png'), href: '/services/bargarar'},
  ]
  
  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        customTitle: <CustomTitle name={authUser?.user?.name} />,
        hideBackBox: true,
        headerAction: <AccountButton />
      }}
    >
      <FlatList 
        data={data}
        renderItem={({item}) => <Item item={item} itemSize={itemSize} />}
        keyExtractor={item => item.title}
        numColumns={3}
        horizontal={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatlist}
      />
    </BaseTheme>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4
  },
  flatlist: {
    alignItems: 'flex-end',
    padding: Spacing[1],
  },
  item: {
    backgroundColor: Colors.elementBackground,
    margin: 4,
    borderRadius: Rounded.lg,
  },
  itemContainer: {
    width: '100%',
    height: '100%',
    gap: Spacing[1],
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemImage: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  }
})
