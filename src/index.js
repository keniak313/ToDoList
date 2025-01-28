import "./styles.css"
import { compareAsc, compareDesc, format, toDate, parse } from "date-fns";
import { dialog, submitTaskBtn } from "./dialog";
import { tasks, Task } from "./task";
import { addTaskBtn, content, taskList, populateTaskList } from "./DOM";

new Task("Swim", "Desc", "2025-03-18T02:04", "1");
new Task("Walk", "Desc", "2025-01-11T02:04", "3");
new Task("Ride", "Desc", "2025-01-10T02:04", "2");
new Task("Drive", "Desc", "2025-02-12T02:04", "1");
new Task("Run", "Short running seassion", "2025-01-06T02:04", "3");
new Task("Swim", "Desc", "2025-03-18T02:04", "1");
new Task("Walk", "Desc", "2025-01-11T02:04", "3");
new Task("Ride", "Desc", "2025-01-10T02:04", "2");
new Task("Drive", "Desc", "2025-02-12T02:04", "1");
new Task("Run", "Short running seassion", "2025-01-06T02:04", "3");

//Functions
function inputEventHandler(){
    //Open new task dialog
    addTaskBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    //Close Dialog
    dialog.addEventListener("mousedown", (e) =>{
        if(e.target === e.currentTarget){
            dialog.querySelector("form").reset();
            dialog.close();
        }
    });

    //Create new task
    submitTaskBtn.addEventListener("click", () =>{
        const inputTitle = dialog.querySelector("input[name=title]").value;
        const inputDescription = dialog.querySelector("input[name=description]").value;
        const inputDueDate = dialog.querySelector("input[name=duedate]").value;
        let priority = 0;
        const option = dialog.querySelectorAll("option");
        option.forEach((o) =>{
            if(o.selected){
                priority = o.dataset.id;
            }
        });

        if(dialog.querySelector("form").checkValidity()){
            new Task(inputTitle, inputDescription, inputDueDate, priority);
            populateTaskList(tasks);
        }else{
            console.log("Please fill all required fields.")
        }
    });

    //Remove Task
    const removeTaskButtons = document.querySelectorAll(".removeTaskBtn");
    removeTaskButtons.forEach((b) => {
        b.addEventListener("click", (e) => {
            tasks.splice(e.target.parentNode.dataset.obj, 1)
            taskList.removeChild(e.target.parentNode);
            console.log(e.target.parentNode.dataset.obj);
            console.log(tasks);
        })
    });

    //Edit Task
    const editTaskButtons = document.querySelectorAll(".editTaskBtn");
    editTaskButtons.forEach((b) => {
        b.addEventListener("click", (e) => {
            dialog.showModal();
        })
    });
};

const sortTasks = (function(){
    const byDateAsc = () => {
        tasks.sort((a, b) =>{
            return compareAsc(a.dueDate, b.dueDate); 
        });
        return tasks;
    }

    const byDateDesc = () => {
        tasks.sort((a, b) =>{
            return compareDesc(a.dueDate, b.dueDate); 
        });
        return tasks;
    }

    const byPrioAsc = () => {
        tasks.sort((a, b) =>{
            return a.priority - b.priority;
        });
        return tasks;
    }

    const byPrioDesc = () => {
        tasks.sort((a, b) =>{
            return b.priority - a.priority;
        });
        return tasks;
    }
    return{byDateAsc, byDateDesc, byPrioAsc, byPrioDesc};
})();

//Init
sortTasks.byDateAsc();
sortTasks.byPrioDesc();
populateTaskList(tasks);
inputEventHandler();