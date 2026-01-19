/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { gTreasuryApiRequest, getBaseUrl } from './apiClient';
import { ERP_ENDPOINTS, API_VERSION } from '../constants/endpoints';
import { ERP_SYSTEMS } from '../constants/erpSystems';

/**
 * GTreasury ERP Connectors
 *
 * Provides integration with major ERP systems:
 * - Workday
 * - NetSuite
 * - Oracle (Cloud, EBS, JDE, PeopleSoft)
 * - SAP (S/4HANA, ECC)
 * - Microsoft Dynamics (365 F&O, BC, GP)
 * - Sage Intacct
 * - Others
 */

export interface IErpConnection {
	connectionId: string;
	erpSystem: string;
	name: string;
	status: 'active' | 'inactive' | 'error';
	lastSync?: string;
	config: IDataObject;
}

export interface IGlEntry {
	entryId?: string;
	date: string;
	postingDate?: string;
	description: string;
	reference?: string;
	lines: IGlEntryLine[];
	status?: string;
	source?: string;
}

export interface IGlEntryLine {
	accountCode: string;
	accountName?: string;
	debit?: number;
	credit?: number;
	currency?: string;
	entity?: string;
	costCenter?: string;
	project?: string;
	memo?: string;
}

export interface IApInvoice {
	invoiceId: string;
	vendorId: string;
	vendorName?: string;
	invoiceNumber: string;
	invoiceDate: string;
	dueDate: string;
	amount: number;
	currency: string;
	status: string;
	paymentTerms?: string;
}

export interface IArInvoice {
	invoiceId: string;
	customerId: string;
	customerName?: string;
	invoiceNumber: string;
	invoiceDate: string;
	dueDate: string;
	amount: number;
	currency: string;
	status: string;
	paymentTerms?: string;
}

/**
 * Get ERP connections
 */
export async function getErpConnections(
	this: IExecuteFunctions,
	erpSystem?: string,
): Promise<IErpConnection[]> {
	const qs: IDataObject = {};
	if (erpSystem) qs.erpSystem = erpSystem;

	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.connections,
		qs,
	});

	return (response.connections || response) as IErpConnection[];
}

/**
 * Get single ERP connection
 */
export async function getErpConnection(
	this: IExecuteFunctions,
	connectionId: string,
): Promise<IErpConnection> {
	const endpoint = ERP_ENDPOINTS.connection.replace('{id}', connectionId);

	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint,
	});

	return response as IErpConnection;
}

/**
 * Create ERP connection
 */
export async function createErpConnection(
	this: IExecuteFunctions,
	erpSystem: string,
	name: string,
	config: IDataObject,
): Promise<IErpConnection> {
	const response = await gTreasuryApiRequest.call(this, {
		method: 'POST',
		endpoint: ERP_ENDPOINTS.connections,
		body: {
			erpSystem,
			name,
			config,
		},
	});

	return response as IErpConnection;
}

/**
 * Test ERP connection
 */
export async function testErpConnection(
	this: IExecuteFunctions,
	connectionId: string,
): Promise<IDataObject> {
	const endpoint = ERP_ENDPOINTS.testConnection.replace('{id}', connectionId);

	return gTreasuryApiRequest.call(this, {
		method: 'POST',
		endpoint,
	});
}

/**
 * Get GL entries
 */
export async function getGlEntries(
	this: IExecuteFunctions,
	connectionId: string,
	filters?: IDataObject,
): Promise<IGlEntry[]> {
	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.glEntries,
		qs: {
			connectionId,
			...filters,
		},
	});

	return (response.entries || response) as IGlEntry[];
}

/**
 * Post GL entries
 */
export async function postGlEntries(
	this: IExecuteFunctions,
	connectionId: string,
	entries: IGlEntry[],
): Promise<IDataObject> {
	return gTreasuryApiRequest.call(this, {
		method: 'POST',
		endpoint: ERP_ENDPOINTS.glEntries,
		body: {
			connectionId,
			entries,
		},
	});
}

/**
 * Get AP data
 */
export async function getApData(
	this: IExecuteFunctions,
	connectionId: string,
	filters?: IDataObject,
): Promise<IApInvoice[]> {
	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.apData,
		qs: {
			connectionId,
			...filters,
		},
	});

	return (response.invoices || response) as IApInvoice[];
}

/**
 * Get AR data
 */
export async function getArData(
	this: IExecuteFunctions,
	connectionId: string,
	filters?: IDataObject,
): Promise<IArInvoice[]> {
	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.arData,
		qs: {
			connectionId,
			...filters,
		},
	});

	return (response.invoices || response) as IArInvoice[];
}

/**
 * Push data to ERP
 */
export async function pushToErp(
	this: IExecuteFunctions,
	connectionId: string,
	dataType: string,
	data: IDataObject[],
): Promise<IDataObject> {
	return gTreasuryApiRequest.call(this, {
		method: 'POST',
		endpoint: ERP_ENDPOINTS.push,
		body: {
			connectionId,
			dataType,
			data,
		},
	});
}

/**
 * Sync ERP data
 */
