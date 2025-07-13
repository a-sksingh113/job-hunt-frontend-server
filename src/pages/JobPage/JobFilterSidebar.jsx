import React, { useState, useEffect } from "react";

const JobFilterSidebar = ({ onFilterChange, onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [domain, setDomain] = useState("");
  const [jobType, setJobType] = useState("");

  // Trigger filters when keyword or domain change
  useEffect(() => {
    if (keyword.trim() === "" && domain.trim() === "") {
      onFilterChange({ keyword: "", location: "", domain: "", jobType: "" });
    } else {
      onFilterChange({ keyword, location, domain, jobType });
    }
  }, [keyword, domain]);

  // Trigger filter on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onFilterChange({ keyword, location, domain, jobType });
    }
  };

  const applyFilters = () => {
    onFilterChange({ keyword, location, domain, jobType });
  };

  return (
    <div className="p-4 h-full flex flex-col bg-white w-full max-w-sm shadow-md">
      {/* Close Button */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 heading-font text-red-600">
        Filter Jobs
      </h2>

      {/* Keyword */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1 para-font">
          Keyword
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search title or description"
          className="input"
        />
      </div>

      {/* Domain */}
      <div className="mb-4">
        <label className="block para-font font-medium text-gray-700 mb-1">
          Domain
        </label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Software, Marketing"
          className="input"
        />
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={() => {
          applyFilters();
          onClose();
        }}
        className="w-full red-button"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default JobFilterSidebar;
