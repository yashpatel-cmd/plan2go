# Login Activity Tracking System

This system provides comprehensive tracking of all user login activities in your Plan2Go application.

## Features

### 📊 **Comprehensive Activity Logging**
- Tracks all login attempts (successful and failed)
- Records login method (email/password, Google, etc.)
- Captures device information (platform, browser, version)
- Logs IP address and location data
- Generates unique session IDs
- Records timestamps for all activities

### 🔍 **Admin Dashboard**
- View all login activities across all users
- Real-time statistics and analytics
- Filter by login method, success status, and time
- Device and location information display
- Export capabilities for reporting

### 👤 **User Profile**
- Users can view their own login history
- Personal activity tracking
- Device and location information
- Recent login attempts

## Database Structure

### Firestore Collections

#### `loginActivities`
```typescript
{
  id: string;
  userId: string;
  email: string;
  loginMethod: 'email' | 'google' | 'facebook' | 'twitter';
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Timestamp;
  sessionId?: string;
  deviceInfo?: {
    platform: string;
    browser: string;
    version: string;
  };
  location?: {
    country?: string;
    city?: string;
    region?: string;
  };
}
```

## Files Created/Modified

### New Files:
- `src/services/loginActivity.ts` - Core service for login activity management
- `src/services/geoLocation.ts` - Utility for IP and location detection
- `src/components/LoginActivityDashboard.tsx` - Admin dashboard component
- `src/components/UserLoginHistory.tsx` - User login history component
- `src/pages/Admin.tsx` - Admin page
- `src/pages/Profile.tsx` - User profile page

### Modified Files:
- `src/pages/Login.tsx` - Added activity logging
- `src/pages/LoginwithGoogle.tsx` - Added activity logging
- `src/App.tsx` - Added admin and profile routes

## Usage

### For Admins:
1. Navigate to `/admin` to view the admin dashboard
2. View comprehensive statistics and recent activities
3. Monitor login patterns and security

### For Users:
1. Navigate to `/profile` to view personal login history
2. See your recent login attempts and device information
3. Monitor account security

### For Developers:
```typescript
import { loginActivityService } from './services/loginActivity';

// Log a login activity
await loginActivityService.logLoginActivity({
  userId: 'user123',
  email: 'user@example.com',
  loginMethod: 'email',
  success: true,
  // ... other properties
});

// Get user activities
const activities = await loginActivityService.getUserLoginActivities('user123');

// Get statistics
const stats = await loginActivityService.getLoginStats();
```

## Security Considerations

1. **IP Address Logging**: IP addresses are logged for security purposes
2. **Location Data**: Approximate location is captured for security monitoring
3. **Error Messages**: Failed login attempts include error details
4. **Session Tracking**: Unique session IDs help track user sessions
5. **Device Fingerprinting**: Browser and device information for security

## Privacy Compliance

- Users can view their own login history
- Location data is approximate (city/country level)
- No sensitive personal data is stored beyond what's necessary for security
- Consider implementing data retention policies for compliance

## API Endpoints Used

- **IP Geolocation**: `https://ipapi.co/json/` (primary)
- **Fallback IP**: `https://api.ipify.org?format=json` (backup)

## Dependencies Added

- `react-firebase-hooks` - For Firebase authentication hooks

## Future Enhancements

1. **Real-time Notifications**: Alert on suspicious login patterns
2. **Geofencing**: Block logins from unexpected locations
3. **Device Management**: Allow users to manage trusted devices
4. **Export Features**: CSV/PDF export for reporting
5. **Advanced Analytics**: Machine learning for anomaly detection
6. **Two-Factor Authentication**: Integration with 2FA systems

## Setup Instructions

1. Ensure Firebase is properly configured
2. Install dependencies: `npm install react-firebase-hooks`
3. Update Firebase security rules to allow read/write to `loginActivities` collection
4. Deploy and test the system

## Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read their own login activities
    match /loginActivities/{activityId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Allow admins to read all activities (implement your admin check)
    match /loginActivities/{activityId} {
      allow read, write: if request.auth != null && 
        isAdmin(request.auth.uid);
    }
  }
}
```

This system provides a robust foundation for login activity tracking and security monitoring in your application.
