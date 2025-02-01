import { format, parse } from "date-fns";
import { tasks, projects, removeAllChildNodes, updateSorting, updateStorage } from "./index.js";
import { Task } from "./task";
import { Project } from "./project.js";
import { taskList, populateTaskList, updateTaskCard } from "./tasklist";
import { populateProjectList } from "./projectlist.js";

const dialogType = ["task", "project", "edit task", "edit project"];
let curDialogType = dialogType[0];
let taskBox = ""
let projectBox = ""
createDialog();

export const dialogFunc = (function() {
    const dialog = document.querySelector("dialog");
    const openDialogBtn = document.querySelector(".openDialogBtn");
    const submitDialogBtn = document.querySelector(".submitBtn");
    const confirmDialogBtn = document.querySelector(".confirmBtn");
    let inputTitle = dialog.querySelector("input[name=title]");
    let inputDescription = dialog.querySelector("input[name=description]");
    const inputDueDate = dialog.querySelector("input[name=duedate]");
    const inputPriority = dialog.querySelectorAll("input[name=priority]");
    const tabLeft = dialog.querySelector(".tabLeft");
    const tabRight = dialog.querySelector(".tabRight");
    const dropdown = dialog.querySelector("select");
    const dialogContent = dialog.querySelector(".dialogContent");
    let currentEditedTask = [];
    let currentEditedTaskCard = [];
    let currentEditedProject = [];
    let currentEditedProjectCard = [];
    let projectTitleHolder = "";

    function getDialog(){
        return dialog;
    }

    function getOpenButton(){
        return openDialogBtn;
    }

    function getSubmitButton(){
        return submitDialogBtn;
    }

    function getConfirmButton(){
        return confirmDialogBtn;
    }

    function openDialog(){
        changeDialogType(dialogType[0]);
        updateProjectsDropdown();
        dialog.showModal();
    }

    function hideSubmitBtn(){
        if(dialogContent.contains(submitDialogBtn)){
            dialogContent.removeChild(submitDialogBtn);
        }
        dialogContent.appendChild(confirmDialogBtn);
        //submitDialogBtn.hidden = true;
        //confirmDialogBtn.hidden = false;
    }

    function hideConfirmBtn(){
        if(dialogContent.contains(confirmDialogBtn)){
            dialogContent.removeChild(confirmDialogBtn);
        };
        dialogContent.appendChild(submitDialogBtn);
        //confirmDialogBtn.hidden = true;
        //submitDialogBtn.hidden = false;
    };

    function updateProjectsDropdown(){
        removeAllChildNodes(dropdown);
        const baseOption = document.createElement("option");
        baseOption.textContent = "";
        dropdown.appendChild(baseOption);
        projects.forEach((p) => {
            const option = document.createElement("option");
            option.dataset.project = p;
            option.value = p.title;
            option.textContent = p.title;
            dropdown.appendChild(option);
        });
    };
    

    function updateInputs(){
        if(curDialogType === dialogType[0]){
            inputTitle = dialog.querySelector(`input[name=title], input[data-id=${dialogType[0]}]`);
            inputDescription = dialog.querySelector(`input[name=description], input[data-id=${dialogType[0]}]`);
        }else if(curDialogType === dialogType[1]){
            inputTitle = dialog.querySelector(`input[name=title], input[data-id=${dialogType[1]}]`);
            inputDescription = dialog.querySelector(`input[name=description], input[data-id=${dialogType[1]}]`);
        }
    };

    function changeDialogType(type, edit = false){
        const cont = dialog.querySelector(".dialogContent");
        tabLeft.textContent = "Task"
        tabRight.textContent = "Project"
        if(type === dialogType[0]){ //Task
            submitDialogBtn.setAttribute("form", "taskForm");
            confirmDialogBtn.setAttribute("form", "taskForm");
            if(curDialogType != type){
                cont.replaceChild(taskBox, projectBox);
                updateInputs();
            }
            curDialogType = dialogType[0];
            tabLeft.classList.add("tabActive");
            tabRight.classList.remove("tabActive");
        }else if(type === dialogType[1]){ //Project
            submitDialogBtn.setAttribute("form", "projectForm");
            confirmDialogBtn.setAttribute("form", "projectForm");
            if(curDialogType != type){
                cont.replaceChild(projectBox, taskBox);
                updateInputs();
            }
            curDialogType = dialogType[1];
            tabLeft.classList.remove("tabActive");
            tabRight.classList.add("tabActive");
        }
        if(edit){
            dialog.dataset.editable = "true";
            if(curDialogType === dialogType[0]){
                tabLeft.textContent = "Edit Task"
                tabLeft.classList.add("tabEdit");
                tabLeft.classList.remove("tabHidden");
                tabRight.classList.add("tabHidden");
                tabRight.classList.remove("tabEdit");
            }else if(curDialogType === dialogType[1]){
                tabRight.textContent = "Edit Project"
                tabRight.classList.add("tabEdit");
                tabLeft.classList.remove("tabEdit");
                tabLeft.classList.add("tabHidden");
                tabRight.classList.remove("tabHidden");
            }
        }else{
            dialog.dataset.editable = "false";
            tabLeft.classList.remove("tabHidden");
            tabRight.classList.remove("tabHidden");
            tabLeft.classList.remove("tabEdit");
            tabRight.classList.remove("tabEdit");
        }
    };

    function openEditDialog(title, description, dueDate, priority, task, taskCard, project){
        currentEditedTaskCard = taskCard;

        changeDialogType(dialogType[0], true);
        updateProjectsDropdown();
        dropdown.value = project;
        inputTitle.value = title;
        inputDescription.value = description;
        const formatedDate = format(dueDate, "yyyy-MM-dd'T'HH:mm");
        inputDueDate.value = formatedDate;
        inputPriority.forEach((p) => {
            if(p.dataset.id === priority)
                p.checked = true;
        });
        currentEditedTask = task;
        dialog.showModal();
    };

    function confirmEdit(){ 
        if(dialog.querySelector("form").checkValidity()){
            if(curDialogType === dialogType[0]){
                const task = currentEditedTask;
                task.title = inputTitle.value;
                task.description = inputDescription.value;
                task.dueDate = task.parseDate(inputDueDate.value);
        
                let priority = 0;
                inputPriority.forEach((o) =>{
                    if(o.checked){
                        priority = o.dataset.id;
                    };
                });
        
                task.priority = priority;
                task.project = dropdown.value;
                updateSorting();
                //populateTaskList(tasks);
            }else if(curDialogType === dialogType[1]){
                console.log("Confirm Edit project")
                const proj = currentEditedProject;
                proj.title = inputTitle.value;
                proj.description = inputDescription.value;
                tasks.forEach((t) =>{
                    if(t.project === projectTitleHolder){
                        t.project = inputTitle.value;
                    };
                });
                updateSorting();
                populateProjectList(projects);
            }
            //updateTaskCard(currentEditedTaskCard, inputTitle.value, inputDescription.value, inputDueDate.value, priority);
        }else{
            console.log("Please fill all required fields.")
        };
    };

    function openProjectEditDialog(projectTitle, projectDesc, project, projectCard){
        projectTitleHolder = projectTitle;
        currentEditedProjectCard = projectCard;
        changeDialogType(dialogType[1], true);
        inputTitle.value = projectTitle;
        inputDescription.value = projectDesc;
        currentEditedProject = project;
        console.log(project)
        dialog.showModal();
    }
    
    function closeDialog(){
        clearDialog();
        dialog.close();
    }

    function submitDialog(){
        let priority = 0;
        inputPriority.forEach((o) =>{
            if(o.checked){
                priority = o.dataset.id;
            };
        });

        if(dialog.querySelector("form").checkValidity()){
            if(curDialogType === dialogType[0]){
                new Task(inputTitle.value, inputDescription.value, inputDueDate.value, priority, false, dropdown.value);
                updateSorting();
            }else if(curDialogType === dialogType[1]){
                console.log(inputTitle.value);
                new Project(inputTitle.value, inputDescription.value);
                populateProjectList(projects);
                console.log(projects);
            }
        }else{
            console.log("Please fill all required fields.")
        }
    };
    
    function clearDialog(){
        dialog.querySelector("form").reset();
    };
    return {getOpenButton, getSubmitButton, getConfirmButton, hideSubmitBtn, hideConfirmBtn, getDialog, openDialog, openEditDialog, closeDialog, clearDialog, submitDialog, confirmEdit, changeDialogType, openProjectEditDialog}
})();



