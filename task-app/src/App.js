import Header from "./components/Header";
import Tasks from "./components/Tasks";
import Footer from "./components/Footer";
import AddTask from "./components/AddTask";
import About from "./components/About";
import { useState, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    };
    getTasks();
  }, []);

  // fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    console.log(data);
    return data;
  };

   // fetch task
   const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();
    console.log(data);
    return data;
  };
  //Add Task
  const addTask = async (task) => {
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);

    // const id = Math.floor(Math.random() * 10000) + 1;
    // const newTask = { id, ...task };
    // setTasks([...tasks, newTask]);
  };

  //Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  //Toggle Reminder

  const tReminder = async(id) => {
    const taskToToggle = await fetchTask(id)
    const upTask = {... taskToToggle, rem: !taskToToggle.rem}
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(upTask)
    })

    const data = await res.json()


    setTasks(
      tasks.map((task) =>
        task.id == id ? { ...task, rem: data.rem } : task
      )
    )
    console.log(id)
    };
  return (
    <Router>
    <div className="container">
    <Routes>
      <Route path='/' exact element={
        <>
         <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
      {/* shorter turnery operator that only takes true */}
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 ? (
        <Tasks
          tasks={tasks}
          onAdd={addTask}
          onDelete={deleteTask}
          onToggle={tReminder}
        />
      ) : (
        "No Tasks to show"
      )}
        </>
      }/>
      <Route path='/about' element={<About/>}/>
      </Routes>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
