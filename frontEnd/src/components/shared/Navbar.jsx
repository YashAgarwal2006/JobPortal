import React from 'react'
import { useState,useRef,useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'
import { Link,useNavigate } from 'react-router-dom';
import {FaUserCircle} from "react-icons/fa";
import {FiLogOut} from "react-icons/fi";

const Navbar = () => {
    const {user,logout} = useAuth();
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const handleLogout = async()=>{
        setShowDropdown(false);
        await logout();
        navigate("/login");
    }

    const dropdownRef = useRef(null);

    const handleClickOutside = (e)=>{
        if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
            setShowDropdown(false);
        }
    }

    const getInitials=(fullName)=>{
        if(!fullName)return "";
        fullName = fullName.trim();
        const words = fullName.split(/\s+/)
        if(words.length===1)return fullName[0].toUpperCase();
        const firstAlpha = words[0][0].toUpperCase();
        const lastAlpha = words[words.length-1][0].toUpperCase();
        return firstAlpha+lastAlpha;
    }

    useEffect(() => {
        if(!showDropdown)return;
        document.addEventListener("mousedown",handleClickOutside);
        return () => {
            document.removeEventListener("mousedown",handleClickOutside);
        }
    }, [showDropdown]);
    

    return (
        <nav className='flex justify-between items-center px-6 py-4 bg-white shadow'>
            <Link to="/" className="text-2xl font-bold text-blue-600">JobPortal</Link>
            <div className='relative' ref={dropdownRef}>
                <button onClick={()=>setShowDropdown(!showDropdown)} className='flex gap-2 px-2 py-2 rounded-lg items-center font-medium hover:bg-gray-100 transition-colors duration-200'>
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white
                                    flex items-center justify-center font-semibold mr-2">{getInitials(user?.fullName)}</div>
                    <span>{user?.fullName} ▼ </span>
                </button>
                {showDropdown && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">

                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                            {getInitials(user?.fullName)}
                            </div>

                            <div>
                            <p className="font-semibold text-gray-800">
                                {user?.fullName}
                            </p>

                            <p className="text-sm text-gray-500">
                                {user?.email}
                            </p>
                            </div>

                        </div>
                        </div>

                        {/* Profile */}
                        <Link
                        to={
                            user?.role === "candidate"
                            ? "/candidate/profile"
                            : "/recruiter/profile"
                        }
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                        >
                        <FaUserCircle className="text-gray-600 text-lg" />
                        <span>Profile</span>
                        </Link>

                        {/* Logout */}
                        <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 text-red-600 transition-colors"
                        >
                        <FiLogOut className="text-red-600 text-lg" />
                        <span>Logout</span>
                        </button>

                    </div>
                    )}
            </div>
        </nav>
    );
};

export default Navbar;
