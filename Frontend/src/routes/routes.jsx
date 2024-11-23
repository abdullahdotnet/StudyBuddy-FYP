import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Main_Layout from "../layouts/MainLayout";
import DashboardNav from "../layouts/DashboardNavbar";
import Dashboard from "../pages/Dashboard/Dashboard";
import Chatbot from "../pages/Chatbot/Chatbot";
import NoNavbarLayout from "../layouts/NoNavbarLayout";
import Home from "../pages/Home/Home";
import Avatar from "../pages/Avatar/Avatar";
import Resources from "../pages/Resources/Resources";
import Extension from "../pages/Extension/Extension";
import Extras from "../pages/Extras/Extras";
import Extra2 from "../pages/Extras/Extras2";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ResetPasswordEmail from "../pages/ResetPassword/EmailPage";
import ResetPasswordNew from "../pages/ResetPassword/NewPassPage";
import PaperGen from "../pages/PaperGen/PaperGen";
import GeneratedPaper from "../pages/GeneratedPaper/GeneratedPaper";
import UserSpace from "../pages/UserSpace/UserSpace";
import ObjectivePaperGen from "../pages/PaperGen/ObjectivePaperGen";
import EntryTest from "../pages/EntryTest/EntryTest";
import MockTest from "../components/EntryTest/MockTest/MockTest";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Main_Layout />}>
        <Route path="" element={<Home />} />
      </Route>

      <Route path="/" element={<DashboardNav />}>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/avatar" element={<Avatar />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/extension" element={<Extension />} />
        <Route path="/extras" element={<Extras />} />
        <Route path="/extra2/:videoId" element={<Extra2 />} />
        <Route path="/board/:grade" element={<PaperGen />} />
        <Route path="/board/objective/:grade/:subject" element={<ObjectivePaperGen />} />
        <Route path="/generated-paper/:subjectName" element={<GeneratedPaper />} />
        <Route path="/user-space" element={<UserSpace />} />
        <Route path="/entry-test" element={<EntryTest />} />
        <Route path="/entry-test/test" element={<MockTest />} />
        <Route path="/entry-test/book-wise/" element={<h1>This feature will be available soon</h1>} />
        <Route path="*" element={<h1>Page Not found</h1>} />
      </Route>

      <Route path="/" element={<NoNavbarLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="reset-password" element={<ResetPasswordEmail />} />
        <Route path="reset-password/:uid/:token" element={<ResetPasswordNew />} />
      </Route>
    </>
  )
);

export default router;