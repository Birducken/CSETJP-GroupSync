import * as Groups from "@/services/groups"
import { useState } from 'react';
import { parseTask, } from "@/services/taskFunctions"

const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"
const GroupURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/GroupFunction"
const GroupTaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/groupTasks"

export const [groups, setGroups] = useState<Groups.Group[]>([]);

//TODO: REFACTOR THIS TO USE A BACKEND LOOP OF STUFF. THIS WHOLE SECTION BELOW WILL BE TOSSED.
export async function getTasksForGroup(_groupID : Number) : Promise<Number[]>{
    try{
      console.log("Getting GroupTasks...");
      const response = await fetch(GroupTaskURL, {
          method : 'GET',
          mode : 'cors',
          headers : {
            grouptaskgroup : _groupID.toString()
          }
      });
      if(!response.ok){
        throw new Error(`ERROR: STATUS: ${response.status}`);
      }
      const json = await response.json();

      let taskList = [];
      for(const o of json){
        taskList.push(parseTask(o));
      }
      console.log(taskList);


      return json;
    }catch (error) {
      console.error("Failed to get tasks for group", error);
      throw new Error("Failed to fetch tasks for group");
    }
  }

export async function getGroups(_groupOwner: string, setGroups:any, groups:any) : Promise<Groups.Group[]>{
    try{
      console.log("Getting Groups...");

      const response = await fetch(GroupURL, {
          method : 'GET',
          mode : 'cors',
          headers : {
            groupOwner : _groupOwner
          }
      });

      if(!response.ok){
        //throw new Error(`ERROR: STATUS: ${response.status}`);
      }

      const json = await response.json();

      let gotGroups: Groups.Group[] = json.map(parseGroup);

      setGroups([...groups, ...gotGroups])
      return groups;
    }catch (error) {
      console.error("Failed to get groups", error);
      throw new Error("Failed to fetch groups");
    }
}

export function parseGroup (groupToParse: any) {
    console.log(groupToParse);
    var groupToAdd = {
      id: groupToParse[0],
      title:groupToParse[1],
      description: groupToParse[2],

      numTasks: 0,
      hasNextTask: false,
      /**
       * Title and due date for the next due task in the group. This will need to be changed once the
       * backend is actually implemented, but for now I'm just hard-coding things for the demo.
       */
      nextTaskTitle: "NULL",
    }

    return groupToAdd;
  }