import React, { useState, useEffect } from "react";
import JobTabsSection from "./JobTabsSection";
import FileUpload from "../../components/atoms/FileUpload";
import Loading from "../../components/atoms/Loading";
import axios from "../../api/axios";
import toast from "react-hot-toast";

const SeekerProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: "https://randomuser.me/api/portraits/lego/2.jpg",
  });

  const [jobSeeker, setJobSeeker] = useState({
    domain: "",
    location: "",
    experienceYears: "",
    phone: "",
    skills: [],
    resumeUrl: "",
    availabilityStatus: "",
  });

  const [jobOffers] = useState([
    { jobId: 101, jobOfferId: 202, title: "React Engineer", company: "DevHub" },
  ]);

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isProfessionalEditOpen, setIsProfessionalEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedJobsLoading, setAppliedJobsLoading] = useState(true);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setJobSeeker((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (file) => setResumeFile(file);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/jobseeker/profile");
        if (response.data.success) {
          const { jobSeeker } = response.data;

          setUser({
            name: jobSeeker.userId.fullName,
            email: jobSeeker.userId.email,
            profilePic:
              jobSeeker.profilePicUrl ||
              "https://randomuser.me/api/portraits/lego/2.jpg",
          });

          setJobSeeker({
            domain: jobSeeker.domain || "",
            location: jobSeeker.location || "",
            experienceYears: jobSeeker.experienceYears?.toString() || "",
            phone: jobSeeker.phone || "",
            skills: jobSeeker.skills || [],
            resumeUrl: jobSeeker.resumeUrl || "",
            availabilityStatus: jobSeeker.availabilityStatus || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfileUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("name", user.name);
    formData.append("domain", jobSeeker.domain);
    formData.append("location", jobSeeker.location);
    formData.append("experienceYears", jobSeeker.experienceYears);
    formData.append("phone", jobSeeker.phone);
    formData.append("availabilityStatus", jobSeeker.availabilityStatus);
    formData.append("skills", JSON.stringify(jobSeeker.skills)); // stringify array

    if (resumeFile) {
      formData.append("resumeUrl", resumeFile); // matches multer field name
    }

    const response = await axios.put("/jobseeker/profile/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data.success) {
      toast.success("Profile updated successfully!");

      const updated = response.data.updated;

      setJobSeeker({
        domain: updated.domain || "",
        location: updated.location || "",
        experienceYears: updated.experienceYears?.toString() || "",
        phone: updated.phone || "",
        skills: updated.skills || [],
        resumeUrl: updated.resumeUrl || "",
        availabilityStatus: updated.availabilityStatus || "",
      });

      setIsProfileEditOpen(false);
      setIsProfessionalEditOpen(false);
      setResumeFile(null);
    } else {
      toast.error("Failed to update profile");
    }
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get("/jobseeker/jobs/applied");
        if (res.data.success) {
          const formattedJobs = res.data.applications.map((app) => ({
            id: app.jobId._id,
            title: app.jobId.title,
            company: app.jobId.domain || "Unknown Company",
            location: app.jobId.location,
            status: app.status,
            salary: app.jobId.salary,
            jobType: app.jobId.jobType,
          }));
          setAppliedJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setAppliedJobsLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto space-y-10">
      {/* Profile Section */}
      <section className="relative bg-white p-6 rounded-xl border shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <p className="text-xl sm:!text-4xl font-bold heading-font">Profile</p>
          <button
            className="red-button !w-20 mt-2 sm:mt-0"
            onClick={() => setIsProfileEditOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-y-4 sm:gap-x-10 px-2">
          <img
            src={user.profilePic}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-red-700"
          />
          <div className="text-center sm:!text-left">
            <h2 className="text-xl font-extrabold heading-font">{user.name}</h2>
            <p className="text-gray-600 para-font">{user.email}</p>
            <p className="text-gray-600 para-font">{jobSeeker.location}</p>
          </div>
        </div>
      </section>

      {/* Professional Details Section */}
      <section className="relative bg-white p-6 rounded-xl border shadow space-y-4 text-sm sm:text-base">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <p className="text-xl sm:text-2xl font-bold heading-font">
            Professional Details
          </p>
          <button
            className="red-button !w-20 mt-2 sm:mt-0"
            onClick={() => setIsProfessionalEditOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1  para-font sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-700">
          <div>
            <b className="heading-font">Domain:</b> {jobSeeker.domain}
          </div>
          <div>
            <b className="heading-font">Location:</b> {jobSeeker.location}
          </div>
          <div>
            <b className="heading-font">Experience:</b>{" "}
            {jobSeeker.experienceYears} years
          </div>
          <div>
            <b className="heading-font">Phone:</b> {jobSeeker.phone}
          </div>
          <div className="sm:col-span-2">
            <b className="heading-font">Skills:</b>{" "}
            {jobSeeker.skills.join(", ")}
          </div>
          <div className="sm:col-span-2 break-words">
            <b className="heading-font">Resume:</b>{" "}
            <a
              href={jobSeeker.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-700 underline"
            >
              View Resume
            </a>
          </div>
          <div className="sm:col-span-2">
            <b className="heading-font">Availability Status:</b>{" "}
            <span
              className={`font-semibold ${
                jobSeeker.availabilityStatus === "available"
                  ? "text-green-600"
                  : jobSeeker.availabilityStatus === "employed"
                  ? "text-yellow-600"
                  : "text-gray-500"
              }`}
            >
              {jobSeeker.availabilityStatus?.toUpperCase()}
            </span>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <div className="border rounded-xl mt-8">
        <JobTabsSection
          appliedJobs={appliedJobs}
          jobOffers={jobOffers}
          appliedJobsLoading={appliedJobsLoading}
          jobOffersLoading={false}
          handleViewDetails={(job) => console.log("Job clicked:", job)}
        />
      </div>

      {/* Profile Edit Modal */}
      {isProfileEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsProfileEditOpen(false)}
            >
              ×
            </button>
            <p className="text-xl font-bold mb-4 heading-font">Edit Profile</p>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleProfileChange}
              placeholder="Name"
              className="w-full input"
              disabled
            />
            <input
              type="text"
              name="location"
              value={jobSeeker.location}
              onChange={handleProfessionalChange}
              placeholder="Location"
              className="w-full input mb-2"
            />

            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                onClick={handleSaveProfileUpdate}
                className="red-button w-full"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}

      {/* Professional Edit Modal */}
      {isProfessionalEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsProfessionalEditOpen(false)}
            >
              ×
            </button>
            <p className="text-xl font-bold mb-4 heading-font">
              Edit Professional Details
            </p>
            <input
              type="text"
              name="phone"
              value={jobSeeker.phone}
              onChange={handleProfessionalChange}
              placeholder="Phone"
              className="w-full input"
            />
            <input
              type="text"
              name="domain"
              value={jobSeeker.domain}
              onChange={handleProfessionalChange}
              placeholder="Domain"
              className="w-full input"
            />
            <input
              type="text"
              name="experienceYears"
              value={jobSeeker.experienceYears}
              onChange={handleProfessionalChange}
              placeholder="Experience (Years)"
              className="w-full input"
            />
            <input
              type="text"
              name="skills"
              value={jobSeeker.skills.join(", ")}
              onChange={(e) =>
                setJobSeeker((prev) => ({
                  ...prev,
                  skills: e.target.value.split(",").map((s) => s.trim()),
                }))
              }
              placeholder="Skills (comma-separated)"
              className="w-full input"
            />
            {/* <input
              type="text"
              name="resumeUrl"
              value={jobSeeker.resumeUrl}
              onChange={handleProfessionalChange}
              placeholder="Resume URL"
              className="w-full input"
            /> */}
            <FileUpload
              className="!mt-2"
              label="Upload Your Resume (.png, .jpeg, .pdf, .doc only)"
              onChange={handleFile}
            />
            <select
              name="availabilityStatus"
              value={jobSeeker.availabilityStatus}
              onChange={handleProfessionalChange}
              className="w-full input"
            >
              <option value="">Select Availability</option>
              <option value="available">Available</option>
              <option value="employed">Employed</option>
              <option value="unavailable">Unavailable</option>
            </select>
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                onClick={handleSaveProfileUpdate}
                className="red-button w-full"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerProfile;
