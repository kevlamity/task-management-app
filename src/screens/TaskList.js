import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import TaskTitle from "../components/TaskTitle";
import Icon from "react-native-vector-icons/Ionicons";

const TaskList = () => {
  const route = useRoute();
  const { projectName } = route.params;

  const [taskTitles, setTaskTitles] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const addTaskTitle = () => {
    setTaskTitles([...taskTitles, { name: newTaskTitle, tasks: [] }]);
    setNewTaskTitle("");
    setModalVisible(false);
  };

  const addTask = (taskTitleIndex, taskName) => {
    const newTaskTitles = [...taskTitles];
    newTaskTitles[taskTitleIndex].tasks.push({ name: taskName, subtasks: [] });
    setTaskTitles(newTaskTitles);
  };

  const addSubTask = (taskTitleIndex, taskIndex, subTaskName) => {
    const newTaskTitles = [...taskTitles];
    newTaskTitles[taskTitleIndex].tasks[taskIndex].subtasks.push({
      name: subTaskName,
      completed: false,
    });
    setTaskTitles(newTaskTitles);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.ProjectTitle}>{projectName}</Text>

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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add-outline" size={30} color="white" />
      </TouchableOpacity>

      {taskTitles.map((taskTitle, index) => (
        <TaskTitle
          key={index}
          title={taskTitle.name}
          tasks={taskTitle.tasks}
          onAddTask={(taskName) => addTask(index, taskName)}
          onAddSubTask={(taskIndex, subTaskName) =>
            addSubTask(index, taskIndex, subTaskName)
          }
        />
      ))}
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
});

export default TaskList;
