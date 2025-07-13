import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import toast from "react-hot-toast";
import Loading from "../../components/atoms/Loading";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateloading, setUpdateLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/admin/dashboard/profile");
        if (res.data.success) {
          setAdmin(res.data.user);
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
        toast.error("Failed to load admin profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const openEditModal = () => {
    setFormData({
      fullName: admin.fullName || "",
      email: admin.email || "",
      phone: admin.phone || "",
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const res = await axios.put("/admin/dashboard/profile/update", formData);
      if (res.data.success) {
        setAdmin(res.data.user);
        toast.success("Profile updated successfully");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;

  if (!admin)
    return (
      <div className="text-center p-6 text-red-500">
        Failed to load profile.
      </div>
    );

  return (
    <div>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center heading-font">
          Admin Profile
        </h2>
        <div className="space-y-3 para-font">
          <ProfileItem label="Full Name" value={admin.fullName} />
          <ProfileItem label="Email" value={admin.email} />
          <ProfileItem label="Phone" value={admin.phone} />
        </div>
        <div className="text-center mt-6">
          <button onClick={openEditModal} className="red-button">
            Edit Profile
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center heading-font">
              Edit Profile
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                label="Full Name"
                name="fullName"
                className="input"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <input
                label="Phone"
                name="phone"
                className="input"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 !rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                {updateloading ? (
                  <Loading color="success" />
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 !rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between items-center border-b py-2">
    <span className="font-medium text-gray-600">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);


export default AdminProfile;
