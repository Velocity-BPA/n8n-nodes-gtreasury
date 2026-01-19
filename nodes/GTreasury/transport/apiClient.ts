/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { BASE_URLS, API_VERSION, buildEndpoint } from '../constants/endpoints';

/**
 * GTreasury API Client
 *
 * Handles all communication with the GTreasury REST API including:
 * - Authentication (API Key, OAuth 2.0, Session Token)
 * - Request signing
 * - Rate limiting
 * - Error handling
 * - Retry logic
 */

export interface IGTreasuryApiResponse<T = IDataObject> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: IDataObject;
	};
	meta?: {
		page?: number;
		pageSize?: number;
		totalCount?: number;
		totalPages?: number;
	};
}

export interface IGTreasuryRequestOptions {
	method: IHttpRequestMethods;
	endpoint: string;
	body?: IDataObject;
	qs?: IDataObject;
	headers?: IDataObject;
	returnFullResponse?: boolean;
	timeout?: number;
}

/**
 * Get the base URL for GTreasury API
 */
export function getBaseUrl(credentials: ICredentialDataDecryptedObject): string {
	const customUrl = credentials.baseUrl as string;
	if (customUrl && customUrl.trim()) {
		return customUrl.replace(/\/$/, '');
	}

	const environment = credentials.environment as string;
	return environment === 'production' ? BASE_URLS.production : BASE_URLS.sandbox;
}

/**
 * Build authentication headers based on auth method
 */
export function buildAuthHeaders(credentials: ICredentialDataDecryptedObject): IDataObject {
	const headers: IDataObject = {
		'X-Tenant-ID': credentials.tenantId,
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	};

	const authMethod = credentials.authMethod as string;

	switch (authMethod) {
		case 'apiKey':
			headers['X-API-Key'] = credentials.apiKey;
			headers['X-API-Secret'] = credentials.apiSecret;
			break;
		case 'sessionToken':
			headers['Authorization'] = `Bearer ${credentials.sessionToken}`;
			break;
		case 'oauth2':
			// OAuth token should be obtained via OAuth flow
			// This is handled by n8n's OAuth infrastructure
			break;
	}

	// Add custom headers if defined
	const customHeaders = credentials.customHeaders as { header?: Array<{ name: string; value: string }> };
	if (customHeaders?.header) {
		for (const h of customHeaders.header) {
			if (h.name && h.value) {
				headers[h.name] = h.value;
			}
		}
	}

	return headers;
}

/**
 * Generate request signature for API Key authentication
 */
export function generateRequestSignature(
	apiSecret: string,
	method: string,
	endpoint: string,
	timestamp: string,
	body?: string,
): string {
	const crypto = require('crypto');
	const payload = `${method}${endpoint}${timestamp}${body || ''}`;
	return crypto.createHmac('sha256', apiSecret).update(payload).digest('hex');
}

/**
 * Make a request to the GTreasury API
 */
export async function gTreasuryApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	options: IGTreasuryRequestOptions,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('gTreasuryApi');
	const baseUrl = getBaseUrl(credentials);
	const authHeaders = buildAuthHeaders(credentials);

	const timestamp = new Date().toISOString();

	// Build request options
	const requestOptions: IHttpRequestOptions = {
		method: options.method,
		url: `${baseUrl}/${API_VERSION}${options.endpoint}`,
		headers: {
			...authHeaders,
			'X-Request-Timestamp': timestamp,
			...(options.headers || {}),
		},
		json: true,
		timeout: options.timeout || 30000,
	};

	// Add body for POST/PUT/PATCH
	if (options.body && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
		requestOptions.body = options.body;

		// Add request signature for API Key auth
		if (credentials.authMethod === 'apiKey') {
			const signature = generateRequestSignature(
				credentials.apiSecret as string,
				options.method,
				options.endpoint,
				timestamp,
				JSON.stringify(options.body),
			);
			(requestOptions.headers as IDataObject)['X-Request-Signature'] = signature;
		}
	}

	// Add query string parameters
	if (options.qs && Object.keys(options.qs).length > 0) {
		requestOptions.qs = options.qs;
	}

	try {
		const response = await this.helpers.httpRequest(requestOptions);

		// Handle paginated responses
		if (options.returnFullResponse) {
			return response as IDataObject;
		}

		// Extract data from response
		if (response.success === false) {
			throw new NodeApiError(this.getNode(), response.error || { message: 'API request failed' });
		}

		return response.data || response;
	} catch (error: unknown) {
		// Handle specific error types
		if (error instanceof NodeApiError) {
			throw error;
		}

		const errorObj = error as { response?: { status?: number; data?: IDataObject }; message?: string };

		if (errorObj.response) {
			const status = errorObj.response.status;
			const data = errorObj.response.data;

			switch (status) {
				case 400:
					throw new NodeApiError(this.getNode(), {
						message: 'Bad Request',
						description: (data?.error as IDataObject)?.message as string || 'Invalid request parameters',
					});
				case 401:
					throw new NodeApiError(this.getNode(), {
						message: 'Unauthorized',
						description: 'Invalid or expired credentials. Please check your API credentials.',
					});
				case 403:
					throw new NodeApiError(this.getNode(), {
						message: 'Forbidden',
						description: 'You do not have permission to access this resource.',
					});
				case 404:
					throw new NodeApiError(this.getNode(), {
						message: 'Not Found',
						description: 'The requested resource was not found.',
					});
				case 429:
					throw new NodeApiError(this.getNode(), {
						message: 'Rate Limited',
						description: 'Too many requests. Please wait before retrying.',
					});
				case 500:
					throw new NodeApiError(this.getNode(), {
						message: 'Server Error',
						description: 'GTreasury server error. Please try again later.',
					});
				default:
					throw new NodeApiError(this.getNode(), { message: (error as Error).message });
			}
		}

		throw new NodeOperationError(this.getNode(), `API request failed: ${errorObj.message || 'Unknown error'}`);
	}
}

