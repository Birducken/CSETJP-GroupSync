import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import * as Tasks from "@/services/tasks";
import { View, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const UserURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/User"
// is this unecessary or just unused for now?
const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"


export default function Settings() {

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text variant="headlineLarge" style={styles.title}>
        Settings
      </Text>

      {/* Buttons */}
      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor="white"
          onPress={() => console.log("Password")}
        >
          Change Password
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button
          mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor="white"
          onPress={() => console.log("Preferences")}
        >
          Preferences
        </Button>
      </Card>

      <Card mode="outlined" style={styles.card}>
        <Button mode="contained"
          buttonColor={useThemeColor("backgroundSecondary")}
          textColor={useThemeColor("textPrimary")}
          onPress={() => console.log("Logout")}
        >
          Logout
        </Button>
      </Card>
    </View>

  );
}

/**
 * Creates and adds a user account.
 * @param _userID Should this be a number?
 */
function registerUser(_userID: string, _username: string, _password: string) { 
  return async () => {
    try {
      const response = await fetch(UserURL, {
        method : 'POST',
        body: JSON.stringify({
          userID : _userID,
          username : _username,
          pword : _password 
        })
      });

      if (!response.ok) {
        throw new Error("USER CREATION ERROR");
      }

      const json = response;
      console.log(response);
      return json;
    } catch {

    }
  }
}

//TEST TASK.
let t: Tasks.Task = {
  id: 0,
  title: "Feed da doro",
  description : "Gotta feed em ",
  dueDate : new Date(1678886400000),
  complete : false
}

/**
 * Gets a user's account from the database.
 */
function getUser(_userID: string) { 
  return async () => {
    try {
      const response = await fetch(UserURL, {
        method : 'GET',
        headers : {
          'userID' : _userID
        }
      });

      if(!response.ok){
        throw new Error("User retreival error")
      }

      const json = response;
      console.log(response);
      return json;
    } catch {

    }
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useThemeColor("backgroundPrimary"), // Match dark theme
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: useThemeColor("textPrimary"),
    marginBottom: 20,
  },
  card: {
    width: "80%",
    marginBottom: 10,
    backgroundColor: "transparent",
    borderColor: useThemeColor("highlight"),
    borderWidth: 2,
    // guarantees the card will conform to the buttons
    borderRadius: 1000
  },
});
