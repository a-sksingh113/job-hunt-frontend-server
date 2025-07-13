import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import Cards from "./Cards";
import toast from "react-hot-toast";

const AllPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true); // Start loading
        const res = await axios.get("/employer/jobs", {
          withCredentials: true,
        });
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Error fetching jobs")
        setJobs([]);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="px-4 md:px-24 py-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-50" />
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center para-font text-gray-500 text-base">
          No jobs posted yet.
        </p>
      ) : (
        <>
          <p className="text-2xl md:text-4xl text-red-700 font-extrabold mb-2 heading-font">
            Your Posted Jobs
          </p>

          <div className="h-[1px] mt-4 mb-4 bg-red-700" />

          <div className="flex overflow-x-auto space-x-4 pb-4">
            {jobs.map((job) => (
              <div key={job._id} className="min-w-[300px] flex-shrink-0">
                <Cards job={job} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AllPostedJobs;
