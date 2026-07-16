import React from 'react'
import { useState, useEffect } from 'react'
import { getApplicationsByJobId, updateStatus } from '../../api/applicationApi'
import { Navigate, useParams } from 'react-router-dom'

const Applicants = () => {
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [error, setError] = useState("");
  const { jobId } = useParams();

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleStatusSelect = (applicationId, status) => {
    setSelectedStatuses((prev) => ({
      ...prev, [applicationId]: status,
    }));
  }
  //handle status change
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setError("");
      const { updatedApplication } = await updateStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(application =>
          application._id === applicationId ? updatedApplication : application
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update application status");
    }
  }
  //fecth job details and all applications on initial render
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setError("");
        const { job, applications } = await getApplicationsByJobId(jobId);
        setJob(job);
        setApplications(applications);
      } catch (err) {
        setError(err.message || "Unable to fetch applications");
      }
    }

    fetchApplications();
  }, [jobId])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {/*Heading */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            Applicants
          </h1>
        </div>

        {/*Job Summary Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-4">{job.title}</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Applications:</p>
              <p className='font-semibold text-lg'>{job.applicationCount}</p>
            </div>

            <div>
              <p className='text-sm text-gray-500'>Status:</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === "open"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >{job.status.toUpperCase()}</span>
            </div>

          </div>
        </div>

        {/* error */}
        {error &&
          <p className='text-red-600 text-center mb-4'>{error}</p>
        }
        {/*Applications  */}
        {applications.length === 0 ? (
          <div className='text-center py-16'>
            <h2 className='text-2xl font-semibold text-gray-700'>No Applications yet</h2>
            <p className='text-gray-500 mt-2'>Once candidates start applying, they'll appear here.</p>
          </div>
        ) : (
          <>
            {applications.map((application) => (
              <div key={application._id} className="bg-white border rounded-xl shadow-sm p-6 mb-6">

                {/*Profile Section */}
                <div className='flex item-center gap-5'>
                  <img src={application.applicant.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full object-cover border" />

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{application.applicant.fullName}</h2>
                    <p className="text-gray-500 text-sm">Applied on{" "}{new Date(application.createdAt).toLocaleDateString()}</p>
                    <p className='text-gray-600'>{application.applicant.email}</p>
                    <p className='text-gray-600'>{application.applicant.phoneNumber}</p>
                  </div>
                </div>
                {/* Bio */}
                <div className='mt-6'>
                  <h3 className='font-semibold text-lg mb-2'>Bio</h3>
                  <p className='text-gray-700'>{application.applicant.bio}</p>
                </div>

                {/*Skills */}
                <div className='mt-6'>
                  <h3 className='font-semibold text-lg mb-2'>Skills</h3>
                  <div className='flex flex-wrap gap-2'>
                    {application.applicant.skills.map((skill, index) => (
                      <span key={index} className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm'>{skill}</span>
                    ))}
                  </div>
                </div>

                {/*Resume */}
                {application.applicant.resume ? (
                  <a
                    href={application.applicant.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg transition"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-500">Resume not uploaded</span>
                )}

                {/*Status */}
                <div className='mt-6 border-t pt-5'>
                  <h3 className='font-semibold text-lg mb-3'>Application Status</h3>
                  <div className='flex items-center gap-4'>
                    <select value={selectedStatuses[application._id] ?? application.status} onChange={(e) => handleStatusSelect(application._id, e.target.value)}
                      className='border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'>
                      <option value="pending">Pending</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button onClick={() => handleStatusChange(application._id, selectedStatuses[application._id] ?? application.status)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition">Update Status</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )
        }
      </div>
    </div>
  )
}

export default Applicants
