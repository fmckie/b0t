import axios, { AxiosRequestConfig } from 'axios';

/**
 * RapidAPI Client
 *
 * Generic client for making requests to RapidAPI endpoints
 * Add your RapidAPI key to .env.local as RAPIDAPI_KEY
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

if (!RAPIDAPI_KEY) {
  console.warn('⚠️  RAPIDAPI_KEY not set. RapidAPI calls will fail.');
}

/**
 * Make a RapidAPI request
 *
 * @param host - The RapidAPI host (e.g., 'twitter-api45.p.rapidapi.com')
 * @param endpoint - The API endpoint path (e.g., '/timeline.php')
 * @param method - HTTP method
 * @param params - Query parameters
 * @param data - Request body
 */
export async function rapidApiRequest<T = unknown>(
  host: string,
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  params?: Record<string, string | number | boolean>,
  data?: Record<string, unknown>
): Promise<T> {
  const config: AxiosRequestConfig = {
    method,
    url: `https://${host}${endpoint}`,
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': host,
    },
    params,
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('RapidAPI Error:', {
        status: error.response?.status,
        data: error.response?.data,
        host,
        endpoint,
      });
    }
    throw error;
  }
}

/**
 * Example: Twitter API via RapidAPI
 */
export async function getRapidApiTwitterTimeline(username: string) {
  return rapidApiRequest(
    'twitter-api45.p.rapidapi.com',
    '/timeline.php',
    'GET',
    { screenname: username }
  );
}

/**
 * Example: Instagram API via RapidAPI
 */
export async function getRapidApiInstagramProfile(username: string) {
  return rapidApiRequest(
    'instagram-scraper-api2.p.rapidapi.com',
    '/v1/info',
    'GET',
    { username_or_id_or_url: username }
  );
}

/**
 * Example: YouTube API via RapidAPI
 */
export async function getRapidApiYouTubeComments(videoId: string) {
  return rapidApiRequest(
    'youtube-v31.p.rapidapi.com',
    '/commentThreads',
    'GET',
    {
      part: 'snippet',
      videoId,
      maxResults: 100,
    }
  );
}

// Export the base request function for custom API calls
export { rapidApiRequest as rapidApi };
