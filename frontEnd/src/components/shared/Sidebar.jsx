import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { NavLink } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { FaUserCircle,FaBriefcase,FaBuilding,FaUsers,FaFileAlt,FaPlusCircle} from "react-icons/fa";
const Sidebar = () => {
    const {user} = useAuth();
    if(!user)return null;
    
    const candidateLinks = [
        {label:"Dashboard",path:"/candidate/dashboard",icon: MdDashboard},
        {label:"Profile",path:"/candidate/profile",icon: FaUserCircle},
        {label:"Jobs",path:"/candidate/jobs",icon: FaBriefcase},
        {label:"Applications",path:"/candidate/applications",icon: FaFileAlt},
    ]
    const recruiterLinks = [
        {label:"Dashboard",path:"/recruiter/dashboard",icon: MdDashboard},
        {label:"Profile",path:"/recruiter/profile",icon: FaUserCircle},
        {label:"Company",path:"/recruiter/company",icon: FaBuilding},
        {label:"My Jobs",path:"/recruiter/jobs",icon: FaBriefcase},
        {label:"Post Job",path:"/recruiter/post-job",icon: FaPlusCircle},
        {label:"Applicants",path:"/recruiter/applicants",icon: FaUsers},
    ]

    const links = user?.role==="candidate"?candidateLinks:recruiterLinks;
    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm p-4">
            <nav className="flex flex-col gap-2">
                {links.map((link)=>{
                    const Icon = link.icon;
                    return (
                        <NavLink key={link.path} to={link.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-blue-50"
                                }`
                            }
                        >
                            <Icon className="text-lg" />
                            <span>{link.label}</span>
                        </NavLink>
                             
                    )
                })}
            </nav>
        </aside>
    )
}

export default Sidebar
