import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import Task from "./Task";
import Icon from "react-native-vector-icons/Ionicons";

const TaskTitle = ({ title, tasks, onAddTask, onAddSubTask }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState("");

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.textInput}
            placeholder="Task Name"
            onChangeText={(text) => setNewTask(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onAddTask(newTask);
              setNewTask("");
              setModalVisible(false);
            }}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>{title}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text>Add Task</Text>
        </TouchableOpacity>
      </View>

      {tasks.map((task, index) => (
        <Task
          key={index}
          task={task}
          onAddSubTask={(subTaskName) => onAddSubTask(index, subTaskName)}
        />
      ))}
      {/* <TouchableOpacity
          onPress={() => {
            onAddTask(newTask);
            setNewTask('');
          }}
        >
          <Text>Add Task</Text>
        </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47525e",
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

export default TaskTitle;
