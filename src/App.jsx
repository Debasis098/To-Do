import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [taskAddedMsg, setTaskAddedMsg] = useState(false);

  const navItems = [
    { label: 'Home', icon: '🏠' },
    { label: 'Search', icon: '🔍' },
    { label: 'Add Task', icon: '➕' },
    { label: 'Today', icon: '📅' },
    { label: 'Upcoming', icon: '🗓' },
    { label: 'My Tasks', icon: '📋' },
  ];

  const addTask = () => {
    if (taskText.trim() === '') return;
    const newTask = {
      id: Date.now(),
      text: taskText,
      date: taskDate,
      time: taskTime,
    };
    setTasks([newTask, ...tasks]);
    setTaskText('');
    setTaskDate('');
    setTaskTime('');
    setTaskAddedMsg(true);
    setTimeout(() => setTaskAddedMsg(false), 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((task) => task.date === todayStr);
  const upcomingTasks = tasks.filter((task) => task.date > todayStr);
  const filteredSearch = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderTaskList = (taskList, fallbackText) => {
    return taskList.length === 0 ? (
      <p className="text-gray-500 dark:text-gray-400 italic text-center">{fallbackText}</p>
    ) : (
      <ul className="space-y-3">
        {taskList.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-4 border rounded-xl bg-white dark:bg-slate-800 dark:border-slate-700 shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="text-indigo-500 dark:text-indigo-300 text-xl">📝</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{task.text}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.date || 'No date'} {task.time && `at ${task.time}`}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const toggleIconColor = darkMode ? '#e0e7ff' : '#4f46e5';

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <aside className={`transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex flex-col justify-between shadow-md`}>
        <div>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-6`}>
            {!collapsed && <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">🗂️ Tasks</h1>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xl px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-700/40"
              dangerouslySetInnerHTML={{ __html: collapsed
                ? `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${toggleIconColor}"><path d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${toggleIconColor}"><path d="M660-320v-320L500-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/></svg>` }}
            />
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`flex items-center w-full px-3 py-2 text-base font-medium rounded-xl transition hover:bg-indigo-100 dark:hover:bg-indigo-700/30 ${
                  activeTab === item.label ? 'bg-indigo-200 dark:bg-indigo-700/50' : 'text-indigo-700 dark:text-indigo-200'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {activeTab === 'Home' && (
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold mb-2 text-indigo-700 dark:text-indigo-300">🎉 Welcome!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-6">
              Start by clicking "Add Task"
            </p>
            <div className="w-full max-w-xl">
              {renderTaskList(tasks, 'No tasks added yet.')}
            </div>
          </div>
        )}

        {activeTab === 'Add Task' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">➕ Add a New Task</h2>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 w-full">
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Task name"
                className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none w-full"
              />
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
              />
              <input
                type="time"
                value={taskTime}
                onChange={(e) => setTaskTime(e.target.value)}
                className="px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
              />
              <button
                onClick={addTask}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
            {taskAddedMsg && <div className="text-green-500 font-medium">✅ Task added!</div>}
          </div>
        )}

        {activeTab === 'Search' && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">🔍 Search Tasks</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by task name"
              className="w-full mb-4 px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none"
            />
            {searchTerm.trim() === '' ? (
              <p className="text-gray-500 dark:text-gray-400">Type to search for tasks...</p>
            ) : filteredSearch.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No matching tasks found.</p>
            ) : (
              renderTaskList(filteredSearch)
            )}
          </div>
        )}

        {activeTab === 'Today' && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">📅 Today's Tasks</h2>
            {renderTaskList(todayTasks, 'No tasks scheduled for today.')}
          </div>
        )}

        {activeTab === 'Upcoming' && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">🗓 Upcoming Tasks</h2>
            {renderTaskList(upcomingTasks, 'No upcoming tasks found.')}
          </div>
        )}

        {activeTab === 'My Tasks' && (
          <div>
            <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">📋 All My Tasks</h2>
            {renderTaskList(tasks, 'No tasks added yet.')}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
