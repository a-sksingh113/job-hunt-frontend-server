import React, { useState } from "react";
import { Link } from "react-router-dom";

const JobTabsSection = ({
  appliedJobs = [],
  jobOffers = [],
  appliedJobsLoading,
  jobOffersLoading,
  handleViewDetails,
}) => {
  const [activeTab, setActiveTab] = useState("applied");

  const jobsToDisplay = activeTab === "applied" ? appliedJobs : jobOffers;
  const isLoading =
    activeTab === "applied" ? appliedJobsLoading : jobOffersLoading;

  return (
    <section className="bg-white p-4 sm:p-6 rounded-xl shadow space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-gray-300 mb-4 sm:mb-6">
        <button
          onClick={() => setActiveTab("applied")}
          className={`pb-2 font-semibold text-sm heading-font sm:text-base ${
            activeTab === "applied"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-500"
          }`}
        >
          Applied Jobs
        </button>
        {/* <button
          onClick={() => setActiveTab("offers")}
          className={`pb-2 font-semibold heading-font text-sm sm:text-base ${
            activeTab === "offers"
              ? "border-b-2 border-red-700 text-red-700"
              : "text-gray-500"
          }`}
        >
          Job Offers
        </button> */}
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <p className="text-gray-500">Loading jobs...</p>
      ) : jobsToDisplay.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <ul className="space-y-4">
          {jobsToDisplay.map((job) => (
            <li
              key={job.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
                <div className="flex-1">
                  <h4 className="font-semibold heading-font text-base sm:text-lg text-gray-800">
                    {job.title}
                  </h4>
                  <p className="text-gray-600 para-font text-sm sm:text-base">{job.company}</p>
                </div>

                <Link
                  to={
                    activeTab === "applied"
                      ? `/applied-job-details/${job.id}`
                      : `/offered-job-details/${job.jobOfferId}`
                  }
                  className="red-button"
                >
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default JobTabsSection;
