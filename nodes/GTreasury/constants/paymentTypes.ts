/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Payment Types and Constants for GTreasury
 *
 * Comprehensive payment type definitions supporting:
 * - ACH (Automated Clearing House)
 * - Wire transfers (domestic and international)
 * - RTP (Real-Time Payments)
 * - FedNow (Federal Reserve instant payments)
 * - Checks
 * - International payments (SWIFT)
 * - Book transfers
 */

// Payment Types
export const PAYMENT_TYPES = {
	ACH_CREDIT: {
		value: 'ach_credit',
		name: 'ACH Credit',
		description: 'Push payment via Automated Clearing House',
		settlementDays: 1,
		cutoffTime: '17:00 ET',
	},
	ACH_DEBIT: {
		value: 'ach_debit',
		name: 'ACH Debit',
		description: 'Pull payment via Automated Clearing House',
		settlementDays: 1,
		cutoffTime: '17:00 ET',
	},
	ACH_SAME_DAY: {
		value: 'ach_same_day',
		name: 'Same Day ACH',
		description: 'Same-day ACH credit or debit',
		settlementDays: 0,
		cutoffTime: '14:45 ET',
	},
	WIRE_DOMESTIC: {
		value: 'wire_domestic',
		name: 'Domestic Wire',
		description: 'Fedwire domestic transfer',
		settlementDays: 0,
		cutoffTime: '17:30 ET',
	},
	WIRE_INTERNATIONAL: {
		value: 'wire_international',
		name: 'International Wire',
		description: 'SWIFT international transfer',
		settlementDays: 1,
		cutoffTime: '15:00 ET',
	},
	RTP: {
		value: 'rtp',
		name: 'Real-Time Payment',
		description: 'The Clearing House RTP network',
		settlementDays: 0,
		cutoffTime: '24/7',
	},
	FEDNOW: {
		value: 'fednow',
		name: 'FedNow',
		description: 'Federal Reserve instant payment',
		settlementDays: 0,
		cutoffTime: '24/7',
	},
	CHECK: {
		value: 'check',
		name: 'Check',
		description: 'Paper check payment',
		settlementDays: 3,
		cutoffTime: 'N/A',
	},
	BOOK_TRANSFER: {
		value: 'book_transfer',
		name: 'Book Transfer',
		description: 'Internal transfer within same bank',
		settlementDays: 0,
		cutoffTime: '17:30 ET',
	},
	DRAFT: {
		value: 'draft',
		name: 'Draft',
		description: 'Bank draft payment',
		settlementDays: 2,
		cutoffTime: '15:00 ET',
	},
} as const;

// ACH SEC Codes (Standard Entry Class)
export const ACH_SEC_CODES = {
	CCD: {
		value: 'CCD',
		name: 'Corporate Credit or Debit',
		description: 'B2B payments with single addenda',
	},
	CTX: {
		value: 'CTX',
		name: 'Corporate Trade Exchange',
		description: 'B2B payments with multiple addenda (EDI)',
	},
	PPD: {
		value: 'PPD',
		name: 'Prearranged Payment and Deposit',
		description: 'Consumer payments (payroll, direct deposit)',
	},
	WEB: {
		value: 'WEB',
		name: 'Internet Initiated Entry',
		description: 'Consumer payments initiated online',
	},
	TEL: {
		value: 'TEL',
		name: 'Telephone Initiated Entry',
		description: 'Consumer payments initiated by phone',
	},
	IAT: {
		value: 'IAT',
		name: 'International ACH Transaction',
		description: 'Cross-border ACH payments',
	},
	ARC: {
		value: 'ARC',
		name: 'Accounts Receivable Entry',
		description: 'Check conversion at lockbox',
	},
	BOC: {
		value: 'BOC',
		name: 'Back Office Conversion',
		description: 'Back office check conversion',
	},
	POP: {
		value: 'POP',
		name: 'Point of Purchase',
		description: 'Point of sale check conversion',
	},
	RCK: {
		value: 'RCK',
		name: 'Re-presented Check Entry',
		description: 'Returned check re-presentment',
	},
} as const;

