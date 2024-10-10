import { Link } from "react-router-dom";

const PaperGen = () => {
  const subjects = [
    { id: 1, name: "Computer Science" },
    { id: 2, name: "Biology" },
    { id: 3, name: "Physics" },
    { id: 4, name: "Chemistry" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Paper Generator</h1>
      <div className="flex flex-col w-11/12 rounded-lg border-2 border-solid border-slate-300">
        {subjects.map((subject, index) => (
          <div
            key={subject.id}
            className={`flex justify-between mb-0 p-2 align-middle ${
              index < subjects.length - 1 ? 'border-b-2 border-solid border-slate-300' : ''
            }`}
          >
            <span className="text-lg font-medium mt-1 ml-1">{subject.name}</span>
            <Link
              to={`/generated-paper/${subject.name.replace(/\s+/g, '-')}`}
              className="bg-customDarkOrange text-white font-bold py-2 px-4 rounded transition-all hover:bg-customLightOrange hover:text-black"
            >
              Generate Paper
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaperGen;