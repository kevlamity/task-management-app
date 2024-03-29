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
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createProject, deleteProject } from "../helpers/projectHelpers";
import {
  isFieldExceedMaxChar,
  isFieldValid,
} from "../helpers/validationHelpers";

const TaskBoard = () => {
  // Initialize necessary states to be used in the task board
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ddd");
  const colors = ["#ddd", "#fcc", "#cfc", "#ccf", "#ffc", "#fcf"];
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isError, setIsError] = useState(false);
  const projectMaxCharLength = 30;

  // Function that fetches all projects from async storage
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

  const handleCreateProject = async () => {
    if (
      isFieldExceedMaxChar(projectName, projectMaxCharLength) ||
      !isFieldValid(projectName)
    ) {
      console.log("exit");
      setIsError(true);
      return;
    } else {
      console.log("continue");
      setIsError(false);

      const newProjects = createProject(
        projects,
        projectName,
        selectedColor,
        projectToEdit
      );
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
            navigation.navigate("TaskList", {
              selectedProject: project,
              projects: projects,
            })
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
              <Text style={styles.contextMenuText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onDelete(project);
                setMenuVisible(false);
              }}
            >
              <Text style={styles.contextMenuText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onCancel(project);
                setMenuVisible(false);
              }}
            >
              <Text style={styles.contextMenuText}>Cancel</Text>
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

  const handleDeleteProject = async (projectToDelete) => {
    try {
      // 1. Fetch the current list of projects
      const projectsJSON = await AsyncStorage.getItem("@projects");
      const projects = projectsJSON ? JSON.parse(projectsJSON) : [];

      // 2. Filter out the project to delete
      const updatedProjects = deleteProject(projects, projectToDelete);

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchProjects = async () => {
        const projectsJSON = await AsyncStorage.getItem("@projects");
        const projects = JSON.parse(projectsJSON) || [];
        setProjects(projects);
      };

      fetchProjects();
    }, [])
  );

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

  // console.log("projects object is", projects);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.BoardTitle}>My Projects</Text>
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

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <Button
                style={{
                  backgroundColor: "#999",
                }}
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />

              {projectToEdit ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#39ff14",
                    padding: 10,
                    marginLeft: 140,
                  }}
                  onPress={saveProject}
                >
                  <Text
                    style={{
                      color: "white",
                    }}
                  >
                    SAVE
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#39ff14",
                    padding: 10,
                    marginLeft: 140,
                  }}
                  onPress={handleCreateProject}
                >
                  <Text
                    style={{
                      color: "white",
                    }}
                  >
                    CREATE
                  </Text>
                </TouchableOpacity>
              )}
              
            </View>
            {isError && (
                <Text style={{ color: "red", marginTop: 10 }}>
                  Project name cannot be empty, or exceeds 30 characters
                </Text>
              )}
          </View>
        </Modal>

        <View style={styles.innerContainer}>
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
                    { text: "OK", onPress: () => handleDeleteProject(project) },
                  ],
                  { cancelable: false }
                );
              }}
              onCancel={(project) => cancelEdit(project)}
            />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => navigation.navigate("Calendar")}
      >
        <Ionicons name="calendar-outline" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47525e",
  },
  innerContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  BoardTitle: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    paddingTop: 10,
    paddingLeft: 20,
  },
  card: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginVertical: 15,
    height: 140,
    width: 300,
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
    backgroundColor: "#39ff14",
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
    borderWidth: 1,
    borderColor: "white",
    marginTop: -10,
    borderRadius: 100,
  },
  contextMenuText: {
    color: "white",
    fontSize: 20,
  },
});

export default TaskBoard;
