import { useThemeColor } from "@/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Card, IconButton } from "react-native-paper";
import * as Tasks from '@/services/tasks';
import TaskView from "@/components/TaskView";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import TaskCreationModal from "@/components/TaskCreationModal";

// temporary, will be replaced later
interface User {
  name: string
}

export default function GroupHome() {
  const { id } = useLocalSearchParams();
  const groupID = Number(id);
  const [modalVisible, setModalVisible] = useState(false);

  // eventually this will be populated with the actual users, but for now i just need a demo
  const users: User[] = [
    {
      name: "Dave"
    },
    {
      name: "Bob"
    },
    {
      name: "Glornax the Destroyer"
    }
  ];
  
  // for sorting menus
  const [sortAscending, setSortAscending] = useState(true);
  const [sortMode, setSortMode] = useState<string>();
  const sortModeMenuData = [
    { label: "Name", value: "alphabetical" },
    { label: "Creation Date", value: "creation date" },
    { label: "Due Date", value: "due date" }
  ];

  // for filter menu
  const [filters, setFilters] = useState<string[]>([]);
  const filterMenuData = [
    { label: "Completed", value: "completed" },
    { label: "Uncompleted", value: "uncompleted" },
    { label: "Assigned to Me", value: "assigned to me" },
    { label: "Assigned to Others", value: "assigned to others" },
    { label: "Unassigned", value: "Unassigned" },
  ];

  const renderItem = (item: { label: string }) => {
    return (
      <View style={multiSelectStyles.item}>
        <Text style={multiSelectStyles.selectedText}>{item.label}</Text>
        {/* <MaterialIcons style={{marginRight: 5}} color="black" name="shield" size={20} /> */}
      </View>
    );
  };

  // required because react native is a PERFECTLY DESIGNED library with NO FLAWS WHATSOEVER
  const selectedIconColor = useThemeColor("textPrimary");

  return (
    <View style={styles.pageContainer}>
      <TaskCreationModal modalVisible={modalVisible} setModalVisible={setModalVisible} groupID={ groupID }/>
      <View style={styles.upperColumnContainer}>
        <Card mode="contained" style={styles.titleCard}>
          <Text style={styles.textTitle}>Group {id} name</Text>
        </Card>
        <View style={styles.filtersCard}>
          <IconButton
            icon={sortAscending ? "sort-ascending" : "sort-descending"}
            iconColor={useThemeColor("textSecondary")}
            size={36}
            onPress={() => setSortAscending(!sortAscending)}
          />
          <Dropdown
            style={dropdownStyles.main}
            placeholderStyle={dropdownStyles.placeholder}
            selectedTextStyle={dropdownStyles.selectedText}
            containerStyle={dropdownStyles.container}
            itemTextStyle={dropdownStyles.itemText}
            activeColor="transparent"
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="None"
            data={sortModeMenuData}
            value={sortMode}
            onChange={item => {
              setSortMode(item.value);
            }}
          />
          <MultiSelect
            style={multiSelectStyles.main}
            placeholderStyle={multiSelectStyles.placeholder}
            containerStyle={multiSelectStyles.container}
            itemTextStyle={multiSelectStyles.itemText}
            activeColor="transparent"
            alwaysRenderSelectedItem
            labelField="label"
            valueField="value"
            data={filterMenuData}
            value={filters}
            onChange={item => {
              setFilters(item)
            }}
            // renderItem={renderItem}
            renderSelectedItem={(item, unSelect) => (
              <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                <View style={multiSelectStyles.selected}>
                  <Text style={multiSelectStyles.selectedText}>{item.label}</Text>
                  <MaterialIcons color={selectedIconColor} name="delete" size={20} />
                </View>
              </TouchableOpacity>
            )}
          />
          <IconButton
            icon={"note-plus"}
            iconColor={useThemeColor("textSecondary")}
            size={36}
            onPress={() => { setModalVisible(true); }}
          />
        </View>
      </View>
      <View style={styles.lowerColumnContainer}>
        <Card mode="contained" style={styles.usersCard}>
          <Card.Content>
            <Text style={styles.textSubtitle}>Users</Text>
            <FlatList
              data={users}
              renderItem={({item}) => <Text style={styles.textContent}>{item.name}</Text>}
              showsHorizontalScrollIndicator={false}/>
          </Card.Content>
        </Card>
      
        
        <View style={styles.tasksContainer}>
          <FlatList
            data={tasks} 
            // onclick currently does nothing - this will need to be changed eventually
            renderItem={({item}) => <TaskView task={item} onClick={()=>{}}/>}
            showsHorizontalScrollIndicator={false}/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: useThemeColor("backgroundPrimary"),
    paddingHorizontal: 30,
    paddingTop: 20
  },
  upperColumnContainer: {
    flexDirection: "row",
    backgroundColor: useThemeColor("backgroundPrimary"),
    zIndex: 5
  },
  lowerColumnContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: useThemeColor("backgroundPrimary"),
  },
  titleCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    marginRight: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "30%",
  },
  filtersCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    flexGrow: 1,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  multiSelectContainer: {
    flexDirection: "row"
  },
  usersCard: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 15,
    borderColor: useThemeColor("highlight"),
    borderWidth: 3,
    width: "30%",
    alignSelf: "flex-start",
    position: "sticky",
    top: 20,
    marginTop: 9
  },
  tasksContainer: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 10,
  },
  textTitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 48
  },
  textSubtitle: {
    color: useThemeColor("textPrimary"),
    fontWeight: 600,
    fontSize: 36,
    marginBottom: 5
  },
  textContent: {
    color: useThemeColor("textSecondary"),
    fontSize: 28,
  }
});

const dropdownStyles = StyleSheet.create({
  main: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 18,
    height: 50,
    borderBottomColor: useThemeColor("highlight"),
    borderBottomWidth: 2,
    minWidth: 175
  },
  icon: {
    marginRight: 5,
  },
  placeholder: {
    color: useThemeColor("textSecondary"),
    fontSize: 24,
  },
  selectedText: {
    color: useThemeColor("textPrimary"),
    fontSize: 24,
  },
  itemText: {
    color: useThemeColor("textPrimary"),
    fontSize: 18,
  },
  container: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 10,
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
  },
});

const multiSelectStyles = StyleSheet.create({
  main: {
    marginHorizontal: 12,
    marginTop: 14,
    marginBottom: 18,
    height: 50,
    borderBottomColor: useThemeColor("highlight"),
    borderBottomWidth: 2,
    minWidth: 175
  },
  placeholder: {
    color: useThemeColor("textSecondary"),
    fontSize: 24,
  },
  selectedText: {
    color: useThemeColor("textPrimary"),
    fontSize: 16,
    marginRight: 5
  },
  icon: {
    width: 20,
    height: 20,
  },
  selected: {
    borderRadius: 12,
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  container: {
    backgroundColor: useThemeColor("backgroundSecondary"),
    borderRadius: 10,
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: useThemeColor("textPrimary"),
    fontSize: 18,
  },
});