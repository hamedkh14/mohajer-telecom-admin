import { CheckCircleIcon, XCircleIcon } from "react-native-heroicons/outline"
import { Sizes } from "@/constants/Styles"
import Colors from "@/constants/Colors"
import Loading from "../Themes/Loading"

export const TransactionStatus = ({status}: {status?: string | null}) => {
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