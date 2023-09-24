import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import Task from "./Task";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertToJSDate } from "../helpers/dateHelpers";
import { isFieldValid } from "../helpers/validationHelpers";

const TaskTitle = ({
  toggleTaskCompletion,
  taskTitleIndex,
  title,
  tasks,
  onAddTask,
  onAddSubTask,
  handleDeleteTaskTitle,
  handleEditTaskTitle,
  handleEditTask,
  handleDeleteTask,
  handleEditSubtask,
  handleDeleteSubtask,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDetails, setNewTaskDetails] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("1");
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskIndexToEdit, setTaskIndexToEdit] = useState("");

  const [modalType, setModalType] = useState("add");
  const [taskToEdit, setTaskToEdit] = useState("");
  const [isError, setIsError] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate ? new Date(selectedDate) : new Date();
    setNewTaskDueDate(currentDate);
    setShowDatePicker(false);
  };

  console.log("newTaskDueDate is: ", newTaskDueDate);
  let dateString;

  newTaskDueDate instanceof Date
    ? (dateString = newTaskDueDate.toLocaleDateString())
    : (dateString = newTaskDueDate);

  const handleAddTask = () => {
    // console.log("handleAddTask()");

    if (!isFieldValid(newTaskName)) {
      setIsError(true);
      return;
    } else {
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
    }
  };

  const onEditTask = (task, taskIndex) => {
    console.log("original task is: ", task);
    setTaskIndexToEdit(taskIndex);
    setTaskToEdit(task);
    setNewTaskName(task.name);
    setNewTaskDetails(task.details);
    setNewTaskPriority(task.priority);
    setNewTaskDueDate(convertToJSDate(task.dueDate));
    setModalType("edit");
    setModalVisible(true);
  };

  const onSaveEditTask = () => {
    // console.log(taskToEdit);
    if (!isFieldValid(newTaskName)) {
      setIsError(true);
      return;
    } else {
      const updatedTask = {
        ...taskToEdit,
        name: newTaskName,
        details: newTaskDetails,
        priority: newTaskPriority,
        dueDate: newTaskDueDate.toLocaleDateString(),
      };

      console.log("upatedTask is: ", updatedTask);

      handleEditTask(taskTitleIndex, taskIndexToEdit, updatedTask);
      setModalVisible(false);
    }
  };

  return (
    <View>
      {/* Modal for adding task and its details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <Text style={{ fontSize: 20, marginBottom: 30 }}>
            {modalType == "add" ? "Add Task" : "Edit Task"}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Task Name"
            onChangeText={(text) => setNewTaskName(text)}
            value={newTaskName}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Task Details"
            onChangeText={(text) => setNewTaskDetails(text)}
            value={newTaskDetails}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ marginLeft: 220 }}>Priority:</Text>
            <Picker
              selectedValue={newTaskPriority}
              style={{ height: 50, width: 100 }}
              onValueChange={(itemValue, itemIndex) =>
                setNewTaskPriority(itemValue)
              }
              value={newTaskPriority}
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
            {showDatePicker && newTaskDueDate && (
              <DateTimePicker
                value={newTaskDueDate}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar" size={27} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              modalType === "add" ? handleAddTask() : onSaveEditTask();
            }}
          >
            <Text style={styles.buttonText}>
              {modalType === "add" ? "Add" : "Save"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
          {isError && (
            <Text style={{ color: "red", marginTop: 10 }}>
              Task name cannot be empty
            </Text>
          )}
        </View>
      </Modal>

      {/* Show task title row, with edit, delete and add button */}
      <View style={styles.title_row}>
        <View style={{ flexDirection: "row", flex: 5 }}>
          <Text style={styles.title_name}>{title}</Text>
          <View style={{ marginLeft: 10, flexDirection: "row", marginTop: 5 }}>
            <TouchableOpacity onPress={() => handleEditTaskTitle(title)}>
              <FontAwesome5 size={22} name="edit" color={"lightgray"} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => {
                Alert.alert(
                  "Are you sure you want to delete this task title?",
                  "This will delete all tasks and subtasks under it as well",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    { text: "OK", onPress: () => handleDeleteTaskTitle(title) },
                  ],
                  { cancelable: false }
                );
              }}
            >
              <Ionicons size={23} name="ios-trash-outline" color={"red"} />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={30} color="#39FF14" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Displays all tasks under the task title, with props */}
      {tasks.map((task, index) => (
        <Task
          toggleTaskCompletion={toggleTaskCompletion}
          taskTitleIndex={taskTitleIndex}
          taskIndex={index}
          key={index}
          task={task}
          disableAddSubTask={false}
          onEditTask={onEditTask}
          handleDeleteTask={handleDeleteTask}
          handleEditSubtask={handleEditSubtask}
          handleDeleteSubtask={handleDeleteSubtask}
          onAddSubTask={(
            subTaskName,
            subTaskDetails,
            subTaskPriority,
            subTaskDueDate
          ) =>
            onAddSubTask(
              index,
              subTaskName,
              subTaskDetails,
              subTaskPriority,
              subTaskDueDate
            )
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
    marginTop: 300,
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
    paddingTop: 10,
    flexDirection: "row",
  },
  title_name: {
    fontSize: 25,
    color: "white",
  },
});

export default TaskTitle;
