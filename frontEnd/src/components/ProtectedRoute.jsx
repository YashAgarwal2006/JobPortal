import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children,roles=[]}) => {
    const {user,loading,isAuthenticated} = useAuth();
    if(loading){
        return <h2>Loading...</h2>;
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }
    const allowedRoles = Array.isArray(roles) ? roles : [];
    if(allowedRoles.length>0 && !allowedRoles.includes(user.role)){
        return <Navigate to="/login" replace />;
    }
    if(roles.length>0 && !roles.includes(user.role)){
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;
