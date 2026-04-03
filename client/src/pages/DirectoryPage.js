import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';


const DirectoryPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== 'Admin') return;
      setLoading(true);
      try {
        const res = await api.get('/users');
        setUsers(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.msg || 'Could not load directory.');
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  if (!user || user.role !== 'Admin') {
    return (
      <div className="p-8 bg-[#073737] min-h-[91.4vh] text-[#FDFFD4]">
        <h1 className="text-2xl font-bold mb-2">Directory</h1>
        <p>Only Admins can view the organization directory.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 bg-[#073737] min-h-[91.4vh] text-[#FDFFD4]">Loading directory…</div>
    );
  }

  return (
    <div className="p-8 bg-[#073737] min-h-[91.4vh]">
      <h1 className="text-3xl font-bold text-[#FDFFD4] mb-2">Organization directory</h1>
      <p className="text-[#FDFFD4]/80 mb-8 text-sm">
        All users in your company with their Viewer / Analyst / Admin role and status.
      </p>
      <div className="bg-[#FDFFD4] rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="text-xs uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">{u.name}</td>
                <td className="py-3 px-4 text-gray-600">{u.email}</td>
                <td className="py-3 px-4">{u.role}</td>
                <td className="py-3 px-4">{u.status || 'Active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DirectoryPage;
