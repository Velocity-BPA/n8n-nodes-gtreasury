/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * GTreasury API Endpoints
 *
 * Complete listing of all GTreasury API endpoints organized by resource.
 * These endpoints support the 80+ operations available in this node.
 */

// Base URLs by environment
export const BASE_URLS = {
	production: 'https://api.gtreasury.com',
	sandbox: 'https://sandbox-api.gtreasury.com',
	clearConnect: 'https://clearconnect.gtreasury.com',
} as const;

// API Version
export const API_VERSION = 'v1';

// Cash Management Endpoints
export const CASH_MANAGEMENT_ENDPOINTS = {
	positions: '/cash/positions',
	positionByAccount: '/cash/positions/account',
	positionByCurrency: '/cash/positions/currency',
	positionByEntity: '/cash/positions/entity',
	actuals: '/cash/actuals',
	estimates: '/cash/estimates',
	concentration: '/cash/concentration',
	sweepRules: '/cash/sweep-rules',
	intercompany: '/cash/intercompany',
	pooling: '/cash/pooling',
	poolInterest: '/cash/pooling/interest',
	zba: '/cash/zba',
} as const;

// Bank Account Endpoints
export const BANK_ACCOUNT_ENDPOINTS = {
	accounts: '/bank-accounts',
	account: '/bank-accounts/{id}',
	signers: '/bank-accounts/{id}/signers',
	documentation: '/bank-accounts/{id}/documentation',
	auditTrail: '/bank-accounts/{id}/audit',
	balances: '/bank-accounts/{id}/balances',
	transactions: '/bank-accounts/{id}/transactions',
	linkEntity: '/bank-accounts/{id}/entity',
} as const;

// Bank Connectivity (ClearConnect) Endpoints
export const BANK_CONNECTIVITY_ENDPOINTS = {
	connectedBanks: '/banks/connected',
	bankStatus: '/banks/{id}/status',
	realTimeBalance: '/banks/{id}/balance/realtime',
	realTimeTransactions: '/banks/{id}/transactions/realtime',
	priorDayBalance: '/banks/{id}/balance/prior-day',
	currentDayBalance: '/banks/{id}/balance/current-day',
	intradayBalance: '/banks/{id}/balance/intraday',
	connect: '/banks/connect',
	disconnect: '/banks/{id}/disconnect',
	testConnection: '/banks/{id}/test',
	statement: '/banks/{id}/statement',
	supportedBanks: '/banks/supported',
} as const;

// Payment Endpoints
export const PAYMENT_ENDPOINTS = {
	payments: '/payments',
	payment: '/payments/{id}',
	submit: '/payments/{id}/submit',
	approve: '/payments/{id}/approve',
	reject: '/payments/{id}/reject',
	status: '/payments/{id}/status',
	cancel: '/payments/{id}/cancel',
	templates: '/payments/templates',
	template: '/payments/templates/{id}',
	executeTemplate: '/payments/templates/{id}/execute',
	batches: '/payments/batches',
	batch: '/payments/batches/{id}',
	submitBatch: '/payments/batches/{id}/submit',
	ach: '/payments/ach',
	wire: '/payments/wire',
	rtp: '/payments/rtp',
	fedNow: '/payments/fednow',
	international: '/payments/international',
	checks: '/payments/checks',
	bookTransfers: '/payments/book-transfers',
} as const;

// Cash Forecasting Endpoints
export const CASH_FORECASTING_ENDPOINTS = {
	forecasts: '/forecasts',
	forecast: '/forecasts/{id}',
	categories: '/forecasts/categories',
	byCategory: '/forecasts/category/{id}',
	variance: '/forecasts/variance',
	calculateVariance: '/forecasts/variance/calculate',
	aiForcast: '/forecasts/ai',
	accuracy: '/forecasts/accuracy',
	rolling: '/forecasts/rolling',
	adjust: '/forecasts/{id}/adjust',
	lock: '/forecasts/{id}/lock',
	publish: '/forecasts/{id}/publish',
	history: '/forecasts/{id}/history',
} as const;

// Investment Endpoints
export const INVESTMENT_ENDPOINTS = {
	investments: '/investments',
	investment: '/investments/{id}',
	mature: '/investments/{id}/mature',
	roll: '/investments/{id}/roll',
	types: '/investments/types',
	rates: '/investments/rates',
	calculateValue: '/investments/{id}/value',
	moneyMarket: '/investments/money-market',
	cds: '/investments/cds',
	commercialPaper: '/investments/commercial-paper',
	portfolio: '/investments/portfolio',
	performance: '/investments/performance',
} as const;

