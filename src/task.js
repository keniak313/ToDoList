import { format, parse } from "date-fns";
export let tasks = [];

export class Task {
    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = parse(dueDate, "yyyy-MM-dd'T'HH:mm", new Date());
        this.priority = priority;
        tasks.push(this);
    }
};