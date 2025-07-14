import React, { useState } from "react";
import api from "../../api/axios";
import FileUpload from "../../components/atoms/FileUpload";
import Loading from "../../components/atoms/Loading";
import { toast } from "react-hot-toast";

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
    resumeUrl: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResumeUpload = (file) => {
    setFormData((prev) => ({ ...prev, resumeUrl: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append("fullName", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("phone", formData.phone);
    form.append("domain", formData.domain);
    form.append("location", formData.location);
    form.append("experienceYears", formData.experienceYears);
    form.append(
      "skills",
      JSON.stringify(formData.skills.split(",").map((s) => s.trim()))
    );
    if (formData.resumeUrl) {
      form.append("resumeUrl", formData.resumeUrl);
    }

    try {
      const res = await api.post("/auth/seeker-signup", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(
          "Registration successful! Check your email for verification."
        );
        localStorage.setItem("verifyEmail", formData.email);

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          domain: "",
          location: "",
          experienceYears: "",
          skills: "",
          resumeUrl: null,
        });
      } else {
        toast.error(res.data.message || "Registration failed.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error("Signup Error:", err);
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

      <FileUpload
        label="Upload Resume (.png, .jpeg, .pdf, .doc only)"
        onChange={handleResumeUpload}
      />

      {isSubmitting ? (
        <Loading width="100%" />
      ) : (
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full red-button"
        >
          Register as Job Seeker
        </button>
      )}
    </form>
  );
};

export default SeekerSignup;
