import * as Tasks from "@/services/tasks"
import { useState } from 'react';
import React, { Component } from "react";
export const [tasks, setTasks] = useState<Tasks.Task[]>([]);


interface State {
    tasks: Tasks.Task[];
}

export class tasksHolder extends Component<{}, State> {
    state: State = {
      tasks: [], // Initial empty array
    };
  
    setTasks = (newTasks: Tasks.Task[]) => {
      this.setState({ tasks: newTasks });
    };
}


const TaskURL = "https://bxgjv0771m.execute-api.us-east-2.amazonaws.com/groupsync/TaskFunction"

export function parseTask(taskToParse: any){
    console.log(taskToParse);
    var taskToAdd = {
        title: taskToParse[1],
        id: taskToParse[0],
        description: taskToParse[2],
        
        dueDate: taskToParse[4],
        complete: taskToParse[5]
    }
    console.log(taskToAdd);

    return taskToAdd;
}

export async function getTasks(_taskAuthor: string, setTasks : any, tasks: any){
    try{
        console.log("Getting Tasks...");
  
        const response = await fetch(TaskURL, {
            method : 'GET',
            mode : 'cors',
            headers : {
                taskAuthor : _taskAuthor
            }
        });
  
        if(!response.ok){
          throw new Error(`ERROR: STATUS: ${response.status}`);
        }
  
        const json = await response.json();
  
        let gotTasks: Tasks.Task[] = json.map(parseTask);
  
        setTasks([...tasks, ...gotTasks])
        return json;
      }catch (error) {
        console.error("Failed to get tasks", error);
        throw new Error("Failed to fetch tasks");
      }
  }
 