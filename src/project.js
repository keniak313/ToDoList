import { tasks, projects, updateStorage, updateSorting } from "./index.js";
import { projectList } from "./projectlist.js";
import { dialogFunc } from "./dialog";

export class Project{
    constructor(title, description, projectCard) {
        this.title = title;
        this.description = description;
        this.projectCard = projectCard;
        projects.push(this);
    }

    editProject(){
        console.log("Edit Project");
        dialogFunc.hideSubmitBtn();
        dialogFunc.openProjectEditDialog(this.title, this.description, this, this.projectCard);
        //dialogFunc.openEditDialog(this.title, this.description, this.dueDate, this.priority, this, this.taskCard, this.project);
        console.log(projects);
    }

    removeProject(){
        console.log("Remove Project")
        projects.splice(this, 1);
        projectList.removeChild(this.projectCard);
        updateStorage("projects");
        tasks.forEach((t) =>{
            if(t.project === this.title){
                tasks.splice(t,1);
            }
        })
        updateSorting();
    }
}