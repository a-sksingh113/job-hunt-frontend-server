import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import Loading from "../../components/atoms/Loading";
import axios from "../../api/axios";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ newPass: "", confirmPass: "" });
  const [loading, setLoading] = useState(false);
  const pathname = window.location.pathname;

  // OTP input handling
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    const { key } = e;

    if (key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (key === "ArrowRight" && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // 1. Send OTP
  const sendOtp = async () => {
    if (!email) return toast.error("Email is required");

    setLoading(true);
    try {
      const res = await axios.post("/auth/forgot-password", { email });

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email.");
        setStep(2);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Failed to send OTP. Try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP");
    }

    setLoading(true);
    try {
      const res = await axios.post("/auth/verify-otp", {
        email,
        otp: enteredOtp,
      });

      if (res.data.success) {
        toast.success(res.data.message || "OTP verified successfully");
        setStep(3);
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Failed to verify OTP. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Reset Password
  const handlePasswordSubmit = async () => {
    if (passwords.newPass !== passwords.confirmPass) {
      return toast.error("Passwords do not match");
    }

    if (passwords.newPass.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await axios.post("/auth/reset-password", {
        email,
        newPassword: passwords.newPass,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully");
        setStep(4);
      } else {
        toast.error(res.data.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("Error resetting password. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto w-[80%] md:w-[60%] lg:w-[30%] mt-20 border p-8 rounded shadow-lg bg-white">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center heading-font">
              Forgot Password
            </h2>
            <label className="block mb-2 font-medium text-gray-700 para-font">
              Enter your email address
            </label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                onClick={sendOtp}
                className="red-button w-full"
                disabled={loading}
              >
                Send OTP
              </button>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center heading-font">
              Enter OTP
            </h2>
            <p className="para-font text-gray-600 mb-4 text-center">
              We sent a 6-digit OTP to {email}
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, i)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  className="w-10 input text-center"
                />
              ))}
            </div>
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                onClick={verifyOtp}
                className="red-button w-full"
                disabled={loading}
              >
                Verify OTP
              </button>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center heading-font">
              Reset Password
            </h2>
            <div className="relative">
              <label className="para-font font-medium">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwords.newPass}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPass: e.target.value })
                }
                className="input"
                placeholder="Enter new password"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="relative">
              <label className="para-font font-medium">Confirm Password</label>
              <input
                type={showConfirm ? "text" : "password"}
                value={passwords.confirmPass}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirmPass: e.target.value })
                }
                className="input"
                placeholder="Confirm new password"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-600"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                onClick={handlePasswordSubmit}
                className="w-full red-button"
                disabled={loading}
              >
                Update Password
              </button>
            )}
          </>
        )}

        {step === 4 && (
          <div className="text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-700 heading-font">
              Password Changed
            </h2>
            <p className="mt-2 para-font text-gray-600">
              You can now log in with your new password.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ForgetPassword;
