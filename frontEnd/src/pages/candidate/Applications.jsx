import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAllApplications } from '../../api/applicationApi'

const Applications = () => {
  const { user, loading } = useAuth();
  const [myApplications, setMyApplications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //show according to status
  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-700";
      case "shortlisted": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  //fetch data at start
  useEffect(() => {
    if (loading || !user) return;
    const getMyApplications = async () => {
      try {
        setError("");
        const { applications } = await getAllApplications();
        setMyApplications(applications);
      } catch (err) {
        setError(err.message || "Unable to fetch your applications");
      }
    }
    getMyApplications();
  }, [user, loading])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/*Heading */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            My Applications
          </h1>
        </div>

        {/* error */}
        {error &&
          <p className='text-red-600 text-center mb-4'>{error}</p>
        }

        {/*Applications  */}
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
          <>
            {myApplications.map((application) => (
              <div key={application._id} className="bg-white border rounded-xl shadow-sm p-6 mb-6">
                {/* Profile */}
                <div className="flex items-center gap-5">

                  {/*Company Logo */}
                  {application.job.company.logo ? (
                    <img
                      src={application.job.company.logo}
                      alt={application.job.company.companyName}
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow">
                      {application.job.company.companyName[0].toUpperCase()}
                    </div>
                  )}
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
                        Salary:</span>{" "}₹{application.job.salary.toLocaleString("en-IN")}
                    </p>
                    {/*Job Employment Type */}
                    <p className="mt-2">
                      <span className="font-semibold">
                        Employment Type:</span>{" "}{application.job.employmentType.charAt(0).toUpperCase() + application.job.employmentType.slice(1)}
                    </p>
                    {/*Job Work Mode */}
                    <p className="mt-2">
                      <span className="font-semibold">
                        Work Mode:</span>{" "}{application.job.workMode.charAt(0).toUpperCase() + application.job.workMode.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="font-semibold mr-2">Resume:</span>

                  <a href={application.resume} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    View Resume</a>
                </div>
                {/*Status */}
                <div className='mt-6 border-t pt-5'>

                  <div className='flex items-center'>
                    <span className='font-semibold mr-2'>Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(application.status)}`}>{application.status}</span>
                  </div>

                  {/*Status message */}
                  {application.status === "accepted" && (
                    <p className="mt-3 text-green-600 font-medium">
                      🎉 Congratulations! Your application has been accepted.
                    </p>
                  )}

                  {application.status === "shortlisted" && (
                    <p className="mt-3 text-blue-600 font-medium">
                      🎯 Congratulations! You have been shortlisted.
                    </p>
                  )}

                  {application.status === "under review" && (
                    <p className="mt-3 text-yellow-600 font-medium">
                      Your application is currently under review.
                    </p>
                  )}

                  {application.status === "rejected" && (
                    <p className="mt-3 text-red-600 font-medium">
                      Don't lose hope! Keep applying. Your next opportunity could be the one.
                    </p>
                  )}
                </div>

              </div>

            ))}
          </>
        )
        }
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

export default Applications