// Payment Statuses
export const PAYMENT_STATUSES = {
	DRAFT: { value: 'draft', name: 'Draft', description: 'Payment created but not submitted' },
	PENDING_APPROVAL: { value: 'pending_approval', name: 'Pending Approval', description: 'Awaiting approval' },
	APPROVED: { value: 'approved', name: 'Approved', description: 'Payment approved' },
	REJECTED: { value: 'rejected', name: 'Rejected', description: 'Payment rejected' },
	SUBMITTED: { value: 'submitted', name: 'Submitted', description: 'Submitted to bank' },
	PROCESSING: { value: 'processing', name: 'Processing', description: 'Being processed by bank' },
	COMPLETED: { value: 'completed', name: 'Completed', description: 'Successfully completed' },
	FAILED: { value: 'failed', name: 'Failed', description: 'Payment failed' },
	CANCELLED: { value: 'cancelled', name: 'Cancelled', description: 'Payment cancelled' },
	RETURNED: { value: 'returned', name: 'Returned', description: 'Payment returned' },
	ON_HOLD: { value: 'on_hold', name: 'On Hold', description: 'Payment on hold' },
} as const;

// ACH Return Codes
export const ACH_RETURN_CODES = {
	R01: { code: 'R01', name: 'Insufficient Funds', description: 'Account has insufficient funds' },
	R02: { code: 'R02', name: 'Account Closed', description: 'Bank account is closed' },
	R03: { code: 'R03', name: 'No Account', description: 'No bank account found' },
	R04: { code: 'R04', name: 'Invalid Account Number', description: 'Account number is invalid' },
	R05: { code: 'R05', name: 'Unauthorized Debit', description: 'Unauthorized debit entry' },
	R06: { code: 'R06', name: 'Returned per ODFI', description: 'ODFI requested return' },
	R07: { code: 'R07', name: 'Authorization Revoked', description: 'Customer revoked authorization' },
	R08: { code: 'R08', name: 'Payment Stopped', description: 'Stop payment on item' },
	R09: { code: 'R09', name: 'Uncollected Funds', description: 'Insufficient available funds' },
	R10: { code: 'R10', name: 'Customer Advises Not Authorized', description: 'Customer claims not authorized' },
	R11: { code: 'R11', name: 'Check Truncation Entry Return', description: 'Check truncation return' },
	R12: { code: 'R12', name: 'Branch Sold', description: 'Bank branch sold to another institution' },
	R13: { code: 'R13', name: 'Invalid ACH Routing Number', description: 'Routing number is invalid' },
	R14: { code: 'R14', name: 'Representative Payee Deceased', description: 'Representative payee has died' },
	R15: { code: 'R15', name: 'Beneficiary Deceased', description: 'Beneficiary has died' },
	R16: { code: 'R16', name: 'Account Frozen', description: 'Account has been frozen' },
	R17: { code: 'R17', name: 'File Record Edit Criteria', description: 'Entry rejected by RDFI' },
	R20: { code: 'R20', name: 'Non-Transaction Account', description: 'Cannot accept ACH entries' },
	R21: { code: 'R21', name: 'Invalid Company ID', description: 'Company ID number is invalid' },
	R22: { code: 'R22', name: 'Invalid Individual ID', description: 'Individual ID is invalid' },
	R23: { code: 'R23', name: 'Credit Entry Refused', description: 'Receiver refused credit entry' },
	R24: { code: 'R24', name: 'Duplicate Entry', description: 'Entry is a duplicate' },
	R29: { code: 'R29', name: 'Corporate Customer Advises Not Authorized', description: 'Corporate not authorized' },
	R31: { code: 'R31', name: 'Permissible Return Entry', description: 'CCD/CTX permissible return' },
	R33: { code: 'R33', name: 'Return of XCK Entry', description: 'Return of XCK entry' },
} as const;