// Debt Endpoints
export const DEBT_ENDPOINTS = {
	instruments: '/debt',
	instrument: '/debt/{id}',
	loans: '/debt/loans',
	creditFacilities: '/debt/credit-facilities',
	revolvingCredit: '/debt/revolving-credit',
	termLoans: '/debt/term-loans',
	calculateInterest: '/debt/{id}/interest',
	amortization: '/debt/{id}/amortization',
	covenantCompliance: '/debt/{id}/covenants',
	drawdown: '/debt/{id}/drawdown',
	repayment: '/debt/{id}/repayment',
	portfolio: '/debt/portfolio',
} as const;

// FX Endpoints
export const FX_ENDPOINTS = {
	rates: '/fx/rates',
	rateHistory: '/fx/rates/history',
	exposure: '/fx/exposure',
	deals: '/fx/deals',
	deal: '/fx/deals/{id}',
	forwards: '/fx/forwards',
	options: '/fx/options',
	swaps: '/fx/swaps',
	gainLoss: '/fx/gain-loss',
	hedging: '/fx/hedging',
	hedgeEffectiveness: '/fx/hedging/effectiveness',
	markToMarket: '/fx/mark-to-market',
	settlement: '/fx/settlement',
	rollForward: '/fx/forwards/{id}/roll',
} as const;

// Intercompany Endpoints
export const INTERCOMPANY_ENDPOINTS = {
	positions: '/intercompany/positions',
	loans: '/intercompany/loans',
	loan: '/intercompany/loans/{id}',
	netting: '/intercompany/netting',
	nettingCycle: '/intercompany/netting/execute',
	nettingResults: '/intercompany/netting/results',
	nettingSavings: '/intercompany/netting/savings',
	settlements: '/intercompany/settlements',
	interest: '/intercompany/interest',
	interestAllocation: '/intercompany/interest/allocation',
} as const;

// ERP Integration Endpoints
export const ERP_ENDPOINTS = {
	connections: '/erp/connections',
	connection: '/erp/connections/{id}',
	testConnection: '/erp/connections/{id}/test',
	data: '/erp/data',
	push: '/erp/push',
	glEntries: '/erp/gl',
	apData: '/erp/ap',
	arData: '/erp/ar',
	sync: '/erp/sync',
	logs: '/erp/logs',
	workday: '/erp/workday',
	netsuite: '/erp/netsuite',
	oracle: '/erp/oracle',
	sap: '/erp/sap',
	dynamics: '/erp/dynamics',
} as const;

// Bank Fee Analysis Endpoints
export const BANK_FEE_ENDPOINTS = {
	fees: '/fees',
	analysis: '/fees/analysis',
	afpReport: '/fees/afp-report',
	uploadStatement: '/fees/statement/upload',
	parseStatement: '/fees/statement/parse',
	benchmarks: '/fees/benchmarks',
	compare: '/fees/compare',
	trends: '/fees/trends',
	savings: '/fees/savings',
	allocation: '/fees/allocation',
	byService: '/fees/by-service',
	byBank: '/fees/by-bank',
} as const;

// Entity Endpoints
export const ENTITY_ENDPOINTS = {
	entities: '/entities',
	entity: '/entities/{id}',
	hierarchy: '/entities/hierarchy',
	entityAccounts: '/entities/{id}/accounts',
	entityPositions: '/entities/{id}/positions',
	entityTransactions: '/entities/{id}/transactions',
	legalEntities: '/entities/legal',
	businessUnits: '/entities/business-units',
} as const;

// Counterparty Endpoints
export const COUNTERPARTY_ENDPOINTS = {
	counterparties: '/counterparties',
	counterparty: '/counterparties/{id}',
	exposure: '/counterparties/{id}/exposure',
	limits: '/counterparties/{id}/limits',
	setLimit: '/counterparties/{id}/limits',
	ratings: '/counterparties/{id}/ratings',
	bankRelationships: '/counterparties/bank-relationships',
} as const;

