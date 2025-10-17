import {
  View,
  Text,
  SafeAreaViewBase,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import React from "react";
import Sc from "./../Assets/IMG/scooter.png";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const Navigate = useNavigation();
  return (
    <View>
      <View style={[styles.Header]}>
        <Text style={[styles.headerText]}>Zaika Online</Text>
        <Image source={Sc} style={[styles.Sc]} />
        <Text style={[styles.bio]}>
          Apna Zaika, Apne Sahar ka, We are Here to Fullfill Your Needs
        </Text>
        <Text style={[styles.bio2]}>
          Order from best nearby cafe & resturants
        </Text>
        <Pressable
          style={[styles.btn]}
          onPress={() => Navigate.navigate("Register")}
        >
          <Text style={[styles.Btnbio]}>Welcome</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    alignItems: "center",
    marginTop: "30%",
  },
  headerText: {
    fontSize: 28,
    letterSpacing: 1.3,
  },
  Sc: {
    width: 400,
    height: 400,
    paddingRight: 15,
    transform: [{ rotate: "-0deg" }],
  },
  bio: {
    fontSize: 25,
    letterSpacing: 1.3,
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: -20,
  },
  bio2: {
    color: "grey",
    marginTop: 10,
  },
  btn: {
    // borderWidth: 1,
    width: "90%",
    height: "9%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "black",
  },
  Btnbio: {
    fontSize: 20,
    color: "white",
  },
});

export default HomeScreen;
