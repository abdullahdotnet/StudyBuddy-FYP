import { Link } from "react-router-dom";

const PaperGen = () => {
  const subjects = [{ id: 1, name: "Computer Science" }];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Paper Generator</h1>
      <div className="flex flex-col w-11/12">
        {subjects.map((subject) => (
          <div key={subject.id} className="flex justify-between mb-4">
            <span className="text-lg">{subject.name}</span>
            <Link
              to = "/generated-paper/Computer Science"
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