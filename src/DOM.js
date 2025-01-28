import { compareAsc, compareDesc, format, toDate, parse } from "date-fns";
import { tasks } from "./task";

export const content = document.createElement("content");

export const taskList = document.createElement("div");
taskList.classList.add("taskList");
const sideMenu = document.createElement("div");
sideMenu.classList.add("sideMenu");

export const addTaskBtn = document.createElement("button");
addTaskBtn.classList.add("newTaskBtn");
addTaskBtn.textContent = "Add";

//DOM Hierarchy

sideMenu.appendChild(addTaskBtn);

content.appendChild(sideMenu);
content.appendChild(taskList);
document.body.appendChild(content);


//Functions

function createTaskCard(title, desc, date, prio, id, task){
    const taskCard = document.createElement("div");
    taskCard.classList.add("taskCard");
    taskCard.dataset.id = id;
    taskCard.dataset.priority = prio;
    taskCard.dataset.obj = task;

    const taskTitle = document.createElement("div");
    taskTitle.textContent = title;

    const taskDesc = document.createElement("div");
    taskDesc.textContent = desc;

    const taskDate = document.createElement("div");
    taskDate.textContent = "Due Date: " + format(date, "dd-MM-yyyy HH:mm");

    const editTaskBtn = document.createElement("button");
    editTaskBtn.classList.add("editTaskBtn");
    editTaskBtn.textContent = "Edit Task";

    const removeTaskBtn = document.createElement("button");
    removeTaskBtn.classList.add("removeTaskBtn");
    removeTaskBtn.textContent = "Remove Task";

    switch (prio){
        case "3":
            taskCard.classList.add("prioHigh");
            break
        case "2":
            taskCard.classList.add("prioMid");
            break
        case "1":
            taskCard.classList.add("prioLow");
            break
    }

    taskCard.appendChild(taskTitle);
    taskCard.appendChild(taskDesc);
    taskCard.appendChild(taskDate);
    taskCard.appendChild(editTaskBtn);
    taskCard.appendChild(removeTaskBtn);
    taskList.appendChild(taskCard);
};

function removeAllChildNodes(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

export function populateTaskList(arr = []){
    removeAllChildNodes(taskList);
    arr.forEach((i) => {
        createTaskCard(i.title, i.description, i.dueDate, i.priority, arr.indexOf(i), i);
    })
};