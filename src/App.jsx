import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Error from "./pages/Error";
import Signup from "./pages/authPages/Signup";
import ForgetPassword from "./pages/authPages/ForgetPassword";
import PostJob from "./pages/Employer/PostJob";
import Dashboard from "./pages/Employer/Dashboard/Dashboard";
import ManageApplications from "./pages/Employer/ManageApplications/ManageApplications";
import Profile from "./pages/authPages/Profile";
import JobPage from "./pages/JobPage/JobPage";
import JobDetail from "./pages/JobPage/jobDetail";
import AppliedJobDetails from "./pages/seeker/AppliedJobDetails";
import DetailsOfApplication from "./pages/Employer/ManageApplications/DetailsOfApplication";
import PostedJobDetail from "./pages/Employer/Dashboard/PostedJobDetails";
import VerfiedMailSuccessRespose from "./pages/authPages/VerfiedMailSuccessRespose";
import AdminDashBoard from "./pages/adminPages/AdminDashBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* common routes */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
        <Route path="/signup" element={<Signup />} />
       <Route path="/verify-email/:token" element={<VerfiedMailSuccessRespose />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/profile" element={<Profile />} />
      

        {/* employer routes */}
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/employer-dashboard" element={<Dashboard />} />
        <Route path="/manage-applications" element={<ManageApplications />} />
        <Route path="/application-detail/:jobId" element={<DetailsOfApplication />}/>
        <Route path="/posted-job/:jobId" element={<PostedJobDetail />} />

        {/* job route */}
        <Route path="/job" element={<JobPage />} />
        <Route path="/job-details/:id" element={<JobDetail />} />

        {/* seeker routes */}
        <Route path="/applied-job-details/:jobId" element={<AppliedJobDetails />}/>

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashBoard />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
