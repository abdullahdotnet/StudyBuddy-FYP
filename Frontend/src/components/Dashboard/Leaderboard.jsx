import React from "react";
import GoldMedal from "../../assets/images/GoldMedal.svg";
import SilverMedal from "../../assets/images/SilverMedal.svg";
import BronzeMedal from "../../assets/images/BronzeMedal.svg";

const Leaderboard = ({ rankings }) => {
  return (
    <div className="h-[296px] w-[356px] bg-white shadow-md rounded-lg p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-3">Leaderboard</h2>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-1 text-sm flex items-center justify-center font-medium text-gray-600">
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
                style={index === rankings.length - 1 ? { border: '1.5px solid #4255FF' } : {}}
              >
                <td className="p-1 text-sm text-gray-700 flex items-center justify-center">
                  {entry.rank === 1 ? (
                    <img src={GoldMedal} alt="Gold Medal" />
                  ) : entry.rank === 2 ? (
                    <img src={SilverMedal} alt="Silver Medal" />
                  ) : entry.rank === 3 ? (
                    <img src={BronzeMedal} alt="Bronze Medal" />
                  ) : (
                    entry.rank
                  )}
                </td>


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
