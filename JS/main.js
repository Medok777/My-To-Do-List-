// loader 

let loader = document.querySelector('.show-loader')

window.addEventListener('load', () => {
    loader.classList.add('show-loader')
    setTimeout(() => {
        loader.remove('.loader')
    }, 3000)
})

// toast сделал не сам но уж больно понравилось )

const toastContainer = document.getElementById('toast-container')

function showToast(msg, time = 3000) {
    const toast = document.createElement('div')
    toast.className = 'toast'
    toast.textContent = msg

    toastContainer.appendChild(toast)
    requestAnimationFrame(() => 
         toast.classList.add('show')
    )
    setTimeout(() => {
        toast.classList.remove('show')
        toast.addEventListener('transitionend', () => 
             toast.remove()
        )
    }, time)
}

 //todo

    const form = document.getElementById('form');
    const taskInput = document.getElementById('taskInput');
    
    const tasksContainer = document.getElementById('tasksList');
    const completedTasksContainer = document.getElementById   ('completedTasksList');
    
    let tasks = [];

    if(localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'))
        tasks.forEach(task => renderTask(task));
    }

    form.addEventListener('submit', addTask)

    if(tasksContainer) {
        tasksContainer.addEventListener('click', handleTaskActions)
    }
    if(completedTasksContainer) {
        completedTasksContainer.addEventListener('click', handleTaskActions)
    }

    function addTask(event) {
        event.preventDefault()
        const taskText = taskInput.value.trim()

        if(!taskText) {
            showToast('❌ Пожалуйста, введите задачу!')
            return
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            isDone: false,
        }

        tasks.push(newTask)
        saveToLocalStorage()
        renderTask(newTask)

        taskInput.value = ""
        taskInput.focus()

        showToast('✅ Задача создана!')
    }

    function handleTaskActions(event) {
        const target = event.target.closest('button')
        if(!target) {
            return
        }

        const parentNode = target.closest('.todo-tasks__wrapper')
        const id = Number(parentNode.id)

        const img = target.querySelector('img');
           if (img && img.alt === 'bin') {
            tasks = tasks.filter(task => task.id !== id)
            parentNode.remove()
            showToast('🗑️ Задача удалена!')
        } else if (img && img.alt === 'check mark') {
            const task = tasks.find(task => task.id === id)

            if(task) {
                task.isDone = !task.isDone
                parentNode.remove()
                renderTask(task)

                showToast(task.isDone ? '🎉 Задача выполнена!' : '▶️ Задача возвращена!')
            }
        }
        saveToLocalStorage()
    }
    
    function renderTask(task) {
        const cssClass = task.isDone ? 'completed' : ''

        let taskHTML
        if(task.isDone) {
            taskHTML = ` 
            <div id="${task.id}" class="todo-tasks__wrapper ${cssClass}">
                <div class="todo-task-completed__content">
                    <div class="${cssClass}"><s>${task.text}</s></div>
                    <div class="events-tasks-btn">
                        <button><img src="./img/bin.svg" alt="bin"></button>
                    </div>
                </div>
            </div>
            `
        
        completedTasksContainer.insertAdjacentHTML('beforeend', taskHTML)
        } else {
            taskHTML = `
            <div id="${task.id}" class="todo-tasks__wrapper">
                <div class="todo-tasks__content">
                    <div class="todo-tasks__text">${task.text}</div>
                    <div class="events-tasks-btn">
                        <button><img src="./img/check mark.svg" alt="check mark"></button>
                        <button><img src="./img/bin.svg" alt="bin"></button>
                    </div>
                </div>
            </div>
            `
            tasksContainer.insertAdjacentHTML('beforeend', taskHTML)
        }
    }

    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }