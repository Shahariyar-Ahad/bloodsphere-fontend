import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "https://blood-donor-server-two.vercel.app";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionUser, setActionUser] = useState(null);
  const [actionType, setActionType] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleMakeAdmin = async () => {
    try {
      const token = localStorage.getItem("access-token");
      const res = await axios.patch(
        `${API_BASE_URL}/users/admin/${actionUser._id}`,
        {},
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (res.data.modifiedCount > 0) {
        toast.success("User promoted to Admin");
        fetchUsers();
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActionUser(null);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus =
      actionUser.status === "active" ? "blocked" : "active";

    try {
      const token = localStorage.getItem("access-token");
      const res = await axios.patch(
        `${API_BASE_URL}/users/status/${actionUser._id}`,
        { status: newStatus },
        { headers: { authorization: `Bearer ${token}` } }
      );

      if (res.data.modifiedCount > 0) {
        toast.success(
          `User ${newStatus === "active" ? "Unblocked" : "Blocked"}`
        );
        fetchUsers();
      }
    } catch {
      toast.error("Action failed");
    } finally {
      setActionUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={u.image || "https://i.ibb.co/5R6zP1r/user.png"}
                        alt="avatar"
                      />
                    </div>
                  </div>
                </td>

                <td>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm opacity-60">{u.email}</p>
                </td>

                <td>
                  <span
                    className={`badge ${
                      u.role === "admin"
                        ? "badge-primary"
                        : "badge-outline"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      u.status === "active"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="flex justify-end gap-2">
                  {u.role !== "admin" && (
                    <button
                      onClick={() => {
                        setActionUser(u);
                        setActionType("admin");
                      }}
                      className="btn btn-xs btn-info"
                    >
                      Make Admin
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActionUser(u);
                      setActionType("status");
                    }}
                    className={`btn btn-xs ${
                      u.status === "active"
                        ? "btn-error"
                        : "btn-success"
                    }`}
                  >
                    {u.status === "active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRMATION MODAL */}
      {actionUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Confirm Action
            </h3>
            <p className="py-4">
              Are you sure you want to{" "}
              <strong>
                {actionType === "admin"
                  ? "make this user an admin"
                  : "change user status"}
              </strong>
              ?
            </p>
            <div className="modal-action">
              <button
                onClick={() => setActionUser(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>

              <button
                onClick={
                  actionType === "admin"
                    ? handleMakeAdmin
                    : handleToggleStatus
                }
                className="btn btn-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
