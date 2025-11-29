import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";

export interface LoginActivity {
  id?: string;
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
    timezone?: string;
    latitude?: number;
    longitude?: number;
    accuracy?: string;
  };
}

export interface LoginStats {
  totalLogins: number;
  successfulLogins: number;
  failedLogins: number;
  uniqueUsers: number;
  loginMethods: {
    email: number;
    google: number;
    facebook: number;
    twitter: number;
  };
  recentActivities: LoginActivity[];
}

class LoginActivityService {
  private collectionName = 'loginActivities';

  /**
   * Log a login activity
   */
  async logLoginActivity(activity: Omit<LoginActivity, 'id' | 'timestamp'>): Promise<string> {
    try {
      // Clean the data to ensure no undefined values
      const cleanActivity = {
        userId: activity.userId || '',
        email: activity.email || '',
        loginMethod: activity.loginMethod,
        success: activity.success,
        errorMessage: activity.errorMessage || null, // Convert undefined to null
        ipAddress: activity.ipAddress || null,
        userAgent: activity.userAgent || null,
        sessionId: activity.sessionId || null,
        deviceInfo: activity.deviceInfo || null,
        location: activity.location || null,
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collectionName), cleanActivity);
      return docRef.id;
    } catch (error) {
      console.error('Error logging login activity:', error);
      throw error;
    }
  }

  /**
   * Get recent login activities for a user (simplified query)
   */
  async getUserLoginActivities(userId: string, limitCount: number = 10): Promise<LoginActivity[]> {
    try {
      // Use a simpler query that doesn't require composite index
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginActivity[];
      
      // Sort by timestamp in descending order (most recent first)
      return activities.sort((a, b) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching user login activities:', error);
      throw error;
    }
  }

  /**
   * Get all recent login activities (admin view) - simplified
   */
  async getAllLoginActivities(limitCount: number = 50): Promise<LoginActivity[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const activities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginActivity[];
      
      // Sort by timestamp in descending order (most recent first)
      return activities.sort((a, b) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0;
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching all login activities:', error);
      throw error;
    }
  }

  /**
   * Get login statistics
   */
  async getLoginStats(): Promise<LoginStats> {
    try {
      const activities = await this.getAllLoginActivities(1000);
      
      const stats: LoginStats = {
        totalLogins: activities.length,
        successfulLogins: activities.filter(a => a.success).length,
        failedLogins: activities.filter(a => !a.success).length,
        uniqueUsers: new Set(activities.map(a => a.userId)).size,
        loginMethods: {
          email: activities.filter(a => a.loginMethod === 'email').length,
          google: activities.filter(a => a.loginMethod === 'google').length,
          facebook: activities.filter(a => a.loginMethod === 'facebook').length,
          twitter: activities.filter(a => a.loginMethod === 'twitter').length,
        },
        recentActivities: activities.slice(0, 10)
      };

      return stats;
    } catch (error) {
      console.error('Error calculating login stats:', error);
      throw error;
    }
  }

  /**
   * Get device information from user agent
   */
  getDeviceInfo(userAgent: string) {
    const platform = this.getPlatform(userAgent);
    const browser = this.getBrowser(userAgent);
    const version = this.getBrowserVersion(userAgent);

    return {
      platform,
      browser,
      version
    };
  }

  private getPlatform(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getBrowserVersion(userAgent: string): string {
    const chromeMatch = userAgent.match(/Chrome\/(\d+\.\d+)/);
    if (chromeMatch) return chromeMatch[1];

    const firefoxMatch = userAgent.match(/Firefox\/(\d+\.\d+)/);
    if (firefoxMatch) return firefoxMatch[1];

    const safariMatch = userAgent.match(/Version\/(\d+\.\d+)/);
    if (safariMatch) return safariMatch[1];

    return 'Unknown';
  }

  /**
   * Generate a unique session ID
   */
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const loginActivityService = new LoginActivityService();
