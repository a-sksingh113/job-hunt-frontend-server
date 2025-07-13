import React, { useEffect, useState, useCallback } from "react";
import Cards from "../JobPage/Cards";
import axios from "../../api/axios";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

const Hero1 = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch once -----------------------------------------------------------
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/general/jobs", {
          params: { page: 1, limit: 1000 },
          withCredentials: true,
        });
        const jobs = (res.data.jobs || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllJobs(jobs);                // filteredJobs handled by effect below
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast.error("Error fetching jobs")
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  // --- Keep the “latest 4” in sync with allJobs -----------------------------
  useEffect(() => {
    if (allJobs.length) {
      setFilteredJobs(allJobs.slice(0, 4));
    }
  }, [allJobs]);

  // --- Filtering helpers ----------------------------------------------------
  const filterJobs = useCallback(
    (keyword) => {
      const query = keyword.trim().toLowerCase();
      if (!query) {
        setFilteredJobs(allJobs.slice(0, 4));
        return;
      }
      const matches = allJobs.filter(({ title = "", domain = "" }) =>
        [title.toLowerCase(), domain.toLowerCase()].some((t) =>
          t.includes(query)
        )
      );
      setFilteredJobs(matches.slice(0, 4));
    },
    [allJobs]
  );

  const debouncedFilter = useCallback(debounce(filterJobs, 300), [filterJobs]);

  // --- Run filter when the user types ---------------------------------------
  useEffect(() => {
    if (!allJobs.length) return;         // wait until jobs are loaded
    debouncedFilter(searchTitle);
  }, [searchTitle, allJobs, debouncedFilter]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      debouncedFilter.cancel();
      filterJobs(searchTitle);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-black py-20 px-4 text-center">
        <p className="text-2xl md:text-4xl font-extrabold mb-4 heading-font">
          Find Your Next <span className="text-red-700">Opportunity</span>
        </p>
        <p className="text-lg md:text-l mb-6 font-bold heading-font">
          Explore thousands of job listings and land your dream role today.
        </p>

        {/* Search Bar */}
        <div className="flex justify-center max-w-xl mx-auto">
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-l-full px-4 py-2 para-font w-full border text-black focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Search by title or domain..."
          />
          <button
            onClick={() => filterJobs(searchTitle)}
            className="!rounded-r-full px-6 py-0.5 border-2 border-red-600 bg-red-700 text-white para-font font-semibold hover:bg-white hover:!text-red-700 hover:border-2 hover:border-red-600 duration-300"
          >
            Search
          </button>
        </div>
      </div>

      {/* Job Results */}
      <div className="py-12 px-4 max-w-6xl mx-auto">
        <p className="text-2xl md:text-4xl font-semibold mb-6 heading-font">
          {searchTitle ? "Search Results" : "Latest"}{" "}
          <span className="text-red-700">Job Openings</span>
        </p>

        {loading ? (
          /* spinner */
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-50" />
          </div>
        ) : filteredJobs.length ? (
          /* cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredJobs.map((job) => (
              <Cards key={job._id} job={job} />
            ))}
          </div>
        ) : (
          /* empty state */
          <div className="flex flex-col items-center mt-16 text-gray-600">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
              alt="No Jobs"
              className="w-32 h-32 mb-4 opacity-80"
            />
            <h2 className="text-xl font-semibold heading-font">
              No matching jobs found
            </h2>
            <p className="mt-1 text-gray-500 para-font">
              Try a different keyword related to your skills or domain.
            </p>
          </div>
        )}
      </div>
  
    </div>
  );
};

export default Hero1;
