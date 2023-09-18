import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from "react-native-progress";
import AchievementCard from "../components/AchievementCard";
import { FlatList } from "react-native-gesture-handler";

const Achievements = () => {
  const [user, setUser] = useState({
    totalTaskCompleted: 0,
  });

  const achievements = [
    {
      iconName: "medal",
      color: "#00A6FF",
      name: "Novice Completer",
      details: "Completed a total of 5 tasks",
      taskToAchieve: 5,
      isAchieved: user.totalTaskCompleted >= 5 ? true : false,
    },
    {
      iconName: "medal",
      color: "#00A6FF",
      name: "Beginner Completer",
      details: "Completed a total of 10 tasks",
      taskToAchieve: 10,
      isAchieved: user.totalTaskCompleted >= 10 ? true : false,
    },
    {
      iconName: "medal",
      color: "#39FF14",
      name: "Competent Completer",
      details: "Completed a total of 20 tasks",
      taskToAchieve: 20,
      isAchieved: user.totalTaskCompleted > 20 ? true : false,
    },
    {
      iconName: "medal",
      color: "#FFBA5C",
      name: "Advanced Completer ",
      details: "Completed a total of 20 tasks",
      taskToAchieve: 50,
      isAchieved: user.totalTaskCompleted > 50 ? true : false,
    },
    {
      iconName: "medal",
      color: "#FF0000",
      name: "Expert Completer ",
      details: "Completed a total of 100 tasks",
      taskToAchieve: 100,
      isAchieved: user.totalTaskCompleted > 100 ? true : false,
    },
    {
      iconName: "medal",
      color: "#FF0000",
      name: "Master Completer ",
      details: "Completed a total of 500 tasks",
      taskToAchieve: 500,
      isAchieved: user.totalTaskCompleted > 500 ? true : false,
    },
  ];

  const chunkArray = (array, size) => {
    const chunked = [];
    let index = 0;
    while (index < array.length) {
      chunked.push(array.slice(index, size + index));
      index += size;
    }
    return chunked;
  };

  const achievementsData = chunkArray(achievements, 2);

  const pointsPerTask = 100;
  const pointsPerLevel = 500;

  const getUserLevel = (totalCompleted) => {
    const totalPoints = totalCompleted * pointsPerTask;
    const level = Math.floor(totalPoints / pointsPerLevel);
    return level;
  };

  const getXPDifference = (totalCompleted, level) => {
    let XPDifference;
    const totalPoints = totalCompleted * pointsPerTask;
    console.log(level);
    if (level == 0) {
      XPDifference = 500 - totalPoints;
    } else {
      XPDifference = (level * 500) + 500 - totalPoints;
    }

    return XPDifference;
  };

  const getUserProgress = (totalCompleted) => {
    const totalPoints = totalCompleted * pointsPerTask;
    const progress = totalPoints % pointsPerLevel;
    return progress / pointsPerLevel;
  };

  const updateTotalTaskCompleted = (projects) => {
    let totalCompleted = 0;

    console.log("project array is ", projects);

    projects.forEach((project) => {
      project.taskTitles.forEach((taskTitle) => {
        taskTitle.tasks.forEach((task) => {
          if (task.completed) {
            totalCompleted++;
          }

          task.subtasks.forEach((subtask) => {
            if (subtask.completed) {
              totalCompleted++;
            }
          });
        });
      });
    });

    setUser({ ...user, totalTaskCompleted: totalCompleted });
  };

  useEffect(() => {
    const getProjects = async () => {
      try {
        const value = await AsyncStorage.getItem("@projects");
        if (value !== null) {
          updateTotalTaskCompleted(JSON.parse(value));
        }
      } catch (e) {
        console.error(e);
      }
    };

    getProjects();
  }, []);

  const level = getUserLevel(user.totalTaskCompleted);
  const progress = getUserProgress(user.totalTaskCompleted);
  const difference = getXPDifference(user.totalTaskCompleted, level);

  return (
    <View style={styles.container}>
      <View style={styles.level}>
        <Text style={{ fontSize: 30, color: "white", marginBottom: 10 }}>
          Level {level}
        </Text>
        <Progress.Bar
          width={300}
          height={30}
          borderRadius={50}
          unfilledColor="#969FAA"
          color="#39FF14"
          borderWidth={0}
          progress={progress}
        />
        <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
          {difference} more xp to the next level
        </Text>
        <Text style={{ color: "white", fontSize: 18 }}>
          Total Task Completed: {user.totalTaskCompleted}
        </Text>
      </View>

      <FlatList
        data={achievementsData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            {item.map((achievement, index) => (
              <AchievementCard key={index} achievement={achievement} />
            ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47525e",
  },
  level: {
    marginTop: 30,
    marginBottom: 30,
    alignItems: "center",
  },
});

export default Achievements;
