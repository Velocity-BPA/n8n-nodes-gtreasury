/**
 * n8n-nodes-gtreasury
 * Unit tests for GTreasury credentials
 *
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import { GTreasuryApi } from '../../credentials/GTreasuryApi.credentials';
import { GTreasuryClearConnect } from '../../credentials/GTreasuryClearConnect.credentials';

describe('GTreasuryApi Credentials', () => {
	let credentials: GTreasuryApi;

	beforeEach(() => {
		credentials = new GTreasuryApi();
	});

	describe('Credential Properties', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('gTreasuryApi');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('GTreasury API');
		});

		it('should have required properties', () => {
			const propertyNames = credentials.properties.map((p) => p.name);
			expect(propertyNames).toContain('baseUrl');
			expect(propertyNames).toContain('tenantId');
			expect(propertyNames).toContain('authMethod');
		});

		it('should have API key authentication properties', () => {
			const propertyNames = credentials.properties.map((p) => p.name);
			expect(propertyNames).toContain('apiKey');
			expect(propertyNames).toContain('apiSecret');
		});

		it('should have OAuth2 authentication properties', () => {
			const propertyNames = credentials.properties.map((p) => p.name);
			expect(propertyNames).toContain('oauthClientId');
			expect(propertyNames).toContain('oauthClientSecret');
		});

		it('should have environment options', () => {
			const envProp = credentials.properties.find((p) => p.name === 'environment');
			expect(envProp).toBeDefined();
			expect(envProp?.type).toBe('options');
		});

		it('should have production and sandbox environments', () => {
			const envProp = credentials.properties.find((p) => p.name === 'environment');
			const options = envProp?.options as Array<{ value: string }>;
			const values = options?.map((o) => o.value) || [];
			expect(values).toContain('production');
			expect(values).toContain('sandbox');
		});
	});

	describe('Test Authentication', () => {
		it('should have test property defined', () => {
			expect(credentials.test).toBeDefined();
		});
	});
});

describe('GTreasuryClearConnect Credentials', () => {
	let credentials: GTreasuryClearConnect;

	beforeEach(() => {
		credentials = new GTreasuryClearConnect();
	});

	describe('Credential Properties', () => {
		it('should have correct name', () => {
			expect(credentials.name).toBe('gTreasuryClearConnect');
		});

		it('should have correct display name', () => {
			expect(credentials.displayName).toBe('GTreasury ClearConnect Gateway');
		});

		it('should have gateway properties', () => {
			const propertyNames = credentials.properties.map((p) => p.name);
			expect(propertyNames).toContain('gatewayEndpoint');
			expect(propertyNames).toContain('gatewayApiKey');
			expect(propertyNames).toContain('gatewaySecret');
		});

		it('should have encryption and certificate settings', () => {
			const propertyNames = credentials.properties.map((p) => p.name);
			expect(propertyNames).toContain('encryptionSettings');
			expect(propertyNames).toContain('certificateChain');
		});

		it('should have tenant ID property', () => {
			const propertyNames = credentials.properties.map((p) => p.name);
			expect(propertyNames).toContain('tenantId');
		});
	});
});
