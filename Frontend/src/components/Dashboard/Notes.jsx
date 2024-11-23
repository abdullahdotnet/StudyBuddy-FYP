import React from "react";

const Notes = () => {
  const notes = [
    { id: 1, name: "Physics" },
    { id: 2, name: "Chemistry" },
    { id: 3, name: "Biology" },
    { id: 4, name: "Maths" },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Notes</h2>
        <a href="#" className="text-blue-500 hover:underline">
          view all
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="text-red-500 text-4xl">
              <i className="fas fa-file-pdf"></i>
            </div>
            <p className="text-center mt-2 font-medium">{note.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
