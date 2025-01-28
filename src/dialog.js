export const dialog = document.createElement("dialog");
dialog.id = "newTask";

export const submitTaskBtn = document.createElement("button");

const dialogBox = document.createElement("div");
dialogBox.classList.add("dialogBox");

const form = document.createElement("form");
form.method = "dialog";
form.id = "newTaskForm";




dialogBox.appendChild(form);
dialog.appendChild(dialogBox);

document.body.appendChild(dialog);

createInputs("title", "Text", "Title: ");
createInputs("description", "Text", "Description: ");
createInputs("duedate", "datetime-local", "Due Date: ");
createSelectList("priority", "Priority: ");
createSubmitButton();

//Functions below

function createInputBox(){
    const inputBox = document.createElement("div");
    inputBox.classList.add("inputBox");

    return inputBox;
};

function createInputLabel(labelName, labelContent){
    const inputLabel = document.createElement("label");
    inputLabel.for = labelName;
    inputLabel.textContent = labelContent;

    return inputLabel;
};

function createInputs(inputName, inputType, inputContent = ""){
    let inputLabel = createInputLabel(inputName, inputContent);
    const inputField = document.createElement("input");
    inputField.type = inputType;
    inputField.name = inputName;
    inputField.title = inputName;
    inputField.placeholder = inputContent;
    inputField.required = true;
    
    let inputBox = createInputBox();

    inputBox.appendChild(inputLabel);
    inputBox.appendChild(inputField);

    form.appendChild(inputBox);
};

function createSelectList(selectName, selectContent){
    const selectList = document.createElement("select");

    selectList.appendChild(createSelectOption("high", "3", "High"));
    selectList.appendChild(createSelectOption("medium", "2", "Medium"));
    selectList.appendChild(createSelectOption("low", "1", "Low"));

    let inputLabel = createInputLabel(selectName, selectContent);
    let inputBox = createInputBox();

    inputBox.appendChild(inputLabel);
    inputBox.appendChild(selectList);

    form.appendChild(inputBox);
};

function createSelectOption(optionValue, optionID, optionContent){
    const option = document.createElement("option");
    option.value = optionValue;
    option.dataset.id = optionID;
    option.textContent = optionContent;

    return option;
}

function createSubmitButton(){
    submitTaskBtn.type = "submit";
    submitTaskBtn.textContent = "Create";
    submitTaskBtn.setAttribute("form", form.id);
    dialogBox.appendChild(submitTaskBtn);
};
