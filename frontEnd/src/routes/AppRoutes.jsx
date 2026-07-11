import React from 'react'
import {Routes,Route} from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import CandidateDashboard from "../pages/candidate/CandidateDashboard";
import CandidateProfile from "../pages/candidate/CandidateProfile";
import Jobs from "../pages/candidate/Jobs";
import Applications from "../pages/candidate/Applications";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import MyJobs from "../pages/recruiter/MyJobs";
import Applicants from "../pages/recruiter/Applicants";
import Company from "../pages/recruiter/Company";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";

import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

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
        <Route path='/candidate/dashboard' element={
          <ProtectedRoute roles={["candidate"]}>
            <CandidateDashboard/>
          </ProtectedRoute>
        } />
        <Route path='/candidate/profile' element={
          <ProtectedRoute roles={["candidate"]}>
            <CandidateProfile/>
          </ProtectedRoute>
        } />
        <Route path='/candidate/jobs' element={
          <ProtectedRoute roles={["candidate"]}>
            <Jobs/>
          </ProtectedRoute>
        } />
        <Route path='/candidate/applications' element={
          <ProtectedRoute roles={["candidate"]}>
            <Applications/>
          </ProtectedRoute>
        } />

        {/* Recruiter paths */}
        <Route path='/recruiter/dashboard' element={
          <ProtectedRoute roles={["recruiter"]}>
            <RecruiterDashboard/>
          </ProtectedRoute>
        } />
        <Route path='/recruiter/company' element={
          <ProtectedRoute roles={["recruiter"]}>
            <Company/>
          </ProtectedRoute>
        } />
        <Route path='/recruiter/jobs' element={
          <ProtectedRoute roles={["recruiter"]}>
            <MyJobs/>
          </ProtectedRoute>
        } />
        <Route path='/recruiter/post-job' element={
          <ProtectedRoute roles={["recruiter"]}>
            <PostJob/>
          </ProtectedRoute>
        } />
        <Route path='/recruiter/applicants' element={
          <ProtectedRoute roles={["recruiter"]}>
            <Applicants/>
          </ProtectedRoute>
        } />
        <Route path='/recruiter/profile' element={
          <ProtectedRoute roles={["recruiter"]}>
            <Applicants/>
          </ProtectedRoute>
        } />
    </Routes>
  )
}

export default AppRoutes
