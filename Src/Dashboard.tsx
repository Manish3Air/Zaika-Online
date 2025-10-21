import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./../Assets/IMG/profile.png";
import card from "./../Assets/IMG/card.jpeg";
import TD from "../Assets/IMG/Tandoori.jpg";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Dessert", "Pizza", "Ice Cream", "Burger"];
  const Navigate = useNavigation();

  return (
    <ScrollView>
      <SafeAreaView>
        <View>
          <View style={styles.Header}>
            <View>
              <Text style={styles.txt}>Hey Harshit,</Text>
              <Text style={styles.txt2}>Good Afternoon</Text>
            </View>
            <View>
              <Image source={Profile} style={styles.image} />
            </View>
          </View>

          <View style={styles.icon}>
            <Ionicons name="search-outline" size={20} color="gray" />
            <TextInput
              placeholder="Search..."
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>

          <View style={styles.Header2}>
            <Pressable>
              <Text style={styles.Best}>Best Sellers</Text>
            </Pressable>
            <Pressable onPress={() => Navigate.navigate("Best")}>
              <Text style={styles.Best2}>See All</Text>
            </Pressable>
          </View>

          {[1, 2, 3].map((item) => (
            <View style={styles.card} key={item}>
              <Image source={card} style={styles.cardImg} />
              <Text style={styles.cardTxt}>Black Rose Cafe</Text>
              <Text style={styles.cardTxt2}>Ratings</Text>
              <Ionicons
                name="arrow-forward-sharp"
                size={20}
                color="gray"
                style={{ paddingLeft: 30 }}
              />
            </View>
          ))}

          <View style={styles.Header3}>
            <Text style={styles.Best}>All Categories</Text>
            <Text style={styles.Best2}>See All</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.Cata}
          >
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={({ pressed }) => [
                  styles.Cata1,
                  {
                    backgroundColor:
                      selectedCategory === cat ? "#ff4d4d" : "#f0f0f0",
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <Text
                  style={{
                    color: selectedCategory === cat ? "white" : "black",
                    fontWeight: "600",
                  }}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={[styles.ImgCont]}>
            <Image source={TD} style={[styles.Image2]} />
          </View>
          <View style={[styles.ImgDet]}>
            <Text style={[styles.txt]}>Tandoori Pizza</Text>
            <Text style={[styles.txt2]}>Rs 399/-</Text>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
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
  txt2: {
    fontSize: 18,
    letterSpacing: 1.3,
    color: "red",
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingHorizontal: 10,
    width: "90%",
    height: 45,
  },
  Header2: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 20,
  },
  Best: {
    fontSize: 17,
    letterSpacing: 1.3,
  },
  Best2: {
    fontSize: 17,
    letterSpacing: 1.3,
    color: "grey",
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
  Header3: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 10,
  },
  Cata: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 16,
  },
  Cata1: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 13,
    alignItems: "center",
    marginRight: 10,
  },
  Image2: {
    width: 370,
    height: 200,
    borderRadius: 12,
  },
  ImgCont: {
    alignItems: "center",
    marginTop: 20,
  },
  ImgDet: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 10,
  },
});

export default Dashboard;
