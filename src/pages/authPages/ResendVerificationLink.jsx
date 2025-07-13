import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Loading from "../../components/atoms/Loading";

const ResendVerificationLink = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/resend-verification", { email });
      toast.success(res.data.message || "Verification link sent!");
      onClose();
    } catch (err) {
      console.log(
        "resend verification link Error: ",
        err?.response?.data?.message || "Failed to resend verification link."
      );
      toast.error("Failed to resend verification link.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          Resend Verification Link
        </h2>

        <p className="text-sm text-gray-600 mb-3">
          Enter the email you registered with. We’ll send a new verification
          link.
        </p>

        <input
          type="email"
          className="input w-full"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {loading ? (
          <Loading width="100%" />
        ) : (
          <button onClick={handleResend} className="w-full red-button mt-4">
            Send Verification Link
          </button>
        )}
      </div>
    </div>
  );
};

export default ResendVerificationLink;
