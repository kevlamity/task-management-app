import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native";

const SubTask = ({ subTask, taskCompleted }) => {
  const [completed, setCompleted] = useState(taskCompleted);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleCompleted = () => {
    setCompleted(!completed);
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
        return "green";
      default:
        return "gray";
    }
  };

  useEffect(() => {
    setCompleted(taskCompleted);
  }, [taskCompleted]);

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsVisible}
        onRequestClose={toggleDetailsVisible}
      >
        <View style={styles.modalView}>
          <Text>Sub Task Name: {subTask.name}</Text>
          <Text>Sub Task Details: {subTask.details}</Text>
          <Text>Priority: {subTask.priority}</Text>
          <Text>Due Date: {subTask.dueDate}</Text>
          <TouchableOpacity onPress={toggleDetailsVisible}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity onPress={toggleCompleted}>
        <View
          style={{
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: getPriorityColor(subTask.priority),
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
                backgroundColor: getPriorityColor(subTask.priority),
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
          {subTask.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SubTask;
