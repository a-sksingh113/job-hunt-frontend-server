import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { format } from "date-fns";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/employer/applications", {
          withCredentials: true,
        });

        const apps = Array.isArray(res.data?.applications)
          ? res.data.applications
          : [];

        setApplications(apps);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="px-4 md:px-20 py-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-4 heading-font">
        All Job-Seekers Applications
      </h1>
      <div className="h-px bg-red-700 mb-6" />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-50" />
        </div>
      ) : applications.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-8">
          No Job-seekers applications found.
        </p>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-4">
          {applications.map((app, index) => {
            const job = app.jobId;
            const seeker = app.jobSeekerId;
            const user = seeker.userId;

            return (
              <div
                key={app._id || index}
                className="min-w-[300px] flex-shrink-0 bg-white shadow-md rounded-xl p-4 border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                    {user?.fullName?.charAt(0) || "?"}
                  </div>
                  <p className="text-gray-500 para-font">
                    {format(new Date(app.createdAt), "dd MMM yyyy")}
                  </p>
                </div>

                <h2 className="text-xl heading-font font-bold text-red-600 mt-4">
                  {job?.title || "No Title"}
                </h2>

                <p className="text-base para-font font-semibold mt-2">
                  {user?.fullName || "No Name"}
                </p>
               

                {typeof app?.aiInsightScore === "number" && (
                  <div className="flex flex-col items-start mt-4">
                    <p className="para-font px-3 py-1 w-fit rounded font-bold bg-gray-500 text-white mb-2">
                      AI Score
                    </p>
                    <div className="relative w-12 h-12">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="#e5e7eb"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke={
                            app.aiInsightScore > 7
                              ? "#22c55e"
                              : app.aiInsightScore >= 3
                              ? "#f97316"
                              : "#ef4444"
                          }
                          strokeWidth="10"
                          strokeDasharray="282.74"
                          strokeDashoffset={
                            282.74 - (app.aiInsightScore * 10 * 282.74) / 100
                          }
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                        {app.aiInsightScore}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 para-font mt-3">
                  {seeker?.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-sm text-gray-700 px-2 py-1 rounded-full border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() =>
                    navigate(`/application-detail/${app._id}`, {
                      state: app,
                    })
                  }
                  className="red-button w-full mt-4"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllApplications;
