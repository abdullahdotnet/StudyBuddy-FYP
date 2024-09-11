import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-[#f0694a] text-black h-full flex-shrink-0">
      <nav className="mt-5">
        <ul>
          {/* Dashboard Link */}
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 m-2 rounded-lg font-bold hover:bg-red-300 hover:text-white transition duration-300"
            >
              <span className="mr-3">🏠</span>
              Dashboard
            </Link>
          </li>

          {/* Chat Link */}
          <li>
            <Link
              to="/chat"
              className="block px-4 py-2 m-2 rounded-lg font-bold hover:bg-red-300 hover:text-white transition duration-300"
            >
              <span className="mr-3">💬</span>
              Chat
            </Link>
          </li>

          {/* Resources Link */}
          <li>
            <Link
              to="/resources"
              className="block px-4 py-2 m-2 rounded-lg font-bold hover:bg-red-300 hover:text-white transition duration-300"
            >
              <span className="mr-3">📚</span>
              Resources
            </Link>
          </li>

          {/* ToDo Link */}
          <li>
            <Link
              to="/todo"
              className="block px-4 py-2 m-2 rounded-lg font-bold hover:bg-red-300 hover:text-white transition duration-300"
            >
              <span className="mr-3">✅</span>
              ToDo
            </Link>
          </li>

          {/* Extensions Link */}
          <li>
            <Link
              to="/extensions"
              className="block px-4 py-2 m-2 rounded-lg font-bold hover:bg-red-300 hover:text-white transition duration-300"
            >
              <span className="mr-3">🧩</span>
              Extensions
            </Link>
          </li>

          {/* Books Link */}
          <li>
            <Link
              to="/books"
              className="block px-4 py-2 m-2 rounded-lg font-bold hover:bg-red-300 hover:text-white transition duration-300"
            >
              <span className="mr-3">📖</span>
              Books
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
