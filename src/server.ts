import { checkFile } from "./lib/checkFile";
import readline from "node:readline";
import commandLists from "./lib/commandList";
import { checkId } from "./lib/checkID";
import { parseBoolean } from "./lib/parseBoolean";
import fs from "node:fs";

interface Task {
  Id: number;
  Task: string;
  Done: boolean;
}

const rl: readline.Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function mainQuestion() {
  rl.question("\nTodo CLI: Press -help for help:\n", (option) => {
    switch (option) {
      case "-add":
        addNewTask();
        break;
      case "-listAll":
        listAllTasks();
        break;
      case "-help":
        commandLists();
        mainQuestion();
        break;
      case "-exit":
        rl.close();
        break;
      case "-changeStatus":
        setStatusTask();
        break;
      case "-removeTask":
        removeTask();
        break;
      case "-changeTask":
        changeTask();
        break;
      default:
        console.log("Unknown command");
        return mainQuestion();
    }
  });
}

function removeTask() {
  fs.readFile("Tasks.json", "utf8", (err, data) => {
    if (!checkFile(data, err)) return mainQuestion();
    let Task = JSON.parse(data);
    rl.question("Which task do you want to delete? ", (value) => {
      let index = parseInt(value);
      if (!checkId(value, Task)) return removeTask();
      let newArray = Task.filter((element: Task) => element.Id !== index);
        change(newArray, "removed");
    });
  });
}

function setStatusTask() {
  fs.readFile("Tasks.json", "utf-8", (err, data) => {
    if (!checkFile(data, err)) return mainQuestion();
    let Task = JSON.parse(data);
    rl.question("Which task do you want to modify: ", (taskN) => {
      let index = parseInt(taskN);
      if (!checkId(taskN, Task)) return setStatusTask();
      const findIndex = Task.findIndex((element: any) => element.Id === index);
      rl.question("What value do you want to set? (true/false): ", (value) => {
        if (!value) {
          console.log("Value cannot be empty");
          return setStatusTask();
        }
        Task[findIndex].Done = parseBoolean(value)
          change(Task, "updated");
      });
    });
  });
}

function changeTask() {
  fs.readFile("Tasks.json", "utf-8", (err, data) => {
    if (!checkFile(data, err)) return mainQuestion();
    let Task = JSON.parse(data);
    rl.question("Which task do you want to modify: ", (taskN) => {
      let index = parseInt(taskN);
      if (!checkId(taskN, Task)) return changeTask();
      const findIndex = Task.findIndex((element: any) => element.Id === index);
      rl.question("What value do you want to set?: ", (value) => {
        if (!value) {
          console.log("Value cannot be empty");
          return changeTask();
        }
        Task[findIndex].Task = value;
          change(Task, "updated");
      });
    });
  });
}

function change(Task: Array<object>, param: string) {
  fs.writeFile("Tasks.json", JSON.stringify(Task), (err) => {
    if (err) {
      console.error("Error updating the task", err);
    } else {
      console.log(`Task successfully ${param}`);
    }
    return mainQuestion();
  });
}

function addNewTask() {
  rl.question("New Task: ", (taskName: string) => {
    if (!taskName) {
      console.log("Task cannot be empty\n");
      return addNewTask();
    }
    let tasks: Array<Object> = [];
    const objectTask: Task = { Id: 0, Task: taskName, Done: false };
    fs.readFile("Tasks.json", "utf-8", (err, data) => {
      if (data == null || err || data.length == 0) {
        objectTask["Id"] = 1;
        tasks = [objectTask];
        return change(tasks, "added");
      }
      tasks = JSON.parse(data);
      objectTask["Id"] = tasks.length + 1;
      tasks.push(objectTask);
      change(tasks, "added");
    });
  });
}

function listAllTasks() {
  fs.readFile("Tasks.json", "utf-8", (err, data) => {
    if (!checkFile(data, err)) return mainQuestion();
    const tasks = JSON.parse(data);
    tasks.forEach(
      (element: { Id: string; Task: string; Done: boolean }, key: String) => {
        console.log(
          `Id: ${element.Id} | Task: ${element.Task} | ${
            element.Done ? "Completed" : "In progress"
          }`
        );
      }
    );
    return mainQuestion();
  });
}

mainQuestion();
