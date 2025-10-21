import {
  View,
  Text,
  SafeAreaViewBase,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const Register = () => {
    const [isChecked, setIsChecked] = useState(false);
    const Navigate = useNavigation();

  return (
    <SafeAreaView>
      <View>
        <View style={[style.container]}>
          <Text style={[style.header]}>Register Account</Text>
        </View>
        <View style={[style.input]}>
          <TextInput placeholder="Enter First Name :" style={[style.first]} />
          <TextInput placeholder="Enter Second Name :" style={[style.Second]} />
          <TextInput
            placeholder="Enter Phone Number :"
            style={[style.Second]}
          />
          <TextInput placeholder="Enter Gmail ID :" style={[style.Second]} />
          <TextInput placeholder="Enter Password :" style={[style.Second]} />
          <View style={style.container1}>
            <TouchableOpacity
              style={style.checkboxContainer}
              onPress={() => setIsChecked(!isChecked)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isChecked ? "checkbox" : "square-outline"}
                size={22}
                color={isChecked ? "black" : "#666"}
              />
              <Text style={style.label}>Agree terms and conditions</Text>
            </TouchableOpacity>
          </View>
          <Pressable style={[style.btn]}>
            <Text style={[style.btnText]}>
                Register
            </Text>
          </Pressable>
          <Text style={[style.T1]}>Already have an Account ?</Text>
          <Pressable style={[style.Login]} onPress={()=> Navigate.navigate("Login")}>
            <Text style={[style.loginTxt]}>Login</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 60,
  },
  header: {
    fontSize: 25,
    letterSpacing: 1.3,
    fontWeight: "semibold",
  },
  first: {
    // marginLeft: 30,
    borderWidth: 1,
    width: "90%",
    alignItems: "center",
    height: 50,
    borderRadius: 15,
    paddingLeft: 20,
    marginTop: 35,
    fontSize: 16,
    letterSpacing: 1.3
  },
  input: {
    alignItems: "center",
  },
  Second: {
    borderWidth: 1,
    width: "90%",
    alignItems: "center",
    height: 50,
    borderRadius: 15,
    paddingLeft: 20,
    marginTop: 20,
    fontSize: 16,
    letterSpacing: 1.3
  },
  container1: {
    marginVertical: 10,
    marginLeft: -70
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#222',
    letterSpacing: 1.3
  },
  btn: {
    // borderWidth: 1,
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    height: 50,
    borderRadius: 15,
    backgroundColor: 'black'
  },
  btnText: {
    fontSize: 18,
    color: 'white',
    letterSpacing: 1.3
  },
  T1: {
    marginTop: 15,
    fontSize: 14,
    letterSpacing: 1.3,
  },
  Login: {
    marginTop: 7,
  },
  loginTxt: {
    color: '#007bff',
    fontSize: 14,
    letterSpacing: 1.3
  }
});

export default Register;
