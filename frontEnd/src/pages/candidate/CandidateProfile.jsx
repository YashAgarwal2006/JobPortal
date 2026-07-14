import React from 'react'
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfilePhoto } from '../../api/userApi';


const CandidateProfile = () => {
  const { user, loading, updateProfile, updateResume,updateProfilePhoto } = useAuth();
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null);

  if (loading) return null;
  //to handle changes in input
  const handleChange = (e) => {
    const newProfileData = { ...profileData };
    newProfileData[e.target.name] = e.target.value;
    setProfileData(newProfileData);
  }

  //to save changes after editing
  const handleSave = async () => {
    try {
      setError("");
      const updatedData = {
        ...profileData,
        skills:
          typeof profileData.skills === "string" ?
            profileData.skills.split(",").map(skill => skill.trim())
              .filter(skill => skill !== "")
            : profileData.skills
      };
      await updateProfile(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  }

  //to handle resume change
  const handleResumeChange = (e) => {
    setSelectedResume(e.target.files[0]);
  }
  //to upload resume
  const handleResumeUpload = async () => {
    if (!selectedResume) {
      setError("Please select a pdf first");
      return null;
    }
    const formData = new FormData();
    formData.append("resume", selectedResume);
    try {
      await updateResume(formData);
      setSelectedResume(null);
    } catch (err) {
      setError(err.message || "Unable to upload resume")
    }
  }

  //handle profile Photo change
  const handleProfilePhotoChange = (e) => {
    setSelectedProfilePhoto(e.target.files[0]);
  }
  //upload profile photo
  const handleProfilePhotoUpload = async () => {
    if (!selectedProfilePhoto) {
      setError("Please select a profile photo first");
      return null;
    }
    setError("");
    const formData = new FormData();
    formData.append("profilePhoto", selectedProfilePhoto);
    try {
      await updateProfilePhoto(formData);
      setSelectedProfilePhoto(null);
    } catch (err) {
      setError(err.message || "Unable to upload profilePhoto")
    }
  }

  useEffect(() => {
    setProfileData(user);
  }, [user])

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Candidate Profile
        </h1>

        {/* Profile Photo */}
        <div className="border-b py-6">
          <p className="font-semibold text-gray-600 mb-4">
            Profile Photo
          </p>

          <div className="flex flex-col items-center gap-4">

            {/* Current Profile Photo */}
            {profileData.profilePhoto ? (
              <img
                src={profileData.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold shadow">
                {profileData.fullName
                  ? profileData.fullName
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                  : "U"}
              </div>
            )}

            {/* File Input + Upload Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
                className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:bg-blue-50 file:text-blue-700
                   file:font-semibold
                   hover:file:bg-blue-100"
              />

              <button
                onClick={handleProfilePhotoUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Upload Photo
              </button>
            </div>

            {/* Selected file name */}
            {selectedProfilePhoto && (
              <p className="text-sm text-gray-500">
                Selected: {selectedProfilePhoto.name}
              </p>
            )}
          </div>
        </div>

        {/* Full Name */}
        {isEditing ? (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={profileData.fullName || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 border-b py-4">
            <span className="font-semibold text-gray-600">Full Name</span>
            <span className="col-span-2 text-gray-800">{profileData.fullName || ""}</span>
          </div>
        )}

        {/* Email */}
        <div className="grid grid-cols-3 border-b py-4">
          <span className="font-semibold text-gray-600">Email</span>
          <span className="col-span-2 text-gray-800">{profileData.email || ""}</span>
        </div>

        {/* Phone */}
        {isEditing ? (
          <div className="my-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>

            <input
              type="tel"
              name="phoneNumber"
              value={profileData.phoneNumber || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 border-b py-4">
            <span className="font-semibold text-gray-600">Phone Number</span>
            <span className="col-span-2 text-gray-800">{profileData.phoneNumber || ""}</span>
          </div>
        )}

        {/* Role */}
        <div className="grid grid-cols-3 border-b py-4">
          <span className="font-semibold text-gray-600">Role</span>
          <span className="col-span-2 text-gray-800">{profileData.role || ""}</span>
        </div>

        {/* Bio */}
        {isEditing ? (
          <div className="my-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>

            <textarea
              rows={4}
              name="bio"
              value={profileData.bio || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        ) : (
          <div className="border-b py-4">
            <p className="font-semibold text-gray-600 mb-2">Bio</p>
            <p>{profileData.bio || "No bio added yet."}</p>
          </div>
        )}

        {/* Skills */}
        {isEditing ? (
          <div className="my-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={
                Array.isArray(profileData.skills)
                  ? profileData.skills.join(", ")
                  : profileData.skills || ""
              }
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        ) : (
          <div className="border-b py-4">
            <p className="font-semibold text-gray-600 mb-3">Skills</p>

            <div className="flex flex-wrap gap-2">
              {Array.isArray(profileData.skills) &&
                profileData.skills.length > 0 ? (
                profileData.skills.map(skill => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No skills added yet.</span>
              )}
            </div>
          </div>
        )}

        {/* Resume */}
        <div className="border-b py-4">
          <p className="font-semibold text-gray-600 mb-3">
            Resume
          </p>

          {profileData.resume ? (
            <div className="mb-4">
              <a
                href={profileData.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                📄 View Current Resume
              </a>
            </div>
          ) : (
            <p className="text-gray-500 mb-4">
              No resume uploaded
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="block w-full text-sm text-gray-600
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:bg-blue-50 file:text-blue-700
                 file:font-semibold
                 hover:file:bg-blue-100"
            />

            <button
              onClick={handleResumeUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Upload Resume
            </button>
          </div>

          {selectedResume && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {selectedResume.name}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 mt-5 text-center font-medium">
            {error}
          </p>
        )}

        {/* Button */}
        {isEditing ? (
          <button
            type="submit"
            onClick={handleSave}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  )
}

export default CandidateProfile
