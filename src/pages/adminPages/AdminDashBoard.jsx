import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Layout from "../../components/Layout/Layout";
import UserDetailModal from "./UserDetailModel";
import toast from "react-hot-toast";
import Loading from "../../components/atoms/Loading";

const AdminDashboard = () => {
  const [employers, setEmployers] = useState([]);
  const [seekers, setSeekers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userType, setUserType] = useState(""); // "employer" | "seeker"

  const [dataLoading, setDataLoading] = useState(true); // page‑level spinner
  const [actionLoading, setActionLoading] = useState(null); // { id, action } or null

  /* ───── fetch helpers ───── */
  const fetchData = async (showSpinner = false) => {
    if (showSpinner) setDataLoading(true);
    try {
      const [empRes, seekerRes] = await Promise.all([
        axios.get("/admin/dashboard/employers"),
        axios.get("/admin/dashboard/seekers"),
      ]);
      setEmployers(empRes.data.employers || []);
      setSeekers(seekerRes.data.seekers || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      toast.error("Failed to load dashboard data");
    } finally {
      if (showSpinner) setDataLoading(false);
    }
  };

  /* first load */
  useEffect(() => {
    fetchData(true);
  }, []);

  /* ───── approve / reject ───── */

  const handleApproveReject = async (userId, action, type) => {
    setActionLoading({ id: userId, action }); // only that button spins

    // build request
    const url = `/admin/dashboard/${action}/${type}/${userId}`;
    const request = action === "approve" ? axios.patch(url) : axios.delete(url);

    try {
      // toast.promise handles all 3 states
      await toast.promise(
        request,
        {
          loading: `${capitalize(type)} ${action}ing…`,
          success: `${capitalize(type)} ${action}d successfully!`,
          error: "Action failed. Please try again.",
        },
        { success: { duration: 3000 } } // optional: tweak durations
      );

      await fetchData(false); // refresh lists without full‑page spinner
    } catch (err) {
      console.error("Action failed:", err);
      // toast.promise already showed an error toast
    } finally {
      setActionLoading(null);
    }
  };

  /* ───── utils ───── */
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const isBtnLoading = (id, act) =>
    actionLoading && actionLoading.id === id && actionLoading.action === act;

  /* ───── derived lists ───── */
  const pendingEmployers = employers.filter((e) => !e.isApproved);
  const pendingSeekers = seekers.filter((s) => !s.isApproved);
  const noPending = !pendingEmployers.length && !pendingSeekers.length;

  /* ───── UI ───── */
  return (
    <Layout>
      <div className="p-6 space-y-10">
        <h1 className="text-3xl font-bold heading-font">Admin Dashboard</h1>

        {/* 1) full‑page spinner */}
        {dataLoading && (
          <div className="flex flex-col items-center py-20">
            <p className="mt-2 text-gray-600 para-font">
              Fetching pending approvals…
            </p>
          </div>
        )}

        {/* 2) no pending */}
        {!dataLoading && noPending && (
          <p className="text-center para-font text-gray-500 text-xl font-semibold">
            No pending approvals!
          </p>
        )}

        {/* 3) pending employers */}
        {!dataLoading && pendingEmployers.length > 0 && (
          <Section
            title="Pending Employers"
            items={pendingEmployers}
            type="employer"
            isBtnLoading={isBtnLoading}
            onView={(u) => {
              setSelectedUser(u);
              setUserType("employer");
            }}
            onAction={handleApproveReject}
          />
        )}

        {/* 4) pending seekers */}
        {!dataLoading && pendingSeekers.length > 0 && (
          <Section
            title="Pending Job Seekers"
            items={pendingSeekers}
            type="seeker"
            isBtnLoading={isBtnLoading}
            onView={(u) => {
              setSelectedUser(u);
              setUserType("seeker");
            }}
            onAction={handleApproveReject}
          />
        )}

        {/* 5) modal */}
        {selectedUser && (
          <UserDetailModal
            user={selectedUser}
            type={userType}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </Layout>
  );
};

/* ───────────────────────────────── helper sub‑component ─────────────── */
const Section = ({ title, items, type, isBtnLoading, onView, onAction }) => (
  <section>
    <h2 className="text-2xl font-bold mb-4 heading-font">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((u) => (
        <div key={u._id} className="border rounded-xl p-4 shadow">
          <p className="text-2xl font-semibold para-font">{u.fullName}</p>
          <p className="para-font text-gray-600">
            {type === "employer"
              ? `${u.employerDetails?.companyName} — ${u.employerDetails?.industry}`
              : u.jobSeekerDetails?.domain}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => onView(u)}
            >
              View Details
            </button>

            <button
              className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              disabled={isBtnLoading(u._id, "approve")}
              onClick={() => onAction(u._id, "approve", type)}
            >
              {isBtnLoading(u._id, "approve") ? (
                <Loading color="success" />
              ) : (
                "Approve"
              )}
            </button>

            <button
              className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
              disabled={isBtnLoading(u._id, "reject")}
              onClick={() => onAction(u._id, "reject", type)}
            >
              {isBtnLoading(u._id, "reject") ? <Loading /> : "Reject"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AdminDashboard;
