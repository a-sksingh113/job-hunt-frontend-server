import React from "react";

const UserDetailModal = ({ user, type, onClose }) => {
  const details = type === "employer" ? user.employerDetails : user.jobSeekerDetails;

  return (
   <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 heading-font">{user.fullName}</h2>
        <p className="text-gray-700 mb-2 para-font">
          <strong>Email:</strong> {user.email}
        </p>
        {type === "employer" ? (
          <div className="para-font">
            <p><strong>Company:</strong> {details.companyName}</p>
            <p><strong>Industry:</strong> {details.industry}</p>
            <p><strong>Location:</strong> {details.location}</p>
            <p><strong>Description:</strong> {details.description}</p>
            <p><strong>Phone:</strong> {details.phone}</p>
            <p><strong>Company Size:</strong> {details.companySize}</p>
          </div>
        ) : (
          <>
            <p><strong>Domain:</strong> {details.domain}</p>
            <p><strong>Location:</strong> {details.location}</p>
            <p><strong>Experience:</strong> {details.experienceYears} years</p>
            <p><strong>Phone:</strong> {details.phone}</p>
            <p><strong>Skills:</strong> {details.skills.join(", ")}</p>
            <p><strong>Status:</strong> {details.availabilityStatus}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailModal;
