import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { loginActivityService, LoginActivity } from '../services/loginActivity';

const UserLoginHistory: React.FC = () => {
  const [user] = useAuthState(auth);
  const [activities, setActivities] = useState<LoginActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserActivities();
    }
  }, [user]);

  const loadUserActivities = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const userActivities = await loginActivityService.getUserLoginActivities(user.uid, 20);
      setActivities(userActivities);
    } catch (err: any) {
      console.error('Error loading user activities:', err);
      setError('Failed to load login history. This might be due to Firestore security rules. Please check the console for details.');
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

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please log in to view your login history.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading your login history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Error loading login history</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={loadUserActivities}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Login History</h2>
        <button
          onClick={loadUserActivities}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No login activities found.</p>
          <p className="text-sm text-gray-500 mt-2">
            Your login activities will appear here after you log in and out.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
      )}
    </div>
  );
};

export default UserLoginHistory;
