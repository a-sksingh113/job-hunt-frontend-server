import React from "react";
import Layout from "../../../components/Layout/Layout";
import AllApplications from "./AllApplications";
import ErrorBoundary from "./ErrorBoundary";

const ManageApplications = () => {
  return (
    <Layout>
      <ErrorBoundary>
        <AllApplications />
      </ErrorBoundary>
    </Layout>
  );
};

export default ManageApplications;
