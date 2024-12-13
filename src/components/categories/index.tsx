import { View, FlatList } from "react-native";
import { Category } from "../category";
import { s } from "./styles";

export type CategoriesProps = {
  id: string;
  name: string;
};

type Props = {
  data: CategoriesProps[];
  selected: string;
  onSelected: (id: string) => void;
};

export function Categories({ data, selected, onSelected }: Props) {
  return (
    <FlatList
      horizontal
      data={data}
      style={s.container}
      keyExtractor={(item) => item.id}
      contentContainerStyle={s.content}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Category
          name={item.name}
          iconId={item.id}
          onPress={() => onSelected(item.id)}
          isSelected={item.id === selected}
        />
      )}
    />
  );
}
