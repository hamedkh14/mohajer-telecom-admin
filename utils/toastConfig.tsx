import { Text, View } from "react-native";

const toastConfig = {
  success: ({ text1, text2, props }: any) => (
    <View
      style={{
        backgroundColor: "#28a745",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 16, fontFamily: 'Yekan-Bold', }}>{text1}</Text>
      {text2 ? <Text style={{ color: "#fff", fontSize: 14, fontFamily: 'Yekan-Medium', }}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2, props }: any) => (
    <View
      style={{
        backgroundColor: "#dc3545",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 16, fontFamily: 'Yekan-Bold', }}>{text1}</Text>
      {text2 ? <Text style={{ color: "#fff", fontSize: 14, fontFamily: 'Yekan-Medium', }}>{text2}</Text> : null}
    </View>
  ),
  info: ({ text1, text2, props }: any) => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: "#B0BEC5",
      }}
    >
      <Text style={{ color: "#333", fontSize: 16, fontFamily: 'Yekan-Bold', }}>{text1}</Text>
      {text2 ? <Text style={{ color: "#333", fontSize: 14, fontFamily: 'Yekan-Medium', }}>{text2}</Text> : null}
    </View>
  ),
};

export default toastConfig;