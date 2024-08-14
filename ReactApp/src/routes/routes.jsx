import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Main_Layout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Chatbot from '../pages/Chatbot/Chatbot';
import NoNavbarLayout from '../layouts/NoNavbarLayout';
import Home from '../pages/Home/Home';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<Main_Layout />} >
            <Route path='' element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chatbot" element={<Chatbot />} />
        </Route>


        <Route path='/' element={<NoNavbarLayout />} >
            <Route path="*" element={<h1>Page Not found</h1>} />
        </Route> 
        </>
    )
)

export default router
