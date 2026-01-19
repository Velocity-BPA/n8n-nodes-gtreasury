/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

/**
 * GTreasury ClearConnect Gateway Client
 *
 * ClearConnect provides bank-grade connectivity to 11,000+ financial
 * institutions worldwide. This client handles:
 * - Real-time balance queries
 * - Transaction retrieval
 * - Bank statement downloads (MT940, BAI2, camt.053)
 * - Secure bank authentication
 * - Connection management
 */

export interface IClearConnectRequestOptions {
	method: IHttpRequestMethods;
	endpoint: string;
	body?: IDataObject;
	qs?: IDataObject;
	headers?: IDataObject;
	bankId?: string;
	timeout?: number;
}

export interface IBankConnection {
	bankId: string;
	bankName: string;
	status: 'connected' | 'disconnected' | 'pending' | 'error';
	connectionType: string;
	lastSync?: string;
	accounts?: IBankAccount[];
}

export interface IBankAccount {
	accountId: string;
	accountNumber: string;
	accountName: string;
	currency: string;
	accountType: string;
	balance?: number;
	availableBalance?: number;
	lastUpdated?: string;
}

export interface IBankTransaction {
	transactionId: string;
	accountId: string;
	date: string;
	valueDate: string;
	amount: number;
	currency: string;
	type: 'credit' | 'debit';
	description: string;
	reference?: string;
	bankReference?: string;
	counterparty?: string;
	baiCode?: string;
}

export interface IBankStatement {
	statementId: string;
	accountId: string;
	format: 'mt940' | 'bai2' | 'camt053' | 'csv';
	periodStart: string;
	periodEnd: string;
	openingBalance: number;
	closingBalance: number;
	transactionCount: number;
	rawData?: string;
	parsedData?: IDataObject;
}

/**
 * Build authentication headers for ClearConnect Gateway
 */
function buildClearConnectHeaders(credentials: ICredentialDataDecryptedObject): IDataObject {
	return {
		'X-Gateway-Key': credentials.gatewayApiKey,
		'X-Gateway-Secret': credentials.gatewaySecret,
		'X-Tenant-ID': credentials.tenantId,
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	};
}

/**
 * Get bank-specific credentials from the stored bank credentials
 */
function getBankCredentials(
	credentials: ICredentialDataDecryptedObject,
	bankId: string,
): IDataObject | undefined {
	const bankCredentials = credentials.bankCredentials as { bank?: Array<IDataObject> };
	if (!bankCredentials?.bank) return undefined;

	return bankCredentials.bank.find(b => b.bankId === bankId);
}

/**
 * Make a request to the ClearConnect Gateway
 */
export async function clearConnectRequest(
	this: IExecuteFunctions,
	options: IClearConnectRequestOptions,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('gTreasuryClearConnect');
	const gatewayEndpoint = credentials.gatewayEndpoint as string;
	const headers = buildClearConnectHeaders(credentials);

	// Add bank-specific authentication if bankId provided
	if (options.bankId) {
		const bankCreds = getBankCredentials(credentials, options.bankId);
		if (bankCreds) {
			headers['X-Bank-ID'] = options.bankId;
			// Encrypt bank credentials before sending
			const encryptedCreds = encryptBankCredentials(bankCreds, credentials);
			headers['X-Bank-Auth'] = encryptedCreds;
		}
	}

	// Get connection options
	const connectionOptions = credentials.connectionOptions as IDataObject || {};
	const timeout = options.timeout || (connectionOptions.timeout as number) || 30000;

	const requestOptions: IHttpRequestOptions = {
		method: options.method,
		url: `${gatewayEndpoint}/v1${options.endpoint}`,
		headers: {
			...headers,
			...(options.headers || {}),
		},
		json: true,
		timeout,
	};

	if (options.body) {
		requestOptions.body = options.body;
	}

	if (options.qs) {
		requestOptions.qs = options.qs;
	}

	// Handle mTLS if certificates are configured
	// Note: mTLS certificate handling in n8n requires custom implementation
	// The certificate chain would be used for mutual TLS authentication
	const certChain = credentials.certificateChain as IDataObject;
	if (certChain?.clientCert && certChain?.clientKey) {
		// mTLS configuration would be handled via custom agent setup
		// This is a placeholder for proper certificate-based authentication
		requestOptions.headers = {
			...requestOptions.headers,
			'X-Client-Cert-Configured': 'true',
		};
	}

	try {
		const response = await this.helpers.httpRequest(requestOptions);

		if (response.error) {
			throw new NodeApiError(this.getNode(), {
				message: response.error.code || 'Gateway Error',
				description: response.error.message || 'ClearConnect Gateway returned an error',
			});
		}

		return response.data || response;
	} catch (error: unknown) {
		const err = error as { response?: { status?: number }; message?: string };
		if (err.response?.status === 503) {
			throw new NodeApiError(this.getNode(), {
				message: 'Bank Unavailable',
				description: 'The bank connection is temporarily unavailable. Please try again later.',
			});
		}
		throw new NodeApiError(this.getNode(), { message: (error as Error).message });
	}
}

/**
 * Encrypt bank credentials for secure transmission
 */
