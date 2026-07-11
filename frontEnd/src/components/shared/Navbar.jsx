import React from 'react'
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext'
import { Link,useNavigate } from 'react-router-dom';

const Navbar = () => {
    const {user,logout} = useAuth();
    const navigate = useNavigate();

    const [showDropdown, setShowDropdown] = useState(false);
    const handleLogout = async()=>{
        await logout();
        navigate("/login");
    }

    return (
        <nav className='flex justify-between items-center px-6 py-4 bg-white shadow'>
            <Link to="/" className="text-2xl font-bold text-blue-600">JobPortal</Link>
            <div className='relative'>
                <button onClick={()=>setShowDropdown(!showDropdown)} className='font-medium'>
                    {user?.fullName} ▼
                </button>
                {showDropdown && (
                    <div className='absolute right-0 mt-2 w-40 bg-white shadow rounded'>
                        <Link to={
                            user?.role ==="candidate"?"/candidate/profile":"/recruiter/profile"
                        } className='block px-4 py-2 hover:bg-gray-100'>Profile</Link>

                        <button onClick={handleLogout}
                        className='block w-full text-left px-4 py-2 hover:bg-gray-100'>
                        Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
