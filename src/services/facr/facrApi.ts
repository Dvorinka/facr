import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  SearchResponse,
  ClubInfo,
  Competition,
  SearchResult,
} from './types';

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Cache store
const cache = new Map<string, CacheItem<any>>();

// Create axios instance with base URL from environment variables
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_FACR_API_BASE_URL || 'http://localhost:8080/api/facr',
  timeout: parseInt(process.env.REACT_APP_FACR_API_TIMEOUT || '10000', 10),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for caching
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip cache for non-GET requests
    if (config.method?.toLowerCase() !== 'get') {
      return config;
    }

    // Generate a cache key based on the request
    const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.params)}`;
    
    // Check if we have a cached response
    const cached = cache.get(cacheKey);
    const now = Date.now();
    const cacheTtl = parseInt(process.env.REACT_APP_FACR_CACHE_TTL || '3600000', 10);
    
    if (cached && now - cached.timestamp < cacheTtl) {
      // Return cached response
      return {
        ...config,
        adapter: () => Promise.resolve({
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }),
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for caching successful responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const method = response.config.method?.toLowerCase();
    const url = response.config.url;
    const params = response.config.params;
    
    // Only cache GET requests
    if (method === 'get') {
      const cacheKey = `${method}:${url}:${JSON.stringify(params)}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorData = error.response.data || {};
    const errorMessage = errorData.message || 'API request failed';
    console.error('API Error Response:', errorData);
    throw new Error(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error: No response received', error.request);
    throw new Error('No response from server. Please check if the FACR scraper API is running.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error:', error.message);
    throw new Error(`API request failed: ${error.message}`);
  }
};

// FACR API client
export const facrApi = {
  // Search for clubs
  searchClubs: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await apiClient.get<SearchResponse>('/club/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get club details and matches
  getClub: async (clubId: string, clubType: 'football' | 'futsal' = 'football'): Promise<ClubInfo> => {
    try {
      const response = await apiClient.get<ClubInfo>(`/club/${clubType}/${clubId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get club table (standings)
  getClubTable: async (clubId: string, clubType: 'football' | 'futsal' = 'football'): Promise<ClubInfo> => {
    try {
      const response = await apiClient.get<ClubInfo>(`/club/${clubType}/${clubId}/table`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Clear cache
  clearCache: (): void => {
    cache.clear();
  },

  // Get all competitions for a club
  getClubCompetitions: async (clubId: string, clubType: 'football' | 'futsal' = 'football'): Promise<Competition[]> => {
    try {
      const clubInfo = await facrApi.getClub(clubId, clubType);
      return clubInfo.competitions || [];
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get matches for a specific competition
  getCompetitionMatches: async (competitionId: string): Promise<any[]> => {
    try {
      // Note: This assumes the competition ID is in the format 'type/id'
      const [type, id] = competitionId.split('/');
      const response = await apiClient.get<ClubInfo>(`/club/${type}/${id}`);
      // Find the specific competition and return its matches
      const competition = response.data.competitions?.find(c => c.id === competitionId);
      return competition?.matches || [];
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default facrApi;
