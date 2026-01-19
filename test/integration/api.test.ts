/**
 * n8n-nodes-gtreasury
 * Integration tests for GTreasury API operations
 *
 * Copyright (c) 2024 n8n-nodes-gtreasury Contributors
 * Licensed under the Business Source License 1.1
 *
 * NOTE: These tests require a valid GTreasury sandbox environment.
 * Set the following environment variables before running:
 *   - GTREASURY_API_URL
 *   - GTREASURY_CLIENT_ID
 *   - GTREASURY_CLIENT_SECRET
 */

// Skip integration tests if credentials are not configured
const runIntegrationTests =
	process.env.GTREASURY_API_URL &&
	process.env.GTREASURY_CLIENT_ID &&
	process.env.GTREASURY_CLIENT_SECRET;

const describeOrSkip = runIntegrationTests ? describe : describe.skip;

describeOrSkip('GTreasury API Integration Tests', () => {
	const config = {
		apiUrl: process.env.GTREASURY_API_URL!,
		clientId: process.env.GTREASURY_CLIENT_ID!,
		clientSecret: process.env.GTREASURY_CLIENT_SECRET!,
	};

	let accessToken: string;

	beforeAll(async () => {
		// Obtain OAuth token
		const tokenUrl = `${config.apiUrl}/oauth/token`;
		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: config.clientId,
				client_secret: config.clientSecret,
			}),
		});

		const data = await response.json();
		accessToken = data.access_token;
	});

	describe('Authentication', () => {
		it('should obtain valid access token', () => {
			expect(accessToken).toBeDefined();
			expect(typeof accessToken).toBe('string');
			expect(accessToken.length).toBeGreaterThan(0);
		});
	});

	describe('Cash Management', () => {
		it('should get cash position', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/cash/position`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data).toBeDefined();
		});

		it('should list transactions', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/cash/transactions?limit=10`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(Array.isArray(data.data) || Array.isArray(data)).toBe(true);
		});
	});

	describe('Bank Accounts', () => {
		it('should list bank accounts', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/bank-accounts`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data).toBeDefined();
		});
	});

	describe('Payments', () => {
		it('should list payments', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/payments?limit=10`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data).toBeDefined();
		});
	});

	describe('FX Operations', () => {
		it('should get FX exposure', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/fx/exposure?baseCurrency=USD`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data).toBeDefined();
		});
	});

	describe('Market Data', () => {
		it('should get exchange rates', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/market-data/fx-rates/EUR/USD`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data).toBeDefined();
		});
	});

	describe('Utilities', () => {
		it('should get system status', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/system/status`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(data.status).toBeDefined();
		});

		it('should test connection', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/system/ping`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
		});
	});
});

describeOrSkip('GTreasury Webhook Integration Tests', () => {
	const config = {
		apiUrl: process.env.GTREASURY_API_URL!,
		clientId: process.env.GTREASURY_CLIENT_ID!,
		clientSecret: process.env.GTREASURY_CLIENT_SECRET!,
	};

	let accessToken: string;

	beforeAll(async () => {
		const tokenUrl = `${config.apiUrl}/oauth/token`;
		const response = await fetch(tokenUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: config.clientId,
				client_secret: config.clientSecret,
			}),
		});

		const data = await response.json();
		accessToken = data.access_token;
	});

	describe('Webhook Management', () => {
		let webhookId: string;

		it('should list webhooks', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/webhooks`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			expect(Array.isArray(data.data) || Array.isArray(data)).toBe(true);
		});

		it('should create webhook', async () => {
			const response = await fetch(`${config.apiUrl}/api/v1/webhooks`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					url: 'https://test.example.com/webhook',
					events: ['payment.created'],
					active: true,
				}),
			});

			expect(response.ok).toBe(true);
			const data = await response.json();
			webhookId = data.id;
			expect(webhookId).toBeDefined();
		});

		it('should delete webhook', async () => {
			if (!webhookId) {
				return;
			}

			const response = await fetch(`${config.apiUrl}/api/v1/webhooks/${webhookId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			expect(response.ok).toBe(true);
		});
	});
});

// Test data cleanup utility
describe('Test Utilities', () => {
	it('should have test configuration helper', () => {
		const getTestConfig = () => ({
			apiUrl: process.env.GTREASURY_API_URL || 'https://sandbox.gtreasury.com',
			clientId: process.env.GTREASURY_CLIENT_ID || 'test_client_id',
			clientSecret: process.env.GTREASURY_CLIENT_SECRET || 'test_client_secret',
		});

		const config = getTestConfig();
		expect(config.apiUrl).toBeDefined();
		expect(config.clientId).toBeDefined();
		expect(config.clientSecret).toBeDefined();
	});
});
