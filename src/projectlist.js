import { tasks, projects, updateStorage, removeAllChildNodes } from "./index.js";
import { filerTasks } from "./sidemenu.js";
export const projectList = document.querySelector(".projectsList");

function createProjectCard(title, description, id, project){
    const projectCard = document.createElement("div");
    projectCard.dataset.id = id;
    projectCard.classList.add("projectCard");
    

    const projectTitle = document.createElement("div");
    projectTitle.classList.add("projectTitle");
    projectTitle.textContent = title;
    projectTitle.dataset.filter = title;
    projectTitle.setAttribute("id", "filter");

    const projectDesc = document.createElement("div");
    projectDesc.classList.add("projectDesc");
    projectDesc.textContent = description;

    const projectButtons = document.createElement("div");
    projectButtons.classList.add("projectButtons");

    const projectText = document.createElement("div");
    projectText.classList.add("projectText");

    projectText.addEventListener("click", () =>{
        filerTasks().project(title);
    })

    const editProjBtn = document.createElement("button");
    editProjBtn.classList.add("editProjBtn");
    editProjBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>'
    editProjBtn.hidden = true;

    editProjBtn.addEventListener("click", () =>{
        project.editProject();
    })

    const removeProjBtn = document.createElement("button");
    removeProjBtn.classList.add("removeProjBtn");
    removeProjBtn.innerHTML = '<i class="fa-solid fa-trash">'
    removeProjBtn.hidden = true;

    removeProjBtn.addEventListener("click", () =>{
        project.removeProject();
    })

    projectButtons.appendChild(editProjBtn);
    projectButtons.appendChild(removeProjBtn);

    projectText.appendChild(projectTitle);
    projectText.appendChild(projectDesc);

    projectCard.appendChild(projectText);
    projectCard.appendChild(projectButtons);

    projectList.appendChild(projectCard);

    projectCard.addEventListener("mouseenter", () => {
        editProjBtn.hidden = false;
        removeProjBtn.hidden = false;
    });

    projectCard.addEventListener("mouseleave", () => {
        editProjBtn.hidden = true;
        removeProjBtn.hidden = true;
    });

    return projectCard;
};

export function populateProjectList(arr = []){
    removeAllChildNodes(projectList);
    arr.forEach((i) => {
        i.projectCard = createProjectCard(i.title, i.description, arr.indexOf(i), i);
    });
    updateStorage("projects");
};