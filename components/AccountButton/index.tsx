import React from 'react'
import Button from '../Themes/Button'
import {UserIcon} from 'react-native-heroicons/outline'
import Colors from '@/constants/Colors'

const AccountButton = () => {
  return (
    <Button varient='iconButton' Icon={UserIcon} href={'/account'} iconOptions={{color: Colors.white}} style={{backgroundColor: Colors.whiteAlpha2}}  />
  )
}

export default AccountButton