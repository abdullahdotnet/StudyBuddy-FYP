import React from "react";

const Leaderboard = ({ rankings }) => {
  return (
    <div className="h-[290px] w-[356px] bg-white shadow-md rounded-lg p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-3">Leaderboard</h2>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-1 text-sm font-medium text-gray-600">
                Rank
              </th>
              <th className="border-b p-1 text-sm font-medium text-gray-600">
                Name
              </th>
              <th className="border-b p-1 text-sm font-medium text-gray-600">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((entry, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-1 text-sm text-gray-700">{entry.rank}</td>
                <td className="p-1 text-sm text-gray-700 truncate">
                  {entry.name}
                </td>
                <td className="p-1 text-sm text-gray-700">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
