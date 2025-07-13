import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import Loading from "../../components/atoms/Loading";

const EmployerProfile = () => {
  const [user, setUser] = useState({
    companyLogo: "https://randomuser.me/api/portraits/lego/2.jpg",
    name: "",
    email: "",
    location: "",
  });

  const [logoFile, setLogoFile] = useState(null);

  const [employer, setEmployer] = useState({
    companyName: "",
    companySize: "",
    industry: "",
    location: "",
    description: "",
    phone: "",
    isVerified: false,
  });

  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [isCompanyEditOpen, setIsCompanyEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/employer/profile");
        if (res.data.success) {
          const { data } = res.data;
          setUser({
            name: data.userId.fullName || "",
            email: data.userId.email || "",
            companyLogo:
              data.companyLogoUrl ||
              "https://randomuser.me/api/portraits/lego/2.jpg",
            location: data.location || "",
          });
          setEmployer({
            companyName: data.companyName || "",
            companySize: data.companySize || "",
            industry: data.industry || "",
            location: data.location || "",
            description: data.description || "",
            phone: data.phone || "",
            isVerified: data.isVerified || false,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullName: user.name,
        email: user.email,
        phone: employer.phone,
        companyName: employer.companyName,
        companySize: employer.companySize,
        industry: employer.industry,
        location: employer.location,
        description: employer.description,
      };

      const response = await axios.put("/employer/profile/update", payload);

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        const updated = response.data.data;
        if (logoFile) {
          const objectUrl = URL.createObjectURL(logoFile);
          setUser((prev) => ({ ...prev, companyLogo: objectUrl }));
        }
        setEmployer({
            companyName: updated.companyName || "",
            companySize: updated.companySize || "",
            industry: updated.industry || "",
            location: updated.location || "",
            description: updated.description || "",
            phone: updated.phone || "",
            isVerified: updated.isVerified || false,
          });
        setIsProfileEditOpen(false);
        setIsCompanyEditOpen(false);
      } else {
        toast.error("Update failed!");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 py-6 max-w-4xl mx-auto space-y-10">
      {/* Profile Section */}
      <section className="relative bg-white p-6 rounded-xl border shadow">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <p className="text-xl sm:text-4xl font-bold heading-font">Profile</p>
          {/* <button
            className="red-button !w-20 mt-2 sm:mt-0"
            onClick={() => setIsProfileEditOpen(true)}
          >
            Edit
          </button> */}
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-y-4 sm:gap-x-10 px-2">
          <img
            src={user.companyLogo}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-red-700"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-extrabold heading-font">{user.name}</h2>
            <p className="text-gray-600 para-font">{user.email}</p>
            <p className="text-gray-600 para-font">{user.location}</p>
          </div>
        </div>
      </section>

      {/* Company Details Section */}
      <section className="relative bg-white p-6 rounded-xl border shadow space-y-4 text-sm sm:text-base">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <p className="text-xl sm:text-2xl font-bold heading-font">
            Company Details
          </p>
          <button
            className="red-button !w-20 mt-2 sm:mt-0"
            onClick={() => setIsCompanyEditOpen(true)}
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 para-font sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-700">
          <div>
            <b className="heading-font">Company Name:</b> {employer.companyName}
          </div>
          <div>
            <b className="heading-font">Company Size:</b> {employer.companySize}
          </div>
          <div>
            <b className="heading-font">Industry:</b> {employer.industry}
          </div>
          <div>
            <b className="heading-font">Phone:</b> {employer.phone}
          </div>
          <div className="sm:col-span-2">
            <b className="heading-font">Location:</b> {employer.location}
          </div>
          <div className="sm:col-span-2">
            <b className="heading-font">Description:</b> {employer.description}
          </div>
          {/* <div className="sm:col-span-2">
            <b className="heading-font">Verified:</b>{" "}
            <span
              className={`font-semibold ${
                employer.isVerified ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {employer.isVerified ? "Yes" : "No"}
            </span>
          </div> */}
        </div>
      </section>

      {/* Profile Edit Modal */}
 {/*   {isProfileEditOpen && (
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
              placeholder="Full Name"
              className="w-full input"
              disabled
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full input"
            />
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button onClick={handleSave} className="red-button w-full">
                Save
              </button>
            )}
          </div>
        </div>
      )}*/}

      {/* Company Edit Modal */}
      {isCompanyEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md space-y-4 relative">
            <button
              className="absolute top-2 right-4 text-red-600 text-2xl font-bold"
              onClick={() => setIsCompanyEditOpen(false)}
            >
              ×
            </button>
            <p className="text-xl font-bold mb-4 heading-font">
              Edit Company Details
            </p>
            <input
              type="text"
              name="companyName"
              value={employer.companyName}
              onChange={handleCompanyChange}
              placeholder="Company Name"
              className="w-full input"
            />
            <input
              type="text"
              name="companySize"
              value={employer.companySize}
              onChange={handleCompanyChange}
              placeholder="Company Size"
              className="w-full input"
            />
            <input
              type="text"
              name="industry"
              value={employer.industry}
              onChange={handleCompanyChange}
              placeholder="Industry"
              className="w-full input"
            />
            <input
              type="text"
              name="phone"
              value={employer.phone}
              onChange={handleCompanyChange}
              placeholder="Phone"
              className="w-full input"
            />
            <input
              type="text"
              name="location"
              value={employer.location}
              onChange={handleCompanyChange}
              placeholder="Location"
              className="w-full input"
            />
            <textarea
              name="description"
              value={employer.description}
              onChange={handleCompanyChange}
              placeholder="Description"
              className="w-full input"
              rows="3"
            />
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button onClick={handleSave} className="red-button w-full">
                Save
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;
