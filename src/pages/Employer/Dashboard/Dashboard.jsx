import React from "react";
import Layout from "../../../components/Layout/Layout";
import Hero1 from "./Hero1";
import AllPostedJobs from "./AllPostedJobs";

const Dashboard = () => {
  return (
    <Layout>
      <Hero1 />
      <AllPostedJobs />
    </Layout>
  );
};

export default Dashboard;
