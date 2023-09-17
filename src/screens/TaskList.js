import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import TaskTitle from "../components/TaskTitle";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useDeepCompareEffect from "use-deep-compare-effect";

const TaskList = () => {
  const route = useRoute();
  const { selectedProject, projects } = route.params;

  const [taskTitles, setTaskTitles] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const addTaskTitle = () => {
    // console.log("newTaskTitle:", newTaskTitle);
    const newTask = { name: newTaskTitle, tasks: [] };

    setTaskTitles((prevTaskTitles) => {
      const updatedTaskTitles = [...prevTaskTitles, newTask];
      addTaskTitleToProject(selectedProject.name, updatedTaskTitles);
      return updatedTaskTitles;
    });

    setNewTaskTitle("");
    setModalVisible(false);
  };

  const addTask = async (
    taskTitleIndex,
    taskName,
    taskDetails,
    taskPriority,
    taskDueDate
  ) => {
    const newTask = {
      name: taskName,
      details: taskDetails,
      priority: taskPriority,
      dueDate: taskDueDate,
      completed: false,
      subtasks: [],
    };
    const newTaskTitles = [...taskTitles];
    newTaskTitles[taskTitleIndex].tasks.push(newTask);
    setTaskTitles(newTaskTitles);

    const updatedProjects = updateProject(newTaskTitles);

    // Update the projects object in @projects with update project with new task title(s)
    await AsyncStorage.setItem("@projects", JSON.stringify(updatedProjects));
  };

  const addSubTask = async (
    taskTitleIndex,
    taskIndex,
    subTaskName,
    subTaskDetails,
    subTaskPriority,
    subTaskDueDate
  ) => {
    const newTaskTitles = [...taskTitles];

    const newSubTask = {
      name: subTaskName,
      details: subTaskDetails,
      priority: subTaskPriority,
      dueDate: subTaskDueDate,
      completed: false,
    };

    newTaskTitles[taskTitleIndex].tasks[taskIndex].subtasks.push(newSubTask);
    setTaskTitles(newTaskTitles);

    const updatedProjects = updateProject(newTaskTitles);

    // Update the projects object in @projects with update project with new task title(s)
    await AsyncStorage.setItem("@projects", JSON.stringify(updatedProjects));
  };

  const addTaskTitleToProject = async (projectName, updatedTaskTitles) => {
    try {
      // Find selected project and update taskTitle array

      const updatedProjects = updateProject(updatedTaskTitles);

      // Update the projects object in @projects with update project with new task title(s)
      await AsyncStorage.setItem("@projects", JSON.stringify(updatedProjects));

      console.log("Updated projects is :", updatedProjects);

      // Update projects state
      // setProjects(updatedProjects);

      console.log("Task title added successfully");
    } catch (e) {
      console.error("Failed to add the task title: ", e);
    }
  };

  const toggleTaskCompletion = async (
    taskTitleIndex,
    taskIndex,
    subTaskIndex
  ) => {
    const newTaskTitles = [...taskTitles];

    if (subTaskIndex !== undefined) {
      // Toggle completion of subtask
      // console.log("this");
      const completed =
        newTaskTitles[taskTitleIndex].tasks[taskIndex].subtasks[subTaskIndex]
          .completed;
      newTaskTitles[taskTitleIndex].tasks[taskIndex].subtasks[
        subTaskIndex
      ].completed = !completed;
    } else {
      // console.log("that");
      // Toggle completion of task
      const completed =
        newTaskTitles[taskTitleIndex].tasks[taskIndex].completed;
      newTaskTitles[taskTitleIndex].tasks[taskIndex].completed = !completed;
    }
    setTaskTitles(newTaskTitles);

    // console.log("Checked as completed", newTaskTitles);

    const updatedProjects = updateProject(newTaskTitles);

    // Update the projects object in @projects with update project with new task title(s)
    await AsyncStorage.setItem("@projects", JSON.stringify(updatedProjects));
  };

  const updateProject = (updatedTaskTitles) => {
    const updatedProjects = projects.map((project) => {
      if (project.name === selectedProject.name) {
        console.log("Found matching project");

        return {
          ...project,
          taskTitles: updatedTaskTitles,
        };
      } else {
        console.log("Matching project not found");
        return project;
      }
    });
    return updatedProjects;
  };

  // console.log("selected project is ", selectedProject);
  // console.log("All projects are ", projects);

  useEffect(() => {
    // set existing taskTitle to state
    setTaskTitles(selectedProject.taskTitles);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.ProjectTitle}>{selectedProject.name}</Text>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.textInput}
              placeholder="Task Title"
              onChangeText={setNewTaskTitle}
            />
            <TouchableOpacity style={styles.button} onPress={addTaskTitle}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {taskTitles.map((taskTitle, index) => (
          <TaskTitle
            toggleTaskCompletion={toggleTaskCompletion}
            taskTitleIndex={index}
            style={styles.task_title}
            key={index}
            title={taskTitle.name}
            tasks={taskTitle.tasks}
            onAddTask={(taskName, taskDetails, taskPriority, taskDueDate) =>
              addTask(index, taskName, taskDetails, taskPriority, taskDueDate)
            }
            onAddSubTask={(
              taskIndex,
              subTaskName,
              subTaskDetails,
              subTaskPriority,
              subTaskDueDate
            ) =>
              addSubTask(
                index,
                taskIndex,
                subTaskName,
                subTaskDetails,
                subTaskPriority,
                subTaskDueDate
              )
            }
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47525e",
  },
  ProjectTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    paddingTop: 10,
    paddingLeft: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#39ff14",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  textInput: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#333",
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
  },
  task_title: {
    width: 300,
  },
});

export default TaskList;
