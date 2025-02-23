const numberFormat = (num: number) => {
  const formattedNumber = new Intl.NumberFormat().format(num);

  return formattedNumber;
}

export default numberFormat;