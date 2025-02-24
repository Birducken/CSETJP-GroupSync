import { FlatList, View, StyleSheet } from "react-native";
import { useState } from 'react';
import {getGroups} from "@/services/groupFunctions"
import * as Groups from "@/services/groups"
import PillButton from '@/components/PillButton'
import GroupView from "@/components/GroupView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Button, Menu, Modal, PaperProvider, Portal } from "react-native-paper";

const User = 'doro';
var TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"

export default function Index() {
  const [groups, setGroups] = useState<Groups.Group[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("name");
  const [menuVisible, setMenuVisible] = useState(false);

  const remove = async () => {
    //DELETE ALL GROUPS (HEAVY OPS)
    setGroups([]);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: useThemeColor("backgroundPrimary"),
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    groupsContainer: {
      width: '100%',
      marginTop: 10,
    }
  })
  
  //Return render of groups page
  return (
    <View style={styles.container}>
  
      {/* 🔹 Button Row - Centered with Sort By on the Right */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", paddingHorizontal: 10, marginBottom: 10 }}>
  
        {/* Smaller Action Buttons - Centered */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PillButton icon={"download"} onPress={() => getGroups(User, setGroups, groups)}  />
          <PillButton icon={"trash"} onPress={remove}  />
        </View>
  
        {/* Sort By Button - Aligned Right */}
        <View style={{ marginLeft: "auto" }}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="contained" onPress={() => setMenuVisible(true)}>
                Sort By
              </Button>
            }
          >
            <Menu.Item onPress={() => setSortBy("name")} title="Name" />
            <Menu.Item onPress={() => setSortBy("date")} title="Date" />
            <Menu.Item onPress={() => setSortBy("size")} title="Size" />
          </Menu>
          {/* 🔹 Group List */}
      <FlatList 
        style={styles.groupsContainer} 
        data={groups}  
        renderItem={({ item }) => <GroupView group={item} id={item.id} />}
        showsHorizontalScrollIndicator={false}
      />
      </View>
      </View>
    </View>
  );
}

