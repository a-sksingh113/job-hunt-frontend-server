import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import Layout from "../../../components/Layout/Layout";
import toast from "react-hot-toast";
import Loading from "../../../components/atoms/Loading";

const DetailsOfApplication = () => {
  const { state: application } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState(application?.status || "");
  const [loading, setLoading] = useState(false);

  if (!application) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <p>No application data found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-700 text-white rounded"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const { _id: applicationId, jobSeekerId: jobSeeker, createdAt } = application;

  const {
    userId: user,
    domain,
    location,
    phone,
    skills,
    resumeUrl,
  } = jobSeeker || {};

  const handleStatusSelectChange = (e) => setStatus(e.target.value);

  const saveStatusChange = async () => {
    try {
      setLoading(true);
      await axios.patch(`/employer/applications/${applicationId}`, {
        status,
      });
      toast.success(`Status updated to "${status}"`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Status update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Applicant Info */}
        <section className="relative">
          <h2 className="text-2xl heading-font font-bold text-red-700 mb-4  pb-2">
            Applicant Information
          </h2>

          {/* ✅ AI Score Positioned at Top Right */}
          {typeof application?.aiInsightScore === "number" && (
            <div className="absolute top-0 right-0 flex flex-col items-end">
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
                      application.aiInsightScore > 7
                        ? "#22c55e"
                        : application.aiInsightScore >= 3
                        ? "#f97316"
                        : "#ef4444"
                    }
                    strokeWidth="10"
                    strokeDasharray="282.74"
                    strokeDashoffset={
                      282.74 - (application.aiInsightScore * 10 * 282.74) / 100
                    }
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                  {application.aiInsightScore}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 para-font text-gray-800 mt-6">
            <p>
              <strong>Name:</strong> {user?.fullName || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {phone || "N/A"}
            </p>
            <p>
              <strong>Domain:</strong> {domain || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {location || "N/A"}
            </p>
            <p>
              <strong>Skills:</strong> {skills?.join(", ") || "N/A"}
            </p>
          </div>
        </section>

        {/* Application Info */}
        <section className="border-t pt-6">
          <h2 className="text-2xl font-bold heading-font text-red-700 mb-4">
            Application Details
          </h2>
          <div className=" text-gray-800 para-font space-y-2">
            <p>
              <strong>Applied On:</strong>{" "}
              {new Date(createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Resume:</strong>{" "}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                View Resume
              </a>
            </p>
          </div>
        </section>

        {/* Manage Status */}
        <section className="border-t border-b py-6">
          <h2 className="text-2xl heading-font font-bold text-red-700 mb-4">
            Manage Status
          </h2>
          <div className="flex flex-col sm:flex-row para-font sm:items-center gap-4">
            <label htmlFor="status" className="font-medium">
              Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={handleStatusSelectChange}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="applied">Applied</option>
              <option value="reviewed">Reviewed</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-4">
            {loading ? (
              <Loading color="success" width="150px" />
            ) : (
              <button
                onClick={saveStatusChange}
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full sm:w-auto"
              >
                Save Status
              </button>
            )}
          </div>
        </section>

        {/* Back Button */}
        <div className="pt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded w-full sm:w-auto"
          >
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default DetailsOfApplication;
