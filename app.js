
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Sample data for tasks
const tasks = [];

// Middleware for common header data
app.use((req, res, next) => {
    res.locals.navLinks = [
        { name: 'Home', url: '/' },
        { name: 'All Tasks', url: '/all-tasks' },
        { name: 'New Task', url: '/new-task' }
    ];
    next();
});

// Routes
app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/all-tasks', (req, res) => {
    res.render('allTasks', { title: 'All Tasks', tasks });
});

app.get('/new-task', (req, res) => {
    res.render('newTask', { title: 'New Task' });
});

app.post('/add-task', (req, res) => {
    const { text, date } = req.body;
/*
    if (!text || !date) {
        return res.redirect('/404');
    }*/

    const newTask = { text, date, completed: false };
    tasks.unshift(newTask); // Add the new task to the beginning
    res.redirect('/all-tasks');
});


app.get('/edit-task/:index', (req, res) => {
    const { index } = req.params;
    
    // Check if the index is within the valid range of tasks
    if (index >= 0 && index < tasks.length) {
        // Retrieve the task based on the index and render the edit page
        const task = tasks[index];
        res.render('editTask', { title: 'Edit Task', task, index });
    } else {
        res.redirect('/all-tasks'); // Redirect to the all tasks page 
    }
});


app.post('/edit-task/:index', (req, res) => {
    const { index } = req.params;
    const { text, date, [`completed-${index}`]: completed } = req.body; // Check for completed field
    tasks[index] = { text, date, completed: completed === 'on' }; // Update completed status
    res.redirect('/all-tasks');
});

app.post('/complete-task/:index', (req, res) => {
    const { index } = req.params;
    const task = tasks[index];

    // Toggle the completed property
    task.completed = !task.completed;

    res.redirect('/all-tasks');
});


app.get('/delete-task/:index', (req, res) => {
    const { index } = req.params;
    tasks.splice(index, 1);
    res.redirect('/all-tasks');
});

// Handle 404 errors with a custom 404 page
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
