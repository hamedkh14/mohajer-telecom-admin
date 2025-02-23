import { StyleSheet } from "react-native";
import Colors from "./Colors";

const Spacing = {
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
  7: 64
}

const Sizes = {
  'xs': 12,
  'sm': 14,
  'base': 20,
  'md': 24,
  'lg': 32,
  'xl': 36,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64
}

const Rounded = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48
}

const Global = StyleSheet.create({
  container: {
    backgroundColor: '',
    borderColor: '',
    borderWidth: 1,
    borderRadius: '',
  }
})

export {
  Spacing,
  Sizes,
  Rounded,
  Global
}