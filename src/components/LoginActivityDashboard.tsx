import React, { useState, useEffect } from 'react';
import { loginActivityService, LoginActivity, LoginStats } from '../services/loginActivity';

const LoginActivityDashboard: React.FC = () => {
  const [stats, setStats] = useState<LoginStats | null>(null);
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        loginActivityService.getLoginStats(),
        loginActivityService.getAllLoginActivities(20)
      ]);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      setError('Failed to load login activity data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getMethodColor = (method: string) => {
    const colors: { [key: string]: string } = {
      email: 'bg-blue-100 text-blue-800',
      google: 'bg-red-100 text-red-800',
      facebook: 'bg-blue-100 text-blue-800',
      twitter: 'bg-sky-100 text-sky-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading login activities...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Login Activity Dashboard</h2>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Logins</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.totalLogins}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Successful</h3>
            <p className="text-2xl font-bold text-green-900">{stats.successfulLogins}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-600">Failed</h3>
            <p className="text-2xl font-bold text-red-900">{stats.failedLogins}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Unique Users</h3>
            <p className="text-2xl font-bold text-purple-900">{stats.uniqueUsers}</p>
          </div>
        </div>
      )}

      {/* Login Methods Chart */}
      {stats && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Login Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.loginMethods).map(([method, count]) => (
              <div key={method} className="bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between">
                  <span className="capitalize font-medium">{method}</span>
                  <span className="text-lg font-bold">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activities Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Login Activities</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div>
                      <div className="font-medium text-gray-900">{activity.email}</div>
                      <div className="text-sm text-gray-500">ID: {activity.userId.slice(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(activity.loginMethod)}`}>
                      {activity.loginMethod}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.success)}`}>
                      {activity.success ? 'Success' : 'Failed'}
                    </span>
                    {!activity.success && activity.errorMessage && (
                      <div className="text-xs text-red-600 mt-1">{activity.errorMessage}</div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm">
                      <div>{activity.deviceInfo?.platform || 'Unknown'}</div>
                      <div className="text-gray-500">{activity.deviceInfo?.browser || 'Unknown'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="text-sm">
                      <div>{activity.location?.city || 'Unknown'}</div>
                      <div className="text-gray-500">{activity.location?.country || 'Unknown'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {formatDate(activity.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LoginActivityDashboard;
