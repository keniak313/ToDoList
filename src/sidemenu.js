import { tasks, projects} from "./index.js";

const sideMenu = document.querySelector(".sideMenu");
const inboxBtn = document.querySelector(".inboxBtn");
const todayBtn = document.querySelector(".todayBtn");
const completedBtn = document.querySelector(".completedBtn");

export let currentFilter = "";



setActive();

export function filerTasks(filter = "") {
    if (filter === ""){
        currentFilter = "";
        inbox();
    };
    function inbox() {
        if (currentFilter != "inbox") {
            currentFilter = "inbox";
            tasks.forEach((t) => {
                if(!t.completed){
                    t.taskCard.classList.remove("hidden");
                }else{
                    t.taskCard.classList.add("hidden");
                }
            });
            setActive();
            setActiveDesc();
        } else {
            console.log("Nothing to do");
        }
    };
    function today() {
        if (currentFilter != "today") {
            currentFilter = "today";
            tasks.forEach((t) => {
                if (!t.today || t.completed) {
                    t.taskCard.classList.add("hidden");
                } else {
                    t.taskCard.classList.remove("hidden");
                }
            });
            setActive();
            setActiveDesc();
        } else {
            console.log("Nothing to do");
        }
    };
    function complated() {
        if (currentFilter != "completed") {
            currentFilter = "completed";
            tasks.forEach((t) => {
                if (!t.completed) {
                    t.taskCard.classList.add("hidden");
                } else {
                    t.taskCard.classList.remove("hidden");
                }
            });
            setActive();
            setActiveDesc();
        } else {
            console.log("Nothing to do");
        }
    };

    function project(proj) {
        if (currentFilter != proj) {
            currentFilter = proj;
            tasks.forEach((t) => {
                if (t.project != proj) {
                    t.taskCard.classList.add("hidden");
                } else {
                    t.taskCard.classList.remove("hidden");
                }
            });
            setActive();
            setActiveDesc(currentFilter);
        } else {
            console.log("Nothing to do");
        }
    };
    return { inbox, today, complated, project }
}

export function setActive() {
    setActiveName(currentFilter);
    const items = document.querySelectorAll("#filter");
    items.forEach((i) => {
        if (i.dataset.filter === currentFilter) {
            i.classList.add("active");
        } else {
            i.classList.remove("active");
        }
    })
}

function setActiveName (text){
    const activeProject = document.querySelector(".activeProject");
    if(text === "inbox"){
        activeProject.textContent = "All";
    }else{
        activeProject.textContent = text;
    }
    
}

function setActiveDesc (project = ""){
    const activeDesc = document.querySelector(".activeDesc");
    projects.forEach((p) =>{
        if(p.title === project){
            activeDesc.textContent = p.description;
        }else{
            activeDesc.textContent = "";
        }
    })
}

