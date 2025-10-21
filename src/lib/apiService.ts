import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiEndpoint {
    id: string;
    name: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: string;
}

export interface ApiResponse {
    data: any;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

export interface ApiError {
    message: string;
    status?: number;
    statusText?: string;
    data?: any;
}

/**
 * API Service for making HTTP requests
 * Handles different HTTP methods, headers, and error handling
 */
export class ApiService {
    private static instance: ApiService;
    private axiosInstance = axios.create({
        timeout: 10000, // 10 second timeout
        headers: {
            'Content-Type': 'application/json',
        },
    });

    private constructor() {
        // Add request interceptor for logging
        this.axiosInstance.interceptors.request.use(
            (config) => {
                console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
                if (config.headers) {
                    console.log('📋 Headers:', config.headers);
                }
                if (config.data) {
                    console.log('📦 Body:', config.data);
                }
                return config;
            },
            (error) => {
                console.error('❌ Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for logging
        this.axiosInstance.interceptors.response.use(
            (response) => {
                console.log(`✅ API Response: ${response.status} ${response.statusText}`);
                console.log('📊 Response Data:', response.data);
                return response;
            },
            (error) => {
                console.error('❌ Response Error:', error.response?.status, error.response?.statusText);
                console.error('📊 Error Data:', error.response?.data);
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    /**
     * Make an API request based on endpoint configuration
     */
    public async makeRequest(endpoint: ApiEndpoint): Promise<ApiResponse> {
        try {
            const config: AxiosRequestConfig = {
                method: endpoint.method,
                url: endpoint.url,
                headers: endpoint.headers || {},
            };

            // Add body for POST/PUT requests
            if (endpoint.body && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
                try {
                    config.data = JSON.parse(endpoint.body);
                } catch (parseError) {
                    throw new Error(`Invalid JSON in request body: ${parseError}`);
                }
            }

            const response: AxiosResponse = await this.axiosInstance.request(config);

            return {
                data: response.data,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers as Record<string, string>,
            };
        } catch (error: any) {
            const apiError: ApiError = {
                message: error.message || 'Unknown error occurred',
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
            };

            console.error(`❌ API Error for ${endpoint.name}:`, apiError);
            throw apiError;
        }
    }

    /**
     * Make multiple API requests in parallel
     */
    public async makeMultipleRequests(endpoints: ApiEndpoint[]): Promise<Record<string, ApiResponse | ApiError>> {
        const results: Record<string, ApiResponse | ApiError> = {};

        const promises = endpoints.map(async (endpoint) => {
            try {
                const response = await this.makeRequest(endpoint);
                results[endpoint.name] = response;
            } catch (error) {
                results[endpoint.name] = error as ApiError;
            }
        });

        await Promise.allSettled(promises);
        return results;
    }

    /**
     * Validate endpoint configuration
     */
    public validateEndpoint(endpoint: Partial<ApiEndpoint>): string[] {
        const errors: string[] = [];

        if (!endpoint.name?.trim()) {
            errors.push('Endpoint name is required');
        }

        if (!endpoint.url?.trim()) {
            errors.push('URL is required');
        } else {
            try {
                new URL(endpoint.url);
            } catch {
                errors.push('Invalid URL format');
            }
        }

        if (!endpoint.method) {
            errors.push('HTTP method is required');
        }

        if (endpoint.body && (endpoint.method === 'POST' || endpoint.method === 'PUT')) {
            try {
                JSON.parse(endpoint.body);
            } catch {
                errors.push('Request body must be valid JSON');
            }
        }

        if (endpoint.headers) {
            try {
                JSON.parse(JSON.stringify(endpoint.headers));
            } catch {
                errors.push('Headers must be valid JSON');
            }
        }

        return errors;
    }
}

export const apiService = ApiService.getInstance();
