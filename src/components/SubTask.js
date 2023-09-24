import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const SubTask = ({
  toggleTaskCompletion,
  taskTitleIndex,
  taskIndex,
  subTaskindex,
  subTask,
  disableAddSubTask,
  onEditSubTask,
  handleDeleteSubtask,
}) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleToggleCompletion = () => {
    toggleTaskCompletion(taskTitleIndex, taskIndex, subTaskindex);
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
    console.log("toggleDetailsVisble");
    setDetailsVisible(!detailsVisible);
  };

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

  const onDeleteSubTask = (taskTitleIndex, taskIndex, subtaskIndex) => {
    handleDeleteSubtask(taskTitleIndex, taskIndex, subtaskIndex);

    // Closes swipe menu after deleting a task
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const swipeableRef = useRef(null);

  const renderRightActions = () => {
    return (
      <View style={{ flexDirection: "row", alignContent: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            justifyContent: "center",
            width: 50,
          }}
          onPress={() => onEditSubTask(subTask, taskIndex, subTaskindex)}
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
          onPress={() =>
            onDeleteSubTask(taskTitleIndex, taskIndex, subTaskindex)
          }
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

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsVisible}
        onRequestClose={toggleDetailsVisible}
      >
        <View style={styles.modalView}>
          <Text style={{ fontSize: 25 }}>{subTask.name}</Text>
          <Text style={{ marginBottom: 20, marginTop: 5 }}>
            {subTask.details}
          </Text>
          <Text>Priority: {subTask.priority}</Text>
          <Text>Due Date: {subTask.dueDate}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#999", marginTop: 15, padding: 10 }}
            onPress={toggleDetailsVisible}
          >
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
        <View style={styles.subtask_box}>
          {disableAddSubTask ? (
            <TouchableOpacity>
              <View
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: getPriorityColor(subTask.priority),
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 35,
                }}
              >
                {subTask.completed && (
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      borderRadius: 6,
                      backgroundColor: getPriorityColor(subTask.priority),
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
                  borderColor: getPriorityColor(subTask.priority),
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 35,
                }}
              >
                {subTask.completed && (
                  <View
                    style={{
                      height: 12,
                      width: 12,
                      borderRadius: 6,
                      backgroundColor: getPriorityColor(subTask.priority),
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
                textDecorationLine: subTask.completed ? "line-through" : "none",
                fontSize: 18,
                color: "white",
                marginLeft: 10,
              }}
            >
              {subTask.name}
            </Text>
            <Text
              style={{
                textDecorationLine: subTask.completed ? "line-through" : "none",
                marginLeft: 10,
                fontSize: 17,
                color: "#969faa",
              }}
            >
              {subTask.details}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleDetailsVisible}
            style={{ marginLeft: 55, flex: 2, flexDirection: "row" }}
          >
            <Text
              style={{ color: isOverdue(subTask.dueDate) ? "red" : "#39ff14" }}
            >
              {subTask.dueDate}
            </Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  subtask_box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5E6B7A",
    borderBottomColor: "#8492A6",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
});

export default SubTask;
