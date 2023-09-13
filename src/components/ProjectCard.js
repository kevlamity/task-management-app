const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View>
      <TouchableWithoutFeedback onLongPress={() => setMenuVisible(true)}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: project.color }]}
          onPress={() =>
            navigation.navigate("TaskList", { projectName: project.name })
          }
        >
          <Text style={styles.cardText}>{project.name}</Text>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
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
        </View>
      )}
    </View>
  );
};
