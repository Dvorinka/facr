import { useState, useCallback } from 'react';
import {
  SearchResponse,
  ClubInfo,
  Competition,
  Match,
} from '../services/facr/types';
import facrApi from '../services/facr/facrApi';

interface UseFacrApiReturn {
  // Search for clubs by query
  searchClubs: (query: string) => Promise<SearchResponse>;
  searchResults: SearchResponse['results'] | [];
  searchLoading: boolean;
  searchError: Error | null;
  
  // Get club details by ID and type
  getClub: (clubId: string, clubType?: 'football' | 'futsal') => Promise<ClubInfo>;
  
  // Get club table/standings by ID and type
  getClubTable: (clubId: string, clubType?: 'football' | 'futsal') => Promise<ClubInfo>;
  
  // Get all competitions for a club
  getClubCompetitions: (clubId: string, clubType?: 'football' | 'futsal') => Promise<Competition[]>;
  
  // Get matches for a specific competition
  getCompetitionMatches: (competitionId: string) => Promise<Match[]>;
  
  // Clear the API cache
  clearCache: () => void;
  
  // Loading state
  loading: boolean;
  
  // Error state
  error: Error | null;
}

export const useFacrApi = (): UseFacrApiReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResponse['results']>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  const handleApiCall = useCallback(
    async <T>(apiCall: () => Promise<T>): Promise<T> => {
      setLoading(true);
      setError(null);
      try {
        return await apiCall();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchClubs = useCallback(
    async (query: string): Promise<SearchResponse> => {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const response = await handleApiCall(() => facrApi.searchClubs(query));
        setSearchResults(response.results || []);
        return response;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to search clubs');
        setSearchError(error);
        throw error;
      } finally {
        setSearchLoading(false);
      }
    },
    [handleApiCall]
  );

  const getClub = useCallback(
    (clubId: string, clubType: 'football' | 'futsal' = 'football'): Promise<ClubInfo> =>
      handleApiCall(() => facrApi.getClub(clubId, clubType)),
    [handleApiCall]
  );

  const getClubTable = useCallback(
    (clubId: string, clubType: 'football' | 'futsal' = 'football'): Promise<ClubInfo> =>
      handleApiCall(() => facrApi.getClubTable(clubId, clubType)),
    [handleApiCall]
  );

  const getClubCompetitions = useCallback(
    (clubId: string, clubType: 'football' | 'futsal' = 'football'): Promise<Competition[]> =>
      handleApiCall(() => facrApi.getClubCompetitions(clubId, clubType)),
    [handleApiCall]
  );

  const getCompetitionMatches = useCallback(
    (competitionId: string): Promise<Match[]> =>
      handleApiCall(() => facrApi.getCompetitionMatches(competitionId)),
    [handleApiCall]
  );

  const clearCache = useCallback(() => {
    facrApi.clearCache();
  }, []);

  return {
    searchClubs,
    searchResults,
    searchLoading,
    searchError,
    getClub,
    getClubTable,
    getClubCompetitions,
    getCompetitionMatches,
    clearCache,
    loading,
    error,
  };
};

export default useFacrApi;
