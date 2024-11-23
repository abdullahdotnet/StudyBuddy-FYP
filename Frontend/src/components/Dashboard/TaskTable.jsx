import React from 'react';

const TaskTable = () => {
  const tasks = [
    { title: 'Linear Algebra', deadline: '27-04-2024', status: 'Completed' },
    { title: 'Economics', deadline: '27-04-2024', status: 'Pending' },
    { title: 'Organic Chemistry', deadline: '27-04-2024', status: 'Not Completed' },
    { title: 'Linear Algebra', deadline: '27-04-2024', status: 'Completed' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Not Completed':
        return 'bg-red-100 text-red-700';
      default:
        return '';
    }
  };

  return (
    <div className="w-full mt-3 p-4">
    <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-bold">Tasks</h2>
  <a
    href="#"
    className="text-blue-600 hover:underline text-sm"
  >
    view all
  </a>
</div>

  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border"> </th>
          <th className="py-2 px-4 border text-left">Title</th>
          <th className="py-2 px-4 border text-left">Deadline</th>
          <th className="py-2 px-4 border text-left">Status</th>
          <th className="py-2 px-4 border text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="py-2 px-4 border">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </td>
            <td className="py-2 px-4 border">{task.title}</td>
            <td className="py-2 px-4 border">{task.deadline}</td>
            <td className="py-2 px-4 border">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${getStatusClass(
                  task.status
                )}`}
              >
                {task.status}
              </span>
            </td>
            <td className="py-2 px-4 border">
              <button className="text-gray-700 hover:text-gray-900 mr-2">
                👁️
              </button>
              <button className="text-red-600 hover:text-red-800">
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
</div>

  )
};

export default TaskTable;
