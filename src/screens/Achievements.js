import React, { useEffect, useState } from "react";
import { StyleSheet,View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Progress from 'react-native-progress';

const Achievements = () => {
  const [user, setUser] = useState({
    totalTaskCompleted: 0,
    // ... other fields
  });

  const pointsPerTask = 100;
  const pointsPerLevel = 350;

  const getUserLevel = (totalCompleted) => {
    const totalPoints = totalCompleted * pointsPerTask;
    const level = Math.floor(totalPoints / pointsPerLevel);
    return level;
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

  return (
    <View style={styles.container}>

        <Text>Total Task Completed: {user.totalTaskCompleted}</Text>
        <Text>Level: {level}</Text>
        <Progress.Bar
          progress={progress}
        />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47525e",
  },
});

export default Achievements;