function encryptBankCredentials(
	bankCreds: IDataObject,
	gatewayCredentials: ICredentialDataDecryptedObject,
): string {
	const crypto = require('crypto');

	const encryptionSettings = gatewayCredentials.encryptionSettings as IDataObject || {};
	const algorithm = (encryptionSettings.algorithm as string) || 'aes-256-gcm';
	const key = encryptionSettings.encryptionKey
		? Buffer.from(encryptionSettings.encryptionKey as string, 'base64')
		: crypto.randomBytes(32);

	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, key, iv);

	let encrypted = cipher.update(JSON.stringify(bankCreds), 'utf8', 'base64');
	encrypted += cipher.final('base64');

	const authTag = cipher.getAuthTag();

	return Buffer.from(JSON.stringify({
		iv: iv.toString('base64'),
		data: encrypted,
		tag: authTag.toString('base64'),
	})).toString('base64');
}

/**
 * Get list of connected banks
 */
export async function getConnectedBanks(
	this: IExecuteFunctions,
): Promise<IBankConnection[]> {
	const response = await clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: '/banks/connected',
	});

	return (response.banks || []) as IBankConnection[];
}

/**
 * Get real-time balance for a bank account
 */
export async function getRealTimeBalance(
	this: IExecuteFunctions,
	bankId: string,
	accountId: string,
): Promise<IDataObject> {
	return clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: `/banks/${bankId}/accounts/${accountId}/balance/realtime`,
		bankId,
	});
}

/**
 * Get real-time transactions for a bank account
 */
export async function getRealTimeTransactions(
	this: IExecuteFunctions,
	bankId: string,
	accountId: string,
	startDate?: string,
	endDate?: string,
): Promise<IBankTransaction[]> {
	const qs: IDataObject = {};
	if (startDate) qs.startDate = startDate;
	if (endDate) qs.endDate = endDate;

	const response = await clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: `/banks/${bankId}/accounts/${accountId}/transactions/realtime`,
		bankId,
		qs,
	});

	return (response.transactions || []) as IBankTransaction[];
}

/**
 * Get prior day balance
 */
export async function getPriorDayBalance(
	this: IExecuteFunctions,
	bankId: string,
	accountId: string,
	date?: string,
): Promise<IDataObject> {
	const qs: IDataObject = {};
	if (date) qs.date = date;

	return clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: `/banks/${bankId}/accounts/${accountId}/balance/prior-day`,
		bankId,
		qs,
	});
}

/**
 * Get current day balance
 */
export async function getCurrentDayBalance(
	this: IExecuteFunctions,
	bankId: string,
	accountId: string,
): Promise<IDataObject> {
	return clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: `/banks/${bankId}/accounts/${accountId}/balance/current-day`,
		bankId,
	});
}

/**
 * Get intraday balance
 */
export async function getIntradayBalance(
	this: IExecuteFunctions,
	bankId: string,
	accountId: string,
): Promise<IDataObject> {
	return clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: `/banks/${bankId}/accounts/${accountId}/balance/intraday`,
		bankId,
	});
}

/**
 * Download bank statement
 */
export async function downloadBankStatement(
	this: IExecuteFunctions,
	bankId: string,
	accountId: string,
	format: 'mt940' | 'bai2' | 'camt053',
	startDate: string,
	endDate: string,
): Promise<IBankStatement> {
	const response = await clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: `/banks/${bankId}/accounts/${accountId}/statement`,
		bankId,
		qs: {
			format,
			startDate,
			endDate,
		},
	});

	return response as unknown as IBankStatement;
}

/**
 * Test bank connection
 */
export async function testBankConnection(
	this: IExecuteFunctions,
	bankId: string,
): Promise<IDataObject> {
	return clearConnectRequest.call(this, {
		method: 'POST',
		endpoint: `/banks/${bankId}/test`,
		bankId,
	});
}

/**
 * Initiate new bank connection
 */
export async function initiateConnection(
	this: IExecuteFunctions,
	bankId: string,
	connectionType: string,
	credentials: IDataObject,
): Promise<IDataObject> {
	return clearConnectRequest.call(this, {
		method: 'POST',
		endpoint: '/banks/connect',
		body: {
			bankId,
			connectionType,
			credentials,
		},
	});
}

/**
 * Disconnect bank
 */
export async function disconnectBank(
	this: IExecuteFunctions,
	bankId: string,
): Promise<IDataObject> {
	return clearConnectRequest.call(this, {
		method: 'POST',
		endpoint: `/banks/${bankId}/disconnect`,
		bankId,
	});
}

/**
 * Get list of supported banks
 */
export async function getSupportedBanks(
	this: IExecuteFunctions,
	country?: string,
): Promise<IDataObject[]> {
	const qs: IDataObject = {};
	if (country) qs.country = country;

	const response = await clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: '/banks/supported',
		qs,
	});

	return (response.banks || []) as IDataObject[];
}

/**
 * Get bank status
 */
export async function getBankStatus(
	this: IExecuteFunctions,
	bankId: string,
): Promise<IDataObject> {
	return clearConnectRequest.call(this, {
		method: 'GET',
		endpoint: `/banks/${bankId}/status`,
		bankId,
	});
}

// Alias for backward compatibility
export { downloadBankStatement as downloadStatement };
