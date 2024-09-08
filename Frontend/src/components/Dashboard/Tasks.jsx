import React from 'react'


const tasks = [
    { label: 'Complete the OS lab', color: 'bg-green-400' },
    { label: 'Complete the DW lab', color: 'bg-orange-400' },
    { label: 'Technical writing Assignment', color: 'bg-green-400' },
    { label: 'Operating systems quiz', color: 'bg-orange-400' },
    { label: 'Complete the OS lab', color: 'bg-green-400' },
    { label: 'Complete the DW lab', color: 'bg-orange-400' },
    { label: 'Technical writing Assignment', color: 'bg-green-400' },
    { label: 'Operating systems quiz', color: 'bg-orange-400' },
    { label: 'Operating systems quiz', color: 'bg-orange-400' }
  ];
  
  const TaskItem = ({ label, color }) => {
    return (
      <div className="flex items-center space-x-3">
        <span className={`inline-block w-4 h-4 ${color}`}></span>
        <span>{label}</span>
      </div>
    );
  };

const Tasks = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      <div className="grid grid-cols-3 gap-x-12">
        {tasks.map((task, index) => (
          <TaskItem key={index} label={task.label} color={task.color} />
        ))}
      </div>
    </div>
  )
}

export default Tasks