// Reporting Endpoints
export const REPORTING_ENDPOINTS = {
	reports: '/reports',
	report: '/reports/{id}',
	run: '/reports/{id}/run',
	schedule: '/reports/{id}/schedule',
	output: '/reports/{id}/output',
	export: '/reports/{id}/export',
	dashboard: '/reports/dashboard',
	kpis: '/reports/kpis',
	cashPosition: '/reports/cash-position',
	forecast: '/reports/forecast',
	investment: '/reports/investment',
	debt: '/reports/debt',
	fx: '/reports/fx',
	regulatory: '/reports/regulatory',
} as const;

// Workflow Endpoints
export const WORKFLOW_ENDPOINTS = {
	workflows: '/workflows',
	workflow: '/workflows/{id}',
	pendingApprovals: '/workflows/pending',
	approve: '/workflows/{id}/approve',
	reject: '/workflows/{id}/reject',
	history: '/workflows/{id}/history',
	status: '/workflows/{id}/status',
	escalate: '/workflows/{id}/escalate',
	delegate: '/workflows/{id}/delegate',
} as const;

// User Management Endpoints
export const USER_MANAGEMENT_ENDPOINTS = {
	users: '/users',
	user: '/users/{id}',
	deactivate: '/users/{id}/deactivate',
	roles: '/users/{id}/roles',
	assignRole: '/users/{id}/roles',
	permissions: '/permissions',
	activity: '/users/{id}/activity',
	loginHistory: '/users/{id}/login-history',
} as const;

// Audit Endpoints
export const AUDIT_ENDPOINTS = {
	trail: '/audit',
	byEntity: '/audit/entity/{id}',
	byUser: '/audit/user/{id}',
	byDateRange: '/audit/range',
	systemChanges: '/audit/system',
	dataChanges: '/audit/data',
	export: '/audit/export',
	compliance: '/audit/compliance',
} as const;

// Market Data Endpoints
export const MARKET_DATA_ENDPOINTS = {
	rates: '/market-data/rates',
	interestRates: '/market-data/interest-rates',
	fxRates: '/market-data/fx-rates',
	yieldCurves: '/market-data/yield-curves',
	creditSpreads: '/market-data/credit-spreads',
	commodityPrices: '/market-data/commodities',
	subscribe: '/market-data/subscribe',
	historicalRates: '/market-data/historical',
} as const;

// Risk Management Endpoints
export const RISK_MANAGEMENT_ENDPOINTS = {
	exposure: '/risk/exposure',
	currencyRisk: '/risk/currency',
	interestRateRisk: '/risk/interest-rate',
	counterpartyRisk: '/risk/counterparty',
	liquidityRisk: '/risk/liquidity',
	var: '/risk/var',
	stressTest: '/risk/stress-test',
	limits: '/risk/limits',
	alerts: '/risk/alerts',
	hedgeRecommendations: '/risk/hedge-recommendations',
} as const;

// GSmart AI Endpoints
export const GSMART_AI_ENDPOINTS = {
	insights: '/gsmart/insights',
	forecast: '/gsmart/forecast',
	varianceAnalysis: '/gsmart/variance',
	anomalyDetection: '/gsmart/anomalies',
	cashFlowPredictions: '/gsmart/predictions',
	optimization: '/gsmart/optimization',
	naturalLanguage: '/gsmart/nlq',
	boardReports: '/gsmart/board-reports',
} as const;

// Utility Endpoints
export const UTILITY_ENDPOINTS = {
	status: '/status',
	currencies: '/utilities/currencies',
	banks: '/utilities/banks',
	calendar: '/utilities/calendar',
	businessDays: '/utilities/business-days',
	holidays: '/utilities/holidays',
	rateLimits: '/utilities/rate-limits',
	testConnection: '/utilities/test',
	version: '/utilities/version',
	featureFlags: '/utilities/features',
} as const;

// Webhook Endpoints (for triggers)
export const WEBHOOK_ENDPOINTS = {
	register: '/webhooks',
	webhook: '/webhooks/{id}',
	list: '/webhooks',
	delete: '/webhooks/{id}',
	events: '/webhooks/events',
} as const;

