import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  FlatList,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskBoard = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ddd");
  const colors = ["#ddd", "#fcc", "#cfc", "#ccf", "#ffc", "#fcf"];
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const getProjects = async () => {
    try {
      const value = await AsyncStorage.getItem("@projects");
      if (value !== null) {
        setProjects(JSON.parse(value));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const createProject = async () => {
    const newProject = {
      name: projectName,
      color: selectedColor,
      created_date_time: projectToEdit ? projectToEdit.created_date_time : new Date(),
    };

    const newProjects = projectToEdit
      ? projects.map((p) =>
          p.created_date_time === projectToEdit.created_date_time ? newProject : p
        )
      : [...projects, newProject];

    try {
      const jsonValue = JSON.stringify(newProjects);
      await AsyncStorage.setItem("@projects", jsonValue);
      console.log("Project saved successfully");
      setProjects(newProjects);
      setProjectName("");
      setSelectedColor("#fff");
      setProjectToEdit(null);
      setModalVisible(false);
    } catch (e) {
      console.error("Failed to save the project: ", e);
    }
  };

  const ProjectCard = ({ project, onEdit, onDelete, onCancel }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
      <View>
        <TouchableOpacity
          onLongPress={() => setMenuVisible(true)}
          style={[styles.card, { backgroundColor: project.color }]}
          onPress={() =>
            navigation.navigate("TaskList", { projectName: project.name })
          }
        >
          <Text style={styles.cardText}>{project.name}</Text>
          <Text style={styles.cardText}>
            {" "}
            {new Date(project.created_date_time).toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </Text>
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.contextMenu}>
            <TouchableOpacity
              onPress={() => {
                onEdit(project);
                setMenuVisible(false);
              }}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onDelete(project);
                setMenuVisible(false);
              }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onCancel(project);
                setMenuVisible(false);
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const editProject = (project) => {
    setProjectToEdit(project);
    setModalVisible(true);
  };

  const deleteProject = async (projectToDelete) => {
    try {
      // 1. Fetch the current list of projects
      const projectsJSON = await AsyncStorage.getItem("@projects");
      const projects = projectsJSON ? JSON.parse(projectsJSON) : [];

      // 2. Filter out the project to delete
      const updatedProjects = projects.filter(
        (project) => project.name !== projectToDelete.name
      );

      // 3. Save the updated list of projects
      await AsyncStorage.setItem("@projects", JSON.stringify(updatedProjects));
      setProjects(updatedProjects);

      console.log("Project deleted successfully");
    } catch (e) {
      console.error("Failed to delete the project: ", e);
    }
  };

  const cancelEdit = () => {
    console.log("cancelEdit");
  };
  const saveProject = async () => {
    const newProjects = projects.map((p) =>
      p.name === projectToEdit.name
        ? { ...p, name: projectName, color: selectedColor }
        : p
    );
    try {
      const jsonValue = JSON.stringify(newProjects);
      await AsyncStorage.setItem("@projects", jsonValue);
      console.log("Project updated successfully");
      setModalVisible(false);
      setProjectToEdit(null);
      getProjects();
    } catch (e) {
      console.error("Failed to save the project: ", e);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    if (projectToEdit) {
      setProjectName(projectToEdit.name);
      setSelectedColor(projectToEdit.color);
    }
  }, [projectToEdit]);

  useEffect(() => {
    if (!modalVisible) {
      setProjectName("");
      setSelectedColor("#fff");
      setProjectToEdit(null);
    }
  }, [modalVisible]);

  console.log("projects object is", projects);

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalView}>
          <TextInput
            style={styles.textInput}
            placeholder="Project Name"
            onChangeText={(text) => setProjectName(text)}
          />
          <FlatList
            data={colors}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.colorButton, { backgroundColor: item }]}
                onPress={() => setSelectedColor(item)}
              />
            )}
            horizontal
          />
          {projectToEdit ? (
            <TouchableOpacity onPress={saveProject}>
              <Text>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={createProject}>
              <Text>Create</Text>
            </TouchableOpacity>
          )}
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <View style={styles.container}>
        {projects.map((project, index) => (
          <ProjectCard
            style={styles.editActions}
            key={index}
            project={project}
            onEdit={(project) => editProject(project)}
            onDelete={(project) => {
              Alert.alert(
                "Delete Project",
                "Are you sure you want to delete this project?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => deleteProject(project) },
                ],
                { cancelable: false }
              );
            }}
            onCancel={(project) => cancelEdit(project)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => navigation.navigate("Calendar")}
      >
        <Icon name="calendar-outline" size={30} color="white" />
      </TouchableOpacity>

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
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginVertical: 15,

  },
  cardText: {
    fontSize: 18,
    paddingVertical: 10,
    textAlign: "center",
  },
  calendarButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: "#333",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#333",
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
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  contextMenu: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default TaskBoard;
