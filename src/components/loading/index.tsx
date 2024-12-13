import { s } from "./styles";
import { ActivityIndicator } from "react-native";

import { colors } from "@/styles/colors";

export function Loading() {
  return <ActivityIndicator color={colors.green.base} style={s.container} />;
}
