/**
 * Todo List Application
 * Features: Add, Edit, Delete, Toggle, Filter, Sort, Due dates
 * Uses higher-order functions (map, filter, sort, reduce) throughout
 */

// ===== State =====
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';
let currentSort = 'newest';
let editingId = null;

// ===== Utility =====
const generateId = () => `todo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const formatDate = (isoString) => {
  if (!isoString) return null;
  const d = new Date(isoString);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
};

const saveToStorage = () => localStorage.setItem('todos', JSON.stringify(todos));

// ===== CRUD Operations =====

/** 할 일 추가 */
const addTodo = (text, dueDate = '') => {
  const newTodo = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
  };
  todos = [newTodo, ...todos];
  saveToStorage();
  return newTodo;
};

/** 할 일 삭제 */
const deleteTodo = (id) => {
  todos = todos.filter(todo => todo.id !== id);
  saveToStorage();
};

/** 할 일 수정 */
const editTodo = (id, newText, newDueDate) => {
  todos = todos.map(todo =>
    todo.id === id
      ? { ...todo, text: newText.trim(), dueDate: newDueDate || null, updatedAt: new Date().toISOString() }
      : todo
  );
  saveToStorage();
};

/** 완료 토글 */
const toggleTodo = (id) => {
  todos = todos.map(todo =>
    todo.id === id
      ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : null }
      : todo
  );
  saveToStorage();
};

/** 완료된 항목 전체 삭제 */
const clearCompleted = () => {
  todos = todos.filter(todo => !todo.completed);
  saveToStorage();
};

// ===== Query / Filter / Sort =====

/** 현재 필터에 따라 할 일 조회 */
const getFilteredTodos = () => {
  const filtered = todos.filter(todo => {
    if (currentFilter === 'pending') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (currentSort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (currentSort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (currentSort === 'name') return a.text.localeCompare(b.text, 'ko');
    if (currentSort === 'duedate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });
};

/** 통계 계산 */
const getStats = () => todos.reduce(
  (acc, todo) => {
    acc.total++;
    todo.completed ? acc.completed++ : acc.pending++;
    return acc;
  },
  { total: 0, completed: 0, pending: 0 }
);

// ===== DOM Rendering =====

const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const emptyMessage = document.getElementById('empty-message');

/** 단일 Todo 아이템 DOM 생성 */
const createTodoElement = (todo) => {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' completed' : ''}${isOverdue(todo.dueDate) && !todo.completed ? ' overdue' : ''}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', `${todo.text} 완료 토글`);
  checkbox.addEventListener('change', () => {
    toggleTodo(todo.id);
    render();
  });

  const body = document.createElement('div');
  body.className = 'todo-body';

  const textSpan = document.createElement('span');
  textSpan.className = 'todo-text';
  textSpan.textContent = todo.text;

  const metaDiv = document.createElement('div');
  metaDiv.className = 'todo-meta';

  if (todo.dueDate) {
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = `due-date${isOverdue(todo.dueDate) && !todo.completed ? ' overdue' : ''}`;
    dueDateSpan.textContent = `📅 마감: ${formatDate(todo.dueDate)}${isOverdue(todo.dueDate) && !todo.completed ? ' ⚠️ 기한 초과' : ''}`;
    metaDiv.appendChild(dueDateSpan);
  }

  const createdSpan = document.createElement('span');
  createdSpan.className = 'created-date';
  createdSpan.textContent = `등록: ${formatDate(todo.createdAt)}`;
  metaDiv.appendChild(createdSpan);

  body.appendChild(textSpan);
  body.appendChild(metaDiv);

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn edit';
  editBtn.innerHTML = '✏️';
  editBtn.setAttribute('aria-label', `${todo.text} 수정`);
  editBtn.addEventListener('click', () => openEditModal(todo));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'icon-btn delete';
  deleteBtn.innerHTML = '🗑️';
  deleteBtn.setAttribute('aria-label', `${todo.text} 삭제`);
  deleteBtn.addEventListener('click', () => {
    if (confirm(`"${todo.text}"을(를) 삭제하시겠습니까?`)) {
      deleteTodo(todo.id);
      render();
    }
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(body);
  li.appendChild(actions);

  return li;
};

/** 전체 화면 렌더링 */
const render = () => {
  const filtered = getFilteredTodos();
  const stats = getStats();

  // 목록 렌더링
  todoList.innerHTML = '';
  filtered.forEach(todo => todoList.appendChild(createTodoElement(todo)));

  // 빈 상태 처리
  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    if (currentFilter === 'pending') emptyMessage.textContent = '미완료 항목이 없습니다. 🎉';
    else if (currentFilter === 'completed') emptyMessage.textContent = '완료된 항목이 없습니다.';
    else emptyMessage.textContent = '등록된 할 일이 없습니다. 위에서 추가해 보세요!';
  } else {
    emptyState.style.display = 'none';
  }

  // 통계 업데이트
  document.getElementById('total-count').textContent = stats.total;
  document.getElementById('pending-count').textContent = stats.pending;
  document.getElementById('completed-count').textContent = stats.completed;

  // '완료 항목 삭제' 버튼 표시 여부
  const clearBtn = document.getElementById('clear-completed-btn');
  clearBtn.style.display = stats.completed > 0 ? 'inline-flex' : 'none';
};

// ===== Modal =====

const editModal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-input');
const editDueDate = document.getElementById('edit-due-date');

const openEditModal = (todo) => {
  editingId = todo.id;
  editInput.value = todo.text;
  editDueDate.value = todo.dueDate || '';
  editModal.style.display = 'flex';
  editInput.focus();
  editInput.select();
};

const closeEditModal = () => {
  editModal.style.display = 'none';
  editingId = null;
  editInput.value = '';
  editDueDate.value = '';
};

document.getElementById('save-edit-btn').addEventListener('click', () => {
  const newText = editInput.value.trim();
  if (!newText) {
    alert('내용을 입력해 주세요.');
    editInput.focus();
    return;
  }
  editTodo(editingId, newText, editDueDate.value);
  closeEditModal();
  render();
});

document.getElementById('cancel-edit-btn').addEventListener('click', closeEditModal);

document.querySelector('.modal-backdrop').addEventListener('click', closeEditModal);

editInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('save-edit-btn').click();
  if (e.key === 'Escape') closeEditModal();
});

// ===== Event Listeners =====

// 추가 폼
document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  const dueDateInput = document.getElementById('due-date-input');
  const text = input.value.trim();
  if (!text) return;
  addTodo(text, dueDateInput.value);
  input.value = '';
  dueDateInput.value = '';
  input.focus();
  render();
});

// 필터 버튼
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

// 정렬
document.getElementById('sort-select').addEventListener('change', (e) => {
  currentSort = e.target.value;
  render();
});

// 완료 항목 삭제
document.getElementById('clear-completed-btn').addEventListener('click', () => {
  const stats = getStats();
  if (confirm(`완료된 항목 ${stats.completed}개를 삭제하시겠습니까?`)) {
    clearCompleted();
    render();
  }
});

// ===== Init =====
render();
