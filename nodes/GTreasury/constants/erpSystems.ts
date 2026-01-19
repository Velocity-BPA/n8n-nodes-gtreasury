/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * ERP Systems Constants for GTreasury
 *
 * GTreasury integrates with major ERP systems for:
 * - GL posting
 * - Cash flow data
 * - AP/AR integration
 * - Bank reconciliation
 */

// Supported ERP Systems
export const ERP_SYSTEMS = {
	WORKDAY: {
		value: 'workday',
		name: 'Workday',
		description: 'Workday Financial Management',
		apiType: 'rest',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	NETSUITE: {
		value: 'netsuite',
		name: 'NetSuite',
		description: 'Oracle NetSuite ERP',
		apiType: 'soap_rest',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	ORACLE_CLOUD: {
		value: 'oracle_cloud',
		name: 'Oracle Cloud',
		description: 'Oracle Cloud ERP (Fusion)',
		apiType: 'rest',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	ORACLE_EBS: {
		value: 'oracle_ebs',
		name: 'Oracle E-Business Suite',
		description: 'Oracle E-Business Suite',
		apiType: 'plsql',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	SAP_S4HANA: {
		value: 'sap_s4hana',
		name: 'SAP S/4HANA',
		description: 'SAP S/4HANA Cloud & On-Premise',
		apiType: 'odata',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	SAP_ECC: {
		value: 'sap_ecc',
		name: 'SAP ECC',
		description: 'SAP ECC (R/3)',
		apiType: 'bapi',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	DYNAMICS_365_FO: {
		value: 'dynamics_365_fo',
		name: 'Microsoft Dynamics 365 F&O',
		description: 'Dynamics 365 Finance & Operations',
		apiType: 'odata',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	DYNAMICS_365_BC: {
		value: 'dynamics_365_bc',
		name: 'Microsoft Dynamics 365 BC',
		description: 'Dynamics 365 Business Central',
		apiType: 'rest',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	DYNAMICS_GP: {
		value: 'dynamics_gp',
		name: 'Microsoft Dynamics GP',
		description: 'Dynamics GP (Great Plains)',
		apiType: 'odbc',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	SAGE_INTACCT: {
		value: 'sage_intacct',
		name: 'Sage Intacct',
		description: 'Sage Intacct Cloud',
		apiType: 'xml',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	QUICKBOOKS: {
		value: 'quickbooks',
		name: 'QuickBooks',
		description: 'Intuit QuickBooks Online',
		apiType: 'rest',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	XERO: {
		value: 'xero',
		name: 'Xero',
		description: 'Xero Accounting',
		apiType: 'rest',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	INFOR: {
		value: 'infor',
		name: 'Infor',
		description: 'Infor CloudSuite Financials',
		apiType: 'rest',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	PEOPLESOFT: {
		value: 'peoplesoft',
		name: 'PeopleSoft',
		description: 'Oracle PeopleSoft',
		apiType: 'component_interface',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
	JDE: {
		value: 'jde',
		name: 'JD Edwards',
		description: 'Oracle JD Edwards',
		apiType: 'ais',
		glSupport: true,
		apSupport: true,
		arSupport: true,
	},
} as const;

// ERP Integration Types
export const ERP_INTEGRATION_TYPES = {
	REAL_TIME: {
		value: 'real_time',
		name: 'Real-Time',
		description: 'Synchronous API calls',
	},
	BATCH: {
		value: 'batch',
		name: 'Batch',
		description: 'Scheduled batch processing',
	},
	FILE_BASED: {
		value: 'file_based',
		name: 'File-Based',
		description: 'File import/export',
	},
	EVENT_DRIVEN: {
		value: 'event_driven',
		name: 'Event-Driven',
		description: 'Webhook/event notifications',
	},
} as const;

// GL Entry Types
export const GL_ENTRY_TYPES = {
	CASH_RECEIPT: { value: 'cash_receipt', name: 'Cash Receipt', description: 'Incoming cash' },
	CASH_DISBURSEMENT: { value: 'cash_disbursement', name: 'Cash Disbursement', description: 'Outgoing cash' },
	BANK_FEE: { value: 'bank_fee', name: 'Bank Fee', description: 'Bank service charges' },
	INTEREST_INCOME: { value: 'interest_income', name: 'Interest Income', description: 'Interest earned' },
	INTEREST_EXPENSE: { value: 'interest_expense', name: 'Interest Expense', description: 'Interest paid' },
	FX_GAIN: { value: 'fx_gain', name: 'FX Gain', description: 'Foreign exchange gain' },
	FX_LOSS: { value: 'fx_loss', name: 'FX Loss', description: 'Foreign exchange loss' },
	INTERCOMPANY: { value: 'intercompany', name: 'Intercompany', description: 'Intercompany transfer' },
	INVESTMENT: { value: 'investment', name: 'Investment', description: 'Investment transaction' },
	DEBT: { value: 'debt', name: 'Debt', description: 'Debt transaction' },
	HEDGING: { value: 'hedging', name: 'Hedging', description: 'Hedge transaction' },
	ADJUSTMENT: { value: 'adjustment', name: 'Adjustment', description: 'Manual adjustment' },
} as const;

// Data Sync Directions
export const SYNC_DIRECTIONS = {
	INBOUND: { value: 'inbound', name: 'Inbound', description: 'ERP to GTreasury' },
	OUTBOUND: { value: 'outbound', name: 'Outbound', description: 'GTreasury to ERP' },
	BIDIRECTIONAL: { value: 'bidirectional', name: 'Bidirectional', description: 'Two-way sync' },
} as const;

// Data Entity Types
export const ERP_DATA_ENTITIES = {
	CHART_OF_ACCOUNTS: {
		value: 'chart_of_accounts',
		name: 'Chart of Accounts',
		description: 'GL account structure',
	},
	COST_CENTERS: {
		value: 'cost_centers',
		name: 'Cost Centers',
		description: 'Cost center hierarchy',
	},
	LEGAL_ENTITIES: {
		value: 'legal_entities',
		name: 'Legal Entities',
		description: 'Company/entity structure',
	},
	VENDORS: {
		value: 'vendors',
		name: 'Vendors',
		description: 'Vendor master data',
	},
	CUSTOMERS: {
		value: 'customers',
		name: 'Customers',
		description: 'Customer master data',
	},
	BANK_ACCOUNTS: {
		value: 'bank_accounts',
		name: 'Bank Accounts',
		description: 'Bank account master',
	},
	INVOICES: {
		value: 'invoices',
		name: 'Invoices',
		description: 'AP/AR invoices',
	},
	PAYMENTS: {
		value: 'payments',
		name: 'Payments',
		description: 'Payment transactions',
	},
	JOURNAL_ENTRIES: {
		value: 'journal_entries',
		name: 'Journal Entries',
		description: 'GL journal entries',
	},
} as const;

// Common ERP File Formats
export const ERP_FILE_FORMATS = {
	CSV: { value: 'csv', name: 'CSV', description: 'Comma-separated values' },
	XML: { value: 'xml', name: 'XML', description: 'Extensible Markup Language' },
	JSON: { value: 'json', name: 'JSON', description: 'JavaScript Object Notation' },
	EXCEL: { value: 'xlsx', name: 'Excel', description: 'Microsoft Excel' },
	EDI: { value: 'edi', name: 'EDI', description: 'Electronic Data Interchange' },
	IDOC: { value: 'idoc', name: 'IDoc', description: 'SAP Intermediate Document' },
	FLAT_FILE: { value: 'flat', name: 'Flat File', description: 'Fixed-width text file' },
} as const;

// Workday Specific Config
export const WORKDAY_CONFIG = {
	apiVersion: 'v41.0',
	modules: ['Financial_Management', 'Cash_Management', 'Banking'],
	dataTypes: ['Journal', 'Bank_Statement', 'Payment', 'Cash_Balance'],
} as const;

// NetSuite Specific Config
export const NETSUITE_CONFIG = {
	apiVersion: '2023.2',
	restletTypes: ['search', 'create', 'update', 'delete'],
	customRecords: ['customrecord_bank_account', 'customrecord_cash_position'],
} as const;

// SAP Specific Config
export const SAP_CONFIG = {
	rfcDestination: 'SAP_PROD',
	bapiModules: ['BAPI_ACC_GL_POSTING_POST', 'BAPI_ACC_DOCUMENT_POST'],
	idocTypes: ['FINSTA01', 'FINSTA03', 'PEXR2002'],
} as const;

// Oracle Specific Config
export const ORACLE_CONFIG = {
	cloudVersion: '23B',
	modules: ['Financials', 'Cash Management', 'Payments'],
	biPublisher: true,
} as const;

// Microsoft Dynamics Specific Config
export const DYNAMICS_CONFIG = {
	apiVersion: '1.0',
	oDataVersion: '4.0',
	integrationTypes: ['dual-write', 'data-export', 'virtual-entity'],
} as const;

// Helper to get ERP system info
export function getErpSystem(system: string): typeof ERP_SYSTEMS[keyof typeof ERP_SYSTEMS] | undefined {
	return ERP_SYSTEMS[system.toUpperCase() as keyof typeof ERP_SYSTEMS];
}

// Helper to check if ERP supports real-time integration
export function supportsRealTimeIntegration(system: string): boolean {
	const erp = getErpSystem(system);
	if (!erp) return false;
	return ['rest', 'odata', 'soap_rest'].includes(erp.apiType);
}
