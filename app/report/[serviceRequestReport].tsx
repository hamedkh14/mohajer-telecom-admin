import BaseTheme from '@/components/Themes/BaseTheme'
import ThemedText from '@/components/Themes/ThemedText'
import React from 'react'

const ServiceRequestReport = () => {
  return (
    <BaseTheme
      hasHeader
      headerOptions={{
        hasBack: true,
        title: 'گزارش'
      }}
    >
      <ThemedText type='title'>ServiceRequestReport</ThemedText>
    </BaseTheme>
  )
}

export default ServiceRequestReport