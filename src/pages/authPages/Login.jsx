import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import Loading from "../../components/atoms/Loading";

const LoginModal = ({ modalState, setModalState, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset fields when modal closes
  useEffect(() => {
    if (!modalState) {
      setEmail("");
      setPassword("");
      setResendEmail("");
    }
  }, [modalState]);

  const closeModal = () => setModalState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", { email, password });
      const { success, user } = res.data;

      if (success) {
        toast.success("Login successful!");
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);
        onLoginSuccess(user);
        closeModal();
        navigate("/");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/resend-otp", {
        email: resendEmail,
      });
      toast.success(res.data.message || "Verification link sent!");
      closeModal();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to resend verification link."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!modalState) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-xl text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {modalState === "login" && (
          <>
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-gray-800 heading-font">
                Login
              </h2>
              <p className="para-font text-gray-500">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  onClick={closeModal}
                  className="!no-underline"
                >
                  Register now
                </Link>
              </p>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="mb-4">
                <label className="block mb-1 para-font text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 para-font text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
              </div>
              {loading ? (
                <Loading width="100%" />
              ) : (
                <button type="submit" className="w-full red-button">
                  Login
                </button>
              )}

              <div className="flex justify-between mt-2 ">
                <button
                  type="button"
                  onClick={() => setModalState("resend")}
                  className="text-blue-600 para-font "
                >
                  Resend Verification Link
                </button>

                <Link
                  to="/forgetPassword"
                  onClick={closeModal}
                  className="para-font !no-underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-2 text-sm text-gray-500">OR</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 w-1/2 border border-gray-300 py-2 !rounded-lg hover:bg-gray-100">
                <FcGoogle size={20} /> Google
              </button>
              <button className="flex items-center justify-center gap-2 w-1/2 border border-gray-300 py-2 !rounded-lg hover:bg-gray-100">
                <FaLinkedin size={20} className="text-blue-700" /> LinkedIn
              </button>
            </div>
          </>
        )}

        {modalState === "resend" && (
          <>
            <h2 className="text-2xl heading-font font-bold text-center text-gray-800 mb-4">
              Resend Verification Link
            </h2>
            <p className="para-font text-gray-600 mb-3">
              Enter your email and we’ll send a new verification link.
            </p>

            <input
              type="email"
              className="input  mb-3"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
            />
            {loading ? (
              <Loading width="100%" />
            ) : (
              <button
                onClick={handleResendVerification}
                className="w-full red-button"
              >
                Send Link
              </button>
            )}

            <div className="text-center mt-3 ">
              <button
                onClick={() => setModalState("login")}
                className="text-blue-600 para-font"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
