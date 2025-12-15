import { createClient } from "./supabase/server";

export class ApiError extends Error {
    constructor(
        message: string,
        public code: string,
        public status?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export async function handleApiError(error: unknown): Promise<never> {
    if (error instanceof ApiError) {
        throw error;
    }

    if (error instanceof Error) {
        // Network errors
        if (error.message.includes('Failed to fetch')) {
            throw new ApiError(
                'Network error. Please check your connection.',
                'NETWORK_ERROR'
            );
        }

        throw new ApiError(error.message, 'UNKNOWN_ERROR');
    }

    throw new ApiError('An unexpected error occurred', 'UNKNOWN_ERROR');
}

const API_BASE_URL = process.env.NEXT_PUBLIC_PULSEBOARD_API_URL || process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:3001";

export class WorkerAPI {
    private static async getHeaders() {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            throw new ApiError("Unauthorized", "UNAUTHORIZED", 401);
        }

        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
        };
    }

    private static async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        const headers = await this.getHeaders();
        const url = `${API_BASE_URL}${path}`;
        const method = options.method || 'GET';

        console.log(`[WorkerAPI] Requesting: ${method} ${url}`);
        console.log(`[WorkerAPI] Base URL: ${API_BASE_URL}`);

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new ApiError(
                    errorData.error || "API Request Failed",
                    "API_ERROR",
                    response.status,
                    errorData
                );
            }

            // For 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            return handleApiError(error);
        }
    }

    // Endpoints
    static async getEndpoints() {
        return this.request<any[]>("/api/endpoints");
    }

    static async createEndpoint(data: any) {
        return this.request<any>("/api/endpoints", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    static async getEndpoint(id: string) {
        return this.request<any>(`/api/endpoints/${id}`);
    }

    static async updateEndpoint(id: string, data: any) {
        return this.request<any>(`/api/endpoints/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    static async deleteEndpoint(id: string) {
        return this.request<{ success: boolean }>(`/api/endpoints/${id}`, {
            method: "DELETE",
        });
    }

    static async triggerCheck(id: string) {
        return this.request<{ success: boolean; message: string }>(`/api/endpoints/${id}/check-now`, {
            method: "POST",
        });
    }

    // Checks & Stats
    static async getChecks(endpointId: string, limit = 50, offset = 0) {
        return this.request<any[]>(`/api/endpoints/${endpointId}/checks?limit=${limit}&offset=${offset}`);
    }

    static async getStats(endpointId: string) {
        return this.request<any>(`/api/endpoints/${endpointId}/stats`);
    }

    // Notifications
    static async getNotifications(limit = 50) {
        return this.request<any[]>(`/api/notifications?limit=${limit}`);
    }
}

