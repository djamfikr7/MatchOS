import { requestApi } from '@/lib/api';
import { z } from 'zod';

export const createRequestSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    location: z.string().min(2),
    budget: z.coerce.number().positive(),
});

export type CreateRequestData = z.infer<typeof createRequestSchema>;

export interface Request {
    id: string;
    title: string;
    description: string;
    location: string;
    budget: number;
    status: string;
    userId: string;
    createdAt: string;
    campaign_status?: {
        status: string;
        platforms?: string[];
        error?: string;
    };
}

export const requestService = {
    create: async (data: CreateRequestData & { userId: string }) => {
        const response = await requestApi.post('/requests', data);
        return response.data;
    },

    getAll: async () => {
        const response = await requestApi.get<Request[]>('/requests');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await requestApi.get<Request>(`/requests/${id}`);
        return response.data;
    },
};
