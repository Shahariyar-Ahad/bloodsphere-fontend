import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const API_BASE_URL = 'https://blood-donor-server-two.vercel.app';

    const fetchUsers = async () => {
        const token = localStorage.getItem('access-token');
        const res = await axios.get(`${API_BASE_URL}/users`, {
            headers: { authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchUsers(); }, []);

    const handleMakeAdmin = async (id) => {
        const token = localStorage.getItem('access-token');
        const res = await axios.patch(`${API_BASE_URL}/users/admin/${id}`, {}, {
            headers: { authorization: `Bearer ${token}` }
        });
        if (res.data.modifiedCount > 0) {
            toast.success("User is now an Admin!");
            fetchUsers();
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const token = localStorage.getItem('access-token');
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        const res = await axios.patch(`${API_BASE_URL}/users/status/${id}`, { status: newStatus }, {
            headers: { authorization: `Bearer ${token}` }
        });
        if (res.data.modifiedCount > 0) {
            toast.success(`User ${newStatus === 'active' ? 'Unblocked' : 'Blocked'}`);
            fetchUsers();
        }
    };

    return (
        <div className="bg-gray-500 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6">Manage All Users</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="bg-red-500 text-black">
                            <th >Avatar</th>
                            <th>Name & Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td><div className="avatar"><div className="w-10 rounded-full"><img src={u.image} alt="" /></div></div></td>
                                <td><p className="font-bold">{u.name}</p><p className="text-sm">{u.email}</p></td>
                                <td><span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>{u.role}</span></td>
                                <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-error'}`}>{u.status}</span></td>
                                <td className="flex gap-2">
                                    {u.role !== 'admin' && <button onClick={() => handleMakeAdmin(u._id)} className="btn btn-xs btn-info">Make Admin</button>}
                                    <button onClick={() => handleToggleStatus(u._id, u.status)} className={`btn btn-xs ${u.status === 'active' ? 'btn-error' : 'btn-success text-white'}`}>
                                        {u.status === 'active' ? 'Block' : 'Unblock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;