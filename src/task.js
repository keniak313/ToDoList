import { format, parse, isToday, isYesterday, isTomorrow } from "date-fns";
import { createTaskCard, taskList } from "./tasklist";
import { dialogFunc } from "./dialog";
import { tasks, projects, updateStorage } from "./index.js";

export class Task {
    constructor(title, description, dueDate, priority, completed = false, project = "", taskCard){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;//parse(dueDate, "yyyy-MM-dd'T'HH:mm", new Date());
        this.priority = priority;
        this.today = false;//isToday(this.dueDate);
        this.tomorrow = false;//isTomorrow(this.dueDate);
        this.yesterday = false;//isYesterday(this.dueDate);
        this.completed = completed;
        this.project = project;
        this.parseDate(this.dueDate);
        this.taskCard = taskCard;

        tasks.push(this);
    }

    parseDate(date){
        const result = parse(date, "yyyy-MM-dd'T'HH:mm", new Date());
        //this.dueDate = result;
        this.today = isToday(result);
        this.tomorrow = isTomorrow(result);
        this.yesterday = isYesterday(result);
        return result;
    }

    removeTask(){
        console.log("Remove Task")
        tasks.splice(this, 1);
        taskList.removeChild(this.taskCard);
        updateStorage("tasks");
    }

    editTask(){
        console.log("Edit Task");
        dialogFunc.hideSubmitBtn();
        dialogFunc.openEditDialog(this.title, this.description, this.dueDate, this.priority, this, this.taskCard, this.project);
        console.log(tasks);
    }

    markComplete(){
        console.log("Complete")
        this.completed = this.completed ? false : true;
        this.taskCard.dataset.completed = this.completed;
        if(this.completed){
            this.taskCard.classList.add("completed");
        }else{
            this.taskCard.classList.remove("completed");
        }
        updateStorage("tasks");
        console.log(tasks);
    }
};