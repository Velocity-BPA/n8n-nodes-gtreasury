/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * GTreasury ClearConnect Gateway Credentials
 *
 * ClearConnect is GTreasury's bank connectivity solution that provides
 * real-time access to bank balances, transactions, and statement data
 * across 11,000+ financial institutions worldwide.
 *
 * Security Note: Bank credentials are highly sensitive. This credential
 * type implements bank-grade encryption and secure storage practices.
 */
export class GTreasuryClearConnect implements ICredentialType {
	name = 'gTreasuryClearConnect';
	displayName = 'GTreasury ClearConnect Gateway';
	documentationUrl = 'https://docs.gtreasury.com/clearconnect';
	icon = 'file:gtreasury.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Gateway Endpoint',
			name: 'gatewayEndpoint',
			type: 'string',
			default: 'https://clearconnect.gtreasury.com',
			required: true,
			description: 'ClearConnect Gateway endpoint URL',
		},
		{
			displayName: 'Gateway API Key',
			name: 'gatewayApiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'API key for ClearConnect Gateway authentication',
		},
		{
			displayName: 'Gateway Secret',
			name: 'gatewaySecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Secret key for ClearConnect Gateway authentication',
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your GTreasury tenant identifier',
		},
		// Encryption Settings
		{
			displayName: 'Encryption Settings',
			name: 'encryptionSettings',
			type: 'collection',
			placeholder: 'Add Encryption Setting',
			default: {},
			options: [
				{
					displayName: 'Encryption Algorithm',
					name: 'algorithm',
					type: 'options',
					options: [
						{ name: 'AES-256-GCM', value: 'aes-256-gcm' },
						{ name: 'AES-256-CBC', value: 'aes-256-cbc' },
						{ name: 'RSA-OAEP', value: 'rsa-oaep' },
					],
					default: 'aes-256-gcm',
					description: 'Encryption algorithm for sensitive data',
				},
				{
					displayName: 'Encryption Key',
					name: 'encryptionKey',
					type: 'string',
					typeOptions: { password: true },
					default: '',
					description: 'Encryption key for data protection (base64 encoded)',
				},
				{
					displayName: 'Key Rotation Enabled',
					name: 'keyRotationEnabled',
					type: 'boolean',
					default: true,
					description: 'Whether to enable automatic key rotation',
				},
			],
			description: 'Encryption configuration for bank data',
		},
		// Certificate Chain
		{
			displayName: 'Certificate Chain',
			name: 'certificateChain',
			type: 'collection',
			placeholder: 'Add Certificate',
			default: {},
			options: [
				{
					displayName: 'Client Certificate',
					name: 'clientCert',
					type: 'string',
					typeOptions: {
						rows: 10,
					},
					default: '',
					description: 'PEM-encoded client certificate for mTLS',
				},
				{
					displayName: 'Client Private Key',
					name: 'clientKey',
					type: 'string',
					typeOptions: {
						password: true,
						rows: 10,
					},
					default: '',
					description: 'PEM-encoded private key for the client certificate',
				},
				{
					displayName: 'CA Certificate',
					name: 'caCert',
					type: 'string',
					typeOptions: {
						rows: 10,
					},
					default: '',
					description: 'PEM-encoded CA certificate chain',
				},
				{
					displayName: 'Verify SSL',
					name: 'verifySsl',
					type: 'boolean',
					default: true,
					description: 'Whether to verify SSL certificates',
				},
			],
			description: 'SSL/TLS certificate configuration for secure bank connectivity',
		},
		// Bank Credentials (per institution)
		{
			displayName: 'Bank Credentials',
			name: 'bankCredentials',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			options: [
				{
					name: 'bank',
					displayName: 'Bank',
					values: [
						{
							displayName: 'Bank Identifier',
							name: 'bankId',
							type: 'string',
							default: '',
							description: 'Unique identifier for the bank (e.g., SWIFT BIC, routing number)',
						},
						{
							displayName: 'Bank Name',
							name: 'bankName',
							type: 'string',
							default: '',
							description: 'Display name of the bank',
						},
						{
							displayName: 'Connection Type',
							name: 'connectionType',
							type: 'options',
							options: [
								{ name: 'SWIFT', value: 'swift' },
								{ name: 'Host-to-Host', value: 'h2h' },
								{ name: 'API Direct', value: 'api' },
								{ name: 'Screen Scraping', value: 'scraping' },
								{ name: 'File Transfer (SFTP)', value: 'sftp' },
								{ name: 'Open Banking', value: 'openbanking' },
							],
							default: 'api',
							description: 'Type of connection to the bank',
						},
						{
							displayName: 'Username',
							name: 'username',
							type: 'string',
							default: '',
							description: 'Bank portal/API username',
						},
						{
							displayName: 'Password',
							name: 'password',
							type: 'string',
							typeOptions: { password: true },
							default: '',
							description: 'Bank portal/API password',
						},
						{
							displayName: 'API Key',
							name: 'apiKey',
							type: 'string',
							typeOptions: { password: true },
							default: '',
							description: 'Bank-specific API key (if applicable)',
						},
						{
							displayName: 'Additional Authentication',
							name: 'additionalAuth',
							type: 'json',
							default: '{}',
							description: 'Additional authentication parameters (JSON format)',
						},
					],
				},
			],
			description: 'Credentials for individual bank connections',
		},
		// Connection Options
		{
			displayName: 'Connection Options',
			name: 'connectionOptions',
			type: 'collection',
			placeholder: 'Add Option',
			default: {},
			options: [
				{
					displayName: 'Timeout (ms)',
					name: 'timeout',
					type: 'number',
					default: 30000,
					description: 'Connection timeout in milliseconds',
				},
				{
					displayName: 'Retry Attempts',
					name: 'retryAttempts',
					type: 'number',
					default: 3,
					description: 'Number of retry attempts for failed connections',
				},
				{
					displayName: 'Retry Delay (ms)',
					name: 'retryDelay',
					type: 'number',
					default: 1000,
					description: 'Delay between retry attempts in milliseconds',
				},
				{
					displayName: 'Keep Alive',
					name: 'keepAlive',
					type: 'boolean',
					default: true,
					description: 'Whether to keep connections alive',
				},
			],
			description: 'Connection behavior options',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Gateway-Key': '={{$credentials.gatewayApiKey}}',
				'X-Gateway-Secret': '={{$credentials.gatewaySecret}}',
				'X-Tenant-ID': '={{$credentials.tenantId}}',
				'Content-Type': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.gatewayEndpoint}}',
			url: '/v1/status',
			method: 'GET',
		},
	};
}
