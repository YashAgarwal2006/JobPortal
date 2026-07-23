import React from 'react'
import {Routes,Route} from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateProfile from "../pages/candidate/CandidateProfile";
import Jobs from "../pages/candidate/Jobs";
import Applications from "../pages/candidate/Applications";
import ApplyJob from '../pages/candidate/ApplyJob';

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import MyJobs from "../pages/recruiter/MyJobs";
import Applicants from "../pages/recruiter/Applicants";
import Company from "../pages/recruiter/Company";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";
import EditJob from '../pages/recruiter/EditJob';

import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

import Layout from '../layouts/Layout';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path='/signup' element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Candidate paths*/}
        <Route
            element={
                <ProtectedRoute roles={["candidate"]}>
                    <Layout />
                </ProtectedRoute>
            }
        >
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/profile" element={<CandidateProfile />} />
            <Route path="/candidate/jobs" element={<Jobs />} />
            <Route path="/candidate/applications" element={<Applications />} />
            <Route path="/candidate/apply/:jobId" element={<ApplyJob />} />
        </Route>

        {/* Recruiter paths */}
        <Route
            element={
                <ProtectedRoute roles={["recruiter"]}>
                    <Layout />
                </ProtectedRoute>
            }
        >
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/company" element={<Company />} />
            <Route path="/recruiter/jobs" element={<MyJobs />} />
            <Route path="/recruiter/post-job" element={<PostJob />} />
            <Route path="/recruiter/edit-job/:jobId" element={<EditJob />} />
            <Route path="/recruiter/applicants/:jobId" element={<Applicants />} />
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
        </Route>
    </Routes>
  )
}

export default AppRoutes
