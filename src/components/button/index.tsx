import { s } from "./styles";
import {
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from "react-native";
import { colors } from "@/styles/theme";
import { IconProps as TableIconProps } from "@tabler/icons-react-native";

type ButtonProps = TouchableOpacityProps & {
  isLoading?: boolean;
};

function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isLoading}
      style={[s.container, style]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.gray[100]} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

type IconProps = {
  icon: React.ComponentType<TableIconProps>;
};

function Icon({ icon: Icon }: IconProps) {
  return <Icon size={24} color={colors.gray[100]} />;
}

function Title({ children }: TextProps) {
  return <Text style={s.title}>{children}</Text>;
}

Button.Title = Title;
Button.Icon = Icon;

export { Button };
