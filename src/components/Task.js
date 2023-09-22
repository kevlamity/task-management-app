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
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

const Task = ({
  toggleTaskCompletion,
  taskTitleIndex,
  taskIndex,
  task,
  onAddSubTask,
  disableAddSubTask,
  onEditTask,
  handleDeleteTask,
}) => {
  const [newSubTask, setNewSubTask] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  const [newSubTaskDetails, setNewSubTaskDetails] = useState("");
  const [newSubTaskPriority, setNewSubTaskPriority] = useState("1");
  const [newSubTaskDueDate, setNewSubTaskDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleToggleCompletion = () => {
    toggleTaskCompletion(taskTitleIndex, taskIndex, undefined);
  };

  const setSubTaskVisibleCloseModal = (val) => {
    if (val) {
      setDetailsVisible(false);
      setTimeout(() => setModalVisible(true), Platform.OS === "ios" ? 300 : 0);
    }
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const [month, day, year] = dueDate.split("/");
    return (
      new Date(year, month - 1, day) <
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
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
        return "#39ff14";
      default:
        return "gray";
    }
  };



  const renderRightActions = () => {
    return (
      <View style={{ flexDirection: "row", alignContent: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            justifyContent: "center",
            width: 50,
          }}
          onPress={() => onEditTask(task)}
        >
          <FontAwesome5
            name="edit"
            size={25}
            color="white"
            style={{ textAlign: "center" }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            justifyContent: "center",
            width: 50,
          }}
          onPress={() => handleDeleteTask()}
        >
          <Ionicons
            name="ios-trash-outline"
            size={25}
            color="white"
            style={{ textAlign: "center" }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // console.log(task);
  return (
    <View>
      {/* Modal for adding subtask and its details */}
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
            <Text style={{ marginLeft: 220 }}>Priority:</Text>
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
              <Ionicons name="calendar" size={27} color="#333" />
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


      {/* Modal showing task details and add task button */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsVisible}
        onRequestClose={toggleDetailsVisible}
      >
        <View style={styles.modalView}>
          <Text style={{ fontSize: 25 }}>{task.name}</Text>
          <Text style={{ marginBottom: 20, marginTop: 5 }}>{task.details}</Text>
          <Text>Priority: {task.priority}</Text>
          <Text>Due Date: {task.dueDate}</Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#999",
                padding: 10,
                marginRight: disableAddSubTask ? 0 : 160,
              }}
              onPress={toggleDetailsVisible}
            >
              <Text>Close</Text>
            </TouchableOpacity>

            {disableAddSubTask ? null : (
              <TouchableOpacity
                style={{
                  backgroundColor: "#39ff14",
                  padding: 10,
                }}
                onPress={() => setSubTaskVisibleCloseModal(true)}
              >
                <Text>Add Sub Task</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.task_box}>
          {disableAddSubTask ? (
            <TouchableOpacity>
              <View
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: getPriorityColor(task.priority),
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                {task.completed && (
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
          ) : (
            <TouchableOpacity onPress={handleToggleCompletion}>
              <View
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: getPriorityColor(task.priority),
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                {task.completed && (
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
          )}
          <TouchableOpacity
            onPress={toggleDetailsVisible}
            style={{ flex: 5, flexDirection: "col" }}
          >
            <Text
              style={{
                textDecorationLine: task.completed ? "line-through" : "none",
                marginLeft: 10,
                fontSize: 20,
                color: "white",
              }}
            >
              {task.name}
            </Text>
            <Text
              style={{
                textDecorationLine: task.completed ? "line-through" : "none",
                marginLeft: 10,
                fontSize: 17,
                color: "#969faa",
              }}
            >
              {task.details}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleDetailsVisible}
            style={{ marginLeft: 80, flex: 2, flexDirection: "row" }}
          >
            <Text
              style={{ color: isOverdue(task.dueDate) ? "red" : "#39ff14" }}
            >
              {task.dueDate}
            </Text>
          </TouchableOpacity>
        </View>
      </Swipeable>

      {task.subtasks.map((subtask, index) => (
        <SubTask
          toggleTaskCompletion={toggleTaskCompletion}
          taskTitleIndex={taskTitleIndex}
          taskIndex={taskIndex}
          subTaskindex={index}
          key={index}
          subTask={subtask}
          disableAddSubTask={disableAddSubTask}
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
  task_box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5E6B7A",
    borderBottomColor: "#8492A6",
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
});

export default Task;
