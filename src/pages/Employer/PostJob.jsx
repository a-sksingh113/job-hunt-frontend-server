import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from '../../api/axios'
import Layout from "../../components/Layout/Layout";
import Loading from "../../components/atoms/Loading";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    openings: "",
    location: "",
    salary: "",
    domain: "",
    experienceRequired: "",
    jobType: "full-time",
    deadline: "",
    skills: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      openings: Number(formData.openings),
      salary: Number(formData.salary),
      deadline: undefined, 
      expireInDays: Number(formData.deadline),
      skills: formData.skills.split(",").map((skill) => skill.trim()),
    };

    try {
      const res = await axios.post(
        "/employer/jobs/jobs-create",
        payload,
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // }
      );

      if (res.data.success) {
        toast.success("Job posted successfully!");
        setSubmitted(true);
        setFormData({
          title: "",
          description: "",
          openings: "",
          location: "",
          salary: "",
          domain: "",
          experienceRequired: "",
          jobType: "full-time",
          deadline: "",
          skills: "",
        });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Job post error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to post job. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
        <div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 heading-font">
            Post a New Job
          </h2>

          <form onSubmit={handleSubmit}>
            {[
              { name: "title", label: "Job Title" },
              {
                name: "description",
                label: "Job Description",
                type: "textarea",
              },
              { name: "openings", label: "Openings", type: "number" },
              { name: "location", label: "Location" },
              { name: "salary", label: "Salary (e.g. 100)" },
              { name: "domain", label: "Domain (e.g. Web Dev)" },
              { name: "experienceRequired", label: "Experience Required" },
              { name: "deadline", label: "Deadline (in days)", type: "number" },
              {
                name: "skills",
                label: "Required Skills (comma separated)",
              },
            ].map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block para-font font-semibold text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    rows={3}
                    required
                    className="input"
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                )}
              </div>
            ))}

            <div>
              <label
                htmlFor="jobType"
                className="block para-font font-semibold text-gray-700 mb-1"
              >
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="input"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className=" text-center">
              {isSubmitting ? (
                <Loading width="100%" />
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="red-button w-full"
                >
                  Post Job
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
