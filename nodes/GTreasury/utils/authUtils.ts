/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * Authentication Utilities for GTreasury
 *
 * Provides helper functions for:
 * - Token management
 * - Request signing
 * - Session handling
 * - Secure credential handling
 */

/**
 * Generate HMAC signature for API requests
 */
export function generateHmacSignature(
	secret: string,
	payload: string,
	algorithm: 'sha256' | 'sha512' = 'sha256',
): string {
	const crypto = require('crypto');
	return crypto.createHmac(algorithm, secret).update(payload).digest('hex');
}

/**
 * Generate timestamp for API requests
 */
export function generateTimestamp(): string {
	return new Date().toISOString();
}

/**
 * Generate nonce for request uniqueness
 */
export function generateNonce(length: number = 32): string {
	const crypto = require('crypto');
	return crypto.randomBytes(length).toString('hex');
}

/**
 * Build canonical request string for signing
 */
export function buildCanonicalRequest(
	method: string,
	path: string,
	queryString: string,
	headers: IDataObject,
	body?: string,
): string {
	const sortedHeaders = Object.keys(headers)
		.sort()
		.map(key => `${key.toLowerCase()}:${headers[key]}`)
		.join('\n');

	const bodyHash = body
		? require('crypto').createHash('sha256').update(body).digest('hex')
		: require('crypto').createHash('sha256').update('').digest('hex');

	return [
		method.toUpperCase(),
		path,
		queryString,
		sortedHeaders,
		'',
		Object.keys(headers).sort().map(k => k.toLowerCase()).join(';'),
		bodyHash,
	].join('\n');
}

/**
 * Parse JWT token and extract payload
 */
export function parseJwtToken(token: string): IDataObject | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) return null;

		const payload = Buffer.from(parts[1], 'base64').toString('utf8');
		return JSON.parse(payload);
	} catch {
		return null;
	}
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string, bufferSeconds: number = 60): boolean {
	const payload = parseJwtToken(token);
	if (!payload || !payload.exp) return true;

	const expirationTime = (payload.exp as number) * 1000; // Convert to milliseconds
	const bufferTime = bufferSeconds * 1000;

	return Date.now() >= (expirationTime - bufferTime);
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: IDataObject, sensitiveKeys: string[] = []): IDataObject {
	const defaultSensitiveKeys = [
		'password', 'secret', 'apiKey', 'apiSecret', 'token',
		'accessToken', 'refreshToken', 'sessionToken', 'privateKey',
		'clientSecret', 'encryptionKey', 'bankPassword',
	];

	const keysToMask = [...defaultSensitiveKeys, ...sensitiveKeys];
	const masked = { ...data };

	for (const key of Object.keys(masked)) {
		if (keysToMask.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
			if (typeof masked[key] === 'string') {
				masked[key] = '***MASKED***';
			}
		} else if (typeof masked[key] === 'object' && masked[key] !== null) {
			masked[key] = maskSensitiveData(masked[key] as IDataObject, sensitiveKeys);
		}
	}

	return masked;
}

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string, key: string): string {
	const crypto = require('crypto');
	const iv = crypto.randomBytes(16);
	const keyBuffer = crypto.scryptSync(key, 'salt', 32);
	const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv);

	let encrypted = cipher.update(data, 'utf8', 'base64');
	encrypted += cipher.final('base64');

	const authTag = cipher.getAuthTag();

	return JSON.stringify({
		iv: iv.toString('base64'),
		data: encrypted,
		tag: authTag.toString('base64'),
	});
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedJson: string, key: string): string {
	const crypto = require('crypto');
	const { iv, data, tag } = JSON.parse(encryptedJson);

	const keyBuffer = crypto.scryptSync(key, 'salt', 32);
	const decipher = crypto.createDecipheriv(
		'aes-256-gcm',
		keyBuffer,
		Buffer.from(iv, 'base64'),
	);
	decipher.setAuthTag(Buffer.from(tag, 'base64'));

	let decrypted = decipher.update(data, 'base64', 'utf8');
	decrypted += decipher.final('utf8');

	return decrypted;
}

/**
 * Validate OAuth 2.0 scopes
 */
export function validateScopes(required: string[], granted: string[]): boolean {
	return required.every(scope => granted.includes(scope));
}

/**
 * Build OAuth 2.0 authorization URL
 */
export function buildOAuthAuthorizationUrl(
	baseUrl: string,
	clientId: string,
	redirectUri: string,
	scope: string,
	state: string,
	additionalParams?: IDataObject,
): string {
	const params = new URLSearchParams({
		response_type: 'code',
		client_id: clientId,
		redirect_uri: redirectUri,
		scope,
		state,
		...additionalParams,
	});

	return `${baseUrl}?${params.toString()}`;
}

/**
 * Parse OAuth 2.0 token response
 */
export function parseTokenResponse(response: IDataObject): {
	accessToken: string;
	refreshToken?: string;
	expiresIn?: number;
	tokenType?: string;
	scope?: string;
} {
	return {
		accessToken: response.access_token as string,
		refreshToken: response.refresh_token as string | undefined,
		expiresIn: response.expires_in as number | undefined,
		tokenType: response.token_type as string | undefined,
		scope: response.scope as string | undefined,
	};
}

/**
 * Session management
 */
export class SessionManager {
	private sessions: Map<string, { token: string; expiresAt: Date }> = new Map();

	setSession(key: string, token: string, expiresInSeconds: number): void {
		const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
		this.sessions.set(key, { token, expiresAt });
	}

	getSession(key: string): string | null {
		const session = this.sessions.get(key);
		if (!session) return null;

		if (new Date() >= session.expiresAt) {
			this.sessions.delete(key);
			return null;
		}

		return session.token;
	}

	clearSession(key: string): void {
		this.sessions.delete(key);
	}

	clearAllSessions(): void {
		this.sessions.clear();
	}
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
	private requests: Map<string, number[]> = new Map();
	private limit: number;
	private windowMs: number;

	constructor(limit: number = 100, windowMs: number = 60000) {
		this.limit = limit;
		this.windowMs = windowMs;
	}

	canMakeRequest(key: string): boolean {
		const now = Date.now();
		const requests = this.requests.get(key) || [];

		// Remove old requests outside the window
		const validRequests = requests.filter(time => now - time < this.windowMs);
		this.requests.set(key, validRequests);

		return validRequests.length < this.limit;
	}

	recordRequest(key: string): void {
		const requests = this.requests.get(key) || [];
		requests.push(Date.now());
		this.requests.set(key, requests);
	}

	getRemaining(key: string): number {
		const requests = this.requests.get(key) || [];
		const now = Date.now();
		const validRequests = requests.filter(time => now - time < this.windowMs);
		return Math.max(0, this.limit - validRequests.length);
	}
}