// All endpoints combined (alias as ENDPOINTS for backward compatibility)
export const ALL_ENDPOINTS = {
	cashManagement: CASH_MANAGEMENT_ENDPOINTS,
	bankAccount: BANK_ACCOUNT_ENDPOINTS,
	bankConnectivity: BANK_CONNECTIVITY_ENDPOINTS,
	payment: PAYMENT_ENDPOINTS,
	cashForecasting: CASH_FORECASTING_ENDPOINTS,
	investment: INVESTMENT_ENDPOINTS,
	debt: DEBT_ENDPOINTS,
	fx: FX_ENDPOINTS,
	intercompany: INTERCOMPANY_ENDPOINTS,
	erp: ERP_ENDPOINTS,
	bankFee: BANK_FEE_ENDPOINTS,
	entity: ENTITY_ENDPOINTS,
	counterparty: COUNTERPARTY_ENDPOINTS,
	reporting: REPORTING_ENDPOINTS,
	workflow: WORKFLOW_ENDPOINTS,
	userManagement: USER_MANAGEMENT_ENDPOINTS,
	audit: AUDIT_ENDPOINTS,
	marketData: MARKET_DATA_ENDPOINTS,
	riskManagement: RISK_MANAGEMENT_ENDPOINTS,
	gsmartAi: GSMART_AI_ENDPOINTS,
	utility: UTILITY_ENDPOINTS,
	webhook: WEBHOOK_ENDPOINTS,
} as const;

// Helper function to build full endpoint URL
export function buildEndpoint(baseUrl: string, endpoint: string, params?: Record<string, string>): string {
	let url = `${baseUrl}/${API_VERSION}${endpoint}`;
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url = url.replace(`{${key}}`, encodeURIComponent(value));
		}
	}
	return url;
}

