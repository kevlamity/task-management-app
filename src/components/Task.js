import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import SubTask from "./SubTask";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Ionicons";

const Task = ({ task, onAddSubTask }) => {
  const [newSubTask, setNewSubTask] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const [newSubTaskDetails, setNewSubTaskDetails] = useState("");
  const [newSubTaskPriority, setNewSubTaskPriority] = useState("1");
  const [newSubTaskDueDate, setNewSubTaskDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleCompleted = () => {
    setCompleted(!completed);
  };

  const toggleDetailsVisible = () => {
    setDetailsVisible(!detailsVisible);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate ? new Date(selectedDate) : new Date();
    setNewSubTaskDueDate(currentDate);
    setShowDatePicker(false);
  };

  const dateString = newSubTaskDueDate.toLocaleDateString();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "1":
        return "red";
      case "2":
        return "orange";
      case "3":
        return "blue";
      case "4":
        return "green";
      default:
        return "gray";
    }
  };
useEffect(() => {
    console.log(task);
  }, []);
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
            placeholder="Sub Task Name"
            onChangeText={(text) => setNewSubTask(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Sub Task Details"
            onChangeText={(text) => setNewSubTaskDetails(text)}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ marginRight: 10 }}>Priority:</Text>
            <Picker
              selectedValue={newSubTaskPriority}
              style={{ height: 50, width: 100 }}
              onValueChange={(itemValue, itemIndex) =>
                setNewSubTaskPriority(itemValue)
              }
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              <Text>Due Date: </Text>
              <Text>{dateString}</Text>
            </View>
            {showDatePicker && newSubTaskDueDate && (
              <DateTimePicker
                value={newSubTaskDueDate}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar" size={27} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onAddSubTask(
                newSubTask,
                newSubTaskDetails,
                newSubTaskPriority,
                newSubTaskDueDate.toLocaleDateString()
              );
              setNewSubTask("");
              setNewSubTaskDetails("");
              setNewSubTaskPriority("1");
              setNewSubTaskDueDate(new Date());
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsVisible}
        onRequestClose={toggleDetailsVisible}
      >
        <View style={styles.modalView}>
          <Text>Task Name: {task.name}</Text>
          <Text>Task Details: {task.details}</Text>
          <Text>Priority: {task.priority}</Text>
          <Text>Due Date: {task.dueDate}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text>Add Sub Task</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDetailsVisible}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={toggleCompleted}>
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: getPriorityColor(task.priority),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {completed && (
              <View
                style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: getPriorityColor(task.priority),
                }}
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleDetailsVisible} style={{ flex: 1 }}>
          <Text
            style={{
              textDecorationLine: completed ? "line-through" : "none",
            }}
          >
            {task.name}
          </Text>
        </TouchableOpacity>
      </View>

      {task.subtasks.map((subtask, index) => (
        <SubTask key={index} subTask={subtask} taskCompleted={completed} />
      ))}
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
  task_box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5E6B7A",
    borderBottomColor: "#8492A6",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
});

export default Task;
