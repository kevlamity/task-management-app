import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const TaskBoard = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ddd');
  const colors = ['#ddd', '#fcc', '#cfc', '#ccf', '#ffc', '#fcf'];

  const createProject = () => {
    console.log("Project Name: ", projectName);
    console.log("Selected Color: ", selectedColor);
    // Add your function to create a project
    setModalVisible(false);
  };

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
            onChangeText={text => setProjectName(text)}
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
          <Button title="Create Project" onPress={createProject} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('TaskList', { projectName: 'School' })}
      >
        <Text style={styles.cardText}>Schoolaaaa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.calendarButton}
        onPress={() => navigation.navigate('Calendar')}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  cardText: {
    fontSize: 18,
  },
  calendarButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textInput: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
});

export default TaskBoard;
