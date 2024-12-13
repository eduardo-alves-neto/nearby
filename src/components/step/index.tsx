import { Text, View } from "react-native";
import { s } from "./styles";
import { IconProps } from "@tabler/icons-react-native";
import { colors } from "@/styles/colors";

interface IStepProps {
  title: string;
  description: string;
  icon?: React.ComponentType<IconProps>;
}

export function Step({ description, title, icon: Icon }: IStepProps) {
  return (
    <View style={s.container}>
      {Icon && <Icon size={32} color={colors.red.base} />}

      <View style={s.details}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.description}>{description}</Text>
      </View>
    </View>
  );
}
