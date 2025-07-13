import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Layout from "../../components/Layout/Layout";
import Cards from "./Cards";
import JobFilterWrapper from "./JobFilterWrapper";

const NAVBAR_HEIGHT = 64;

const JobPage = () => {
  const [filters, setFilters] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/general/jobs`, {
        params: {
          ...filters,
          page,
          limit,
          minSalary: filters.salaryRange?.[0],
          maxSalary: filters.salaryRange?.[1],
        },
      });

      if (response.data.success) {
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      setError("Error fetching jobs from server");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const handleFilterChange = (updatedFilters, close = false) => {
  setFilters(updatedFilters);
  setPage(1);
  if (close) setShowSidebar(false);   // close only when we’re told to
};


  return (
    <Layout>
      <div className="relative min-h-screen flex">
        {/* Toggle Sidebar Button */}
        {!showSidebar && (
          <button
            onClick={() => setShowSidebar(true)}
            className="fixed top-16 left-4 z-50 bg-white shadow border border-gray-300 w-12 h-12 rounded-md flex items-center justify-center"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-16 left-0 w-72 h-[calc(100vh-64px)] bg-white shadow-md z-40 transform transition-transform duration-300 overflow-y-auto ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <JobFilterWrapper
              onClose={() => setShowSidebar(false)}
              onFilterChange={handleFilterChange}
            />
          </LocalizationProvider>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 w-full pt-16 ${
            showSidebar ? "pl-72" : ""
          }`}
        >
          <p className="text-4xl font-bold mb-6 text-center heading-font">
            Jobs List
          </p>

          {/* Loading, Error, or Jobs */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-50 mb-4"></div>
              <p className="text-gray-600 font-medium">
                Fetching filtered jobs...
              </p>
            </div>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-16 animate-fadeIn text-center text-gray-600">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                alt="No Jobs"
                className="w-32 h-32 mb-4 opacity-80"
              />
              <h2 className="text-xl font-semibold">No jobs found</h2>
              <p className="text-sm mt-1 text-gray-500">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 px-4 pb-10 ${
                showSidebar
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              }`}
            >
              {jobs.map((job) => (
                <Cards key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 border rounded text-sm bg-gray-100 hover:bg-gray-200"
                disabled={page === 1}
              >
                Prev
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 border rounded text-sm bg-gray-100 hover:bg-gray-200"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JobPage;
