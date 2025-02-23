const toPersion = (num: any) => {
  const farsi = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

  return num.replace(/[0-9]/g, (w: any) => farsi[+w]);
}

export default toPersion;