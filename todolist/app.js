document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks = storedTasks;
        updateTaskList();
    }
});

let tasks = [];
let currentFilter = 'all';
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};
const addTask = () => {
    const taskInput = document.getElementById('newTask');
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        taskInput.value = '';
        taskInput.focus();
        updateTaskList();
        saveTasks();
    }
};
const toggleTaskComplete = (index) => {
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = !tasks[index].completed;
        updateTaskList();
        saveTasks();
    } else {
        console.error("Invalid index:", index);
    }
};
const deleteTask = (index) => {
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        updateTaskList();
        saveTasks();
    } else {
        console.error("Invalid index:", index);
    }
};
const editTask = (index) => {
    if (index >= 0 && index < tasks.length) {
        const taskInput = document.getElementById('newTask');
        taskInput.value = tasks[index].text;
        taskInput.focus();
        deleteTask(index);
    } else {
        console.error("Invalid index:", index);
    }
};
const updateTaskList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <div class="taskItem ${task.completed ? 'text-completed' : ''}">
                <p>${task.text}</p>
                <button class="edit" data-index="${index}" type="button"><i class="fa-solid fa-pen"></i></button>
                <button class="done" data-index="${index}" type="button"><i class="fa-solid fa-square-check"></i></button>
                <button class="delete" data-index="${index}" type="button"><i class="fa-solid fa-square-xmark"></i></button>
            </div>`;
        taskList.appendChild(listItem);
    });
    document.querySelectorAll('.edit').forEach(button =>
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('[data-index]').dataset.index, 10);
            editTask(index);
        })
    );
    document.querySelectorAll('.done').forEach(button =>
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('[data-index]').dataset.index, 10);
            toggleTaskComplete(index);
        })
    );
    document.querySelectorAll('.delete').forEach(button =>
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.closest('[data-index]').dataset.index, 10);
            deleteTask(index);
        })
    );
};
document.getElementById('addnewtask').addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
});
document.querySelector('.All').addEventListener('click', () => {
    currentFilter = 'all';
    updateTaskList();
});

document.querySelector('.Active').addEventListener('click', () => {
    currentFilter = 'active';
    updateTaskList();
});

document.querySelector('.Completed').addEventListener('click', () => {
    currentFilter = 'completed';
    updateTaskList();
});
