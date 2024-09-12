import { Outlet } from 'react-router-dom'
import DashboardNavbar from '../components/Navbar/DashboardNavbar'
import Sidebar from '../components/Sidebar/Sidebar'

function DashboardNav() {
  return (
    <div className="flex flex-col h-screen">
      <DashboardNavbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;