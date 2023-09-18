// AppNavigator.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, Text, View, Button } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";

import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import TaskBoard from "../screens/TaskBoard";
import TaskList from "../screens/TaskList";
import CalendarScreen from "../screens/Calendar";
import Settings from "../screens/Settings";
import Achievements from "../screens/Achievements";
// ... import the other pages

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TaskBoard"
        screenOptions={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "#5e6b7a",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
            alignSelf: "center",
          },
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => navigation.navigate("TaskBoard")}
              >
                <FontAwesome5
                  name="tasks"
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                  size={25}
                  backgroundColor="#5e6b7a"
                  color="white"
                  onPress={() => navigation.navigate("TaskBoard")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Achievements")}
              >
                <Icon
                  name="medal-outline"
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                  size={25}
                  backgroundColor="#5e6b7a"
                  color="white"
                  onPress={() => navigation.navigate("Achievements")}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                <Icon
                  name="settings-outline"
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                  size={25}
                  backgroundColor="#5e6b7a"
                  color="white"
                />
              </TouchableOpacity> */}
            </View>
          ),
        })}
      >
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="TaskBoard"
          component={TaskBoard}
          options={{
            title: "Project Board",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="TaskList"
          component={TaskList}
          options={({ route }) => ({
            title: "Task List",
            headerTitleAlign:"center"
          })}
        />
        <Stack.Screen
          name="Calendar"
          component={CalendarScreen}
          options={() => ({
            headerTitleAlign:"center"
          })}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerLeft: () => null,
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Achievements"
          component={Achievements}
          options={{
            headerTitleAlign: "center",
          }}
        />
        {/* ... other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
