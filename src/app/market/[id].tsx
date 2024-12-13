import { useEffect, useRef, useState } from "react";
import { Alert, Modal, StatusBar, View, ScrollView } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { api } from "@/services/api";
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details, PropsDetails } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";
import { CameraView, useCameraPermissions } from "expo-camera";

type DataProps = PropsDetails & {
  cover: string;
};

export default function Market() {
  const [_, requestPermission] = useCameraPermissions();
  const params = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<DataProps>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);
  const [couponIsFetching, setCouponIsFetching] = useState<boolean>(false);
  const qrLock = useRef(false);

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar os dados", [
        { text: "Ok", onPress: () => router.back() },
      ]);
    }
  }

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera");
      }

      qrLock.current = false;
      setIsVisibleCameraModal(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Câmera", "Não foi possível utilizar a câmera");
    }
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);
      const { data } = await api.get("/coupons/" + id);

      Alert.alert("Cupom", data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível utilizar o cupom");
    } finally {
      setCouponIsFetching(false);
    }
  }

  function handlerUseCoupon(id: string) {
    setIsVisibleCameraModal(false);

    Alert.alert(
      "Cupom",
      "Não é possível reutilzar um cupom resgatado. Deseja realmente resgatar o cupom?",
      [
        {
          style: "cancel",
          text: "Não",
        },
        {
          text: "Sim",
          onPress: () => getCoupon(id),
        },
      ]
    );
  }

  useEffect(() => {
    fetchMarket();
  }, [params]);

  if (isLoading) return <Loading />;

  if (!data) return <Redirect href={"/home"} />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />

      <ScrollView showsHorizontalScrollIndicator={false}>
        <Cover uri={data?.cover} />
        <Details data={data} />
        {coupon && <Coupon code={coupon} />}
      </ScrollView>

      <View style={{ padding: 32 }}>
        <Button onPress={() => handleOpenCamera()}>
          <Button.Title>Ler QR Code</Button.Title>
        </Button>
      </View>

      <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          onBarcodeScanned={({ data }) => {
            if (data && !qrLock.current) {
              qrLock.current = true;
              setTimeout(() => handlerUseCoupon(data), 500);
            }
          }}
        />

        <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <Button
            onPress={() => setIsVisibleCameraModal(false)}
            isLoading={couponIsFetching}
          >
            <Button.Title>Voltar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
