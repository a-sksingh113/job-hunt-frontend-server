import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import EmployerSignup from "./EmployerSignup";
import SeekerSignup from "./SeekerSignup";
import { Link } from "react-router-dom";
import LoginModal from "./Login";

const Signup = () => {
  const [role, setRole] = useState("job_seeker");
  const [modalState, setModalState] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  }, []);

  return (
    <Layout>
      <div className="mx-auto mb-10 mt-10 w-[80%] md:w-[60%] lg:w-[40%] border p-6 rounded shadow bg-white text-sm md:text-base">
        <div className="mb-6 text-center">
          <p className="text-4xl !font-extrabold mb-4 heading-font">
            Create an Account
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setRole("job_seeker")}
              className={`px-4 py-2 rounded  ${
                role === "job_seeker"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Job Seeker
            </button>
            <button
              onClick={() => setRole("employer")}
              className={`px-4 py-2 rounded ${
                role === "employer"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Employer
            </button>
          </div>
        </div>

        {role === "job_seeker" ? <SeekerSignup /> : <EmployerSignup />}
        <p className="text-center para-font text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => setModalState("login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
      <LoginModal
        modalState={modalState}
        setModalState={setModalState}
        onLoginSuccess={(user) => {
          setUser(user);
          setRole(user.role);
        }}
      />
    </Layout>
  );
};

export default Signup;
