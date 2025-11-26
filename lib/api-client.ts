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
