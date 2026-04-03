import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const emptyRecordForm = {
  amount: '',
  type: 'Expense',
  category: '',
  date: new Date().toISOString().slice(0, 10),
  description: '',
};
const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [orgStats, setOrgStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer',
    status: 'Active',
  });
  const [recordForm, setRecordForm] = useState(emptyRecordForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);

  const refreshOverview = async () => {
    try {
      const [sumRes, orgRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/analytics/admin'),
      ]);
      setSummary(sumRes.data.data || null);
      setOrgStats(orgRes.data.data || null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Could not load overview.');
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not load users.');
    }
  };

  const loadTransactions = async (page = 1) => {
    setRecordsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filters.type) params.set('type', filters.type);
      if (filters.category.trim()) params.set('category', filters.category.trim());
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);
      const res = await api.get(`/transactions?${params.toString()}`);
      setTransactions(res.data.data || []);
      if (res.data.pagination) setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not load records.');
    }
    setRecordsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshOverview(), loadUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (activeView === 'records') loadTransactions(1);
  }, [activeView]);

  const onCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', userForm);
      toast.success(`Created ${userForm.role}: ${userForm.name}`);
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'Viewer',
        status: 'Active',
      });
      await loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not create user.');
    }
  };

  const saveUserRow = async (id, patch) => {
    try {
      await api.patch(`/users/${id}`, patch);
      toast.success('User updated');
      await loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed.');
    }
  };

  const onCreateRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', {
        amount: Number(recordForm.amount),
        type: recordForm.type,
        category: recordForm.category.trim(),
        date: recordForm.date,
        description: recordForm.description.trim() || undefined,
      });
      toast.success('Record created');
      setRecordForm(emptyRecordForm);
      await refreshOverview();
      if (activeView === 'records') await loadTransactions(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not create record.');
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setEditForm({
      amount: t.amount,
      type: t.type,
      category: t.category,
      date: t.date ? new Date(t.date).toISOString().slice(0, 10) : '',
      description: t.description || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    try {
      await api.put(`/transactions/${editingId}`, {
        amount: Number(editForm.amount),
        type: editForm.type,
        category: editForm.category.trim(),
        date: editForm.date,
        description: editForm.description.trim() || undefined,
      });
      toast.success('Record updated');
      cancelEdit();
      await refreshOverview();
      await loadTransactions(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not update record.');
    }
  };

  const removeRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Record deleted');
      await refreshOverview();
      await loadTransactions(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not delete.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-[#073737] min-h-[91.4vh] text-[#FDFFD4]">
        Loading admin workspace…
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#073737] min-h-[91.4vh]">
      <h1 className="text-3xl font-bold text-[#FDFFD4] mb-2">Admin Dashboard</h1>
      {/* <p className="text-[#FDFFD4]/80 mb-8 text-sm">
        Manage users (Viewer / Analyst / Admin), financial records, and view organization insights.
      </p> */}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="w-full lg:w-56 bg-[#FDFFD4] p-4 rounded-lg shadow border border-gray-200 flex-shrink-0">
          <nav className="space-y-0">
            {[
              ['overview', 'Overview'],
              ['users', 'Users'],
              ['records', 'Records'],
              ['new-record', 'New record'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveView(key);
                  if (key === 'overview') refreshOverview();
                }}
                className={`w-full text-left p-3 font-semibold border-b border-gray-300 ${
                  activeView === key ? 'bg-teal-50 text-[#073737]' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 w-full space-y-8">
          {activeView === 'overview' && summary && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                  <h2 className="text-sm font-semibold text-[#073737] uppercase">Total income</h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {Number(summary.totalIncome).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                  <h2 className="text-sm font-semibold text-[#073737] uppercase">Total expenses</h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {Number(summary.totalExpenses).toFixed(2)}
                  </p>
                </div>
                <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                  <h2 className="text-sm font-semibold text-[#073737] uppercase">Net balance</h2>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {Number(summary.netBalance).toFixed(2)}
                  </p>
                </div>
              </div>

              {orgStats && (
                <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                  <h2 className="text-xl font-bold text-[#073737] mb-4">Users by role</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Viewers</p>
                      <p className="text-2xl font-bold">{orgStats.byRole?.Viewer ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Analysts</p>
                      <p className="text-2xl font-bold">{orgStats.byRole?.Analyst ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Admins</p>
                      <p className="text-2xl font-bold">{orgStats.byRole?.Admin ?? 0}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Active {orgStats.byStatus?.Active ?? 0} · Inactive{' '}
                    {orgStats.byStatus?.Inactive ?? 0}
                  </p>
                </div>
              )}

              <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold text-[#073737] mb-4">Recent activity</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-gray-700">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(summary.recentActivity || []).map((row) => (
                        <tr key={row._id} className="border-b border-gray-100">
                          <td className="py-2 px-3">
                            {row.date ? new Date(row.date).toLocaleDateString() : '—'}
                          </td>
                          <td className="py-2 px-3">{row.type}</td>
                          <td className="py-2 px-3">{row.category}</td>
                          <td className="py-2 px-3 text-right">{Number(row.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeView === 'users' && (
            <div className="space-y-8">
              <div className="bg-[#FDFFD4] p-8 rounded-lg shadow border border-gray-200">
                <h2 className="text-2xl font-bold text-[#073737] mb-6">Create user</h2>
                <form onSubmit={onCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#073737]">Name</label>
                    <input
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#073737]">Email</label>
                    <input
                      required
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#073737]">Password</label>
                    <input
                      required
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#073737]">Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#073737]">Status</label>
                    <select
                      value={userForm.status}
                      onChange={(e) => setUserForm({ ...userForm, status: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#073737] text-white rounded-md font-medium hover:bg-[#0a4f4f]"
                    >
                      Create user
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200 overflow-x-auto">
                <h2 className="text-xl font-bold text-[#073737] mb-4">Directory</h2>
                <table className="w-full text-sm text-gray-800">
                  <thead className="text-xs uppercase bg-gray-100">
                    <tr>
                      <th className="py-2 px-3 text-left">Name</th>
                      <th className="py-2 px-3 text-left">Email</th>
                      <th className="py-2 px-3 text-left">Role</th>
                      <th className="py-2 px-3 text-left">Status</th>
                      <th className="py-2 px-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <UserRow key={u._id} user={u} onSave={saveUserRow} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'new-record' && (
            <div className="bg-[#FDFFD4] p-8 rounded-lg shadow border border-gray-200 max-w-xl">
              <h2 className="text-2xl font-bold text-[#073737] mb-6">New financial record</h2>
              <form onSubmit={onCreateRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#073737]">Amount</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={recordForm.amount}
                    onChange={(e) => setRecordForm({ ...recordForm, amount: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#073737]">Type</label>
                  <select
                    value={recordForm.type}
                    onChange={(e) => setRecordForm({ ...recordForm, type: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#073737]">Category</label>
                  <input
                    required
                    value={recordForm.category}
                    onChange={(e) => setRecordForm({ ...recordForm, category: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Travel, Payroll"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#073737]">Date</label>
                  <input
                    required
                    type="date"
                    value={recordForm.date}
                    onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#073737]">Notes</label>
                  <textarea
                    value={recordForm.description}
                    onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#073737] text-white rounded-md font-medium hover:bg-[#0a4f4f]"
                >
                  Save record
                </button>
              </form>
            </div>
          )}

          {activeView === 'records' && (
            <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-2xl font-bold text-[#073737] mb-4">Records</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadTransactions(1);
                }}
                className="flex flex-wrap gap-3 mb-6 items-end"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-600">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="">All</option>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Category</label>
                  <input
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-36"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">From</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">To</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#073737] text-white rounded-md text-sm font-medium"
                >
                  Apply
                </button>
              </form>

              {recordsLoading ? (
                <p className="text-gray-600">Loading…</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-gray-800">
                      <thead className="text-xs uppercase bg-gray-100">
                        <tr>
                          <th className="py-2 px-2">Date</th>
                          <th className="py-2 px-2">Type</th>
                          <th className="py-2 px-2">Category</th>
                          <th className="py-2 px-2 text-right">Amount</th>
                          <th className="py-2 px-2">Notes</th>
                          <th className="py-2 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) =>
                          editingId === t._id ? (
                            <tr key={t._id} className="border-b bg-amber-50/50">
                              <td className="py-2 px-2">
                                <input
                                  type="date"
                                  value={editForm.date}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, date: e.target.value })
                                  }
                                  className="w-full border rounded px-1 text-xs"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <select
                                  value={editForm.type}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, type: e.target.value })
                                  }
                                  className="w-full border rounded text-xs"
                                >
                                  <option value="Income">Income</option>
                                  <option value="Expense">Expense</option>
                                </select>
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  value={editForm.category}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, category: e.target.value })
                                  }
                                  className="w-full border rounded px-1 text-xs"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editForm.amount}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, amount: e.target.value })
                                  }
                                  className="w-20 border rounded px-1 text-xs text-right"
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  value={editForm.description}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, description: e.target.value })
                                  }
                                  className="w-full border rounded px-1 text-xs max-w-[140px]"
                                />
                              </td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={saveEdit}
                                  className="text-xs text-green-700 font-semibold mr-2"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="text-xs text-gray-600"
                                >
                                  Cancel
                                </button>
                              </td>
                            </tr>
                          ) : (
                            <tr key={t._id} className="border-b border-gray-100">
                              <td className="py-2 px-2 whitespace-nowrap">
                                {t.date ? new Date(t.date).toLocaleDateString() : '—'}
                              </td>
                              <td className="py-2 px-2">{t.type}</td>
                              <td className="py-2 px-2">{t.category}</td>
                              <td className="py-2 px-2 text-right">
                                {Number(t.amount).toFixed(2)}
                              </td>
                              <td className="py-2 px-2 max-w-[160px] truncate">
                                {t.description || '—'}
                              </td>
                              <td className="py-2 px-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => startEdit(t)}
                                  className="text-xs text-[#073737] font-medium mr-2"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeRecord(t._id)}
                                  className="text-xs text-red-600 font-medium"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => loadTransactions(pagination.page - 1)}
                      className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} / {pagination.totalPages || 1} · {pagination.total}{' '}
                      records
                    </span>
                    <button
                      type="button"
                      disabled={pagination.page >= (pagination.totalPages || 1)}
                      onClick={() => loadTransactions(pagination.page + 1)}
                      className="px-3 py-1 text-sm bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

function UserRow({ user, onSave }) {
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status || 'Active');

  useEffect(() => {
    setRole(user.role);
    setStatus(user.status || 'Active');
  }, [user.role, user.status, user._id]);

  return (
    <tr className="border-b border-gray-100">
      <td className="py-2 px-3">{user.name}</td>
      <td className="py-2 px-3 text-gray-600">{user.email}</td>
      <td className="py-2 px-3">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
        >
          <option value="Viewer">Viewer</option>
          <option value="Analyst">Analyst</option>
          <option value="Admin">Admin</option>
        </select>
      </td>
      <td className="py-2 px-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </td>
      <td className="py-2 px-3">
        <button
          type="button"
          onClick={() => {
            const patch = {};
            if (role !== user.role) patch.role = role;
            if (status !== (user.status || 'Active')) patch.status = status;
            if (Object.keys(patch).length === 0) {
              toast('No changes to save');
              return;
            }
            onSave(user._id, patch);
          }}
          className="text-sm font-medium text-[#073737] hover:underline"
        >
          Save
        </button>
      </td>
    </tr>
  );
}

export default AdminDashboard;
