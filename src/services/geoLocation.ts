/**
 * Enhanced utility functions for getting accurate IP address and location information
 */

export interface LocationInfo {
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: string;
}

/**
 * Get user's IP address and location information using multiple services for better accuracy
 */
export async function getLocationInfo(): Promise<LocationInfo> {
  try {
    // Try multiple services for better accuracy
    const services = [
      'https://ipapi.co/json/',
      'https://ipinfo.io/json',
      'https://api.ipgeolocation.io/ipgeo?apiKey=free'
    ];

    for (const service of services) {
      try {
        const response = await fetch(service, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          timeout: 5000 // 5 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Normalize data from different services
          const locationInfo = normalizeLocationData(data, service);
          
          if (locationInfo.city && locationInfo.country) {
            console.log('Location detected:', locationInfo);
            return locationInfo;
          }
        }
      } catch (error) {
        console.warn(`Location service ${service} failed:`, error);
        continue;
      }
    }

    // Fallback to basic IP detection
    return await getFallbackLocation();
    
  } catch (error) {
    console.error('Error fetching location info:', error);
    return await getFallbackLocation();
  }
}

/**
 * Normalize location data from different services
 */
function normalizeLocationData(data: any, service: string): LocationInfo {
  const locationInfo: LocationInfo = {
    ip: 'Unknown',
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    timezone: 'Unknown'
  };

  if (service.includes('ipapi.co')) {
    return {
      ip: data.ip || 'Unknown',
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      latitude: data.latitude,
      longitude: data.longitude
    };
  } else if (service.includes('ipinfo.io')) {
    return {
      ip: data.ip || 'Unknown',
      country: data.country || 'Unknown',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      timezone: data.timezone || 'Unknown',
      latitude: data.loc ? parseFloat(data.loc.split(',')[0]) : undefined,
      longitude: data.loc ? parseFloat(data.loc.split(',')[1]) : undefined
    };
  } else if (service.includes('ipgeolocation.io')) {
    return {
      ip: data.ip || 'Unknown',
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      region: data.state_prov || 'Unknown',
      timezone: data.time_zone?.name || 'Unknown',
      latitude: data.latitude,
      longitude: data.longitude
    };
  }

  return locationInfo;
}

/**
 * Get fallback location using browser's geolocation API (more accurate)
 */
async function getFallbackLocation(): Promise<LocationInfo> {
  try {
    // Try browser's geolocation API first (most accurate)
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get city/country
      const reverseGeocodeResult = await reverseGeocode(latitude, longitude);
      
      return {
        ip: await getFallbackIP(),
        country: reverseGeocodeResult.country || 'Unknown',
        city: reverseGeocodeResult.city || 'Unknown',
        region: reverseGeocodeResult.region || 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown',
        latitude,
        longitude,
        accuracy: `${Math.round(position.coords.accuracy)}m`
      };
    }
  } catch (error) {
    console.warn('Geolocation API failed:', error);
  }

  // Final fallback
  return {
    ip: await getFallbackIP(),
    country: 'Unknown',
    city: 'Unknown',
    region: 'Unknown',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
  };
}

/**
 * Reverse geocoding to get city/country from coordinates
 */
async function reverseGeocode(latitude: number, longitude: number): Promise<{city: string, country: string, region: string}> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (response.ok) {
      const data = await response.json();
      return {
        city: data.city || data.locality || 'Unknown',
        country: data.countryName || 'Unknown',
        region: data.principalSubdivision || 'Unknown'
      };
    }
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
  }

  return {
    city: 'Unknown',
    country: 'Unknown',
    region: 'Unknown'
  };
}

/**
 * Get a fallback IP address using a different service
 */
export async function getFallbackIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || 'Unknown';
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'Unknown';
  }
}

/**
 * Get more detailed location information with accuracy rating
 */
export async function getDetailedLocationInfo(): Promise<LocationInfo & {accuracy: string, method: string}> {
  const locationInfo = await getLocationInfo();
  
  let accuracy = 'Low';
  let method = 'IP-based';
  
  if (locationInfo.latitude && locationInfo.longitude) {
    accuracy = 'High';
    method = 'GPS + IP';
  } else if (locationInfo.city !== 'Unknown' && locationInfo.country !== 'Unknown') {
    accuracy = 'Medium';
    method = 'IP-based';
  }

  return {
    ...locationInfo,
    accuracy,
    method
  };
}