//Functions for creating DOM Dialog



function createDialog(){
    const dialog = document.createElement("dialog");
    dialog.classList.add("dialog");
    const dialogBox = document.createElement("div");
    dialogBox.classList.add("dialogBox");
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialogContent");
    dialog.dataset.editable = "false";

    taskBox = document.createElement("div");
    taskBox.classList.add("taskBox");

    projectBox = document.createElement("div");
    projectBox.classList.add("projectBox");

    const tabLeft = document.createElement("div");
    tabLeft.classList.add("tabLeft");
    tabLeft.textContent = "Task"

    const tabRight = document.createElement("div");
    tabRight.classList.add("tabRight");
    tabRight.textContent = "Project"

    tabLeft.addEventListener("click", () =>{
        if( dialog.dataset.editable === "false"){
            dialogFunc.changeDialogType(dialogType[0])
        }
    })

    tabRight.addEventListener("click", () =>{
        if( dialog.dataset.editable === "false"){
            dialogFunc.changeDialogType(dialogType[1])
        }
    })

    dialogBox.appendChild(tabLeft);
    dialogBox.appendChild(tabRight);
    dialogBox.appendChild(dialogContent);
    dialogContent.appendChild(taskBox);

    projectBox.appendChild(createProjectForm());
    //projectBox.appendChild(createDialogButton("submitBtn", "projectForm", "Submit"));
    //projectBox.appendChild(createDialogButton("confirmBtn", "projectForm", "Confirm"));

    taskBox.appendChild(createTaskForm());
    //taskBox.appendChild(createDialogButton("submitBtn", "taskForm", "Submit"));
    //taskBox.appendChild(createDialogButton("confirmBtn", "taskForm", "Confirm"));

    dialogContent.appendChild(createDialogButton("submitBtn", "taskForm", "Submit"));
    dialogContent.appendChild(createDialogButton("confirmBtn", "taskForm", "Confirm"));
    
    dialog.appendChild(dialogBox);
    document.body.appendChild(dialog);
};

