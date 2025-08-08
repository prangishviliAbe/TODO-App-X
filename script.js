class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.editingTodoId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.renderTodos();
        this.updateStats();
        this.setDefaultTime();
    }

    initializeElements() {
        // Form elements
        this.todoInput = document.getElementById('todoInput');
        this.todoTime = document.getElementById('todoTime');
        this.todoColor = document.getElementById('todoColor');
        this.addBtn = document.getElementById('addTodo');
        
        // List and stats
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.totalTodos = document.getElementById('totalTodos');
        this.pendingTodos = document.getElementById('pendingTodos');
        this.completedTodos = document.getElementById('completedTodos');
        
        // Filter buttons
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        // Modal elements
        this.modal = document.getElementById('editModal');
        this.editInput = document.getElementById('editInput');
        this.editTime = document.getElementById('editTime');
        this.editColor = document.getElementById('editColor');
        this.closeModal = document.getElementById('closeModal');
        this.cancelEdit = document.getElementById('cancelEdit');
        this.saveEdit = document.getElementById('saveEdit');
    }

    bindEvents() {
        // Add todo
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Modal events
        this.closeModal.addEventListener('click', () => this.closeEditModal());
        this.cancelEdit.addEventListener('click', () => this.closeEditModal());
        this.saveEdit.addEventListener('click', () => this.saveEditTodo());
        
        // Close modal on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeEditModal();
        });
    }

    setDefaultTime() {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        this.todoTime.value = localDateTime;
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        const time = this.todoTime.value;
        const color = this.todoColor.value;

        if (!text) {
            this.showNotification('გთხოვთ შეიყვანოთ ამოცანის ტექსტი', 'error');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            time: time,
            color: color,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        this.clearForm();
        this.showNotification('ამოცანა წარმატებით დაემატა!', 'success');
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        this.editingTodoId = id;
        this.editInput.value = todo.text;
        this.editTime.value = todo.time;
        this.editColor.value = todo.color;
        this.openEditModal();
    }

    saveEditTodo() {
        const text = this.editInput.value.trim();
        const time = this.editTime.value;
        const color = this.editColor.value;

        if (!text) {
            this.showNotification('გთხოვთ შეიყვანოთ ამოცანის ტექსტი', 'error');
            return;
        }

        const todoIndex = this.todos.findIndex(t => t.id === this.editingTodoId);
        if (todoIndex === -1) return;

        this.todos[todoIndex] = {
            ...this.todos[todoIndex],
            text: text,
            time: time,
            color: color
        };

        this.saveTodos();
        this.renderTodos();
        this.closeEditModal();
        this.showNotification('ამოცანა წარმატებით განახლდა!', 'success');
    }

    toggleTodo(id) {
        const todoIndex = this.todos.findIndex(t => t.id === id);
        if (todoIndex === -1) return;

        this.todos[todoIndex].completed = !this.todos[todoIndex].completed;
        this.saveTodos();
        this.renderTodos();
        this.updateStats();
        
        const action = this.todos[todoIndex].completed ? 'დასრულებული' : 'მიმდინარე';
        this.showNotification(`ამოცანა ${action}!`, 'success');
    }

    deleteTodo(id) {
        if (confirm('ნამდვილად გსურთ ამ ამოცანის წაშლა?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.renderTodos();
            this.updateStats();
            this.showNotification('ამოცანა წაშლილია!', 'success');
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderTodos();
    }

    renderTodos() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.style.display = 'none';
            this.emptyState.style.display = 'block';
        } else {
            this.todoList.style.display = 'flex';
            this.emptyState.style.display = 'none';
            
            this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoHTML(todo)).join('');
        }
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    createTodoHTML(todo) {
        const timeDisplay = todo.time ? this.formatDateTime(todo.time) : '';
        const completedClass = todo.completed ? 'completed' : '';
        const completedIcon = todo.completed ? 'fa-check-circle' : 'fa-circle';
        const completedText = todo.completed ? 'მიმდინარე' : 'დასრულება';

        return `
            <div class="todo-item ${completedClass}" style="border-left-color: ${todo.color}">
                <div class="todo-header">
                    <div class="todo-content">
                        <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                        ${timeDisplay ? `<div class="todo-time"><i class="fas fa-clock"></i> ${timeDisplay}</div>` : ''}
                    </div>
                    <div class="todo-actions">
                        <button class="action-btn complete" onclick="todoApp.toggleTodo(${todo.id})" title="${completedText}">
                            <i class="fas ${completedIcon}"></i>
                        </button>
                        <button class="action-btn edit" onclick="todoApp.editTodo(${todo.id})" title="რედაქტირება">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="todoApp.deleteTodo(${todo.id})" title="წაშლა">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diffTime = date - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        const formattedDate = date.toLocaleDateString('ka-GE', options);
        
        if (diffDays < 0) {
            return `${formattedDate} (ვადა გასდა)`;
        } else if (diffDays === 0) {
            return `${formattedDate} (დღეს)`;
        } else if (diffDays === 1) {
            return `${formattedDate} (ხვალ)`;
        } else if (diffDays <= 7) {
            return `${formattedDate} (${diffDays} დღეში)`;
        } else {
            return formattedDate;
        }
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        this.totalTodos.textContent = total;
        this.pendingTodos.textContent = pending;
        this.completedTodos.textContent = completed;
    }

    openEditModal() {
        this.modal.classList.add('show');
        this.editInput.focus();
    }

    closeEditModal() {
        this.modal.classList.remove('show');
        this.editingTodoId = null;
    }

    clearForm() {
        this.todoInput.value = '';
        this.setDefaultTime();
        this.todoColor.value = '#ff6b6b';
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-weight: 500;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return '#4caf50';
            case 'error': return '#f44336';
            case 'warning': return '#ff9800';
            default: return '#2196f3';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Add some sample todos on first visit
if (!localStorage.getItem('todos')) {
    const sampleTodos = [
        {
            id: Date.now() - 2,
            text: 'მოგესალმებათ TODO აპლიკაცია!',
            time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            color: '#4ecdc4',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() - 1,
            text: 'შეგიძლიათ დაამატოთ ახალი ამოცანები, რედაქტირება, წაშლა და ფერის მინიჭება',
            time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            color: '#feca57',
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    localStorage.setItem('todos', JSON.stringify(sampleTodos));
}
