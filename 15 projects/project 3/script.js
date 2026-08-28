const cards = document.querySelectorAll('.card');
const lists = document.querySelectorAll('.list');
const toDoList = document.getElementById('list1');
const addTaskBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task-input');
var numberOfCards = document.querySelectorAll('.card').length;


addTaskBtn.addEventListener("click", addTask);
function addTask(e) {

    numberOfCards = document.querySelectorAll('.card').length;
    let taskName = taskInput.value;
    if (taskName === "") {
        return
    };
    const task = document.createElement('div');
    task.classList.add('card');
    task.id = `card + ${numberOfCards + 1}`;
    task.draggable = 'true';
    task.textContent = taskName;

    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    e.preventDefault();
    toDoList.appendChild(task);
    taskInput.value = '';
}

for (const card of cards) {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
}

for (const list of lists) {
    list.addEventListener('dragover', dragOver);
    list.addEventListener('dragenter', dragEnter);
    list.addEventListener('dragleave', dragLeave);
    list.addEventListener('drop', drop);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', this.id);
    console.log("Drag Start");
}

function dragEnd() {
    console.log("Drag Ended");
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();

    this.classList.add('over');
}

function dragLeave(e) {
    e.preventDefault();
    this.classList.remove('over');
}

function drop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const card = document.getElementById(id);
    this.appendChild(card);
    this.classList.remove('over')
}


