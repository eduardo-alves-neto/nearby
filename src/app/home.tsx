import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

//https://qrfy.com/pt

type MarketsProps = PlaceProps & {
  latitude: number;
  longitude: number;
};

const CURRENT_LOCATION = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
};

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [category, setCategory] = useState("");
  const [markets, setMarkets] = useState<MarketsProps[]>([]);
  // const [location, setLocation] = useState<Location.LocationObjectCoords>();

  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
      setCategory(data[0].id);
    } catch (error) {
      console.log(error);
      Alert.alert("Categorias", "Não foi possível carregar as categorias");
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) return;

      const { data } = await api.get("/markets/category/" + category);
      setMarkets(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Locais", "Não foi possível carregar os locais");
    }
  }

  // async function gerCurrentLocation() {
  //   try {
  //     const { granted } = await Location.requestForegroundPermissionsAsync();
  //     if (granted) {
  //       const location = await Location.getCurrentPositionAsync();
  //       setLocation(location.coords);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    // gerCurrentLocation();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [category]);

  return (
    <View style={{ flex: 1, backgroundColor: "#CECECE" }}>
      <Categories
        data={categories}
        selected={category}
        onSelected={setCategory}
      />

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: CURRENT_LOCATION?.latitude,
          longitude: CURRENT_LOCATION?.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          identifier="current"
          coordinate={{
            latitude: CURRENT_LOCATION.latitude,
            longitude: CURRENT_LOCATION.longitude,
          }}
          image={require("@/assets/location.png")}
        />
        {markets.map((item) => (
          <Marker
            key={item.id}
            identifier={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            image={require('@/assets/pin.png')}
          />
        ))}
      </MapView>
      <Places data={markets} />
    </View>
  );
}