function createProjectForm(){
    const form = document.createElement("form");
    form.method = "dialog";
    form.id = "projectForm";

    form.appendChild(createInput("text", "title", "Title", dialogType[1]));
    form.appendChild(createInput("text", "description", "Description", dialogType[1], false));
    //form.appendChild(createInput("datetime-local", "duedate", "DueDate"));

    return form;
};

function createTaskForm(){
    const form = document.createElement("form");
    form.method = "dialog";
    form.id = "taskForm";
    const dropdown = document.createElement("select");
    dropdown.placeholder = "Projects";

    form.appendChild(createInput("text", "title", "Title", dialogType[0]));
    form.appendChild(createInput("text", "description", "Description", dialogType[0]));
    form.appendChild(createInput("datetime-local", "duedate", "DueDate", dialogType[0]));
    form.appendChild(dropdown);
    form.appendChild(createPriorityBox());
    

    return form;
};

function createInputBox(element){
    const inputBox = document.createElement("div");
    inputBox.classList.add("inputBox");

    inputBox.appendChild(element);
    return inputBox;
};

function createInput(type, name, text, id, required = true){
    let input = "";
    if (type === "textarea"){
        input = document.createElement("textarea");   
    }else{
        input = document.createElement("input");
        input.type = type;
    }
    input.name = name;
    input.title = name;
    input.placeholder = text;
    input.dataset.id = id;
    input.required = required;

    return input;
};

function createRadioInput(name, title, id, check = false){
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.id = title;
    radioInput.name = name;
    radioInput.title = title;
    radioInput.dataset.id = id;
    radioInput.classList.add(title);
    if(check){
        radioInput.setAttribute("checked", check)
    }

    return radioInput;
};

function createLabel(title, text){
    const label = document.createElement("label");
    label.setAttribute("for", title);
    label.classList.add(title);
    label.textContent = text;

    return label;
};

function createPriorityBox(){
    const prioBox = document.createElement("div");
    prioBox.classList.add("prioBox");

    prioBox.appendChild(createRadioInput("priority", "priorityLow", "1"));
    prioBox.appendChild(createLabel("priorityLow", "Low"));

    prioBox.appendChild(createRadioInput("priority", "priorityMid", "2", true));
    prioBox.appendChild(createLabel("priorityMid", "Mid"));

    prioBox.appendChild(createRadioInput("priority", "priorityHigh", "3"));
    prioBox.appendChild(createLabel("priorityHigh", "High"));

    return prioBox;
};

function createDialogButton(classEl, form, text){
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.classList.add(classEl);
    btn.setAttribute("form", form);
    btn.textContent = text;

    return btn;
};



