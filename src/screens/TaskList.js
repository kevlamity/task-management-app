import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskList = ({ route }) => {
  const { projectName } = route.params;

  return (
    <View style={styles.container}>
      <Text>Task List for {projectName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskList;
