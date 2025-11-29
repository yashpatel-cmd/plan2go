import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut, updatePassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { formatUsdAsInr } from '../services/currency';
import { enrollMFA, disableMFA } from '../services/mfa';
import { auth } from '../firebase';
import UserLoginHistory from '../components/UserLoginHistory';
import { listBookings } from '../services/bookings';

const Profile: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage('Successfully logged out!');
      setMessageType('success');
      // Redirect to login page after successful logout
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Error signing out:', error);
      setMessage('Error logging out. Please try again.');
      setMessageType('error');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      setMessageType('error');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters!');
      setMessageType('error');
      return;
    }

    try {
      if (user) {
        await updatePassword(user, newPassword);
        setMessage('Password updated successfully!');
        setMessageType('success');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      setMessage('Error updating password: ' + error.message);
      setMessageType('error');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await updateProfile(user, {
          displayName: displayName || user.displayName,
          phoneNumber: phoneNumber || user.phoneNumber,
        });
        setMessage('Profile updated successfully!');
        setMessageType('success');
        setIsEditing(false);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile: ' + error.message);
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error.message}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  const [bookings, setBookings] = useState<any[]>([]);

  React.useEffect(() => {
    (async () => {
      const data = await listBookings();
      setBookings(data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                />
              )}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                  {user.displayName || 'User Profile'}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  User ID: {user.uid}
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => enrollMFA()} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Enable 2FA</button>
                <button onClick={() => disableMFA()} className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">Disable 2FA</button>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              Logout
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-4 p-4 rounded-lg ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Account Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Display Name</label>
                  <p className="text-gray-800">{user.displayName || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="text-gray-800">{user.phoneNumber || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email Verified</label>
                  <p className={`text-sm ${user.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                    {user.emailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Account Created</label>
                  <p className="text-gray-800">
                    {user.metadata.creationTime ? 
                      new Date(user.metadata.creationTime).toLocaleDateString() : 
                      'Unknown'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Sign In</label>
                  <p className="text-gray-800">
                    {user.metadata.lastSignInTime ? 
                      new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                      'Unknown'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="space-y-4">
              {/* Edit Profile */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder={user.displayName || 'Enter display name'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={user.phoneNumber || 'Enter phone number'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Change Password */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      New Password
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showNewPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-8 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking History</h3>
          {bookings.length === 0 ? (
            <p className="text-gray-600 text-sm">No bookings yet.</p>
          ) : (
            <div className="divide-y">
              {bookings.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{b.hotelName}</div>
                    <div className="text-sm text-gray-600">{b.location} • {b.checkIn} → {b.checkOut}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-700">{b.roomType}</div>
                    <div className="font-semibold">{formatUsdAsInr(b.totalPrice)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Login History */}
        <UserLoginHistory />
      </div>
    </div>
  );
};

export default Profile;
