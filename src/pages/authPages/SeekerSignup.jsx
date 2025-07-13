import React, { useState } from "react";
import api from "../../api/axios";
import FileUpload from "../../components/atoms/FileUpload";
import Loading from "../../components/atoms/Loading";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SeekerSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    domain: "",
    location: "",
    experienceYears: "",
    skills: "",
    resumeUrl: "",
    profilePic: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, profilePic: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      fullName: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      domain: formData.domain,
      location: formData.location,
      experienceYears: Number(formData.experienceYears),
      skills: formData.skills.split(",").map((skill) => skill.trim()),
      resumeUrl: formData.resumeUrl,
    };

    try {
      const response = await api.post("/auth/seeker-signup", payload);
      if (response.data.success) {
        toast.success(
          "Registration successful! Verification Link sent to your registered mail"
        );
        localStorage.setItem("verifyEmail", formData.email);

        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          domain: "",
          location: "",
          experienceYears: "",
          skills: "",
          resumeUrl: "",
          profilePic: null,
        });
        setProfilePreview(null);
      } else {
        toast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      console.error("Signup error:", message);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 heading-font">
        Job Seeker Registration
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
        placeholder="Email Address"
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
          className="absolute right-3 top-2/4 -translate-y-1/2 text-sm text-red-600 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
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
        name="domain"
        placeholder="Domain (e.g. Web Dev)"
        value={formData.domain}
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

      <input
        type="number"
        name="experienceYears"
        placeholder="Experience (Years)"
        value={formData.experienceYears}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        type="text"
        name="skills"
        placeholder="Skills (e.g. React, Node.js)"
        value={formData.skills}
        onChange={handleChange}
        required
        className="input"
      />

      <input
        type="url"
        name="resumeUrl"
        placeholder="Resume URL"
        value={formData.resumeUrl}
        onChange={handleChange}
        required
        className="input"
      />

      {/* <FileUpload label="Upload Company Logo" onChange={handleChange} /> */}
      {isSubmitting ? (
        <Loading width="100%" />
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full red-button"
        >
          Reigister as Job Seeker
        </button>
      )}
    </form>
  );
};

export default SeekerSignup;
