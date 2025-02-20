import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:8000/api/todo/tasks/";

const ToDo = ({ dashboard }) => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserId(); // Get user ID after token is set
        fetchTasks();
    }, []);

    const fetchUserId = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        try {
            const response = await fetch("http://localhost:8000/api/user/profile", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserId(data.id); // Assuming 'id' is the field for the user ID
            } else {
                console.error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchTasks = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const sortedTasks = response.data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            setTasks(sortedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const openAddModal = () => {
        setCurrentTask({ title: '', deadline: '', status: 'Pending' });
        setIsModalOpen(true);
    };

    const openUpdateModal = (task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };
    const handleViewAllClick = () => {
        navigate('/todo'); // Programmatically route to /todo
    };
    const saveTask = async () => {
        const accessToken = sessionStorage.getItem("accessToken");
        try {
            if (currentTask.id) {
                await axios.put(`${API_URL}${currentTask.id}/`, {
                    ...currentTask,
                    user: userId // Add user ID dynamically
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            } else {
                await axios.post(API_URL, {
                    ...currentTask,
                    user: userId // Add user ID dynamically
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
            setIsModalOpen(false);
            fetchTasks();
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    const deleteTask = async (id) => {
        const accessToken = sessionStorage.getItem("accessToken");
        try {
            await axios.delete(`${API_URL}${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const updateTaskStatus = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, status: task.status === 'Completed' ? 'Pending' : 'Completed' } : task
        );
        setTasks(updatedTasks);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Tailwind and custom styles
    return (
        <div className="max-w-6xl bg-white p-8 rounded-lg">
            <div className="rounded-t-lg flex justify-between items-center mb-8">
                <h1 className="text-3xl font-semibold roboto-font">To Do</h1>
                {dashboard ? (
                    <button  onClick={handleViewAllClick}
                        className="px-6 py-2 bg-[#4255FF] text-white rounded-lg "
                    >
                        View All
                    </button>
                ) : (
                    <button
                        onClick={openAddModal}
                        className="px-6 py-2 bg-customDarkBlue hover:bg-customDarkBlueHover text-white rounded-lg"
                    >
                        Add New Task
                    </button>
                )}
            </div>
            <table className="w-full">
                <thead className='bg-[#D4D4D4]'>
                    <tr>
                        <th className="text-black py-2 text-center" style={{ width: '5%' }}></th>
                        <th className="text-black py-2 text-center" style={{ width: '35%' }}>Title</th>
                        <th className="text-black py-2 text-center">Deadline</th>
                        <th className="text-black py-2 text-center">Status</th>
                        <th className="text-black py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id} className="border-t border-b border-[#ddd]">
                            <td className="text-center py-2">
                                <input
                                    type="checkbox"
                                    checked={task.status === 'Completed'}
                                    onChange={() => updateTaskStatus(task.id)}
                                    className="w-4 h-4 text-white bg-gray-200 rounded border-gray-400 checked:bg-green-500 focus:ring-0"
                                />
                            </td>
                            <td className="text-center py-2" style={{ width: '35%' }}>{task.title}</td>
                            <td className="text-center py-2" style={{ width: '30%' }}>{formatDate(task.deadline)}</td>
                            <td className="text-left py-2">
                                <span
                                    className={`px-4 py-2 rounded-full ${task.status === 'Completed'
                                        ? 'text-[#00B17D] bg-[#C7FFEC]'
                                        : task.status === 'Pending'
                                            ? 'text-[#D1BC00] bg-[#FFF7B0]'
                                            : 'text-[#EC3722] bg-[#FFC69B]'
                                        } shadow-md`}
                                >
                                    {task.status}
                                </span>
                            </td>
                            <td className="py-2 flex justify-center">
                                <button
                                    className="px-3 py-1 bg-transparent text-red-600 hover:text-red-800"
                                    onClick={() => openUpdateModal(task)}
                                >
                                    <img src="/src/assets/icons/pen-to-square-solid.svg" alt="Update" className="w-5 h-5" />
                                </button>
                                <button
                                    className="px-3 py-1 bg-transparent text-red-600 hover:text-red-800"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    <img src="/src/assets/icons/material-symbols_delete.svg" alt="Delete" className="w-6 h-6" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#2e2e2e] text-white p-8 rounded-lg shadow-lg w-96 text-center">
                        <h2>{currentTask.id ? 'Update Task' : 'Add Task'}</h2>
                        <input
                            type="text"
                            placeholder="Task Title"
                            value={currentTask.title}
                            onChange={(e) =>
                                setCurrentTask({ ...currentTask, title: e.target.value })
                            }
                            className="w-full p-2 mt-4 text-black rounded"
                        />
                        <input
                            type="date"
                            value={currentTask.deadline}
                            onChange={(e) =>
                                setCurrentTask({ ...currentTask, deadline: e.target.value })
                            }
                            className="w-full p-2 mt-4 text-black rounded"
                        />
                        <select
                            value={currentTask.status}
                            onChange={(e) =>
                                setCurrentTask({ ...currentTask, status: e.target.value })
                            }
                            className="w-full p-2 mt-4 text-black rounded"
                        >
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={saveTask}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToDo;
