import React, { useState } from 'react';
import HomeIcon from '../../assets/icons/Home.svg';
import BagIcon from '../../assets/icons/Bag.svg';
import CategoryIcon from '../../assets/icons/Category.svg';
import ChatIcon from '../../assets/icons/Chat.svg';
import DocIcon from '../../assets/icons/Document.svg';
import ConvIcon from '../../assets/icons/Conv.svg';
import openArrow from '../../assets/icons/rightarrow.svg';
import closeArrow from '../../assets/icons/leftarrow.png';
import Todo from '../../assets/icons/todo.svg';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-screen flex roboto-font">
      {/* Sidebar */}
      <div classNa  me={`bg-white text-586380 flex flex-col justify-between transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden relative`}>
        <div className="p-4 ">
          {/* Navigation Items */}
          <ul>
            <Link to="/dashboard">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={HomeIcon} alt="Dashboard" className="mr-4" />
                {isOpen && <span>Dashboard</span>}
              </li>
            </Link>
            <Link to="/chatbot">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={ConvIcon} alt="Chat" className="mr-4" />
                {isOpen && <span>Chat</span>}
              </li>
            </Link>
            <Link to='/entry-test'>
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={BagIcon} alt="Extras" className="mr-4" />
                {isOpen && <span>Entry Test</span>}
              </li>
            </Link>
            <Link to="/user-space">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={HomeIcon} alt="Dashboard" className="mr-4" />
                {isOpen && <span>Notes</span>}
              </li>
            </Link>
            {/* <Link to="/resources">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={DocIcon} alt="Resources" className="mr-4" />
                {isOpen && <span>Resources</span>}
              </li>
            </Link> */}
            <Link to="/todo">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={Todo} alt="To Do" className="mr-4" />
                {isOpen && <span>To Do</span>}
              </li>
            </Link>
            <Link to="/extension">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={CategoryIcon} alt="Extension" className="mr-4" />
                {isOpen && <span>Extension</span>}
              </li>
            </Link>
            <Link to="/books">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={BagIcon} alt="Books" className="mr-4" />
                {isOpen && <span>Books</span>}
              </li>
            </Link>

            {/* New Board Button */}
            <Link to="/board">
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={DocIcon} alt="Board" className="mr-4" />
                {isOpen && <span>Board</span>}
              </li>
            </Link>

            {/* <Link to='/extras'>
              <li className="mb-4 flex items-center text-586380 hover:bg-[#EDEFFF] p-2 rounded transition-colors cursor-pointer">
                <img src={BagIcon} alt="Extras" className="mr-4" />
                {isOpen && <span>Extras</span>}
              </li>
            </Link> */}
          </ul>
        </div>
      </div>

      {/* Toggle Sidebar Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 transform -translate-y-1/2 bg-[#EDEFFF] p-2 rounded-full focus:outline-none hover:bg-[#4255FF] cursor-pointer"
        style={{
          marginLeft: isOpen ? '-18px' : '0',
          right: isOpen ? '-12px' : '-40px',
          transition: 'right 0.3s ease'
        }}
      >
        <img
          src={isOpen ? closeArrow : openArrow}
          alt={isOpen ? "Close Sidebar" : "Open Sidebar"}
          className="w-6 h-6"
        />
      </button>
    </div>
  );
};

export default Sidebar;
