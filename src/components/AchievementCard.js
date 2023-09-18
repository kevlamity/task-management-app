import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { MaterialIcons } from "@expo/vector-icons";

const AchievementCard = ({ achievement }) => {
  getAchievementProgress = () => {};
  return (
    <View
      style={[
        styles.card,
        { borderColor: achievement.isAchieved ? "#39FF14" : "red" },
      ]}
    >
        <FontAwesome5
          name={achievement.iconName}
          size={60}
          color={achievement.color}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{achievement.name}</Text>
          <Text style={styles.details}>{achievement.details}</Text>
          <View style={styles.completed}>
            {achievement.isAchieved ? (
              <MaterialIcons name="check" size={30} color="#39FF14" />
            ) : (
              <MaterialIcons name="close" size={30} color="red" />
            )}
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    width: 170,
    backgroundColor: "#6C7B8C",
    opacity: 0.8,

  },
  icon: {
    width: 50,
    height: 50,
    justifyContent: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  details: {
    color: "white",
    textAlign: "center",
  },
  completed: {
    alignContent: "center",
    alignItems: "center",
  },
});

export default AchievementCard;