/**
 * Make a paginated request to the GTreasury API
 */
export async function gTreasuryApiRequestAllItems(
	this: IExecuteFunctions,
	options: IGTreasuryRequestOptions,
	maxResults?: number,
): Promise<IDataObject[]> {
	const results: IDataObject[] = [];
	let page = 1;
	const pageSize = 100;
	let hasMore = true;

	while (hasMore) {
		const response = await gTreasuryApiRequest.call(this, {
			...options,
			qs: {
				...options.qs,
				page,
				pageSize,
			},
			returnFullResponse: true,
		}) as IGTreasuryApiResponse;

		if (response.data && Array.isArray(response.data)) {
			results.push(...(response.data as IDataObject[]));
		}

		// Check if we have more pages
		if (response.meta) {
			hasMore = page < (response.meta.totalPages || 0);
		} else {
			hasMore = false;
		}

		// Check if we've reached maxResults
		if (maxResults && results.length >= maxResults) {
			hasMore = false;
			results.splice(maxResults);
		}

		page++;
	}

	return results;
}

/**
 * Upload a file to GTreasury
 */
export async function gTreasuryUploadFile(
	this: IExecuteFunctions,
	endpoint: string,
	fileData: Buffer,
	fileName: string,
	mimeType: string,
	additionalFields?: IDataObject,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('gTreasuryApi');
	const baseUrl = getBaseUrl(credentials);
	const authHeaders = buildAuthHeaders(credentials);

	const formData: IDataObject = {
		file: {
			value: fileData,
			options: {
				filename: fileName,
				contentType: mimeType,
			},
		},
		...additionalFields,
	};

	const requestOptions: IHttpRequestOptions = {
		method: 'POST',
		url: `${baseUrl}/${API_VERSION}${endpoint}`,
		headers: {
			...authHeaders,
			'Content-Type': 'multipart/form-data',
		},
		body: formData,
		json: true,
	};

	try {
		return await this.helpers.httpRequest(requestOptions);
	} catch (error) {
		throw new NodeApiError(this.getNode(), { message: (error as Error).message });
	}
}

/**
 * Download a file from GTreasury
 */
export async function gTreasuryDownloadFile(
	this: IExecuteFunctions,
	endpoint: string,
	qs?: IDataObject,
): Promise<Buffer> {
	const credentials = await this.getCredentials('gTreasuryApi');
	const baseUrl = getBaseUrl(credentials);
	const authHeaders = buildAuthHeaders(credentials);

	const requestOptions: IHttpRequestOptions = {
		method: 'GET',
		url: `${baseUrl}/${API_VERSION}${endpoint}`,
		headers: authHeaders,
		encoding: 'arraybuffer',
		returnFullResponse: true,
		qs,
	};

	try {
		const response = await this.helpers.httpRequest(requestOptions);
		return Buffer.from(response.body as ArrayBuffer);
	} catch (error) {
		throw new NodeApiError(this.getNode(), { message: (error as Error).message });
	}
}

/**
 * Validate API response
 */
export function validateResponse(response: IDataObject, expectedFields?: string[]): void {
	if (!response) {
		throw new Error('Empty response received from API');
	}

	if (expectedFields) {
		for (const field of expectedFields) {
			if (!(field in response)) {
				throw new Error(`Expected field '${field}' not found in response`);
			}
		}
	}
}

/**
 * Format date for API requests
 */
export function formatDateForApi(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toISOString().split('T')[0];
}

/**
 * Format datetime for API requests
 */
export function formatDateTimeForApi(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toISOString();
}

/**
 * Parse amount from API (handles different formats)
 */
export function parseAmount(amount: string | number): number {
	if (typeof amount === 'number') return amount;
	return parseFloat(amount.replace(/[^0-9.-]/g, ''));
}

/**
 * Simple API request wrapper for action files
 * Provides a simpler interface: (method, endpoint, body?, qs?)
 */
export async function simpleApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<IDataObject> {
	return gTreasuryApiRequest.call(this, {
		method,
		endpoint,
		body,
		qs,
	});
}
