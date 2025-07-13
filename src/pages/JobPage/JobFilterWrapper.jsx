import React from "react";
import JobFilterSidebar from "./JobFilterSidebar";

const JobFilterWrapper = ({ onClose, onFilterChange }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-sm bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent overlay close when clicking inside
      >
        <JobFilterSidebar  onFilterChange={onFilterChange} onClose={onClose} />
      </div>
    </div>
  );
};

export default JobFilterWrapper;
