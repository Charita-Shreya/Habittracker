// Data storage
let data = {
    habits: [
        { id: 0, name: 'Morning Exercise', xp: 10, frequency: 'Daily', completed: false, completedToday: false },
    ],
    tasks: [
        { id: 0, name: 'Complete Project', description: '', xp: 25, dueDate: '', completed: false },
    ],
    totalXP: 0,
    level: 1,
    streak: 0
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('habitflowData');
    if (saved) {
        data = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('habitflowData', JSON.stringify(data));
    updateUI();
}

// Update all UI elements
function updateUI() {
    updateStats();
    updateHabitList();
    updateTaskList();
}

function updateStats() {
    document.getElementById('total-xp').textContent = data.totalXP;
    document.getElementById('level').textContent = Math.floor(data.totalXP / 1000) + 1;
    document.getElementById('streak').textContent = data.streak;
    
    const xpInLevel = data.totalXP % 1000;
    document.getElementById('xp-fill').style.width = (xpInLevel / 1000 * 100) + '%';
    document.getElementById('xp-text').textContent = xpInLevel + ' / 1000 XP';

    document.getElementById('total-xp-report').textContent = data.totalXP;
}

function updateHabitList() {
    const list = document.getElementById('habit-list');
    list.innerHTML = data.habits.map((habit, index) => `
        <li class="habit-item ${habit.completedToday ? 'completed' : ''}">
            <div>
                <strong>${habit.name}</strong>
                <p style="font-size: 12px; color: #999;">+${habit.xp} XP • ${habit.frequency}</p>
            </div>
            <div class="item-actions">
                <button class="btn-small" onclick="completeHabit(${index})">${habit.completedToday ? 'Done' : 'Complete'}</button>
                <button class="btn-small delete" onclick="deleteHabit(${index})">Delete</button>
            </div>
        </li>
    `).join('');
}

function updateTaskList() {
    const list = document.getElementById('task-list');
    list.innerHTML = data.tasks.map((task, index) => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <div>
                <strong>${task.name}</strong>
                <p style="font-size: 12px; color: #999;">+${task.xp} XP</p>
            </div>
            <div class="item-actions">
                <button class="btn-small" onclick="completeTask(${index})">${task.completed ? 'Done' : 'Done'}</button>
                <button class="btn-small delete" onclick="deleteTask(${index})">Delete</button>
            </div>
        </li>
    `).join('');
}

function completeHabit(index) {
    if (!data.habits[index].completedToday) {
        data.habits[index].completedToday = true;
        data.totalXP += data.habits[index].xp;
        data.streak++;
        saveData();
    }
}

function deleteHabit(index) {
    data.habits.splice(index, 1);
    saveData();
}

function completeTask(index) {
    if (!data.tasks[index].completed) {
        data.tasks[index].completed = true;
        data.totalXP += data.tasks[index].xp;
        saveData();
    }
}

function deleteTask(index) {
    data.tasks.splice(index, 1);
    saveData();
}

function addHabit(event) {
    event.preventDefault();
    const habit = {
        id: data.habits.length,
        name: document.getElementById('habit-name').value,
        xp: parseInt(document.getElementById('habit-xp').value),
        frequency: document.getElementById('habit-frequency').value,
        completed: false,
        completedToday: false
    };
    data.habits.push(habit);
    saveData();
    closeModal('habitModal');
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-xp').value = '10';
}

function addTask(event) {
    event.preventDefault();
    const task = {
        id: data.tasks.length,
        name: document.getElementById('task-name').value,
        description: document.getElementById('task-description').value,
        xp: parseInt(document.getElementById('task-xp').value),
        dueDate: document.getElementById('task-due-date').value,
        completed: false
    };
    data.tasks.push(task);
    saveData();
    closeModal('taskModal');
    document.getElementById('task-name').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-xp').value = '25';
    document.getElementById('task-due-date').value = '';
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tab + '-tab').style.display = 'block';
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Load and initialize
    loadData();
    updateUI();
});
