// получение элементов
const inpText = document.querySelector('#inp-text')
const btnAddTodo = document.querySelector('#btn-add-todo')
const todoList = document.querySelector('#todo-list')
// Создание массива для хранения задач
let todos = []

function addTodo () {
  const text = inpText.value.trim();
  if(text) {
    todos.push({
      id: Date.now(),
      text,
      completed: false
    })
    inpText.value = ''
    saveTodos()
    renderTodos()
    updateCounters()
  }
}

function renderTodos () {
  todoList.innerHTML = ''
  const emptyState = document.querySelector('.empty-state')
  if(todos.length === 0) {
    return emptyState.classList.add('active')
    
  } else {
    emptyState.classList.remove('active')
  }

  todos.forEach(todo => {
    const todoItem = document.createElement('li')
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`
    todoItem.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id='${todo.id}'>
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" data-id="${todo.id}"></button>
    `
    todoList.appendChild(todoItem)
  })
  document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', toggleComplete)
  })

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', deleteTodo)
  })
}

function toggleComplete(e) {
  const id = Number(e.target.dataset.id)
  const todo = todos.find(todo => todo.id === id)
  if (todo) {
    todo.completed =!todo.completed
    saveTodos()
    updateCounters()
  }
}

function deleteTodo (e) {
  const id = Number(e.target.dataset.id)
  todos = todos.filter(todo => todo.id !== id)
  saveTodos()
  renderTodos()
  updateCounters()
}

// Сохранение в LocalStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos))
}

// Загрузка из LocalStorage
function loadTodos() {
  const saved = localStorage.getItem('todos')
  if(saved) {
    todos = JSON.parse(saved)
    renderTodos()
    updateCounters()
  }
}

// Обновление счетчика
function updateCounters() {
  const createdCounter = document.getElementById('created-counter')
  const completedCounter = document.getElementById('completed-counter')

  const total = todos.length
  const completed = todos.filter(todo => todo.completed).length

  createdCounter.textContent = total
  completedCounter.textContent = completed

}

btnAddTodo.addEventListener('click', addTodo)
document.addEventListener('DOMContentLoaded', loadTodos)
inpText.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo()
})


