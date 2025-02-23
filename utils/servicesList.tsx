export const servicesList = ['uc-pubg', 'recharge', 'internet', 'almas', 'bargarar', 'remittances']
export const servicesListPersianTitle: Record<string, string> = {
  'uc-pubg': 'UC PUBG',
  'recharge': 'شارژ سیم کارت', 
  'internet': 'بسته اینترنت', 
  'almas': 'بسته الماس', 
  'bargarar': 'برقرار',
  'remittances': 'ثبت حواله',
  'subscriptions': 'اشتراک',
  'subCustomerWalletTopUp': 'شارژ کیف پول مشتری',
  'wallet': 'کیف پول'
}

export const transactionServiceList: Record<string, Record<string, string>> = {
  deposit: {
    depositByAdmin: 'واریز توسط ادمین',
    walletTopUp: 'شارژ حساب',
    sellerProfit: 'درآمد حاصل از فروش',
  },
  withdrawal: {
    internet:               'بسته اینترنت',
    recharge:               'شارژ سیم کارت',
    almas:                  'بسته الماس',
    bargarar:               'بسته برقرار',
    'uc-pubg':              'یوسی پابجی',
    remittances:            'حواله',
    subscriptions:          'خرید اشتراک',
    subCustomerWalletTopUp: 'شارژ حساب مشتری',
    withdrawalByAdmin:      'برداشت توسط ادمین',
  }
}

// wallet, subCustomerWalletTopUp, remittances, subscriptions, uc-pubg, recharge, internet, almas, bargarar