// Alias for backward compatibility with action files
// Maps expected property names to actual endpoint values
export const ENDPOINTS = {
	CASH: {
		POSITION: CASH_MANAGEMENT_ENDPOINTS.positions,
		POSITIONS: CASH_MANAGEMENT_ENDPOINTS.positions,
		BALANCES: '/cash/balances',
		TRANSACTIONS: '/cash/transactions',
		SWEEPS: CASH_MANAGEMENT_ENDPOINTS.zba,
		POOLING: CASH_MANAGEMENT_ENDPOINTS.pooling,
		RECONCILIATION: '/cash/reconciliation',
		...CASH_MANAGEMENT_ENDPOINTS,
	},
	BANK_ACCOUNTS: {
		BASE: BANK_ACCOUNT_ENDPOINTS.accounts,
		SIGNATORIES: BANK_ACCOUNT_ENDPOINTS.signers,
		...BANK_ACCOUNT_ENDPOINTS,
	},
	BANK_CONNECTIVITY: {
		CONNECTIONS: BANK_CONNECTIVITY_ENDPOINTS.connectedBanks,
		STATUS: BANK_CONNECTIVITY_ENDPOINTS.bankStatus,
		STATEMENTS: BANK_CONNECTIVITY_ENDPOINTS.statement,
		REALTIME_BALANCE: BANK_CONNECTIVITY_ENDPOINTS.realTimeBalance,
		...BANK_CONNECTIVITY_ENDPOINTS,
	},
	PAYMENTS: {
		BASE: PAYMENT_ENDPOINTS.payments,
		BATCH: '/payments/batch',
		APPROVE: PAYMENT_ENDPOINTS.approve,
		REJECT: PAYMENT_ENDPOINTS.reject,
		STATUS: PAYMENT_ENDPOINTS.status,
		SUBMIT: '/payments/submit',
		BATCHES: '/payments/batches',
		...PAYMENT_ENDPOINTS,
	},
	FORECASTING: {
		BASE: CASH_FORECASTING_ENDPOINTS.forecasts,
		VARIANCE: CASH_FORECASTING_ENDPOINTS.variance,
		CATEGORIES: CASH_FORECASTING_ENDPOINTS.categories,
		IMPORT: '/forecasts/import',
		SCENARIOS: '/forecasts/scenarios',
		...CASH_FORECASTING_ENDPOINTS,
	},
	INVESTMENT: {
		BASE: INVESTMENT_ENDPOINTS.investments,
		PORTFOLIO: INVESTMENT_ENDPOINTS.portfolio,
		MATURITIES: '/investments/maturities',
		YIELD: '/investments/yield',
		COMPLIANCE: '/investments/compliance',
		POLICY: '/investments/policy',
		...INVESTMENT_ENDPOINTS,
	},
	DEBT: {
		BASE: DEBT_ENDPOINTS.instruments,
		DRAWS: '/debt/draws',
		PAYMENTS: '/debt/payments',
		COVENANTS: '/debt/covenants',
		AMORTIZATION: '/debt/amortization',
		...DEBT_ENDPOINTS,
	},
	FX: {
		DEALS: FX_ENDPOINTS.deals,
		EXPOSURE: FX_ENDPOINTS.exposure,
		RATES: FX_ENDPOINTS.rates,
		QUOTE: '/fx/quote',
		TRADE: '/fx/trade',
		HEDGE: '/fx/hedge',
		MTM: '/fx/mtm',
		...FX_ENDPOINTS,
	},
	INTERCOMPANY: {
		NETTING: INTERCOMPANY_ENDPOINTS.netting,
		INVOICES: '/intercompany/invoices',
		SETTLEMENT: '/intercompany/settlement',
		...INTERCOMPANY_ENDPOINTS,
	},
	ERP: {
		GL: '/erp/gl',
		GL_ENTRIES: '/erp/gl/entries',
		AP_SYNC: '/erp/ap/sync',
		AR_SYNC: '/erp/ar/sync',
		SYNC_STATUS: '/erp/sync/status',
		MAPPING: '/erp/mapping',
		RECONCILIATION: '/erp/reconciliation',
		...ERP_ENDPOINTS,
	},
	BANK_FEE: {
		SUMMARY: BANK_FEE_ENDPOINTS.analysis,
		ANALYZE: BANK_FEE_ENDPOINTS.analysis,
		SERVICE_CHARGES: '/bank-fees/service-charges',
		COMPARE: '/bank-fees/compare',
		TRENDS: '/bank-fees/trends',
		IMPORT: '/bank-fees/import',
		...BANK_FEE_ENDPOINTS,
	},
	BANK_FEES: {
		SUMMARY: BANK_FEE_ENDPOINTS.analysis,
		ANALYZE: BANK_FEE_ENDPOINTS.analysis,
		SERVICE_CHARGES: '/bank-fees/service-charges',
		COMPARE: '/bank-fees/compare',
		TRENDS: '/bank-fees/trends',
		IMPORT: '/bank-fees/import',
		...BANK_FEE_ENDPOINTS,
	},
	ENTITY: {
		BASE: ENTITY_ENDPOINTS.entities,
		HIERARCHY: ENTITY_ENDPOINTS.hierarchy,
		...ENTITY_ENDPOINTS,
	},
	COUNTERPARTY: {
		BASE: COUNTERPARTY_ENDPOINTS.counterparties,
		CREDIT: '/counterparties/credit-ratings',
		EXPOSURE: '/counterparties/exposure',
		...COUNTERPARTY_ENDPOINTS,
	},
	REPORTING: {
		BASE: REPORTING_ENDPOINTS.reports,
		RUN: '/reports/run',
		SCHEDULE: '/reports/schedule',
		EXPORT: '/reports/export',
		...REPORTING_ENDPOINTS,
	},
	WORKFLOW: {
		TASKS: '/workflow/tasks',
		COMPLETE: '/workflow/complete',
		REASSIGN: '/workflow/reassign',
		STATUS: '/workflow/status',
		APPROVALS: '/workflow/approvals',
		ESCALATE: '/workflow/escalate',
		...WORKFLOW_ENDPOINTS,
	},
	USER_MANAGEMENT: {
		BASE: USER_MANAGEMENT_ENDPOINTS.users,
		ROLES: USER_MANAGEMENT_ENDPOINTS.roles,
		PERMISSIONS: USER_MANAGEMENT_ENDPOINTS.permissions,
		...USER_MANAGEMENT_ENDPOINTS,
	},
	AUDIT: {
		LOGS: AUDIT_ENDPOINTS.trail,
		BASE: AUDIT_ENDPOINTS.trail,
		LOGINS: '/audit/logins',
		SECURITY: '/audit/security',
		COMPLIANCE: AUDIT_ENDPOINTS.compliance,
		DATA_ACCESS: '/audit/data-access',
		EXPORT: AUDIT_ENDPOINTS.export,
		RETENTION: '/audit/retention',
		RECONCILIATION: '/audit/reconciliation',
		...AUDIT_ENDPOINTS,
	},
	MARKET_DATA: {
		FX_RATES: MARKET_DATA_ENDPOINTS.fxRates,
		INTEREST_RATES: MARKET_DATA_ENDPOINTS.interestRates,
		YIELD_CURVES: MARKET_DATA_ENDPOINTS.yieldCurves,
		QUOTES: '/market-data/quotes',
		HISTORICAL: '/market-data/historical',
		SUBSCRIBE: '/market-data/subscribe',
		COMMODITIES: '/market-data/commodities',
		CREDIT_SPREADS: '/market-data/credit-spreads',
		FORWARD_RATES: '/market-data/forward-rates',
		VOLATILITY: '/market-data/volatility',
		SUBSCRIPTIONS: '/market-data/subscriptions',
		SOURCES: '/market-data/sources',
		...MARKET_DATA_ENDPOINTS,
	},
	RISK_MANAGEMENT: {
		EXPOSURE: RISK_MANAGEMENT_ENDPOINTS.exposure,
		VAR: RISK_MANAGEMENT_ENDPOINTS.var,
		COUNTERPARTY_RISK: RISK_MANAGEMENT_ENDPOINTS.counterpartyRisk,
		STRESS_TEST: RISK_MANAGEMENT_ENDPOINTS.stressTest,
		LIMITS: RISK_MANAGEMENT_ENDPOINTS.limits,
		REPORTS: '/risk/reports',
		...RISK_MANAGEMENT_ENDPOINTS,
	},
	GSMART_AI: {
		FORECAST: GSMART_AI_ENDPOINTS.forecast,
		ANOMALIES: GSMART_AI_ENDPOINTS.anomalyDetection,
		RECOMMENDATIONS: '/ai/recommendations',
		PATTERNS: '/ai/patterns',
		OPTIMIZATION: '/ai/optimization',
		TRAIN: '/ai/train',
		modelStatus: '/ai/model-status',
		patternAnalysis: '/ai/patterns',
		recommendations: '/ai/recommendations',
		...GSMART_AI_ENDPOINTS,
	},
	UTILITY: {
		PING: '/utility/ping',
		STATUS: '/utility/status',
		CONFIG: '/utility/config',
		VALIDATE: '/utility/validate',
		CONVERT: '/utility/currency/convert',
		BUSINESS_DAYS: '/utility/business-days',
		VALIDATE_BANK_ACCOUNT: '/utility/validate/bank-account',
		VALIDATE_IBAN: '/utility/validate/iban',
		HOLIDAYS: '/utility/holidays',
		CONVERT_CURRENCY: '/utility/currency/convert',
		SWIFT_LOOKUP: '/utility/swift-lookup',
		BANK_SEARCH: '/utility/bank-search',
		COUNTRIES: '/utility/countries',
		CURRENCIES: '/utility/currencies',
		...UTILITY_ENDPOINTS,
	},
	WEBHOOK: WEBHOOK_ENDPOINTS,
	// Aliases for backward compatibility
	RISK: {
		EXPOSURE: '/risk/exposure',
		VAR: '/risk/var',
		COUNTERPARTY: '/risk/counterparty',
		STRESS_TEST: '/risk/stress-test',
		LIMITS: '/risk/limits',
		REPORTS: '/risk/reports',
		SCENARIOS: '/risk/scenarios',
		SENSITIVITY: '/risk/sensitivity',
		HEDGE_EFFECTIVENESS: '/risk/hedge-effectiveness',
		POLICY_COMPLIANCE: '/risk/policy-compliance',
		DASHBOARD: '/risk/dashboard',
	},
	USERS: {
		BASE: '/users',
		ROLES: '/users/roles',
		PERMISSIONS: '/users/permissions',
	},
	SYSTEM: {
		STATUS: '/system/status',
		HEALTH: '/system/health',
		CONFIG: '/system/config',
		API_USAGE: '/system/api-usage',
		PING: '/system/ping',
	},
	REPORTS: {
		BASE: '/reports',
		RUN: '/reports/run',
		SCHEDULE: '/reports/schedule',
		EXPORT: '/reports/export',
		GENERATE: '/reports/generate',
		SCHEDULES: '/reports/schedules',
		TEMPLATES: '/reports/templates',
		DASHBOARDS: '/reports/dashboards',
		HISTORY: '/reports/history',
	},
	WORKFLOWS: {
		BASE: '/workflows',
		TASKS: '/workflows/tasks',
		COMPLETE: '/workflows/complete',
		REASSIGN: '/workflows/reassign',
		STATUS: '/workflows/status',
		APPROVALS: '/workflows/approvals',
		ESCALATE: '/workflows/escalate',
		RULES: '/workflows/rules',
		DELEGATIONS: '/workflows/delegations',
	},
	WEBHOOKS: {
		BASE: '/webhooks',
		CREATE: '/webhooks',
		DELETE: '/webhooks',
		LIST: '/webhooks',
		TEST: '/webhooks/test',
	},
} as const;
