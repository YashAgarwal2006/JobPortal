import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
const PublicRoute = ({children}) => {
    const {user,loading} = useAuth();
    if(loading){
        return <h1>Loading...</h1>
    }
    if(user){
        if(user.role === "candidate"){
            return <Navigate to="/candidate/dashboard" replace />;
        }else{
            return <Navigate to="/recruiter/dashboard" replace />;
        }
    }
    return children;
}

export default PublicRoute;
