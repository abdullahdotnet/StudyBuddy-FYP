import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Main_Layout from '../layouts/MainLayout';
import DashboardNav from '../layouts/DashboardNavbar';
import Dashboard from '../pages/Dashboard/Dashboard';
import Chatbot from '../pages/Chatbot/Chatbot';
import NoNavbarLayout from '../layouts/NoNavbarLayout';
import Home from '../pages/Home/Home';
import Avatar from '../pages/Avatar/Avatar';
import Resources from '../pages/Resources/Resources';
import Extension from '../pages/Extension/Extension';
import Extras from '../pages/Extras/Extras';
import Extra2 from '../pages/Extras/Extras2';


const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<Main_Layout />} >
            <Route path='' element={<Home />} />
        </Route>

        <Route path="/" element={<DashboardNav />} >
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="/avatar" element={<Avatar />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/extension' element={<Extension />} />
            <Route path='/extras' element={<Extras />} />
            <Route path="/extra2/:videoId" element={<Extra2 />} />
            <Route path="*" element={<h1>Page Not found</h1>} />
        </Route>

        <Route path='/' element={<NoNavbarLayout />} >
        </Route>
        </>
    )
)

export default router
