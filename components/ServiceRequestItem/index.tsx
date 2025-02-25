import { ArrowsUpDownIcon } from "react-native-heroicons/outline"
import ThemedText from "../Themes/ThemedText"
import Colors from "@/constants/Colors"
import { Rounded, Sizes, Spacing } from "@/constants/Styles"
import { StyleSheet, TouchableOpacity, View } from "react-native"

import Price from "../Price"
import convertDate from "@/utils/convertDate"
import { TransactionStatus } from "../TransactionStatus"

interface transactionItemProps {
  id?: string | null, 
  title?: string,
  service_type?: string | null,
  price?: number, 
  isToman: boolean,
  user?: string,
  date: Date,
  onPress?: any
}

const ServiceRequestItem = ({
  id, 
  title,
  service_type = 'recharge',
  price = 0, 
  isToman = true,
  user,
  date = new Date(),
  onPress
}: transactionItemProps) => {
  const ComponentContent = () => {
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionItemTopContainer}>
          <View style={styles.transactionItemIcon}><ArrowsUpDownIcon size={Sizes.lg} color={Colors.subTitle} /></View>
          <View style={styles.transactionItemTopContainerDetails}>
            <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
              {
                service_type === 'walletRecharge' ? 
                  <ThemedText type='text' style={{fontSize: Sizes.sm}}>شارژ کیف پول</ThemedText> 
                : <ThemedText type='text' style={{fontSize: Sizes.sm}}>{title}</ThemedText>
              }

              <Price type='text' price={price} isToman={isToman} />
            </View>
            <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
              <ThemedText type='caption'>{convertDate(date)}</ThemedText>
              <ThemedText type='caption'>{user || ''}</ThemedText>
            </View>
          </View>
        </View>
      </View>
    )
  }

  if(!id) {
    return <ComponentContent />
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.6} 
      onPress={onPress}
    >
      <ComponentContent />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  transactionItem: {
    width: '100%',
    height: 80,
    backgroundColor: Colors.elementBackground,
    marginTop: Spacing[1],
    borderRadius: Rounded.lg,
    padding: Spacing[1],
  },
  transactionItemTopContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
  },
  transactionItemTopContainerDetails: {
    flex: 1,
    paddingRight: Spacing[1],
    justifyContent: 'space-between'
  },
  transactionItemIcon : {
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteAlpha2,
    borderRadius: Rounded.lg
  },
  transactionItemDeposit: {
    backgroundColor: Colors.bgSuccessAlphaDark,
    paddingHorizontal: Spacing[1],
    borderRadius: Rounded.lg
  },
  transactionItemWithdrawal: {
    backgroundColor: Colors.bgErrorAlphaDark,
    paddingHorizontal: Spacing[1],
    borderRadius: Rounded.lg

  }
});

export default ServiceRequestItem;