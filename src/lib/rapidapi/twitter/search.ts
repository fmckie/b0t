import axios from 'axios';

/**
 * Twitter Search API via RapidAPI
 *
 * Host: twitter-api47.p.rapidapi.com
 * Endpoint: /v3/search
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'twitter-api47.p.rapidapi.com';

interface SearchParams {
  query: string;
  type?: 'Top' | 'Latest' | 'People' | 'Photos' | 'Videos';
}

interface SearchResponse {
  // Add proper types based on actual API response
  results: unknown[];
  next_cursor?: string;
}

export async function searchTwitter(params: SearchParams): Promise<SearchResponse> {
  if (!RAPIDAPI_KEY) {
    throw new Error('RAPIDAPI_KEY not set in environment variables');
  }

  const options = {
    method: 'GET',
    url: `https://${API_HOST}/v3/search`,
    params: {
      query: params.query,
      type: params.type || 'Top',
    },
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': API_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Twitter Search API Error:', {
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    throw error;
  }
}
