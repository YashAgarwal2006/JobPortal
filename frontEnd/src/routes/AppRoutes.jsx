import React from 'react'
import {Routes,Route} from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import Profile from "../pages/candidate/Profile";
import Jobs from "../pages/candidate/Jobs";
import Applications from "../pages/candidate/Applications";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import MyJobs from "../pages/recruiter/MyJobs";
import Applicants from "../pages/recruiter/Applicants";
import Company from "../pages/recruiter/Company";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='/candidate/dashboard' element={<CandidateDashboard />} />
        <Route path='/candidate/profile' element={<Profile />} />
        <Route path='/candidate/jobs' element={<Jobs />} />
        <Route path='/candidate/applications' element={<Applications />} />

        <Route path='/recruiter/dashboard' element={<RecruiterDashboard />} />
        <Route path='/recruiter/company' element={<Company />} />
        <Route path='/recruiter/jobs' element={<MyJobs />} />
        <Route path='/recruiter/post-job' element={<PostJob />} />
        <Route path='/recruiter/applicants' element={<Applicants />} />
    </Routes>
  )
}

export default AppRoutes