export async function syncErpData(
	this: IExecuteFunctions,
	connectionId: string,
	syncType: 'full' | 'incremental',
	dataTypes?: string[],
): Promise<IDataObject> {
	return gTreasuryApiRequest.call(this, {
		method: 'POST',
		endpoint: ERP_ENDPOINTS.sync,
		body: {
			connectionId,
			syncType,
			dataTypes,
		},
	});
}

/**
 * Get integration logs
 */
export async function getIntegrationLogs(
	this: IExecuteFunctions,
	connectionId?: string,
	startDate?: string,
	endDate?: string,
	status?: string,
): Promise<IDataObject[]> {
	const qs: IDataObject = {};
	if (connectionId) qs.connectionId = connectionId;
	if (startDate) qs.startDate = startDate;
	if (endDate) qs.endDate = endDate;
	if (status) qs.status = status;

	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.logs,
		qs,
	});

	return (response.logs || response) as IDataObject[];
}

// Workday-specific functions
export async function getWorkdayData(
	this: IExecuteFunctions,
	connectionId: string,
	dataType: 'journals' | 'bank_statements' | 'payments' | 'cash_balances',
	filters?: IDataObject,
): Promise<IDataObject[]> {
	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.workday,
		qs: {
			connectionId,
			dataType,
			...filters,
		},
	});

	return (response.data || response) as IDataObject[];
}

// NetSuite-specific functions
export async function getNetSuiteData(
	this: IExecuteFunctions,
	connectionId: string,
	recordType: string,
	searchFilters?: IDataObject,
): Promise<IDataObject[]> {
	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.netsuite,
		qs: {
			connectionId,
			recordType,
			...searchFilters,
		},
	});

	return (response.data || response) as IDataObject[];
}

// Oracle-specific functions
export async function getOracleData(
	this: IExecuteFunctions,
	connectionId: string,
	module: string,
	entity: string,
	filters?: IDataObject,
): Promise<IDataObject[]> {
	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.oracle,
		qs: {
			connectionId,
			module,
			entity,
			...filters,
		},
	});

	return (response.data || response) as IDataObject[];
}

// SAP-specific functions
export async function getSapData(
	this: IExecuteFunctions,
	connectionId: string,
	bapiName: string,
	params?: IDataObject,
): Promise<IDataObject> {
	return gTreasuryApiRequest.call(this, {
		method: 'POST',
		endpoint: ERP_ENDPOINTS.sap,
		body: {
			connectionId,
			bapiName,
			params,
		},
	});
}

// Microsoft Dynamics-specific functions
export async function getDynamicsData(
	this: IExecuteFunctions,
	connectionId: string,
	entity: string,
	select?: string[],
	filter?: string,
): Promise<IDataObject[]> {
	const qs: IDataObject = { connectionId, entity };
	if (select) qs.$select = select.join(',');
	if (filter) qs.$filter = filter;

	const response = await gTreasuryApiRequest.call(this, {
		method: 'GET',
		endpoint: ERP_ENDPOINTS.dynamics,
		qs,
	});

	return (response.value || response.data || response) as IDataObject[];
}

/**
 * Build GL entry from treasury transaction
 */
export function buildGlEntry(
	transaction: IDataObject,
	mapping: IDataObject,
): IGlEntry {
	return {
		date: transaction.date as string,
		postingDate: transaction.postingDate as string || transaction.date as string,
		description: transaction.description as string,
		reference: transaction.reference as string,
		lines: [
			{
				accountCode: mapping.debitAccount as string,
				debit: transaction.amount as number,
				currency: transaction.currency as string,
				entity: mapping.entity as string,
				costCenter: mapping.costCenter as string,
			},
			{
				accountCode: mapping.creditAccount as string,
				credit: transaction.amount as number,
				currency: transaction.currency as string,
				entity: mapping.entity as string,
				costCenter: mapping.costCenter as string,
			},
		],
		source: 'GTreasury',
	};
}

/**
 * Validate ERP system is supported
 */
export function validateErpSystem(system: string): boolean {
	const normalizedSystem = system.toLowerCase().replace(/[\s-_]/g, '_');
	return Object.keys(ERP_SYSTEMS).some(
		key => key.toLowerCase() === normalizedSystem ||
			ERP_SYSTEMS[key as keyof typeof ERP_SYSTEMS].value === normalizedSystem
	);
}

// Aliases for backward compatibility
export { postGlEntries as postGlEntry };
export { syncErpData as syncApData };
export { syncErpData as syncArData };

// Missing function - getSyncStatus
export async function getSyncStatus(
	this: IExecuteFunctions,
	erpSystem: string,
	syncId?: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('gTreasuryApi');
	const baseUrl = getBaseUrl(credentials);
	
	const endpoint = syncId 
		? `${baseUrl}/${API_VERSION}/erp/${erpSystem}/sync/${syncId}/status`
		: `${baseUrl}/${API_VERSION}/erp/${erpSystem}/sync/status`;

	const response = await this.helpers.httpRequest({
		method: 'GET',
		url: endpoint,
		headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
			'Content-Type': 'application/json',
		},
		json: true,
	});

	return response as IDataObject;
}
