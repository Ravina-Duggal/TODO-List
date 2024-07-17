import React, { useState, useEffect } from 'react';
import Noty from 'noty';
import Toastify from 'toastify-js';
import 'noty/lib/noty.css';
import 'noty/lib/themes/metroui.css';
import 'toastify-js/src/toastify.css';
import './Style.css';
import ConfirmationDialog from './DialogBox';


const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    return savedTasks || [];
  });
  const [taskText, setTaskText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, taskId: null });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (taskText.trim() === '') return;
    const newTask = { id: Date.now(), text: taskText, completed: false };
    setTasks([...tasks, newTask]);
    setTaskText('');
    showNotification('success', 'Task was successfully added');
  };


  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Show notification for task completion status
    const task = updatedTasks.find(task => task.id === id);
    showNotification(task.completed ? 'success' : 'warning', `Task "${task.text}" was ${task.completed ? 'completed' : 'uncompleted'}`);
  };

  const startEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
    document.querySelector("#edit-modal").style.display = "block";
  };

  const saveEditTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId ? { ...task, text: editTaskText } : task
    );
    setTasks(updatedTasks);
    setEditTaskId(null);
    setEditTaskText('');
    showNotification('success', 'Task was successfully updated');
    document.querySelector("#edit-modal").style.display = "none";
  };

  const removeTask = (id) => {
    setConfirmDialog({ isOpen: true, taskId: id, action: 'deleteTask' });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.action === 'deleteTask') {
      const updatedTasks = tasks.filter((task) => task.id !== confirmDialog.taskId);
      setTasks(updatedTasks);
      showNotification('success', 'Task was successfully deleted');
    } else if (confirmDialog.action === 'clearAllTasks') {
      setTasks([]);
      showNotification('success', 'All tasks were successfully deleted');
    }
    setConfirmDialog({ isOpen: false, taskId: null, action: null });
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, taskId: null, action: null });
  };
  const clearAllTasks = () => {
    if (tasks.length > 0) {
      setConfirmDialog({ isOpen: true, taskId: null, action: 'clearAllTasks' });
    } else {
      showNotification('error', 'There is no task to remove.');
    }
  };


  const showNotification = (type, text) => {
    new Noty({
      type,
      text: `<i class="check icon"></i> ${text}`,
      layout: "bottomRight",
      timeout: 2000,
      progressBar: true,
      closeWith: ["click"],
      theme: "metroui",
    }).show();
  };


  return (
    <>
      <div className='todolist-header'>To-Do List App
      </div>
      <div className="app">


        <form id="add-task" onSubmit={addTask}>
          <input
            id="add-task-input"
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter your tasks today"
            autoFocus
          />
          <button class="custom-btn btn-1">Add Task</button>
        </form>
        <button id="clear-all-tasks" onClick={clearAllTasks} disabled={tasks.length === 0}>Clear All Tasks</button>
        <ul id="tasks-list">
          {tasks.length === 0 ? (
            <div className="ui icon warning message">
              <i className="inbox icon"></i>
              <div className="content">
                <div className="header">You have nothing task today!</div>
                <div>Enter your tasks today above.</div>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <li key={task.id} className="ui segment grid equal width">
                <div className="ui checkbox column">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <label>{task.text}</label>
                </div>
                <div className="">
                  <i
                    data-id={task.id}
                    className="edit outline icon"
                    onClick={() => startEditTask(task.id, task.text)}
                  ></i>
                  <i
                    data-id={task.id}
                    className="trash alternate outline remove icon"
                    onClick={() => removeTask(task.id)}
                  ></i>
                </div>
              </li>
            ))
          )}
        </ul>

        <div id="edit-modal" className="modal">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <input
              id="task-text"
              type="text"
              value={editTaskText}
              onChange={(e) => setEditTaskText(e.target.value)}
            />
            <button class="custom-btn btn-1" onClick={saveEditTask}>Update</button>
            <button onClick={() => document.querySelector("#edit-modal").style.display = "none"}>Cancel</button>

          </div>
        </div>

      </div>
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={
          confirmDialog.action === 'deleteTask'
            ? "Are you sure you want to delete this task?"
            : "Are you sure you want to clear all tasks?"
        }
      />
    </>
  );
};

export default App;
