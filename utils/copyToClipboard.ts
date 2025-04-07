import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

const copyToClipboard = async (val: string) => {
  await Clipboard.setStringAsync(`${val}`);
  Toast.show({
    type: 'success',
    text1: 'کپی شد!'
  })
};
export default copyToClipboard