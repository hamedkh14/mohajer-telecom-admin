import moment from 'jalali-moment';

const convertDate = (date?: Date, format?: string) => {
  const currentDate = moment(date || new Date());
  return currentDate.locale('fa').format(format || 'dddd jD jMMMM jYYYY HH:mm');
};

export default convertDate;
