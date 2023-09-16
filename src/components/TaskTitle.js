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
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const TaskTitle = ({ title, tasks, onAddTask, onAddSubTask }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDetails, setNewTaskDetails] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("1");
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate ? new Date(selectedDate) : new Date();
    setNewTaskDueDate(currentDate);
    setShowDatePicker(false);
  };

  const dateString = newTaskDueDate.toLocaleDateString();

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
            onChangeText={(text) => setNewTaskName(text)}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Task Details"
            onChangeText={(text) => setNewTaskDetails(text)}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>

          
          <Text style={{marginRight: 10}}>Priority:</Text>
    <Picker
      selectedValue={newTaskPriority}
      style={{ height: 50, width: 100 }}
      onValueChange={(itemValue, itemIndex) => setNewTaskPriority(itemValue)}
    >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
          </Picker>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>

          <View style={{flexDirection: 'row', alignItems: 'center', marginRight:15 }}>
            <Text>Due Date: </Text>
            <Text>{dateString}</Text>
            </View>
            {showDatePicker && newTaskDueDate && (
              <DateTimePicker
              
                value={newTaskDueDate}
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
              onAddTask(
                newTaskName,
                newTaskDetails,
                newTaskPriority,
                newTaskDueDate.toLocaleDateString()
              );

              setNewTaskName("");
              setNewTaskDetails("");
              setNewTaskPriority("1");
              setNewTaskDueDate(new Date());
              setShowDatePicker(false);
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

      <View style={styles.title_row}>
        <Text style={styles.title_name}>{title}</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon name="add" size={30} color="#39FF14" />
        </TouchableOpacity>
      </View>

      {tasks.map((task, index) => (
        <Task
          key={index}
          task={task}
          onAddSubTask={(subTaskName, subTaskDetails, subTaskPriority, subTaskDueDate) => onAddSubTask(index, subTaskName , subTaskDetails, subTaskPriority, subTaskDueDate)}
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
  title_row: {
    borderBottomWidth: 1,
    paddingLeft: 12,
    paddingBottom: 5,
    borderBottomColor: "#39FF14",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title_name: {
    fontSize: 25,
    color: "white",
  },
});

export default TaskTitle;
