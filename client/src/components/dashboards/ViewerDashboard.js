import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import toast from 'react-hot-toast';

const ViewerDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/summary');
      setSummary(res.data.data || null);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || 'Could not load dashboard.');
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-[#073737] min-h-[91.4vh] text-[#FDFFD4]">
        Loading dashboard…
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-8 bg-[#073737] min-h-[91.4vh] text-[#FDFFD4]">
        No summary data available.
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#073737] min-h-[91.4vh]">
      <h1 className="text-3xl font-bold text-[#FDFFD4] mb-2">Viewer Dashboard</h1>
      <p className="text-[#FDFFD4]/80 mb-8 text-sm">
        Read-only financial overview. You cannot view individual records or change data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-sm font-semibold text-[#073737] uppercase tracking-wide">
            Total income
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Number(summary.totalIncome).toFixed(2)}
          </p>
        </div>
        <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-sm font-semibold text-[#073737] uppercase tracking-wide">
            Total expenses
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Number(summary.totalExpenses).toFixed(2)}
          </p>
        </div>
        <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-sm font-semibold text-[#073737] uppercase tracking-wide">
            Net balance
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Number(summary.netBalance).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-bold text-[#073737] mb-4">By category</h2>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-700">
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
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="text-xs uppercase bg-gray-100 sticky top-0">
                <tr>
                  <th className="py-2 px-3">Period</th>
                  <th className="py-2 px-3 text-right">Income</th>
                  <th className="py-2 px-3 text-right">Expenses</th>
                  <th className="py-2 px-3 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {(summary.monthlyTrends || []).map((row) => (
                  <tr key={row.period} className="border-b border-gray-100">
                    <td className="py-2 px-3">{row.period}</td>
                    <td className="py-2 px-3 text-right">{Number(row.income).toFixed(2)}</td>
                    <td className="py-2 px-3 text-right">{Number(row.expenses).toFixed(2)}</td>
                    <td className="py-2 px-3 text-right">{Number(row.net).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-[#FDFFD4] p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold text-[#073737] mb-4">This week (by day)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="py-2 px-3">Day (1=Sun)</th>
                <th className="py-2 px-3 text-right">Income</th>
                <th className="py-2 px-3 text-right">Expenses</th>
                <th className="py-2 px-3 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {(summary.weeklyTrends || []).map((row) => (
                <tr key={row.dayOfWeek} className="border-b border-gray-100">
                  <td className="py-2 px-3">{row.dayOfWeek}</td>
                  <td className="py-2 px-3 text-right">{Number(row.income).toFixed(2)}</td>
                  <td className="py-2 px-3 text-right">{Number(row.expenses).toFixed(2)}</td>
                  <td className="py-2 px-3 text-right">{Number(row.net).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;
