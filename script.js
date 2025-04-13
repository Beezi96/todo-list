// получение элементов
const inpText = document.querySelector('#inp-text')
const btnAddTodo = document.querySelector('#btn-add-todo')
const todoList = document.querySelector('#todo-list')
const createdCounter = document.getElementById('created-counter')
const completedCounter = document.getElementById('completed-counter')
const emptyState = document.querySelector('#empty-state')
const inputError = document.querySelector('#input-error')
let currentFilter = 'all'
// Создание массива для хранения задач
let todos = []

function addTodo () {
  const text = inpText.value.trim();
  const minLength = 2

  if (!text) {
    showError('Пожалуйста, введите задачу')
    inpText.focus()
    return
  }

  if (text.length < minLength) {
    showError(`Задача должна содержать минимум ${minLength} символа`)
    inpText.focus()
    return
  }

  const alreadyExists = todos.some(
    todo => todo.text.toLowerCase() === text.toLowerCase()
  )

  if(alreadyExists) {
    showError('Такая задача уже существует')
    inpText.focus()
    return
  }
  
  todos.push({
    id: Date.now(),
    text,
    completed: false
  })
  inpText.value = ''
  updateCharCounter()
  hideError()
  saveTodos()
  renderTodos()
  updateCounters()

}

function renderTodos () {
  todoList.innerHTML = ''
  const todosToRender = filterTodos()

  if(todosToRender.length === 0) {
    emptyState.classList.add('active')
    return 
  } 

  emptyState.classList.remove('active')
  

  todosToRender.forEach(todo => {
    const todoItem = document.createElement('li')
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`
    todoItem.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id='${todo.id}'>
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" data-id="${todo.id}"></button>
    `
    todoList.appendChild(todoItem)
  })
}

function initEventListener() {
  todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
      toggleComplete(e)
    }
  })

  todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      deleteTodo(e)
    }
  })
}

function toggleComplete(e) {
  const id = Number(e.target.dataset.id)
  const todo = todos.find(todo => todo.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    updateCounters()
    renderTodos()
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
  const total = todos.length
  const completed = todos.filter(todo => todo.completed).length

  createdCounter.textContent = total
  completedCounter.textContent = completed

  if (document.getElementById('filter-all')) {
    document.getElementById('filter-all').dataset.count = total
    document.getElementById('filter-active').dataset.count = total - completed
    document.getElementById('filter-completed').dataset.count = completed
  }
}

// функция обработчик
function handleKeyPress(e) {
  if (e.key === 'Enter') {
    addTodo()
  }
}

function showError(message) {
  inpText.setAttribute('aria-invalid', true)
  inpText.setAttribute('aria-describedby', 'input-error')

  inputError.textContent = message
  inputError.classList.add('show')

  inpText.classList.add('invalid')
  inpText.focus()

  setTimeout(() => {
    if (inputError.textContent === message) {
      hideError()
    }
  }, 5000)
}

function hideError() {
  inpText.setAttribute('aria-invalid', false)
  inputError.classList.remove('show')
  inpText.classList.remove('invalid')
}

function validateInput() {
  const text = inpText.value.trim()
  const minLength = 2

  if(!text) {
    hideError()
    return true
  }

  if(text.length < minLength) {
    showError(`Минимум ${minLength} символа`)
    return false
  }

  hideError()
  return true
}

function updateCharCounter() {
  const charCounter = document.getElementById('char-counter')
  if (!charCounter) return
  
  const currentLength = inpText.value.length
  const maxLength = 50

  charCounter.textContent = `${currentLength}/${maxLength}`
  charCounter.style.color = currentLength > maxLength 
    ? 'var(--danger)'
    : 'var(--gray-300)'
}

function setupFilters() {
  document.getElementById('filter-all').addEventListener('click', () => {
    currentFilter = 'all'
    updateActiveFilter()
    renderTodos()
  })

  document.getElementById('filter-active').addEventListener('click', () => {
    currentFilter = 'active'
    updateActiveFilter()
    renderTodos()
  })

  document.getElementById('filter-completed').addEventListener('click', () => {
    currentFilter = 'completed'
    updateActiveFilter()
    renderTodos()
  })
}

function updateActiveFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active')
  })
  document.getElementById(`filter-${currentFilter}`).classList.add('active')
}

function filterTodos() {
  return todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed
    if (currentFilter === 'completed') return todo.completed
    return true
  })
}

btnAddTodo.addEventListener('click', addTodo)
document.addEventListener('DOMContentLoaded', () => {
  loadTodos()
  updateCharCounter()
  setupFilters()
  initEventListener()
  inpText.focus()
})
inpText.addEventListener('keypress', handleKeyPress)
inpText.addEventListener('input', () => {
  updateCharCounter()
  validateInput()
})
