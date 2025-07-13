import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import Layout from "../../../components/Layout/Layout";
import toast from "react-hot-toast";
import Loading from "../../../components/atoms/Loading";

const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
};

const PostedJobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/employer/jobs/${jobId}`);
      setJob(res.data.job);
      setFormData(res.data.job);
    } catch (err) {
      console.error("Failed to fetch job detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "skills" ? value.split(",").map((s) => s.trim()) : value,
    });
  };

  const handleJobUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(`/employer/jobs/${jobId}`, formData);
      toast.success("Job updated successfully!");
      setEditMode(false);
      fetchJobDetail();
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Job update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`/employer/jobs/${jobId}`);
      toast.success("Job deleted successfully!");
      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 2000);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete the job.");
    }
  };

  //   const handleSendOffers = async () => {
  //     setSending(true);
  //     try {
  //       const res = await axios.post(`/employer/send-jobOffer`, {
  //         jobId: Number(jobId),
  //       });
  //       toast.success(res.data.message || "Offers sent successfully!");
  //     } catch (err) {
  //       const message = err.response?.data?.message || "Unknown error";
  //       if (message === "Job openings already filled.") {
  //         toast.error("All openings are already filled.");
  //       } else {
  //         console.error("Send offer failed:", err);
  //         toast.error("Failed to send offers.");
  //       }
  //     } finally {
  //       setSending(false);
  //     }
  //   };

  if (loading) {
    return (
      <Layout>
        <div className="py-10 text-center text-lg font-semibold text-gray-700">
          Loading job details...
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="py-10 text-center text-red-600 font-semibold">
          Job not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-3xl font-bold text-red-700 heading-font">
            {job.title}
          </h2>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="red-button">
              Edit Job
            </button>
          )}
        </div>

        {!editMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 para-font text-gray-800">
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Job Type:</strong> {job.jobType}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>
              <p>
                <strong>Domain:</strong> {job.domain}
              </p>
              <p>
                <strong>Experience Required:</strong> {job.experienceRequired}
              </p>
              <p>
                <strong>Deadline:</strong> {formatDate(job.deadline)}
              </p>
              <p>
                <strong>Openings:</strong> {job.openings}
              </p>
              <p>
                <strong>Skills:</strong> {job.skills?.join(", ")}
              </p>
            </div>

            <div className="para-font text-gray-800">
              <p className="mt-0">
                <strong>Description:</strong> {job.description}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t">
              
                <button
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  ← Back
                </button>

                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteJob}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete Job
                  </button>
                </div>
            

              {/* {sending ? (
                <div className="w-full md:w-auto"><Loading /></div>
              ) : (
                <button
                  onClick={handleSendOffers}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Send Offer to Relevant Seekers
                </button>
              )} */}
            </div>
          </>
        ) : (
          <form onSubmit={handleJobUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "title", placeholder: "Job Title" },
                { name: "location", placeholder: "Location" },
                { name: "domain", placeholder: "Domain" },
                {
                  name: "experienceRequired",
                  placeholder: "Experience Required",
                },
                { name: "jobType", placeholder: "Job Type" },
                { name: "openings", type: "number", placeholder: "Openings" },
                { name: "salary", type: "number", placeholder: "Salary" },
                { name: "deadline", type: "date", placeholder: "Deadline" },
                { name: "skills", placeholder: "Skills (comma-separated)" },
              ].map(({ name, type = "text", placeholder }) => (
                <input
                  key={name}
                  type={type}
                  name={name}
                  value={
                    name === "skills"
                      ? formData.skills?.join(", ") || ""
                      : name === "deadline"
                      ? formatDate(formData.deadline)
                      : formData[name] || ""
                  }
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className="input"
                />
              ))}
            </div>

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Description"
              rows="5"
              className="input"
            />

            <div className="flex gap-4">
              {updating ? <Loading color="success"/> : <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Changes
              </button>}
              
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData(job);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default PostedJobDetail;
