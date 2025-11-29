// Test file for login activity service
// This file can be deleted after testing

import { loginActivityService } from './services/loginActivity';

// Test function to verify the service works
export const testLoginActivity = async () => {
  try {
    console.log('Testing login activity service...');
    
    // Test device info parsing
    const testUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    const deviceInfo = loginActivityService.getDeviceInfo(testUserAgent);
    console.log('Device info:', deviceInfo);
    
    // Test session ID generation
    const sessionId = loginActivityService.generateSessionId();
    console.log('Session ID:', sessionId);
    
    console.log('Login activity service test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Uncomment the line below to run the test
// testLoginActivity();
