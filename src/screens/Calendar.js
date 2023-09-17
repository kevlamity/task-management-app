import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Task from "../components/Task";

const CalendarScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [tasks, setTasks] = useState([]);

  const date = new Date();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const today = new Date().toISOString().split("T")[0];

  const currentDate = moment();
  const overdueTasks = tasks.filter((task) =>
    moment(task.dueDate, "MM/DD/YYYY").isBefore(currentDate)
  );
  const upcomingTasks = tasks.filter(
    (task) => !moment(task.dueDate, "MM/DD/YYYY").isBefore(currentDate)
  );

  const firstDayOfMonthStr = firstDayOfMonth.toISOString().split("T")[0];
  const lastDayOfMonthStr = lastDayOfMonth.toISOString().split("T")[0];

  useEffect(() => {
    // retrieve projects from AsyncStorage
    const getProjects = async () => {
      try {
        const projectsJSON = await AsyncStorage.getItem("@projects");
        const projects = JSON.parse(projectsJSON) || [];

        if (projects !== null) {
          const allTasks = [];
          projects.forEach((project) => {
            project.taskTitles.forEach((taskTitle) => {
              if (taskTitle.tasks && taskTitle.tasks.length > 0) {
                taskTitle.tasks.forEach((task) => {
                  const dueDate = moment(task.dueDate, "MM/DD/YYYY");
                  if (dueDate.month() === selectedMonth) {
                    allTasks.push(task);
                  }
                });
              }
            });
          });
          setTasks(allTasks);
          console.log(allTasks);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getProjects();
  }, [selectedMonth]);

  const onMonthChange = (month) => {
    setSelectedMonth(new Date(month.dateString).getMonth());
  };

  const convertDateFormat = (dateStr) => {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const getMarkedDates = (tasks) => {
    const markedDates = {};
  
    tasks.forEach((task) => {
      const dueDate = convertDateFormat(task.dueDate);
      if (markedDates[dueDate]) {
        // date already marked
      } else {
        markedDates[dueDate] = {
          marked: true,
          dotColor: 'white',
        };
      }
    });
  
    return markedDates;
  };
  
  const markedDates = getMarkedDates(tasks);

  

  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: "#47525e",
          calendarBackground: "#47525e",
          textSectionTitleColor: "white",
          dayTextColor: "white",
          todayTextColor: "white",
          selectedDayTextColor: "white",
          monthTextColor: "white",
          indicatorColor: "white",
          selectedDayBackgroundColor: "#333248",
          arrowColor: "white",
          // ...other colors
        }}
        // Initially visible month. Default = Date()
        current={Date()}
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        minDate={firstDayOfMonthStr}
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        maxDate={lastDayOfMonthStr}
        // Handler which gets executed on day press. Default = undefined
        onDayPress={(day) => {
          console.log("selected day", day);
        }}
        markedDates={{
          ...markedDates,
          [today]: { selected: true, selectedColor: "#999" },
        }}
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
        monthFormat={"MMMM yyyy"}
        // Hide month navigation arrows. Default = false
        hideArrows={false}
        disableMonthChange={false}
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        onPressArrowRight={(addMonth) => addMonth()}
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
        // day from another month that is visible in calendar page. Default = false
        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
        firstDay={1}
        // Show week numbers to the left. Default = false
        showWeekNumbers={false}
        onMonthChange={onMonthChange}
      />

<ScrollView style={styles.tasksContainer}>
    <Text style={styles.sectionHeader}>Overdue Tasks</Text>
    {overdueTasks.map((task, index) => (
      <Task
        taskIndex={index}
        task={task}
        disableAddSubTask={true}
        key={index}
      />
    ))}
    <Text style={styles.sectionHeader}>Upcoming Tasks</Text>
    {upcomingTasks.map((task, index) => (
      <Task
        taskIndex={index}
        task={task}
        disableAddSubTask={true}
        key={index}
      />
    ))}
  </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#47525e",
  },
  tasksContainer: {
    padding: 10,
  },
  task: {
    backgroundColor: "#333248",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskText: {
    color: "white",
  },
  sectionHeader:{
    borderBottomColor: "#39ff14",
    borderBottomWidth:1,
    fontSize:20,
    color:"white",
  }
});

export default CalendarScreen;
