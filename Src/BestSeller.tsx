import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native";
import Profile from "./../Assets/IMG/profile.png";
import card from "./../Assets/IMG/card.jpeg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BestSeller = () => {
    const Navigate = useNavigation();

  return (
    <SafeAreaView>
      <View style={[styles.Header]}>
        <View>
          <Text style={[styles.txt]}>Best Sellers</Text>
        </View>
        <View>
          <Image source={Profile} style={[styles.image]} />
        </View>
      </View>
      {[1].map((item) => (
        <Pressable style={styles.card} key={item} onPress={() => Navigate.navigate("Vendor")}>
          <Image source={card} style={styles.cardImg} />
          <Text style={styles.cardTxt}>Black Rose Cafe</Text>
          <Text style={styles.cardTxt2}>Ratings</Text>
          <Ionicons
            name="arrow-forward-sharp"
            size={20}
            color="gray"
            style={{ paddingLeft: 30 }}
          />
        </Pressable>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
  },
  image: {
    height: 32,
    width: 32,
  },
  txt: {
    fontSize: 18,
    letterSpacing: 1.3,
  },
  card: {
    marginTop: 10,
    backgroundColor: "#fde68a",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 10,
    height: 70,
    flexDirection: "row",
    alignItems: "center",
  },
  cardTxt: {
    fontSize: 15,
    letterSpacing: 1.3,
    paddingLeft: 10,
  },
  cardTxt2: {
    fontSize: 15,
    letterSpacing: 1.3,
    paddingLeft: 30,
    color: "red",
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});

export default BestSeller;
