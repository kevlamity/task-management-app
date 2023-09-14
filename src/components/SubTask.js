import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const SubTask = ({ subTask, taskCompleted }) => {
    const [completed, setCompleted] = useState(taskCompleted);
  
    useEffect(() => {
      setCompleted(taskCompleted);
    }, [taskCompleted]);
  
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setCompleted(!completed)}>
          <Text>{completed ? '☑' : '☐'}</Text>
        </TouchableOpacity>
        <Text style={{ textDecorationLine: completed ? 'line-through' : 'none' }}>{subTask}</Text>
      </View>
    );
  };
  

export default SubTask;