// Wire Transfer Purpose Codes (ISO 20022)
export const WIRE_PURPOSE_CODES = {
	BEXP: { code: 'BEXP', name: 'Business Expenses', description: 'General business expenses' },
	COLL: { code: 'COLL', name: 'Collection Payment', description: 'Collection payment' },
	COMM: { code: 'COMM', name: 'Commission', description: 'Commission payment' },
	DIVI: { code: 'DIVI', name: 'Dividend', description: 'Dividend payment' },
	EPAY: { code: 'EPAY', name: 'Payroll', description: 'Payroll/salary payment' },
	GDDS: { code: 'GDDS', name: 'Goods Purchase', description: 'Purchase of goods' },
	GOVT: { code: 'GOVT', name: 'Government Payment', description: 'Government payment' },
	ICCP: { code: 'ICCP', name: 'Intercompany Payment', description: 'Intercompany transfer' },
	INTC: { code: 'INTC', name: 'Intracompany Payment', description: 'Intracompany transfer' },
	INSU: { code: 'INSU', name: 'Insurance Premium', description: 'Insurance premium payment' },
	LOAN: { code: 'LOAN', name: 'Loan', description: 'Loan payment' },
	OTHR: { code: 'OTHR', name: 'Other', description: 'Other purpose' },
	PENS: { code: 'PENS', name: 'Pension Payment', description: 'Pension payment' },
	RENT: { code: 'RENT', name: 'Rent', description: 'Rent payment' },
	RLWY: { code: 'RLWY', name: 'Railway', description: 'Railway payment' },
	SALA: { code: 'SALA', name: 'Salary', description: 'Salary payment' },
	SCVE: { code: 'SCVE', name: 'Services', description: 'Purchase of services' },
	SUPP: { code: 'SUPP', name: 'Supplier Payment', description: 'Supplier payment' },
	TAXS: { code: 'TAXS', name: 'Tax Payment', description: 'Tax payment' },
	TRAD: { code: 'TRAD', name: 'Trade Services', description: 'Trade services' },
	TREA: { code: 'TREA', name: 'Treasury Payment', description: 'Treasury payment' },
} as const;

// Payment Priority Levels
export const PAYMENT_PRIORITIES = {
	LOW: { value: 'low', name: 'Low', description: 'Standard processing' },
	NORMAL: { value: 'normal', name: 'Normal', description: 'Normal priority' },
	HIGH: { value: 'high', name: 'High', description: 'High priority processing' },
	URGENT: { value: 'urgent', name: 'Urgent', description: 'Urgent/immediate processing' },
} as const;

// Check Types
export const CHECK_TYPES = {
	REGULAR: { value: 'regular', name: 'Regular Check', description: 'Standard paper check' },
	LASER: { value: 'laser', name: 'Laser Check', description: 'Laser-printed check' },
	POSITIVE_PAY: { value: 'positive_pay', name: 'Positive Pay', description: 'Check with positive pay protection' },
	PAYABLE_THROUGH_DRAFT: { value: 'ptd', name: 'Payable Through Draft', description: 'Draft payable through' },
} as const;

// International Payment Types
export const INTERNATIONAL_PAYMENT_TYPES = {
	SWIFT_MT103: { value: 'mt103', name: 'SWIFT MT103', description: 'Single customer credit transfer' },
	SWIFT_MT202: { value: 'mt202', name: 'SWIFT MT202', description: 'Financial institution transfer' },
	SEPA_CREDIT: { value: 'sepa_credit', name: 'SEPA Credit Transfer', description: 'EU credit transfer' },
	SEPA_INSTANT: { value: 'sepa_instant', name: 'SEPA Instant', description: 'EU instant payment' },
	BACS: { value: 'bacs', name: 'BACS', description: 'UK Bacs payment' },
	CHAPS: { value: 'chaps', name: 'CHAPS', description: 'UK high-value transfer' },
	FASTER_PAYMENTS: { value: 'faster_payments', name: 'Faster Payments', description: 'UK instant payment' },
} as const;

// RTP/FedNow Message Types
export const INSTANT_PAYMENT_TYPES = {
	CREDIT_TRANSFER: { value: 'credit_transfer', name: 'Credit Transfer', description: 'Push payment' },
	REQUEST_FOR_PAYMENT: { value: 'rfp', name: 'Request for Payment', description: 'Payment request' },
	PAYMENT_ACKNOWLEDGEMENT: { value: 'ack', name: 'Acknowledgement', description: 'Payment acknowledged' },
	PAYMENT_STATUS: { value: 'status', name: 'Status', description: 'Payment status update' },
} as const;

// Helper to get payment type info
export function getPaymentType(type: string): typeof PAYMENT_TYPES[keyof typeof PAYMENT_TYPES] | undefined {
	return PAYMENT_TYPES[type.toUpperCase() as keyof typeof PAYMENT_TYPES];
}

// Helper to check if payment type is instant
export function isInstantPayment(type: string): boolean {
	const instantTypes = ['rtp', 'fednow', 'sepa_instant', 'faster_payments'];
	return instantTypes.includes(type.toLowerCase());
}

// Helper to get settlement days
export function getSettlementDays(paymentType: string): number {
	const type = getPaymentType(paymentType);
	return type?.settlementDays ?? 1;
}
