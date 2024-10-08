import React from "react";
import { Link } from "react-router-dom";

const PaperGen = () => {
  const subjects = [
    { id: 1, name: "Computer Science" },
    // { id: 2, name: 'Mathematics' },
    // { id: 3, name: 'Chemistry' },
    // { id: 4, name: 'Physics' },
    // { id: 5, name: 'Biology' },
  ];

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Paper Generator
        </h1>
        <div className="flex flex-col">
          {subjects.map((subject) => (
            <div key={subject.id} className="flex justify-between mb-4 me-5">
              <span className="text-lg">{subject.name}</span>
              <Link
                to={`/generated-paper/${subject.name}`}
                className="bg-customDarkOrange text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightOrange hover:text-black"
              >
                Generate Paper
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PaperGen;
