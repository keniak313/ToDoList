import { compareAsc, compareDesc, format, toDate, parse, isToday } from "date-fns";
import { removeAllChildNodes, timer } from "./index.js";
import { dialogFunc } from "./dialog.js";
import { tasks, projects, updateStorage } from "./index.js";
import { filerTasks, currentFilter } from "./sidemenu.js";

export const taskList = document.querySelector(".taskList");

//Functions

export function createTaskCard(title, desc, date, prio, id, today, tomorrow, yesterday, completed = false, project, task){
    const taskCard = document.createElement("div");
    taskCard.classList.add("taskCard");
    taskCard.dataset.id = id;
    taskCard.dataset.priority = prio;
    taskCard.dataset.today = today;
    taskCard.dataset.yesterday = yesterday;
    taskCard.dataset.today = today;
    taskCard.dataset.completed = completed;
    taskCard.dataset.project = project;

    const taskClickArea = document.createElement("div");
    taskClickArea.classList.add("taskClickArea");

    const taskTitle = document.createElement("div");
    taskTitle.textContent = title;
    taskTitle.classList.add("taskTitle")

    const taskDesc = document.createElement("div");
    taskDesc.textContent = desc;
    taskDesc.classList.add("taskDesc")

    const taskProject = document.createElement("div");
    taskProject.textContent = project;
    taskProject.classList.add("taskProject");

    const taskDate = document.createElement("div");
    if(today){
        taskDate.textContent = "Today " + format(date, "HH:mm")
    }else if(tomorrow){
        taskDate.textContent = "Tomorrow " + format(date, "HH:mm")
    }else if(yesterday){
        taskDate.textContent = "Yesterday  " + format(date, "HH:mm")
    }else{
        taskDate.textContent = format(date, "dd-MM-yyyy HH:mm");
    }
    taskDate.classList.add("taskDate")

    const completeCheckbox = document.createElement("input");
    completeCheckbox.setAttribute("type", "checkbox");
    completeCheckbox.classList.add("completeCheckbox");

    const checkboxHolder = document.createElement("div");
    checkboxHolder.classList.add("checkboxHolder");

    checkboxHolder.appendChild(completeCheckbox);

    const editTaskBtn = document.createElement("button");
    editTaskBtn.classList.add("editTaskBtn");
    editTaskBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
    editTaskBtn.hidden = true;


    const removeTaskBtn = document.createElement("button");
    removeTaskBtn.classList.add("removeTaskBtn");
    removeTaskBtn.innerHTML = '<i class="fa-solid fa-trash">';
    removeTaskBtn.hidden = true;

    const taskButtons = document.createElement("div");
    taskButtons.classList.add("taskButtons");

    taskButtons.appendChild(editTaskBtn);
    taskButtons.appendChild(removeTaskBtn);


    switch (prio){
        case "3":
            completeCheckbox.classList.add("prioHigh");
            break
        case "2":
            completeCheckbox.classList.add("prioMid");
            break
        case "1":
            completeCheckbox.classList.add("prioLow");
            break
    }

    taskCard.appendChild(taskTitle);
    taskCard.appendChild(taskDesc);
    taskCard.appendChild(taskDate);
    taskCard.appendChild(taskProject);
    taskCard.appendChild(checkboxHolder);
    taskCard.appendChild(taskButtons);
    taskCard.appendChild(taskClickArea);
    taskList.appendChild(taskCard);

    editTaskBtn.addEventListener("click", () =>{
        task.editTask();
    })

    removeTaskBtn.addEventListener("click", () =>{
        task.removeTask();
    })

    completeCheckbox.addEventListener("click", () =>{
        task.markComplete();
        console.log(currentFilter)
        if(currentFilter === "inbox" || currentFilter === "today" || currentFilter === "completed"){
            taskCard.classList.add("completedAnim");
        }
    })

    taskCard.addEventListener("animationend", () =>{
        taskCard.classList.add("hidden");
        taskCard.classList.remove("completedAnim");
    })

    taskClickArea.addEventListener("click", () =>{
        if(taskCard.classList.contains("taskCardActive")){
            taskCard.classList.remove("taskCardActive");
        }else{
            if(taskDesc.textContent != ""){
                taskCard.classList.add("taskCardActive");
            }
        }
    })

    taskCard.addEventListener("mouseenter", () => {
        editTaskBtn.hidden = false;
        removeTaskBtn.hidden = false;
        //taskDesc.classList.remove("itemSmaller");
        //taskCard.classList.remove("taskCardMin");
    });

    //taskDesc.classList.add("itemSmaller");
    //taskCard.classList.add("taskCardMin");

    taskCard.addEventListener("mouseleave", () => {
        editTaskBtn.hidden = true;
        removeTaskBtn.hidden = true;
        taskCard.classList.remove("taskCardActive");
        //taskDesc.classList.add("itemSmaller");
        //taskCard.classList.add("taskCardMin");
    });
    if(completed){
        taskCard.classList.add("completed");
        completeCheckbox.checked = true;
    };

    return taskCard;
};

export function updateTaskCard(taskCard, title, description, dueDate, priority){
    taskCard.querySelector(".taskTitle").textContent = title;
    taskCard.querySelector(".taskDesc").textContent = description;
    taskCard.querySelector(".taskDate").textContent = "Due Date: " + format(dueDate, "dd-MM-yyyy HH:mm");
    taskCard.dataset.priority = priority;
    console.log(taskCard);
};

export function populateTaskList(arr = []){
    removeAllChildNodes(taskList);
    arr.forEach((i) => {
        i.taskCard = createTaskCard(i.title, i.description, i.dueDate, i.priority, arr.indexOf(i), i.today, i.tomorrow, i.yesterday, i.completed, i.project, i);
    });
    updateStorage("tasks");
    filerTasks().inbox();
};