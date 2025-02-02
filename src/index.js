import "./styles.css"
import "./sidemenu.js"
import { compareAsc, compareDesc, format, toDate, parse } from "date-fns";
import { Task } from "./task.js";
import { taskList, populateTaskList } from "./tasklist.js";
import { currentFilter, filerTasks, setActive } from "./sidemenu.js";
import { Project } from "./project.js";
import { populateProjectList } from "./projectlist.js";
import { dialogFunc} from "./dialog.js";

document.body.style.display = 'flex';

const sortOptions = ["prioDesc", "prioAsc", "dateAsc", "dateDesc"]
let curSorting = sortOptions[0];

export const timer = ms => new Promise(res => setTimeout(res, ms));

export let projects = [];
export let tasks = [];


new Task("Dzis", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", "2025-01-31T02:04", "1", false);
// new Task("Wczoraj", "Desc", "2025-01-30T02:04", "3", false, "Some Project");
// new Task("Jutro", "Desc", "2025-02-01T02:04", "2");
// new Task("Drive", "Desc", "2025-02-12T02:04", "1");
// new Task("Run", "Short running seassion", "2025-01-06T02:04", "3", false, "Some Project");
// new Task("Swim", "Desc", "2025-03-18T02:04", "1");
// new Task("Walk", "Desc", "2025-01-11T02:04", "3", false, "Another example project");
// new Task("Ride", "Desc", "2025-01-10T02:04", "2", false, "Some Project");
// new Task("Drive", "Desc", "2025-02-12T02:04", "1");
// new Task("Run", "Short running seassion", "2025-01-06T02:04", "3");

new Project("Some Project", "Jakis Opis");
// new Project("Another example project", "Inny chyba Opis cos cos cos, troche dluzszy i wiekszy, a i moze cos cos");


//Functions
function inputEventHandler(){
    //Mobile side menu
    const navButton = document.querySelector(".navButton");
    const sideMenu = document.querySelector(".sideMenu");
    navButton.addEventListener("click", () => {
        console.log("BZZ")
        sideMenu.classList.toggle("sideMenuShown");
    });

    window.addEventListener("resize", () =>{
        sideMenu.classList.remove("sideMenuShown");
    });

    //Side Menu Main filters
    const filterBtns = document.querySelectorAll("#filter");
    filterBtns.forEach((i) =>{
        i.addEventListener("click", (e) =>{
            switch(i.dataset.filter){
                case "inbox":
                    filerTasks().inbox();
                    break
                case "today":
                    filerTasks().today();
                    break;
                case "completed":
                    filerTasks().complated();
                    break;
            };
        });
    });

    //Sort buttons
    const sortButtons = document.querySelectorAll("#sort");
    sortButtons.forEach((b) =>{
        b.addEventListener("click", (c)=>{
            if(c.target.className != curSorting){
                switch(c.target.dataset.sort){
                    case "prioDesc":
                        curSorting = sortOptions[0]
                        break;
                    case "prioAsc":
                        curSorting = sortOptions[1]
                        break;
                    case "dateAsc":
                        curSorting = sortOptions[2]
                        break;
                    case "dateDesc":
                        curSorting = sortOptions[3]
                        break;
                };
                updateSorting();
                console.log(curSorting);
            };

        });
    })

    //Open new task dialog
    dialogFunc.getOpenButton().addEventListener("click", () => {
        dialogFunc.clearDialog();
        dialogFunc.hideConfirmBtn();
        dialogFunc.openDialog();
    });

    //Close Dialog
    dialogFunc.getDialog().addEventListener("mousedown", (e) =>{
        if(e.target === e.currentTarget){
            dialogFunc.closeDialog();
        }
    });

    //Create new task
    dialogFunc.getSubmitButton().addEventListener("click", () =>{
        dialogFunc.submitDialog();
    });

    //Confirm Edited Task
    dialogFunc.getConfirmButton().addEventListener("click",() =>{
        dialogFunc.confirmEdit();
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
        byDateAsc();
        tasks.sort((a, b) =>{
            return a.priority - b.priority;
        });
        return tasks;
    }

    const byPrioDesc = () => {
        byDateAsc();
        tasks.sort((a, b) =>{
            return b.priority - a.priority;
        });
        return tasks;
    }
    return{byDateAsc, byDateDesc, byPrioAsc, byPrioDesc};
})();

export function updateSorting(){
    switch(curSorting){
        case sortOptions[0]:
            //sortTasks.byDateAsc(); 
            sortTasks.byPrioDesc();
            break;
        case sortOptions[1]:
            //sortTasks.byDateAsc(); 
            sortTasks.byPrioAsc();
            break;
        case sortOptions[2]: 
            sortTasks.byDateAsc();
            break;
        case sortOptions[3]: 
            sortTasks.byDateDesc();
            break;
    };
    const sortButtons = document.querySelectorAll("#sort");
    sortButtons.forEach((b) =>{
        if(b.dataset.sort === curSorting){
            b.classList.add("sortActive");
        }else{
            b.classList.remove("sortActive");
        }
    });
    populateTaskList(tasks);
};

export function removeAllChildNodes(parent){
    if(parent.firstChild){
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

};

export function updateStorage(type){
    if (type === "projects"){
        localStorage.setItem("projects", JSON.stringify(projects));
        console.log("Writing storage: Projects")
        console.log(JSON.parse(localStorage.getItem("projects")));
    }else if(type === "tasks"){
        localStorage.setItem("tasks", JSON.stringify(tasks));
        console.log("Writing storage: Tasks")
        console.log(JSON.parse(localStorage.getItem("tasks")));
    }
}

export function checkStorage(){
    const localProjects = localStorage.getItem("projects");
    const localTasks = localStorage.getItem("tasks");
    if (localStorage.length != 0){
        if(localProjects){
            projects = [];
            const projectsParsed = JSON.parse(localStorage.getItem("projects"));
            projectsParsed.forEach((p) => {
                new Project(p.title, p.description)
            })
            populateProjectList(projects);
            console.log("Reading storage: Projects")
            console.log(projectsParsed);
        }
        if(localTasks){
            tasks = [];
            const tasksParsed = JSON.parse(localStorage.getItem("tasks"));
            tasksParsed.forEach((t) => {
                new Task(t.title, t.description, t.dueDate, t.priority, t.completed, t.project)
                //new Task(inputTitle.value, inputDescription.value, inputDueDate.value, priority, false, dropdown.value);
            })
            updateSorting();
            console.log("Reading storage: Tasks")
            console.log(tasksParsed);
        }
    }else{
        console.log("Nie ma nic")
    }
}

//Init
checkStorage();
updateSorting();
populateProjectList(projects)
inputEventHandler();
filerTasks().inbox();
