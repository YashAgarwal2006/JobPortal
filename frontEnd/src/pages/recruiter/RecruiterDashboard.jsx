import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyJobs } from '../../api/jobApi'
import { getRecentApplications } from '../../api/applicationApi'
import { useNavigate } from 'react-router-dom'

const RecruiterDashboard = () => {
  const { user, loading } = useAuth();
  const [myJobs, setMyJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }
  //fetch job details and recent applications on load of page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        const [jobsResponse, applicationsResponse] = await Promise.all([getMyJobs(), getRecentApplications()]);
        setMyJobs(jobsResponse.jobs);
        setRecentApplications(applicationsResponse.applications);
      } catch (err) {
        setError(err.message || "Unable to fetch details")
      }
    }
    fetchData();
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        < h1 className="text-3xl font-bold text-center text-gray-800 mb-8" >
          Welcome back, {user.fullName} 👋
        </h1 >
        <p className='text-center text-gray-500 mt-2 mb-8'>
          Here's an overview of your hiring activity.
        </p>
        {/* Error*/}
        {error &&
          <p className="text-red-600 mt-3 text-center">{error}</p>}
        {myJobs.length === 0 ? (
          <div className='text-center py-10'>
            <h2 className="text-2xl font-bold">
              No jobs posted yet
            </h2>

            <p className="text-gray-500 mt-2">
              Start by posting your first opening.
            </p>
            {/*Quick Actions */}
            <div className='bg-white rounded-xl shadow-md p-6 mt-8'>
              <div className='flex flex-wrap gap-4'>
                <button onClick={() => navigate("/recruiter/post-job")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
                  + Post New Job
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/*Statistics card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Total Jobs</p>
                <p className="text-3xl font-bold">{myJobs.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Open Jobs</p>
                <p className="text-3xl font-bold">{myJobs.filter(job => job.status === "open").length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Closed Jobs</p>
                <p className="text-3xl font-bold">{myJobs.filter(job => job.status === "closed").length}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <p className="text-gray-500">Applications Received</p>
                <p className="text-3xl font-bold">{myJobs.reduce((sum, job) => sum + job.applicationCount, 0)}</p>
              </div>
            </div>
            {/*Quick Actions */}
            <div className='bg-white rounded-xl shadow-md p-6 mt-8'>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className='flex flex-wrap gap-4'>
                <button onClick={() => navigate("/recruiter/post-job")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
                  + Post New Job
                </button>
                <button onClick={() => navigate("/recruiter/jobs")}
                  className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg transition">
                  View My Jobs
                </button>
              </div>
            </div>
          </div>
        )}
        {myJobs.length === 0 ? (
          <div>
            {/*Dont write anything as it has already been written
            while showing statistics card */}
          </div>
        ) : (
          <div className='space-y-6'>
            <h2 className="text-2xl font-bold mt-10 text-gray-800 mb-4">
              Recent Jobs
            </h2>
            {myJobs.slice(0, 5).map((job) => {
              return (
                <div key={job.id} className="border rounded-xl shadow-sm p-6 bg-white">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className='text-2xl font-semibold text-gray-800'>
                        {job.title}
                      </h2>
                      <p className='text-gray-500 mt-1 text-lg'>
                        <span className='font-semibold'>Posted On : </span>{" "}
                        {new Date(job.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      <p className='text-gray-500 mt-1 text-lg'>
                        {job.location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}>{job.status.toUpperCase()}
                    </span>

                  </div>
                  <p className='text-gray-700 mt-3 line-clamp-2'>{job.description}</p>
                  {/* Basic Details */}
                  <div className='grid grid-cols-2 gap-4 mt-4 text-gray-700'>
                    <p>
                      <span className='font-semibold'>Salary:</span>{" "}₹{job.salary}
                    </p>
                    <p>
                      <span className='font-semibold'>Experience:</span>{" "}{job.experienceLevel} years
                    </p>

                    <p>
                      <span className='font-semibold'>Employment:</span>{" "}{job.employmentType}
                    </p>

                    <p>
                      <span className='font-semibold'>Work Mode:</span>{" "}{job.workMode}
                    </p>
                  </div>

                  <div className="mt-5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold">
                        Applications:
                      </span>{" "}
                      {job.applicationCount}
                    </div>

                    <button
                      onClick={() => navigate("/recruiter/jobs")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      Manage Jobs
                    </button>
                  </div>
                </div>
              )
            }
            )
            }
            {/* Recent Applications */}

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Recent Applications
              </h2>
              {recentApplications.length === 0 ? (
                <div className="text-center py-10">
                  <h2 className="text-xl font-semibold text-gray-700">
                    No recent applications
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Applications from candidates will appear here.
                  </p>
                </div>
              ) : (
                <>

                  {recentApplications.map((application) => (
                    <div
                      key={application._id}
                      className="bg-white border rounded-xl shadow-sm p-6 mb-6"
                    >
                      {/* Profile */}
                      <div className="flex items-center gap-5">

                        <img
                          src={application.applicant.profilePhoto} alt="Profile"
                          className="w-20 h-20 rounded-full object-cover border"
                        />
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{application.fullName}</h2>

                          <p className="text-gray-500 text-sm">Applied on{" "}
                            {new Date(application.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </p>

                          <p className="mt-2">
                            <span className="font-semibold">
                              Applied For:</span>{" "}{application.job.title}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
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

                        <button onClick={() => navigate(`/recruiter/applicants/${application.job._id}`)}
                          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg">Review Application
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default RecruiterDashboard
