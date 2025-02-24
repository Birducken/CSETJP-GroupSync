import { FlatList, View, StyleSheet } from "react-native";
import { useState } from 'react';


import { getTasks, parseTask } from "@/services/taskFunctions"
import * as Tasks from "@/services/tasks";
import PillButton from '@/components/PillButton'
import TaskView from "@/components/TaskView";
import { useThemeColor } from "@/hooks/useThemeColor";
import TaskCreationModal from "@/components/TaskCreationModal";
import { Menu, Button } from "react-native-paper";




export default function Index() {
  const [selectedTasks, setSelectedTasks] = useState<Number[]>([]);
  const [tasks, setTasks] = useState<Tasks.Task[]>([]);
  //sort by button
  
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  var User = 'doro';
 

  //TODO: Remove nested 'then' chain-hell. 
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "name") return a.title.localeCompare(b.title);
    if (sortBy === "date") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (sortBy === "size") return (a.description?.length || 0) - (b.description?.length || 0);
    return 0;
  });


  function clearTasks() {
    setTasks([]);
  }
    

//Return render of tasks page
  return (
    <View style={styles.container}>
  
      <TaskCreationModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", paddingHorizontal: 10, marginBottom: 10 }}>
  
  
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PillButton icon={"download"} onPress={()=>getTasks(User, setTasks, tasks)} />
          <PillButton icon={"trash"} onPress={clearTasks} />
          <PillButton icon={"newItem"} onPress={()=>{setModalVisible(true)}} />
        </View>
  
        
        <View style={{ marginLeft: "auto" }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="contained" onPress={()=>{setMenuVisible(true);}}>
                Sort By
              </Button>
            }
          >
            <Menu.Item onPress={() => setSortBy("name")} title="Name" />
            <Menu.Item onPress={() => setSortBy("date")} title="Date" />
            <Menu.Item onPress={() => setSortBy("size")} title="Size" />
          </Menu>
        </View>
  
      </View>
  
 
      <FlatList 
        style={styles.tasksContainer} 
        data={sortedTasks}  
        renderItem={({ item }) => (
          <TaskView 
            task={item} 
            onClick={() => {
              if (!selectedTasks.includes(item.id)) {
                setSelectedTasks([...selectedTasks, item.id]);
              } else {
                setSelectedTasks(selectedTasks.filter(taskId => taskId !== item.id));
              }
              console.log(selectedTasks);
            }}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
  
    </View>
  );
  

  
}







const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: useThemeColor("backgroundPrimary"),
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tasksContainer: {
    width: '100%',
    marginTop: 10,
  }
});

function addToSelectedList(item: Tasks.Task): Tasks.Task {
  throw new Error("Function not implemented.");
}
