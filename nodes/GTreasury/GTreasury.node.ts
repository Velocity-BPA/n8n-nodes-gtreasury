/**
 * GTreasury Node for n8n
 * Corporate Treasury Management Platform Integration
 *
 * Copyright (c) 2025 Velocity BPA
 *
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://mariadb.com/bsl11/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Change Date: 2029-01-01
 * Change License: Apache License, Version 2.0
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as cashManagement from './actions/cashManagement';
import * as bankAccount from './actions/bankAccount';
import * as bankConnectivity from './actions/bankConnectivity';
import * as payment from './actions/payment';
import * as cashForecasting from './actions/cashForecasting';
import * as investment from './actions/investment';
import * as debt from './actions/debt';
import * as fx from './actions/fx';
import * as intercompany from './actions/intercompany';
import * as erpIntegration from './actions/erpIntegration';
import * as bankFeeAnalysis from './actions/bankFeeAnalysis';
import * as entity from './actions/entity';
import * as counterparty from './actions/counterparty';
import * as reporting from './actions/reporting';
import * as workflow from './actions/workflow';
import * as userManagement from './actions/userManagement';
import * as audit from './actions/audit';
import * as marketData from './actions/marketData';
import * as riskManagement from './actions/riskManagement';
import * as gsmartAi from './actions/gsmartAi';
import * as utility from './actions/utility';

export class GTreasury implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GTreasury',
		name: 'gTreasury',
		icon: 'file:gtreasury.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Corporate Treasury Management Platform - Cash Management, Payments, FX, Forecasting & More',
		defaults: {
			name: 'GTreasury',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'gTreasuryApi',
				required: true,
			},
			{
				name: 'gTreasuryClearConnect',
				required: false,
				displayOptions: {
					show: {
						resource: ['bankConnectivity'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Audit',
						value: 'audit',
						description: 'Audit logs and compliance tracking',
					},
					{
						name: 'Bank Account',
						value: 'bankAccount',
						description: 'Bank account management',
					},
					{
						name: 'Bank Connectivity',
						value: 'bankConnectivity',
						description: 'ClearConnect Gateway bank connections',
					},
					{
						name: 'Bank Fee Analysis',
						value: 'bankFeeAnalysis',
						description: 'AFP bank fee analysis',
					},
					{
						name: 'Cash Forecasting',
						value: 'cashForecasting',
						description: 'Cash flow forecasting and projections',
					},
					{
						name: 'Cash Management',
						value: 'cashManagement',
						description: 'Cash positions, balances, and transactions',
					},
					{
						name: 'Counterparty',
						value: 'counterparty',
						description: 'Counterparty and vendor management',
					},
					{
						name: 'Debt',
						value: 'debt',
						description: 'Debt instruments and covenant tracking',
					},
					{
						name: 'Entity',
						value: 'entity',
						description: 'Legal entity management',
					},
					{
						name: 'ERP Integration',
						value: 'erpIntegration',
						description: 'ERP system integration and GL posting',
					},
					{
						name: 'FX',
						value: 'fx',
						description: 'Foreign exchange and hedging',
					},
					{
						name: 'GSmart AI',
						value: 'gsmartAi',
						description: 'AI-powered treasury insights',
					},
					{
						name: 'Intercompany',
						value: 'intercompany',
						description: 'Intercompany netting and settlements',
					},
					{
						name: 'Investment',
						value: 'investment',
						description: 'Investment portfolio management',
					},
					{
						name: 'Market Data',
						value: 'marketData',
						description: 'Market rates and financial data',
					},
					{
						name: 'Payment',
						value: 'payment',
						description: 'Payment processing and approvals',
					},
					{
						name: 'Reporting',
						value: 'reporting',
						description: 'Reports and dashboards',
					},
					{
						name: 'Risk Management',
						value: 'riskManagement',
						description: 'Risk assessment and exposure tracking',
					},
					{
						name: 'User Management',
						value: 'userManagement',
						description: 'Users, roles, and permissions',
					},
					{
						name: 'Utility',
						value: 'utility',
						description: 'Utility operations and helpers',
					},
					{
						name: 'Workflow',
						value: 'workflow',
						description: 'Approval workflows and routing',
					},
				],
				default: 'cashManagement',
			},

			// =====================================================
			// CASH MANAGEMENT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cashManagement'],
					},
				},
				options: [
					{
						name: 'Get Cash Position',
						value: 'getCashPosition',
						description: 'Get current cash position summary',
						action: 'Get cash position',
					},
					{
						name: 'Get Balance',
						value: 'getBalance',
						description: 'Get account balance details',
						action: 'Get balance',
					},
					{
						name: 'List Transactions',
						value: 'listTransactions',
						description: 'List cash transactions',
						action: 'List transactions',
					},
					{
						name: 'Create Transaction',
						value: 'createTransaction',
						description: 'Create a new cash transaction',
						action: 'Create transaction',
					},
					{
						name: 'Execute ZBA Sweep',
						value: 'executeZbaSweep',
						description: 'Execute Zero Balance Account sweep',
						action: 'Execute ZBA sweep',
					},
					{
						name: 'Get Pool Balance',
						value: 'getPoolBalance',
						description: 'Get cash pool consolidated balance',
						action: 'Get pool balance',
					},
					{
						name: 'Reconcile Account',
						value: 'reconcileAccount',
						description: 'Perform account reconciliation',
						action: 'Reconcile account',
					},
				],
				default: 'getCashPosition',
			},

			// =====================================================
			// BANK ACCOUNT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['bankAccount'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new bank account',
						action: 'Create bank account',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a bank account',
						action: 'Delete bank account',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get bank account details',
						action: 'Get bank account',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get multiple bank accounts',
						action: 'Get many bank accounts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a bank account',
						action: 'Update bank account',
					},
					{
						name: 'Get Signatories',
						value: 'getSignatories',
						description: 'Get account signatories',
						action: 'Get signatories',
					},
					{
						name: 'Update Signatories',
						value: 'updateSignatories',
						description: 'Update account signatories',
						action: 'Update signatories',
					},
				],
				default: 'getMany',
			},

			// =====================================================
			// BANK CONNECTIVITY OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['bankConnectivity'],
					},
				},
				options: [
					{
						name: 'Get Connection Status',
						value: 'getConnectionStatus',
						description: 'Get bank connection status',
						action: 'Get connection status',
					},
					{
						name: 'List Connections',
						value: 'listConnections',
						description: 'List all bank connections',
						action: 'List connections',
					},
					{
						name: 'Test Connection',
						value: 'testConnection',
						description: 'Test bank connection',
						action: 'Test connection',
					},
					{
						name: 'Download Statement',
						value: 'downloadStatement',
						description: 'Download bank statement',
						action: 'Download statement',
					},
					{
						name: 'Parse Statement',
						value: 'parseStatement',
						description: 'Parse bank statement (BAI2/MT940/camt.053)',
						action: 'Parse statement',
					},
					{
						name: 'Get Real-Time Balance',
						value: 'getRealTimeBalance',
						description: 'Get real-time balance via API',
						action: 'Get real-time balance',
					},
					{
						name: 'Send Payment File',
						value: 'sendPaymentFile',
						description: 'Send payment file to bank',
						action: 'Send payment file',
					},
				],
				default: 'listConnections',
			},

			// =====================================================
			// PAYMENT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['payment'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new payment',
						action: 'Create payment',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get payment details',
						action: 'Get payment',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get multiple payments',
						action: 'Get many payments',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a payment',
						action: 'Update payment',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a payment',
						action: 'Delete payment',
					},
					{
						name: 'Approve',
						value: 'approve',
						description: 'Approve a payment',
						action: 'Approve payment',
					},
					{
						name: 'Reject',
						value: 'reject',
						description: 'Reject a payment',
						action: 'Reject payment',
					},
					{
						name: 'Submit',
						value: 'submit',
						description: 'Submit payment for processing',
						action: 'Submit payment',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get payment status',
						action: 'Get payment status',
					},
					{
						name: 'Create Batch',
						value: 'createBatch',
						description: 'Create a payment batch',
						action: 'Create payment batch',
					},
					{
						name: 'Release Batch',
						value: 'releaseBatch',
						description: 'Release payment batch to bank',
						action: 'Release payment batch',
					},
				],
				default: 'getMany',
			},

			// =====================================================
			// CASH FORECASTING OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cashForecasting'],
					},
				},
				options: [
					{
						name: 'Get Forecast',
						value: 'getForecast',
						description: 'Get cash flow forecast',
						action: 'Get forecast',
					},
					{
						name: 'Create Forecast',
						value: 'createForecast',
						description: 'Create a new forecast',
						action: 'Create forecast',
					},
					{
						name: 'Update Forecast',
						value: 'updateForecast',
						description: 'Update forecast data',
						action: 'Update forecast',
					},
					{
						name: 'Get Variance',
						value: 'getVariance',
						description: 'Get forecast vs actual variance',
						action: 'Get variance',
					},
					{
						name: 'Import Forecast Data',
						value: 'importForecastData',
						description: 'Import forecast data from file',
						action: 'Import forecast data',
					},
					{
						name: 'Get Categories',
						value: 'getCategories',
						description: 'Get forecast categories',
						action: 'Get categories',
					},
					{
						name: 'Run Scenario',
						value: 'runScenario',
						description: 'Run forecast scenario analysis',
						action: 'Run scenario',
					},
				],
				default: 'getForecast',
			},

			// =====================================================
			// INVESTMENT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['investment'],
					},
				},
				options: [
					{
						name: 'Get Portfolio',
						value: 'getPortfolio',
						description: 'Get investment portfolio summary',
						action: 'Get portfolio',
					},
					{
						name: 'List Investments',
						value: 'listInvestments',
						description: 'List all investments',
						action: 'List investments',
					},
					{
						name: 'Create Investment',
						value: 'createInvestment',
						description: 'Create a new investment',
						action: 'Create investment',
					},
					{
						name: 'Update Investment',
						value: 'updateInvestment',
						description: 'Update investment details',
						action: 'Update investment',
					},
					{
						name: 'Get Maturities',
						value: 'getMaturities',
						description: 'Get upcoming maturities',
						action: 'Get maturities',
					},
					{
						name: 'Calculate Yield',
						value: 'calculateYield',
						description: 'Calculate investment yield',
						action: 'Calculate yield',
					},
					{
						name: 'Get Policy Compliance',
						value: 'getPolicyCompliance',
						description: 'Check investment policy compliance',
						action: 'Get policy compliance',
					},
				],
				default: 'getPortfolio',
			},

			// =====================================================
			// DEBT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['debt'],
					},
				},
				options: [
					{
						name: 'List Debt Instruments',
						value: 'listDebtInstruments',
						description: 'List all debt instruments',
						action: 'List debt instruments',
					},
					{
						name: 'Get Debt Instrument',
						value: 'getDebtInstrument',
						description: 'Get debt instrument details',
						action: 'Get debt instrument',
					},
					{
						name: 'Create Debt Instrument',
						value: 'createDebtInstrument',
						description: 'Create a new debt instrument',
						action: 'Create debt instrument',
					},
					{
						name: 'Update Debt Instrument',
						value: 'updateDebtInstrument',
						description: 'Update debt instrument',
						action: 'Update debt instrument',
					},
					{
						name: 'Record Draw',
						value: 'recordDraw',
						description: 'Record a debt draw',
						action: 'Record draw',
					},
					{
						name: 'Record Payment',
						value: 'recordPayment',
						description: 'Record debt payment',
						action: 'Record payment',
					},
					{
						name: 'Get Covenants',
						value: 'getCovenants',
						description: 'Get covenant status',
						action: 'Get covenants',
					},
					{
						name: 'Check Covenant Compliance',
						value: 'checkCovenantCompliance',
						description: 'Check covenant compliance',
						action: 'Check covenant compliance',
					},
					{
						name: 'Get Amortization Schedule',
						value: 'getAmortizationSchedule',
						description: 'Get amortization schedule',
						action: 'Get amortization schedule',
					},
				],
				default: 'listDebtInstruments',
			},

			// =====================================================
			// FX OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['fx'],
					},
				},
				options: [
					{
						name: 'Get Exposure',
						value: 'getExposure',
						description: 'Get FX exposure summary',
						action: 'Get exposure',
					},
					{
						name: 'List Deals',
						value: 'listDeals',
						description: 'List FX deals',
						action: 'List deals',
					},
					{
						name: 'Create Deal',
						value: 'createDeal',
						description: 'Create a new FX deal',
						action: 'Create deal',
					},
					{
						name: 'Update Deal',
						value: 'updateDeal',
						description: 'Update FX deal',
						action: 'Update deal',
					},
					{
						name: 'Get Quote',
						value: 'getQuote',
						description: 'Get FX quote',
						action: 'Get quote',
					},
					{
						name: 'Execute Trade',
						value: 'executeTrade',
						description: 'Execute FX trade',
						action: 'Execute trade',
					},
					{
						name: 'Get Hedge Position',
						value: 'getHedgePosition',
						description: 'Get hedge position summary',
						action: 'Get hedge position',
					},
					{
						name: 'Calculate Mark to Market',
						value: 'calculateMtm',
						description: 'Calculate mark to market',
						action: 'Calculate mark to market',
					},
					{
						name: 'Get Hedge Effectiveness',
						value: 'getHedgeEffectiveness',
						description: 'Get hedge effectiveness report',
						action: 'Get hedge effectiveness',
					},
				],
				default: 'getExposure',
			},

			// =====================================================
			// INTERCOMPANY OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['intercompany'],
					},
				},
				options: [
					{
						name: 'Get Netting Position',
						value: 'getNettingPosition',
						description: 'Get intercompany netting position',
						action: 'Get netting position',
					},
					{
						name: 'Create Netting Cycle',
						value: 'createNettingCycle',
						description: 'Create a new netting cycle',
						action: 'Create netting cycle',
					},
					{
						name: 'List Invoices',
						value: 'listInvoices',
						description: 'List intercompany invoices',
						action: 'List invoices',
					},
					{
						name: 'Create Invoice',
						value: 'createInvoice',
						description: 'Create intercompany invoice',
						action: 'Create invoice',
					},
					{
						name: 'Match Invoices',
						value: 'matchInvoices',
						description: 'Match intercompany invoices',
						action: 'Match invoices',
					},
					{
						name: 'Execute Settlement',
						value: 'executeSettlement',
						description: 'Execute netting settlement',
						action: 'Execute settlement',
					},
					{
						name: 'Get Settlement Report',
						value: 'getSettlementReport',
						description: 'Get settlement report',
						action: 'Get settlement report',
					},
				],
				default: 'getNettingPosition',
			},

			// =====================================================
			// ERP INTEGRATION OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['erpIntegration'],
					},
				},
				options: [
					{
						name: 'Post GL Entry',
						value: 'postGlEntry',
						description: 'Post journal entry to GL',
						action: 'Post GL entry',
					},
					{
						name: 'Get GL Entries',
						value: 'getGlEntries',
						description: 'Get GL entries',
						action: 'Get GL entries',
					},
					{
						name: 'Sync AP Data',
						value: 'syncApData',
						description: 'Sync accounts payable data',
						action: 'Sync AP data',
					},
					{
						name: 'Sync AR Data',
						value: 'syncArData',
						description: 'Sync accounts receivable data',
						action: 'Sync AR data',
					},
					{
						name: 'Get Sync Status',
						value: 'getSyncStatus',
						description: 'Get ERP sync status',
						action: 'Get sync status',
					},
					{
						name: 'Map Accounts',
						value: 'mapAccounts',
						description: 'Map treasury to ERP accounts',
						action: 'Map accounts',
					},
					{
						name: 'Run Reconciliation',
						value: 'runReconciliation',
						description: 'Run GL reconciliation',
						action: 'Run reconciliation',
					},
				],
				default: 'getSyncStatus',
			},

			// =====================================================
			// BANK FEE ANALYSIS OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['bankFeeAnalysis'],
					},
				},
				options: [
					{
						name: 'Get Fee Summary',
						value: 'getFeeSummary',
						description: 'Get bank fee summary',
						action: 'Get fee summary',
					},
					{
						name: 'Import Statement',
						value: 'importStatement',
						description: 'Import AFP fee statement',
						action: 'Import statement',
					},
					{
						name: 'Analyze Fees',
						value: 'analyzeFees',
						description: 'Analyze bank fees',
						action: 'Analyze fees',
					},
					{
						name: 'Get Service Charges',
						value: 'getServiceCharges',
						description: 'Get service charges by category',
						action: 'Get service charges',
					},
					{
						name: 'Compare Banks',
						value: 'compareBanks',
						description: 'Compare fees across banks',
						action: 'Compare banks',
					},
					{
						name: 'Get Trend Analysis',
						value: 'getTrendAnalysis',
						description: 'Get fee trend analysis',
						action: 'Get trend analysis',
					},
				],
				default: 'getFeeSummary',
			},

			// =====================================================
			// ENTITY OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['entity'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new entity',
						action: 'Create entity',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an entity',
						action: 'Delete entity',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get entity details',
						action: 'Get entity',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get multiple entities',
						action: 'Get many entities',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an entity',
						action: 'Update entity',
					},
					{
						name: 'Get Hierarchy',
						value: 'getHierarchy',
						description: 'Get entity hierarchy',
						action: 'Get hierarchy',
					},
				],
				default: 'getMany',
			},

			// =====================================================
			// COUNTERPARTY OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['counterparty'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new counterparty',
						action: 'Create counterparty',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a counterparty',
						action: 'Delete counterparty',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get counterparty details',
						action: 'Get counterparty',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get multiple counterparties',
						action: 'Get many counterparties',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a counterparty',
						action: 'Update counterparty',
					},
					{
						name: 'Get Bank Details',
						value: 'getBankDetails',
						description: 'Get counterparty bank details',
						action: 'Get bank details',
					},
					{
						name: 'Verify Bank Details',
						value: 'verifyBankDetails',
						description: 'Verify counterparty bank details',
						action: 'Verify bank details',
					},
				],
				default: 'getMany',
			},

			// =====================================================
			// REPORTING OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['reporting'],
					},
				},
				options: [
					{
						name: 'List Reports',
						value: 'listReports',
						description: 'List available reports',
						action: 'List reports',
					},
					{
						name: 'Run Report',
						value: 'runReport',
						description: 'Run a report',
						action: 'Run report',
					},
					{
						name: 'Get Report',
						value: 'getReport',
						description: 'Get report results',
						action: 'Get report',
					},
					{
						name: 'Schedule Report',
						value: 'scheduleReport',
						description: 'Schedule a report',
						action: 'Schedule report',
					},
					{
						name: 'Export Report',
						value: 'exportReport',
						description: 'Export report to file',
						action: 'Export report',
					},
					{
						name: 'Get Dashboard',
						value: 'getDashboard',
						description: 'Get dashboard data',
						action: 'Get dashboard',
					},
				],
				default: 'listReports',
			},

			// =====================================================
			// WORKFLOW OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workflow'],
					},
				},
				options: [
					{
						name: 'Get Pending Approvals',
						value: 'getPendingApprovals',
						description: 'Get pending approval items',
						action: 'Get pending approvals',
					},
					{
						name: 'Approve Item',
						value: 'approveItem',
						description: 'Approve a workflow item',
						action: 'Approve item',
					},
					{
						name: 'Reject Item',
						value: 'rejectItem',
						description: 'Reject a workflow item',
						action: 'Reject item',
					},
					{
						name: 'Get Workflow History',
						value: 'getWorkflowHistory',
						description: 'Get workflow history',
						action: 'Get workflow history',
					},
					{
						name: 'Reassign Item',
						value: 'reassignItem',
						description: 'Reassign workflow item',
						action: 'Reassign item',
					},
					{
						name: 'Get Rules',
						value: 'getRules',
						description: 'Get workflow rules',
						action: 'Get rules',
					},
				],
				default: 'getPendingApprovals',
			},

			// =====================================================
			// USER MANAGEMENT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
					},
				},
				options: [
					{
						name: 'Create User',
						value: 'createUser',
						description: 'Create a new user',
						action: 'Create user',
					},
					{
						name: 'Get User',
						value: 'getUser',
						description: 'Get user details',
						action: 'Get user',
					},
					{
						name: 'List Users',
						value: 'listUsers',
						description: 'List all users',
						action: 'List users',
					},
					{
						name: 'Update User',
						value: 'updateUser',
						description: 'Update user details',
						action: 'Update user',
					},
					{
						name: 'Deactivate User',
						value: 'deactivateUser',
						description: 'Deactivate a user',
						action: 'Deactivate user',
					},
					{
						name: 'Get Roles',
						value: 'getRoles',
						description: 'Get available roles',
						action: 'Get roles',
					},
					{
						name: 'Assign Role',
						value: 'assignRole',
						description: 'Assign role to user',
						action: 'Assign role',
					},
				],
				default: 'listUsers',
			},

			// =====================================================
			// AUDIT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['audit'],
					},
				},
				options: [
					{
						name: 'Get Audit Log',
						value: 'getAuditLog',
						description: 'Get audit log entries',
						action: 'Get audit log',
					},
					{
						name: 'Search Audit Log',
						value: 'searchAuditLog',
						description: 'Search audit log',
						action: 'Search audit log',
					},
					{
						name: 'Get Change History',
						value: 'getChangeHistory',
						description: 'Get entity change history',
						action: 'Get change history',
					},
					{
						name: 'Export Audit Log',
						value: 'exportAuditLog',
						description: 'Export audit log to file',
						action: 'Export audit log',
					},
				],
				default: 'getAuditLog',
			},

			// =====================================================
			// MARKET DATA OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['marketData'],
					},
				},
				options: [
					{
						name: 'Get FX Rates',
						value: 'getFxRates',
						description: 'Get current FX rates',
						action: 'Get FX rates',
					},
					{
						name: 'Get Interest Rates',
						value: 'getInterestRates',
						description: 'Get interest rates',
						action: 'Get interest rates',
					},
					{
						name: 'Get Historical Rates',
						value: 'getHistoricalRates',
						description: 'Get historical rates',
						action: 'Get historical rates',
					},
					{
						name: 'Get Yield Curve',
						value: 'getYieldCurve',
						description: 'Get yield curve data',
						action: 'Get yield curve',
					},
					{
						name: 'Subscribe to Rates',
						value: 'subscribeToRates',
						description: 'Subscribe to rate updates',
						action: 'Subscribe to rates',
					},
				],
				default: 'getFxRates',
			},

			// =====================================================
			// RISK MANAGEMENT OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['riskManagement'],
					},
				},
				options: [
					{
						name: 'Get Risk Dashboard',
						value: 'getRiskDashboard',
						description: 'Get risk dashboard summary',
						action: 'Get risk dashboard',
					},
					{
						name: 'Get Counterparty Risk',
						value: 'getCounterpartyRisk',
						description: 'Get counterparty risk exposure',
						action: 'Get counterparty risk',
					},
					{
						name: 'Get Liquidity Risk',
						value: 'getLiquidityRisk',
						description: 'Get liquidity risk metrics',
						action: 'Get liquidity risk',
					},
					{
						name: 'Get FX Risk',
						value: 'getFxRisk',
						description: 'Get FX risk exposure',
						action: 'Get FX risk',
					},
					{
						name: 'Run Stress Test',
						value: 'runStressTest',
						description: 'Run risk stress test',
						action: 'Run stress test',
					},
					{
						name: 'Get VaR Report',
						value: 'getVarReport',
						description: 'Get Value at Risk report',
						action: 'Get VaR report',
					},
				],
				default: 'getRiskDashboard',
			},

			// =====================================================
			// GSMART AI OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['gsmartAi'],
					},
				},
				options: [
					{
						name: 'Get Insights',
						value: 'getInsights',
						description: 'Get AI-generated treasury insights',
						action: 'Get insights',
					},
					{
						name: 'Get Recommendations',
						value: 'getRecommendations',
						description: 'Get AI recommendations',
						action: 'Get recommendations',
					},
					{
						name: 'Analyze Cash Flow',
						value: 'analyzeCashFlow',
						description: 'AI cash flow analysis',
						action: 'Analyze cash flow',
					},
					{
						name: 'Predict Forecast',
						value: 'predictForecast',
						description: 'AI-powered forecast prediction',
						action: 'Predict forecast',
					},
					{
						name: 'Detect Anomalies',
						value: 'detectAnomalies',
						description: 'Detect transaction anomalies',
						action: 'Detect anomalies',
					},
					{
						name: 'Optimize Liquidity',
						value: 'optimizeLiquidity',
						description: 'AI liquidity optimization',
						action: 'Optimize liquidity',
					},
				],
				default: 'getInsights',
			},

			// =====================================================
			// UTILITY OPERATIONS
			// =====================================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['utility'],
					},
				},
				options: [
					{
						name: 'Validate IBAN',
						value: 'validateIban',
						description: 'Validate IBAN number',
						action: 'Validate IBAN',
					},
					{
						name: 'Validate BIC',
						value: 'validateBic',
						description: 'Validate BIC/SWIFT code',
						action: 'Validate BIC',
					},
					{
						name: 'Calculate Value Date',
						value: 'calculateValueDate',
						description: 'Calculate payment value date',
						action: 'Calculate value date',
					},
					{
						name: 'Convert Currency',
						value: 'convertCurrency',
						description: 'Convert currency amount',
						action: 'Convert currency',
					},
					{
						name: 'Get Holiday Calendar',
						value: 'getHolidayCalendar',
						description: 'Get banking holiday calendar',
						action: 'Get holiday calendar',
					},
					{
						name: 'Lookup Bank',
						value: 'lookupBank',
						description: 'Look up bank by BIC or routing number',
						action: 'Look up bank',
					},
				],
				default: 'validateIban',
			},

			// =====================================================
			// COMMON FIELDS USED ACROSS RESOURCES
			// =====================================================

			// Account ID field
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cashManagement', 'bankAccount'],
						operation: ['getBalance', 'get', 'update', 'delete', 'reconcileAccount', 'getSignatories', 'updateSignatories'],
					},
				},
				default: '',
				description: 'The ID of the bank account',
			},

			// Entity ID field
			{
				displayName: 'Entity ID',
				name: 'entityId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['entity', 'cashManagement'],
						operation: ['get', 'update', 'delete', 'getCashPosition', 'getPoolBalance'],
					},
				},
				default: '',
				description: 'The ID of the legal entity',
			},

			// Payment ID field
			{
				displayName: 'Payment ID',
				name: 'paymentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['get', 'update', 'delete', 'approve', 'reject', 'submit', 'getStatus'],
					},
				},
				default: '',
				description: 'The ID of the payment',
			},

			// Date range fields
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['cashManagement', 'cashForecasting', 'reporting', 'audit'],
						operation: ['listTransactions', 'getForecast', 'getVariance', 'runReport', 'getAuditLog', 'searchAuditLog'],
					},
				},
				default: '',
				description: 'Start date for the query',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				displayOptions: {
					show: {
						resource: ['cashManagement', 'cashForecasting', 'reporting', 'audit'],
						operation: ['listTransactions', 'getForecast', 'getVariance', 'runReport', 'getAuditLog', 'searchAuditLog'],
					},
				},
				default: '',
				description: 'End date for the query',
			},

			// Currency field
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['cashManagement', 'payment', 'fx', 'investment'],
						operation: ['getCashPosition', 'create', 'getExposure', 'getQuote', 'createInvestment'],
					},
				},
				default: 'USD',
				description: 'ISO 4217 currency code',
			},

			// Amount field
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
				},
				displayOptions: {
					show: {
						resource: ['payment', 'cashManagement', 'fx', 'investment', 'debt'],
						operation: ['create', 'createTransaction', 'createDeal', 'executeTrade', 'createInvestment', 'recordDraw', 'recordPayment'],
					},
				},
				default: 0,
				description: 'Transaction amount',
			},

			// Connection ID for bank connectivity
			{
				displayName: 'Connection ID',
				name: 'connectionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['bankConnectivity'],
						operation: ['getConnectionStatus', 'testConnection', 'downloadStatement', 'getRealTimeBalance', 'sendPaymentFile'],
					},
				},
				default: '',
				description: 'The bank connection ID',
			},

			// Statement format
			{
				displayName: 'Statement Format',
				name: 'statementFormat',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['bankConnectivity'],
						operation: ['downloadStatement', 'parseStatement'],
					},
				},
				options: [
					{ name: 'BAI2', value: 'BAI2' },
					{ name: 'MT940', value: 'MT940' },
					{ name: 'camt.053', value: 'CAMT053' },
					{ name: 'Auto-Detect', value: 'AUTO' },
				],
				default: 'AUTO',
				description: 'Bank statement format',
			},

			// Forecast ID
			{
				displayName: 'Forecast ID',
				name: 'forecastId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['cashForecasting'],
						operation: ['getForecast', 'updateForecast', 'getVariance'],
					},
				},
				default: '',
				description: 'The forecast ID',
			},

			// Investment ID
			{
				displayName: 'Investment ID',
				name: 'investmentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['investment'],
						operation: ['updateInvestment', 'calculateYield'],
					},
				},
				default: '',
				description: 'The investment ID',
			},

			// Debt Instrument ID
			{
				displayName: 'Debt Instrument ID',
				name: 'debtInstrumentId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['debt'],
						operation: ['getDebtInstrument', 'updateDebtInstrument', 'recordDraw', 'recordPayment', 'getCovenants', 'checkCovenantCompliance', 'getAmortizationSchedule'],
					},
				},
				default: '',
				description: 'The debt instrument ID',
			},

			// FX Deal ID
			{
				displayName: 'Deal ID',
				name: 'dealId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['fx'],
						operation: ['updateDeal', 'executeTrade'],
					},
				},
				default: '',
				description: 'The FX deal ID',
			},

			// Currency pair for FX
			{
				displayName: 'Currency Pair',
				name: 'currencyPair',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['fx', 'marketData'],
						operation: ['getQuote', 'createDeal', 'executeTrade', 'getFxRates', 'getHistoricalRates'],
					},
				},
				default: 'EUR/USD',
				placeholder: 'EUR/USD',
				description: 'Currency pair (e.g., EUR/USD)',
			},

			// Netting Cycle ID
			{
				displayName: 'Netting Cycle ID',
				name: 'nettingCycleId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['intercompany'],
						operation: ['getNettingPosition', 'executeSettlement', 'getSettlementReport'],
					},
				},
				default: '',
				description: 'The netting cycle ID',
			},

			// ERP System selection
			{
				displayName: 'ERP System',
				name: 'erpSystem',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['erpIntegration'],
					},
				},
				options: [
					{ name: 'Workday', value: 'WORKDAY' },
					{ name: 'NetSuite', value: 'NETSUITE' },
					{ name: 'Oracle Cloud', value: 'ORACLE' },
					{ name: 'SAP S/4HANA', value: 'SAP' },
					{ name: 'Microsoft Dynamics 365', value: 'DYNAMICS' },
					{ name: 'Sage Intacct', value: 'SAGE_INTACCT' },
					{ name: 'QuickBooks', value: 'QUICKBOOKS' },
					{ name: 'Xero', value: 'XERO' },
					{ name: 'Other', value: 'OTHER' },
				],
				default: 'WORKDAY',
				description: 'The ERP system to integrate with',
			},

			// Report ID
			{
				displayName: 'Report ID',
				name: 'reportId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['reporting'],
						operation: ['getReport', 'runReport', 'scheduleReport', 'exportReport'],
					},
				},
				default: '',
				description: 'The report ID',
			},

			// Workflow Item ID
			{
				displayName: 'Workflow Item ID',
				name: 'workflowItemId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['workflow'],
						operation: ['approveItem', 'rejectItem', 'getWorkflowHistory', 'reassignItem'],
					},
				},
				default: '',
				description: 'The workflow item ID',
			},

			// User ID
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['userManagement'],
						operation: ['getUser', 'updateUser', 'deactivateUser', 'assignRole'],
					},
				},
				default: '',
				description: 'The user ID',
			},

			// Counterparty ID
			{
				displayName: 'Counterparty ID',
				name: 'counterpartyId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['counterparty', 'riskManagement'],
						operation: ['get', 'update', 'delete', 'getBankDetails', 'verifyBankDetails', 'getCounterpartyRisk'],
					},
				},
				default: '',
				description: 'The counterparty ID',
			},

			// IBAN field
			{
				displayName: 'IBAN',
				name: 'iban',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['validateIban'],
					},
				},
				default: '',
				placeholder: 'DE89370400440532013000',
				description: 'The IBAN to validate',
			},

			// BIC field
			{
				displayName: 'BIC/SWIFT Code',
				name: 'bic',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['validateBic', 'lookupBank'],
					},
				},
				default: '',
				placeholder: 'COBADEFFXXX',
				description: 'The BIC/SWIFT code',
			},

			// Batch ID
			{
				displayName: 'Batch ID',
				name: 'batchId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['releaseBatch'],
					},
				},
				default: '',
				description: 'The payment batch ID',
			},

			// Additional options for various operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['bankAccount', 'entity', 'counterparty', 'payment'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						displayName: 'Account Name',
						name: 'accountName',
						type: 'string',
						default: '',
						description: 'Name of the account',
					},
					{
						displayName: 'Account Number',
						name: 'accountNumber',
						type: 'string',
						default: '',
						description: 'Bank account number',
					},
					{
						displayName: 'Bank ID',
						name: 'bankId',
						type: 'string',
						default: '',
						description: 'Bank identifier',
					},
					{
						displayName: 'IBAN',
						name: 'iban',
						type: 'string',
						default: '',
						description: 'International Bank Account Number',
					},
					{
						displayName: 'BIC/SWIFT',
						name: 'bic',
						type: 'string',
						default: '',
						description: 'Bank Identifier Code',
					},
					{
						displayName: 'Currency',
						name: 'currency',
						type: 'string',
						default: 'USD',
						description: 'Account currency',
					},
					{
						displayName: 'Entity ID',
						name: 'entityId',
						type: 'string',
						default: '',
						description: 'Legal entity ID',
					},
					{
						displayName: 'Account Type',
						name: 'accountType',
						type: 'options',
						options: [
							{ name: 'Operating', value: 'OPERATING' },
							{ name: 'Concentration', value: 'CONCENTRATION' },
							{ name: 'Payroll', value: 'PAYROLL' },
							{ name: 'Investment', value: 'INVESTMENT' },
							{ name: 'Escrow', value: 'ESCROW' },
							{ name: 'ZBA', value: 'ZBA' },
						],
						default: 'OPERATING',
						description: 'Type of bank account',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{ name: 'Active', value: 'ACTIVE' },
							{ name: 'Inactive', value: 'INACTIVE' },
							{ name: 'Pending', value: 'PENDING' },
							{ name: 'Closed', value: 'CLOSED' },
						],
						default: 'ACTIVE',
						description: 'Account status',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description or notes',
					},
					{
						displayName: 'Tags',
						name: 'tags',
						type: 'string',
						default: '',
						description: 'Comma-separated tags',
					},
				],
			},

			// Payment creation fields
			{
				displayName: 'Payment Details',
				name: 'paymentDetails',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Payment Type',
						name: 'paymentType',
						type: 'options',
						options: [
							{ name: 'ACH', value: 'ACH' },
							{ name: 'Wire', value: 'WIRE' },
							{ name: 'RTP', value: 'RTP' },
							{ name: 'FedNow', value: 'FEDNOW' },
							{ name: 'Check', value: 'CHECK' },
							{ name: 'Book Transfer', value: 'BOOK' },
							{ name: 'International Wire', value: 'INTL_WIRE' },
						],
						default: 'ACH',
						description: 'Type of payment',
					},
					{
						displayName: 'Beneficiary Name',
						name: 'beneficiaryName',
						type: 'string',
						default: '',
						description: 'Name of the beneficiary',
					},
					{
						displayName: 'Beneficiary Account',
						name: 'beneficiaryAccount',
						type: 'string',
						default: '',
						description: 'Beneficiary account number',
					},
					{
						displayName: 'Beneficiary Bank',
						name: 'beneficiaryBank',
						type: 'string',
						default: '',
						description: 'Beneficiary bank routing/BIC',
					},
					{
						displayName: 'Value Date',
						name: 'valueDate',
						type: 'dateTime',
						default: '',
						description: 'Payment value date',
					},
					{
						displayName: 'Reference',
						name: 'reference',
						type: 'string',
						default: '',
						description: 'Payment reference',
					},
					{
						displayName: 'Purpose',
						name: 'purpose',
						type: 'string',
						default: '',
						description: 'Payment purpose or remittance info',
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'options',
						options: [
							{ name: 'Normal', value: 'NORMAL' },
							{ name: 'High', value: 'HIGH' },
							{ name: 'Urgent', value: 'URGENT' },
						],
						default: 'NORMAL',
						description: 'Payment priority',
					},
				],
			},

			// Filters for list operations
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						operation: ['getMany', 'listTransactions', 'listDeals', 'listInvestments', 'listDebtInstruments', 'listInvoices', 'listUsers', 'listConnections'],
					},
				},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: '',
						description: 'Filter by status',
					},
					{
						displayName: 'Currency',
						name: 'currency',
						type: 'string',
						default: '',
						description: 'Filter by currency',
					},
					{
						displayName: 'Entity ID',
						name: 'entityId',
						type: 'string',
						default: '',
						description: 'Filter by entity',
					},
					{
						displayName: 'Date From',
						name: 'dateFrom',
						type: 'dateTime',
						default: '',
						description: 'Filter from date',
					},
					{
						displayName: 'Date To',
						name: 'dateTo',
						type: 'dateTime',
						default: '',
						description: 'Filter to date',
					},
					{
						displayName: 'Search',
						name: 'search',
						type: 'string',
						default: '',
						description: 'Search term',
					},
				],
			},

			// Pagination options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['getMany', 'listTransactions', 'listDeals', 'listInvestments', 'listDebtInstruments', 'listInvoices', 'listUsers', 'listConnections', 'getAuditLog', 'searchAuditLog', 'listReports'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 1000,
						},
						default: 50,
						description: 'Maximum number of results',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of results to skip',
					},
					{
						displayName: 'Sort By',
						name: 'sortBy',
						type: 'string',
						default: '',
						description: 'Field to sort by',
					},
					{
						displayName: 'Sort Order',
						name: 'sortOrder',
						type: 'options',
						options: [
							{ name: 'Ascending', value: 'asc' },
							{ name: 'Descending', value: 'desc' },
						],
						default: 'desc',
						description: 'Sort order',
					},
				],
			},

			// Statement data for parsing
			{
				displayName: 'Statement Data',
				name: 'statementData',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						resource: ['bankConnectivity'],
						operation: ['parseStatement'],
					},
				},
				default: '',
				description: 'Raw bank statement data to parse',
			},

			// File binary property
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['bankConnectivity', 'cashForecasting', 'bankFeeAnalysis', 'reporting'],
						operation: ['sendPaymentFile', 'importForecastData', 'importStatement', 'exportReport'],
					},
				},
				default: 'data',
				description: 'Name of the binary property containing the file',
			},

			// AI analysis type for GSmart
			{
				displayName: 'Analysis Type',
				name: 'analysisType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['gsmartAi'],
						operation: ['getInsights', 'getRecommendations'],
					},
				},
				options: [
					{ name: 'Cash Position', value: 'CASH_POSITION' },
					{ name: 'Liquidity', value: 'LIQUIDITY' },
					{ name: 'FX Exposure', value: 'FX_EXPOSURE' },
					{ name: 'Investment', value: 'INVESTMENT' },
					{ name: 'Risk', value: 'RISK' },
					{ name: 'General', value: 'GENERAL' },
				],
				default: 'GENERAL',
				description: 'Type of AI analysis',
			},

			// Rejection reason
			{
				displayName: 'Rejection Reason',
				name: 'rejectionReason',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['payment', 'workflow'],
						operation: ['reject', 'rejectItem'],
					},
				},
				default: '',
				description: 'Reason for rejection',
			},

			// Approval comment
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['payment', 'workflow'],
						operation: ['approve', 'reject', 'approveItem', 'rejectItem'],
					},
				},
				default: '',
				description: 'Approval or rejection comment',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				switch (resource) {
					case 'cashManagement':
						responseData = await cashManagement.execute.call(this, i, operation);
						break;
					case 'bankAccount':
						responseData = await bankAccount.execute.call(this, i, operation);
						break;
					case 'bankConnectivity':
						responseData = await bankConnectivity.execute.call(this, i, operation);
						break;
					case 'payment':
						responseData = await payment.execute.call(this, i, operation);
						break;
					case 'cashForecasting':
						responseData = await cashForecasting.execute.call(this, i, operation);
						break;
					case 'investment':
						responseData = await investment.execute.call(this, i, operation);
						break;
					case 'debt':
						responseData = await debt.execute.call(this, i, operation);
						break;
					case 'fx':
						responseData = await fx.execute.call(this, i, operation);
						break;
					case 'intercompany':
						responseData = await intercompany.execute.call(this, i, operation);
						break;
					case 'erpIntegration':
						responseData = await erpIntegration.execute.call(this, i, operation);
						break;
					case 'bankFeeAnalysis':
						responseData = await bankFeeAnalysis.execute.call(this, i, operation);
						break;
					case 'entity':
						responseData = await entity.execute.call(this, i, operation);
						break;
					case 'counterparty':
						responseData = await counterparty.execute.call(this, i, operation);
						break;
					case 'reporting':
						responseData = await reporting.execute.call(this, i, operation);
						break;
					case 'workflow':
						responseData = await workflow.execute.call(this, i, operation);
						break;
					case 'userManagement':
						responseData = await userManagement.execute.call(this, i, operation);
						break;
					case 'audit':
						responseData = await audit.execute.call(this, i, operation);
						break;
					case 'marketData':
						responseData = await marketData.execute.call(this, i, operation);
						break;
					case 'riskManagement':
						responseData = await riskManagement.execute.call(this, i, operation);
						break;
					case 'gsmartAi':
						responseData = await gsmartAi.execute.call(this, i, operation);
						break;
					case 'utility':
						responseData = await utility.execute.call(this, i, operation);
						break;
					default:
						throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
