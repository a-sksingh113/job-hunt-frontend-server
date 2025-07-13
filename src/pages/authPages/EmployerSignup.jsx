import React, { useState } from "react";
import FileUpload from "../../components/atoms/FileUpload";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Loading from "../../components/atoms/Loading";
import { useNavigate } from "react-router-dom";

const EmployerSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    companySize: "",
    industry: "",
    location: "",
    description: "",
    // companyLogoUrl: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "companyLogoUrl") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, companyLogoUrl: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setLogoPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("fullName", formData.name);
      form.append("email", formData.email);
      form.append("password", formData.password);
      form.append("phone", formData.phone);
      form.append("companyName", formData.companyName);
      form.append("companySize", formData.companySize);
      form.append("industry", formData.industry);
      form.append("location", formData.location);
      form.append("description", formData.description);

      if (formData.companyLogoUrl) {
        form.append("companyLogoUrl", formData.companyLogoUrl);
      }

      const response = await api.post("/auth/employer-signup", form);

      if (response.data.success) {
        toast.success("Registration successful! Verification Link sent to your registered mail");
          localStorage.setItem("verifyEmail", formData.email);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          companyName: "",
          companySize: "",
          industry: "",
          location: "",
          description: "",
          // companyLogoUrl: null,
        });
        setLogoPreview(null);
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 heading-font">
        Employer Registration
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="input"
      />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input"
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2 cursor-pointer text-sm text-red-500"
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>

      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        type="text"
        name="companyName"
        placeholder="Company Name"
        value={formData.companyName}
        onChange={handleChange}
        required
        className="input"
      />

      <select
        name="companySize"
        value={formData.companySize}
        onChange={handleChange}
        required
        className="input"
      >
        <option value="">Select Company Size</option>
        <option value="1-10">1-10</option>
        <option value="11-50">11-50</option>
        <option value="51-200">51-200</option>
        <option value="201-500">201-500</option>
        <option value="500+">500+</option>
      </select>

      <input
        type="text"
        name="industry"
        placeholder="Industry"
        value={formData.industry}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
        className="input"
      />

      <textarea
        name="description"
        rows="3"
        placeholder="Company Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="input"
      />

      <div className="mt-4">
        <input
          accept="image/*"
          id="companyLogoUrl"
          type="file"
          name="companyLogoUrl"
          onChange={handleChange}
          className="hidden"
        />

        {/* <FileUpload label="Upload Company Logo" onChange={handleChange} /> */}
      </div>

      {isSubmitting ? (
        <Loading width="100%" />
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full red-button"
        >
          Reigister as Employer
        </button>
      )}
    </form>
  );
};

export default EmployerSignup;
