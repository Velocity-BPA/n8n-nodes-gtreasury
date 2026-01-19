/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

/**
 * GTreasury API Credentials
 *
 * Supports multiple authentication methods for GTreasury's corporate
 * treasury management platform:
 * - API Key + Secret
 * - OAuth 2.0
 * - Session Token
 */
export class GTreasuryApi implements ICredentialType {
	name = 'gTreasuryApi';
	displayName = 'GTreasury API';
	documentationUrl = 'https://docs.gtreasury.com/api';
	icon = 'file:gtreasury.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'API Key + Secret',
					value: 'apiKey',
				},
				{
					name: 'OAuth 2.0',
					value: 'oauth2',
				},
				{
					name: 'Session Token',
					value: 'sessionToken',
				},
			],
			default: 'apiKey',
			description: 'The authentication method to use for GTreasury API access',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'sandbox',
			description: 'The GTreasury environment to connect to',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://api.gtreasury.com',
			description: 'Custom base URL for the GTreasury API. Leave empty to use default environment URL.',
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your GTreasury tenant/organization identifier',
		},
		// API Key Authentication
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['apiKey'],
				},
			},
			description: 'Your GTreasury API key',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['apiKey'],
				},
			},
			description: 'Your GTreasury API secret',
		},
		// OAuth 2.0 Authentication
		{
			displayName: 'OAuth Client ID',
			name: 'oauthClientId',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 client ID for GTreasury',
		},
		{
			displayName: 'OAuth Client Secret',
			name: 'oauthClientSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 client secret for GTreasury',
		},
		{
			displayName: 'OAuth Token URL',
			name: 'oauthTokenUrl',
			type: 'string',
			default: '',
			placeholder: 'https://auth.gtreasury.com/oauth/token',
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 token endpoint URL',
		},
		{
			displayName: 'OAuth Scope',
			name: 'oauthScope',
			type: 'string',
			default: 'treasury.read treasury.write',
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 scopes to request (space-separated)',
		},
		// Session Token Authentication
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['sessionToken'],
				},
			},
			description: 'GTreasury session token for authentication',
		},
		{
			displayName: 'Session Expiry',
			name: 'sessionExpiry',
			type: 'dateTime',
			default: '',
			displayOptions: {
				show: {
					authMethod: ['sessionToken'],
				},
			},
			description: 'When the session token expires (for reference)',
		},
		// Custom Headers
		{
			displayName: 'Custom Headers',
			name: 'customHeaders',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			options: [
				{
					name: 'header',
					displayName: 'Header',
					values: [
						{
							displayName: 'Name',
							name: 'name',
							type: 'string',
							default: '',
							description: 'Header name',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
							description: 'Header value',
						},
					],
				},
			],
			description: 'Custom headers to include with each API request',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const authMethod = credentials.authMethod as string;
		const headers: Record<string, string> = {
			'X-Tenant-ID': credentials.tenantId as string,
			'Content-Type': 'application/json',
		};

		// Add custom headers if defined
		const customHeaders = credentials.customHeaders as { header?: Array<{ name: string; value: string }> };
		if (customHeaders?.header) {
			for (const h of customHeaders.header) {
				if (h.name && h.value) {
					headers[h.name] = h.value;
				}
			}
		}

		if (authMethod === 'apiKey') {
			headers['X-API-Key'] = credentials.apiKey as string;
			headers['X-API-Secret'] = credentials.apiSecret as string;
		} else if (authMethod === 'sessionToken') {
			headers['Authorization'] = `Bearer ${credentials.sessionToken}`;
		} else if (authMethod === 'oauth2') {
			// OAuth token would be obtained separately
			// This is handled by the OAuth flow
		}

		return { headers };
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl || ($credentials.environment === "production" ? "https://api.gtreasury.com" : "https://sandbox-api.gtreasury.com")}}',
			url: '/v1/status',
			method: 'GET',
		},
	};
}
