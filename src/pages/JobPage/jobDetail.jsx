import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import Loading from "../../components/atoms/Loading";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/general/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.job);
        } else {
          toast.error("Failed to load job details");
          setJob(null);
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Something went wrong while fetching job");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      const res = await axios.post(`/jobseeker/jobs/apply`, {
        jobId: id,
        coverLetter:
          "I'm interested in this job and believe I can contribute effectively.",
      });

      toast.success(res.data.message || "Applied successfully");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong while applying";
      const code = err?.response?.data?.code;

      if (code === "ALREADY_APPLIED") {
        toast.error("You have already applied to this job.");
      } else {
        toast.error(message);
      }

      console.error("Apply job error:", err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading job details...</p>;
  }

  if (!job) {
    return <p className="p-6 text-red-600">Job not found.</p>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 heading-font">
              {job.title}
            </h1>
            <div className="flex flex-wrap space-x-4 para-font font-medium text-gray-600">
              <span className="text-red-600">{job.openings} openings</span>
              <span className="capitalize">{job.jobType}</span>
              <span className="text-green-600">
                ₹{job.salary?.toLocaleString() ?? "N/A"}
              </span>
            </div>
            <p className="para-font text-gray-500 mt-1">{job.location}</p>
          </div>

          {isLoggedIn && userRole === "job_seeker" && (
            applying ? (
              <Loading width="150px" />
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="red-button"
              >
                Apply Now
              </button>
            )
          )}
        </div>

        {/* Job Details */}
        <div className="space-y-6">
          <section>
            <h2 className="font-semibold text-gray-800 mb-1 heading-font">
              Job Description
            </h2>
            <hr className="mb-2" />
            <p className="para-font text-gray-700">{job.description}</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 heading-font mb-1">Domain</h2>
            <hr className="mb-2" />
            <p className="text-sm text-gray-700 para-font">{job.domain}</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-1 heading-font">
              Experience Required
            </h2>
            <hr className="mb-2" />
            <p className="text-sm text-gray-700 para-font">
              {job.experienceRequired}
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-1 heading-font">
              Skills Required
            </h2>
            <hr className="mb-2" />
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 para-font">
              {job.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-800 mb-1 heading-font">
              Application Deadline
            </h2>
            <hr className="mb-2" />
            <p className="text-sm text-gray-700 para-font">
              {formatDate(job.deadline)}
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
