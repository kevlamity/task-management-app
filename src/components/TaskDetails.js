// TaskDetails.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const TaskDetails = ({ task, onAddSubTask }) => {
  const [newSubTask, setNewSubTask] = useState('');

  return (
    <View>
      <Text>Task Name: {task.name}</Text>
      <Text>Task Details: {task.details}</Text>
      <Text>Priority: {task.priority}</Text>
      <TextInput
        placeholder="Add SubTask"
        onChangeText={setNewSubTask}
        value={newSubTask}
      />
      <TouchableOpacity onPress={() => onAddSubTask(newSubTask)}>
        <Text>Add SubTask</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskDetails;
