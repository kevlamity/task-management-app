export const createProject = (projects, projectName, selectedColor, projectToEdit) => {
    const newProject = {
        name: projectName,
        color: selectedColor,
        created_date_time: projectToEdit
            ? projectToEdit.created_date_time
            : new Date().toISOString(),
        taskTitles: [],
    };

    const newProjects = projectToEdit
        ? projects.map((p) =>
            p.created_date_time === projectToEdit.created_date_time
                ? newProject
                : p
          )
        : [...projects, newProject];

    return newProjects;
};

export const deleteProject = (projects, projectToDelete) => {
    return projects.filter(
      (project) => project.name !== projectToDelete.name
    );
  };

  export const updateProjectWithTaskTitle = (projects, projectName, updatedTaskTitles) => {
    return projects.map((project) => 
        project.name === projectName
            ? { ...project, taskTitles: updatedTaskTitles }
            : project
    );
};