import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import SeekerProfile from "../seeker/SeekerProfile";
import EmployerProfile from "../Employer/EmployerProfile";
import AdminProfile from '../adminPages/AdminProfile';

const Profile = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <Layout>
      {role === "" ? (
        <div>Loading profile...</div>
      ) : role === "employer" ? (
        <EmployerProfile />
      ) : role === "admin" ? (
        <AdminProfile /> 
      ) : (
        <SeekerProfile />
      )}
    </Layout>
  );
};

export default Profile;
