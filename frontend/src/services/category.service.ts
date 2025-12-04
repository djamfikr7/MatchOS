import { requestApi } from '@/lib/api';

export interface Category {
    id: string;
    name: string;
    slug: string;
    type: string;
    form_schema?: {
        fields: Array<{
            name: string;
            type: string;
            label: string;
            required?: boolean;
            options?: string[];
        }>;
    };
    ui_config?: any;
}

export const categoryService = {
    getAll: async () => {
        const response = await requestApi.get<Category[]>('/categories');
        return response.data;
    },

    getOne: async (slug: string) => {
        const response = await requestApi.get<Category>(`/categories/${slug}`);
        return response.data;
    },
};
