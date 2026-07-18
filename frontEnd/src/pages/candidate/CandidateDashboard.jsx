import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getAllApplications } from '../../api/applicationApi'

const CandidateDashboard = () => {
  const { user, loading } = useAuth();
  const [myApplications, setMyApplications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //fetch applications at start
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setError("");
        const { applications } = await getAllApplications();
        setMyApplications(applications);
      } catch (err) {
        setError(err.message || "Unable to fetch applications");
      }
    }
    fetchApplications();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        < h1 className="text-3xl font-bold text-center text-gray-800 mb-8" >
          Welcome back, {user.fullName} 👋
        </h1 >
        <p className='text-center text-gray-500 mt-2 mb-8'>
          Here's an overview of your job applications.
        </p>
        {/* Error*/}
        {error &&
          <p className="text-red-600 mt-3 text-center">{error}</p>}
        {myApplications.length === 0 ? (
          <div className='text-center py-10'>
            <h2 className="text-2xl font-bold">
              No applications yet!
            </h2>

            <p className="text-gray-500 mt-2">
              Start by applying for your first opening.
            </p>

          </div>
        ) : (
          <div>
            {/*Statistics card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Total Applications</p>
                <p className="text-3xl font-bold">{myApplications.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Pending</p>
                <p className="text-3xl font-bold">{myApplications.filter(application => application.status === "pending").length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Shortlisted</p>
                <p className="text-3xl font-bold">{myApplications.filter(application => application.status === "shortlisted").length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Accepted</p>
                <p className="text-3xl font-bold">{myApplications.filter(application => application.status === "accepted").length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Rejected</p>
                <p className="text-3xl font-bold">{myApplications.filter(application => application.status === "rejected").length}</p>
              </div>
            </div>
          </div>
        )
        }

        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recent Applications
          </h2>
        </div>
        {myApplications.length === 0 ? (
          <div>
            {/*Dont write anything as already written above if no applications */}
          </div>
        ) : (
          <>
            {myApplications.slice(0, 5).map((application) => (
              <div key={application._id} className="bg-white border rounded-xl shadow-sm p-6 mb-6">
                {/* Profile */}
                <div className="flex items-center gap-5">

                  {/*Company Logo */}
                  <img
                    src={application.job.company.logo} alt="Logo"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  {/*Information */}
                  <div>
                    {/*Company Name */}
                    <h2 className="text-xl font-bold text-gray-800">{application.job.company.companyName}</h2>
                    {/*Job title */}
                    <p className="mt-2">
                      <span className="font-semibold">
                        </span>{" "}{application.job.title}
                    </p>
                    {/*Applied Data */}
                    <p className="text-gray-500 text-sm">Applied on{" "}
                      {new Date(application.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                    {/*Job Location */}
                    <p className="mt-2">
                      <span className="font-semibold">
                        Location:</span>{" "}{application.job.location}
                    </p>
                    {/*Job Salary */}
                    <p className="mt-2">
                      <span className="font-semibold">
                        Salary:</span>{" "}₹{application.job.salary}
                    </p>
                    {/*Job Employment Type */}
                    <p className="mt-2">
                      <span className="font-semibold">
                        Employment Type:</span>{" "}{application.job.employmentType}
                    </p>
                    {/*Job Work Mode */}
                    <p className="mt-2">
                      <span className="font-semibold">
                        Work Mode:</span>{" "}{application.job.workMode}
                    </p>
                  </div>
                </div>
                  {/*Status */}
                  <div className="mt-6 flex justify-between items-center border-t pt-5">
                    <div>
                      <span className="font-semibold">
                        Status:
                      </span>

                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${application.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : application.status === "shortlisted"
                            ? "bg-blue-100 text-blue-700"
                            : application.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {application.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                </div>
              
            ))}
          </>
        )}
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => navigate("/candidate/jobs")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Apply for More Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard
