import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Home from "./src/screen/Home";
import { AppWrapper } from "./src/utils/AppContext";

export default function App() {
  return (
    <AppWrapper>
      <Home />
    </AppWrapper>
  );
}
