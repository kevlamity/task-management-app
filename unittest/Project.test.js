import {
  createProject,
  deleteProject,
  updateProjectWithTaskTitle,
} from "../src/helpers/projectHelpers";
import { createTaskTitle, createTask, createSubTask } from "../src/helpers/taskHelpers";

console.log("Testing Project board functions TaskBoard.js");
test("createProject should add a new project", () => {
  const projects = [
    {
      name: "Project 1",
      color: "#ddd",
      created_date_time: "2022-01-01T00:00:00.000Z",
      taskTitles: [],
    },
  ];
  const projectName = "New Project";
  const selectedColor = "#fcc";
  const projectToEdit = null;
  const result = createProject(
    projects,
    projectName,
    selectedColor,
    projectToEdit
  );
  expect(result).toEqual([
    ...projects,
    {
      name: "New Project",
      color: "#fcc",
      created_date_time: expect.any(String),
      taskTitles: [],
    },
  ]);
});

test("createProject should edit an existing project", () => {
  const projects = [
    {
      name: "Project 1",
      color: "#ddd",
      created_date_time: "2022-01-01T00:00:00.000Z",
      taskTitles: [],
    },
  ];
  const projectName = "Edited Project";
  const selectedColor = "#fcc";
  const projectToEdit = projects[0];
  const result = createProject(
    projects,
    projectName,
    selectedColor,
    projectToEdit
  );
  expect(result).toEqual([
    {
      name: "Edited Project",
      color: "#fcc",
      created_date_time: "2022-01-01T00:00:00.000Z",
      taskTitles: [],
    },
  ]);
});

test("deleteProject should remove a project", () => {
  const projects = [
    {
      name: "Project 1",
      color: "#ddd",
      created_date_time: "2022-01-01T00:00:00.000Z",
      taskTitles: [],
    },
    {
      name: "Project 2",
      color: "#eee",
      created_date_time: "2022-01-01T01:00:00.000Z",
      taskTitles: [],
    },
  ];
  const projectToDelete = projects[1];
  const result = deleteProject(projects, projectToDelete);
  expect(result).toEqual([projects[0]]);
});

console.log("Testing task list functions TaskList.js");
test("createTaskTitle should add a new task title", () => {
  const taskTitles = [{ name: "Task 1", tasks: [] }];
  const newTaskTitle = "New Task";
  const result = createTaskTitle(taskTitles, newTaskTitle);
  expect(result).toEqual([...taskTitles, { name: "New Task", tasks: [] }]);
});

test("updateProjectWithTaskTitle should update a project with a new task title", () => {
  const projects = [
    {
      name: "Project 1",
      color: "#ddd",
      created_date_time: "2022-01-01T00:00:00.000Z",
      taskTitles: [{ name: "Task 1", tasks: [] }],
    },
    {
      name: "Project 2",
      color: "#eee",
      created_date_time: "2022-01-01T01:00:00.000Z",
      taskTitles: [],
    },
  ];
  const projectName = "Project 1";
  const updatedTaskTitles = [
    ...projects[0].taskTitles,
    { name: "New Task", tasks: [] },
  ];
  const result = updateProjectWithTaskTitle(
    projects,
    projectName,
    updatedTaskTitles
  );
  expect(result).toEqual([
    {
      name: "Project 1",
      color: "#ddd",
      created_date_time: "2022-01-01T00:00:00.000Z",
      taskTitles: updatedTaskTitles,
    },
    projects[1],
  ]);
});

test("createTask should add a new task to a task title", () => {
  const taskTitles = [{ name: "Task Title 1", tasks: [] }];
  const taskTitleIndex = 0;
  const taskName = "New Task";
  const taskDetails = "New Task Details";
  const taskPriority = "High";
  const taskDueDate = "2023-09-20";
  const result = createTask(
    taskTitles,
    taskTitleIndex,
    taskName,
    taskDetails,
    taskPriority,
    taskDueDate
  );
  expect(result).toEqual([
    {
      name: "Task Title 1",
      tasks: [
        {
          name: taskName,
          details: taskDetails,
          priority: taskPriority,
          dueDate: taskDueDate,
          completed: false,
          subtasks: [],
        },
      ],
    },
  ]);
});

test("createSubTask should add a new subtask to a task", () => {
  const taskTitles = [
    {
      name: "Task Title 1",
      tasks: [
        {
          name: "Task 1",
          details: "Task 1 Details",
          priority: "High",
          dueDate: "2023-09-20",
          completed: false,
          subtasks: [],
        },
      ],
    },
  ];
  const taskTitleIndex = 0;
  const taskIndex = 0;
  const subTaskName = "New SubTask";
  const subTaskDetails = "New SubTask Details";
  const subTaskPriority = "Medium";
  const subTaskDueDate = "2023-09-21";
  const result = createSubTask(
    taskTitles,
    taskTitleIndex,
    taskIndex,
    subTaskName,
    subTaskDetails,
    subTaskPriority,
    subTaskDueDate
  );
  expect(result).toEqual([
    {
      name: "Task Title 1",
      tasks: [
        {
          name: "Task 1",
          details: "Task 1 Details",
          priority: "High",
          dueDate: "2023-09-20",
          completed: false,
          subtasks: [
            {
              name: subTaskName,
              details: subTaskDetails,
              priority: subTaskPriority,
              dueDate: subTaskDueDate,
              completed: false,
            },
          ],
        },
      ],
    },
  ]);
});
