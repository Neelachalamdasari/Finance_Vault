import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const AnalystDashboard = () => {
  const [activeView, setActiveView] = useState('summary');
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [orgStats, setOrgStats] = useState(null);

  const loadSummary = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setSummary(res.data.data || null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Could not load summary.');
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
      console.error(err);
      toast.error(err.response?.data?.msg || 'Could not load records.');
    }
    setRecordsLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadSummary();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (activeView === 'records') loadTransactions(1);
  }, [activeView]);

  useEffect(() => {
    if (activeView !== 'org') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/analytics/admin');
        if (!cancelled) setOrgStats(res.data.data || null);
      } catch (err) {
        if (!cancelled) toast.error(err.response?.data?.msg || 'Could not load org analytics.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeView]);

  const applyFilters = (e) => {
    e.preventDefault();
    loadTransactions(1);
  };

  if (loading) {
    return (
      <div className="p-8 bg-[#073737] min-h-[91.4vh] text-[#FDFFD4]">
        Loading analyst workspace…
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#073737] min-h-[91.4vh]">
      <h1 className="text-3xl font-bold text-[#FDFFD4] mb-2">Analyst Dashboard</h1>
      {/* <p className="text-[#FDFFD4]/80 mb-8 text-sm">
        View and analyze financial records and summaries. Creating or editing records requires an Admin.
      </p> */}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-56 bg-[#FDFFD4] p-4 rounded-lg shadow border border-gray-200 flex-shrink-0">
          <nav className="space-y-0">
            <button
              type="button"
              onClick={() => setActiveView('summary')}
              className={`w-full text-left p-3 font-semibold border-b border-gray-300 ${
                activeView === 'summary' ? 'bg-teal-50 text-[#073737]' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Insights
            </button>
            <button
              type="button"
              onClick={() => setActiveView('records')}
              className={`w-full text-left p-3 font-semibold border-b border-gray-300 ${
                activeView === 'records' ? 'bg-teal-50 text-[#073737]' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Records
            </button>
            <button
              type="button"
              onClick={() => setActiveView('org')}
              className={`w-full text-left p-3 font-semibold ${
                activeView === 'org' ? 'bg-teal-50 text-[#073737]' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Team stats
            </button>
          </nav>
        </aside>

        <main className="flex-1 w-full space-y-8">
          {activeView === 'summary' && summary && (
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

              <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                <h2 className="text-xl font-bold text-[#073737] mb-4">Recent activity</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-700">
                    <thead className="text-xs uppercase bg-gray-100">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(summary.recentActivity || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            No recent entries.
                          </td>
                        </tr>
                      ) : (
                        (summary.recentActivity || []).map((row) => (
                          <tr key={row._id} className="border-b border-gray-100">
                            <td className="py-2 px-3 whitespace-nowrap">
                              {row.date ? new Date(row.date).toLocaleDateString() : '—'}
                            </td>
                            <td className="py-2 px-3">{row.type}</td>
                            <td className="py-2 px-3">{row.category}</td>
                            <td className="py-2 px-3 text-right">{Number(row.amount).toFixed(2)}</td>
                            <td className="py-2 px-3 max-w-xs truncate">{row.description || '—'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                  <h2 className="text-xl font-bold text-[#073737] mb-4">Category totals</h2>
                  <div className="overflow-x-auto max-h-56 overflow-y-auto">
                    <table className="w-full text-sm text-gray-700">
                      <thead className="text-xs uppercase bg-gray-100 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Category</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(summary.categoryTotals || []).map((row, i) => (
                          <tr key={`${row.category}-${row.type}-${i}`} className="border-b border-gray-100">
                            <td className="py-2 px-3">{row.category}</td>
                            <td className="py-2 px-3">{row.type}</td>
                            <td className="py-2 px-3 text-right">{Number(row.total).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
                  <h2 className="text-xl font-bold text-[#073737] mb-4">Monthly trends</h2>
                  <div className="overflow-x-auto max-h-56 overflow-y-auto">
                    <table className="w-full text-sm text-gray-700">
                      <thead className="text-xs uppercase bg-gray-100 sticky top-0">
                        <tr>
                          <th className="py-2 px-3">Period</th>
                          <th className="py-2 px-3 text-right">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(summary.monthlyTrends || []).map((row) => (
                          <tr key={row.period} className="border-b border-gray-100">
                            <td className="py-2 px-3">{row.period}</td>
                            <td className="py-2 px-3 text-right">{Number(row.net).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeView === 'org' && !orgStats && (
            <div className="bg-[#FDFFD4] p-8 rounded-lg text-gray-600">Loading organization stats…</div>
          )}

          {activeView === 'org' && orgStats && (
            <div className="bg-[#FDFFD4] p-8 rounded-lg shadow border border-gray-200">
              <h2 className="text-2xl font-bold text-[#073737] mb-6">Organization overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-600">Viewers</p>
                  <p className="text-2xl font-bold text-gray-900">{orgStats.byRole?.Viewer ?? 0}</p>
                </div>
                <div className="p-4 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-600">Analysts</p>
                  <p className="text-2xl font-bold text-gray-900">{orgStats.byRole?.Analyst ?? 0}</p>
                </div>
                <div className="p-4 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{orgStats.byRole?.Admin ?? 0}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Active: {orgStats.byStatus?.Active ?? 0} · Inactive:{' '}
                {orgStats.byStatus?.Inactive ?? 0}
              </p>
            </div>
          )}

          {activeView === 'records' && (
            <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
              <h2 className="text-2xl font-bold text-[#073737] mb-4">Financial records</h2>
              <form onSubmit={applyFilters} className="flex flex-wrap gap-3 mb-6 items-end">
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
                    className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-40"
                    placeholder="e.g. Travel"
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
                  className="px-4 py-2 bg-[#073737] text-white rounded-md text-sm font-medium hover:bg-[#0a4f4f]"
                >
                  Apply filters
                </button>
              </form>

              {recordsLoading ? (
                <p className="text-gray-600">Loading…</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                      <thead className="text-xs uppercase bg-gray-100">
                        <tr>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Category</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                          <th className="py-2 px-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-500">
                              No records match your filters.
                            </td>
                          </tr>
                        ) : (
                          transactions.map((t) => (
                            <tr key={t._id} className="border-b border-gray-100">
                              <td className="py-2 px-3 whitespace-nowrap">
                                {t.date ? new Date(t.date).toLocaleDateString() : '—'}
                              </td>
                              <td className="py-2 px-3">{t.type}</td>
                              <td className="py-2 px-3">{t.category}</td>
                              <td className="py-2 px-3 text-right">{Number(t.amount).toFixed(2)}</td>
                              <td className="py-2 px-3 max-w-xs truncate">{t.description || '—'}</td>
                            </tr>
                          ))
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
                      Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total}{' '}
                      total)
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

export default AnalystDashboard;

