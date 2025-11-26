import { matchingApi } from '@/lib/api';

export interface MatchResponse {
    request: any;
    matches: any[];
}

export const matchingService = {
    findMatches: async (requestId: string) => {
        const response = await matchingApi.post<MatchResponse>('/matches', { requestId });
        return response.data;
    },
};
