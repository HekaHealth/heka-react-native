import { Dimensions } from "react-native";

export const { width, height } = Dimensions.get("window");

export const COLOR: any = {
  blue: "#2097f3",
  white: "#fff",
  black: "#000",
  tintOrange: "#f44337",
  gray: "#747575",
};

export const FONTSIZE: any = {
  extraSmall: width * 0.02,
  small: width * 0.03,
  mid: width * 0.04,
  large: width * 0.05,
};
