import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import axios from "../../api/axios";

const VerfiedMailSuccessRespose = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const cleanToken = token.split(":")[0];

        const res = await axios.get(`/auth/verify-email/${cleanToken}`);

        if (res.data.success) {
          setVerified(true);
        } else {
          setError("Verification failed. Please try again.");
        }
      } catch (err) {
        setError("Invalid or expired token.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          {loading ? (
            <p className="text-gray-600">Verifying your email...</p>
          ) : verified ? (
            <>
              <div className="text-green-600 text-5xl mb-4">✅</div>
              <h1 className="text-2xl font-bold mb-2">
                Email Verified Successfully
              </h1>
              <p className="text-gray-600 mb-6">
                Your email has been verified. Please log in to continue.
              </p>
              <Link to="/" className="red-button">
                Go to Home
              </Link>
            </>
          ) : (
            <>
              <div className="text-red-600 text-5xl mb-4">❌</div>
              <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link to="/" className="red-button">
                Back to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VerfiedMailSuccessRespose;
