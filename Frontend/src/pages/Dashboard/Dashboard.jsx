import React from "react";
import WelcomeQoute from "../../components/Dashboard/WelcomeQoute";
import Tasks from "../../components/Dashboard/Tasks";
import Notes from "../../components/Dashboard/Notes";
import Activity from "../../components/Dashboard/Activity";
import TaskTable from "../../components/Dashboard/TaskTable";
import Greeting from "../../components/Dashboard/Greeting";
import Leaderboard from "../../components/Dashboard/Leaderboard";
import Chats from "../../components/Dashboard/Chatbot";
const username = sessionStorage.getItem("username");

const user = {
  name: username,
  quote:
    "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma",
  streak: 3,
};

const leaderboardData = [
  { rank: 1, name: "Muhammad Zubair", score: 123 },
  { rank: 2, name: "Anas Tahir", score: 100 },
  { rank: 3, name: "Abdullah Ghazi", score: 94 },
  { rank: 4, name: "Abdullah Ashfaq", score: 83 },
  { rank: 5, name: "Etisam ul Haq", score: 80 },
  { rank: 1543, name: username, score: 35 },
];

function dashboard() {
  return (
    <div>
       <div className="h-[300px] bg-white p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      <Greeting name={username} quote={user.quote} streak={user.streak} />
      <Leaderboard rankings={leaderboardData} />
    </div>
      {/* <WelcomeQoute name={username} /> */}
      {/* <Tasks />
      <Activity />
       */}
      <TaskTable/>
      <Chats/>
      <Notes />
      
    </div>
  );
}

export default dashboard;
