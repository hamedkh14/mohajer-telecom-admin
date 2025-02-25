import { CheckCircleIcon, XCircleIcon } from "react-native-heroicons/outline"
import ThemedText from "../Themes/ThemedText"
import { Sizes } from "@/constants/Styles"
import Colors from "@/constants/Colors"
import { StyleProp, TextStyle } from "react-native"
import Loading from "../Themes/Loading"

export const TransactionStatus = ({status, style}: {status?: string | null, style?: StyleProp<TextStyle>}) => {
  if(status === 'pending') {
    return (
      <Loading size={22} color={Colors.caption} />
    )
  }

  if(status === 'failed' || status === 'rejected') {
    return (
      <XCircleIcon size={Sizes.md} color={Colors.textError} />
    )
  }

  return (
    <CheckCircleIcon size={Sizes.md} color={Colors.textSuccess} />
  )
}