export const createTaskTitle = (taskTitles, newTaskTitle) => {
  const newTask = { name: newTaskTitle, tasks: [] };
  return [...taskTitles, newTask];
};

export const createTask = (
  taskTitles,
  taskTitleIndex,
  taskName,
  taskDetails,
  taskPriority,
  taskDueDate
) => {
  const newTask = {
    name: taskName,
    details: taskDetails,
    priority: taskPriority,
    dueDate: taskDueDate,
    completed: false,
    subtasks: [],
  };
  const newTaskTitles = [...taskTitles];
  newTaskTitles[taskTitleIndex].tasks.push(newTask);
  return newTaskTitles;
};

export const createSubTask = (
  taskTitles,
  taskTitleIndex,
  taskIndex,
  subTaskName,
  subTaskDetails,
  subTaskPriority,
  subTaskDueDate
) => {
  const newSubTask = {
    name: subTaskName,
    details: subTaskDetails,
    priority: subTaskPriority,
    dueDate: subTaskDueDate,
    completed: false,
  };
  const newTaskTitles = [...taskTitles];
  newTaskTitles[taskTitleIndex].tasks[taskIndex].subtasks.push(newSubTask);
  return newTaskTitles;
};
