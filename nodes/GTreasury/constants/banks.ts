/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Bank Constants for GTreasury ClearConnect Gateway
 *
 * GTreasury's ClearConnect provides connectivity to 11,000+ financial
 * institutions worldwide. This file contains commonly used bank identifiers
 * and connection types.
 */

// Major Global Banks (by SWIFT BIC)
export const MAJOR_BANKS = {
	// US Banks
	JPMORGAN_CHASE: { bic: 'CHASUS33', name: 'JPMorgan Chase', country: 'US' },
	BANK_OF_AMERICA: { bic: 'BOFAUS3N', name: 'Bank of America', country: 'US' },
	WELLS_FARGO: { bic: 'WFBIUS6S', name: 'Wells Fargo', country: 'US' },
	CITIBANK: { bic: 'CITIUS33', name: 'Citibank', country: 'US' },
	US_BANK: { bic: 'USBKUS44', name: 'US Bank', country: 'US' },
	PNC: { bic: 'PNCCUS33', name: 'PNC Bank', country: 'US' },
	CAPITAL_ONE: { bic: 'HIBKUS44', name: 'Capital One', country: 'US' },
	TD_BANK_US: { bic: 'NRTHUS33', name: 'TD Bank USA', country: 'US' },
	TRUIST: { bic: 'BRBTUS33', name: 'Truist Bank', country: 'US' },
	FIFTH_THIRD: { bic: 'FTBCUS3C', name: 'Fifth Third Bank', country: 'US' },
	SILICON_VALLEY: { bic: 'SVBKUS6S', name: 'Silicon Valley Bank', country: 'US' },
	FIRST_REPUBLIC: { bic: 'FRBKUS66', name: 'First Republic Bank', country: 'US' },

	// UK Banks
	HSBC_UK: { bic: 'MIDLGB22', name: 'HSBC UK', country: 'GB' },
	BARCLAYS: { bic: 'BARCGB22', name: 'Barclays', country: 'GB' },
	LLOYDS: { bic: 'LOYDGB2L', name: 'Lloyds Banking Group', country: 'GB' },
	NATWEST: { bic: 'NWBKGB2L', name: 'NatWest', country: 'GB' },
	STANDARD_CHARTERED: { bic: 'SCBLGB2L', name: 'Standard Chartered', country: 'GB' },

	// European Banks
	DEUTSCHE_BANK: { bic: 'DEUTDEFF', name: 'Deutsche Bank', country: 'DE' },
	COMMERZBANK: { bic: 'COBADEFF', name: 'Commerzbank', country: 'DE' },
	BNP_PARIBAS: { bic: 'BNPAFRPP', name: 'BNP Paribas', country: 'FR' },
	SOCIETE_GENERALE: { bic: 'SOGEFRPP', name: 'Société Générale', country: 'FR' },
	CREDIT_AGRICOLE: { bic: 'AGRIFRPP', name: 'Crédit Agricole', country: 'FR' },
	UBS: { bic: 'UBSWCHZH', name: 'UBS', country: 'CH' },
	CREDIT_SUISSE: { bic: 'CRESCHZZ', name: 'Credit Suisse', country: 'CH' },
	ING: { bic: 'INGBNL2A', name: 'ING', country: 'NL' },
	ABN_AMRO: { bic: 'ABNANL2A', name: 'ABN AMRO', country: 'NL' },
	SANTANDER: { bic: 'BSCHESMM', name: 'Santander', country: 'ES' },
	UNICREDIT: { bic: 'UNCRITMM', name: 'UniCredit', country: 'IT' },
	INTESA: { bic: 'BCITITMM', name: 'Intesa Sanpaolo', country: 'IT' },
	NORDEA: { bic: 'NDEAFIHH', name: 'Nordea', country: 'FI' },

	// Asian Banks
	HSBC_HK: { bic: 'HSBCHKHH', name: 'HSBC Hong Kong', country: 'HK' },
	MUFG: { bic: 'BOTKJPJT', name: 'MUFG Bank', country: 'JP' },
	MIZUHO: { bic: 'MHCBJPJT', name: 'Mizuho Bank', country: 'JP' },
	SMBC: { bic: 'SMBCJPJT', name: 'Sumitomo Mitsui', country: 'JP' },
	DBS: { bic: 'DBSSSGSG', name: 'DBS Bank', country: 'SG' },
	OCBC: { bic: 'OCBCSGSG', name: 'OCBC Bank', country: 'SG' },
	BOC_CHINA: { bic: 'BKCHCNBJ', name: 'Bank of China', country: 'CN' },
	ICBC: { bic: 'ICBKCNBJ', name: 'ICBC', country: 'CN' },
	CCB: { bic: 'PCBCCNBJ', name: 'China Construction Bank', country: 'CN' },
	ANZ: { bic: 'ANZBAU3M', name: 'ANZ Bank', country: 'AU' },
	COMMONWEALTH: { bic: 'CTBAAU2S', name: 'Commonwealth Bank', country: 'AU' },
	NAB: { bic: 'NATAAU33', name: 'National Australia Bank', country: 'AU' },
	WESTPAC: { bic: 'WPACAU2S', name: 'Westpac', country: 'AU' },

	// Canadian Banks
	RBC: { bic: 'ROYCCAT2', name: 'Royal Bank of Canada', country: 'CA' },
	TD_CANADA: { bic: 'TDOMCATTTOR', name: 'TD Bank Canada', country: 'CA' },
	SCOTIABANK: { bic: 'NOSCCATT', name: 'Scotiabank', country: 'CA' },
	BMO: { bic: 'BOFMCAM2', name: 'Bank of Montreal', country: 'CA' },
	CIBC: { bic: 'CLOACA11', name: 'CIBC', country: 'CA' },

	// Latin American Banks
	ITAU: { bic: 'ITAUBRSP', name: 'Itaú Unibanco', country: 'BR' },
	BRADESCO: { bic: 'BBDEBRSP', name: 'Bradesco', country: 'BR' },
	BANCO_BRASIL: { bic: 'BRASBRRJ', name: 'Banco do Brasil', country: 'BR' },
	BBVA_MEXICO: { bic: 'BCMRMXMM', name: 'BBVA Mexico', country: 'MX' },
	BANORTE: { bic: 'MENOMXMT', name: 'Banorte', country: 'MX' },
} as const;

// Bank Connection Types
export const BANK_CONNECTION_TYPES = {
	SWIFT: {
		value: 'swift',
		name: 'SWIFT',
		description: 'Society for Worldwide Interbank Financial Telecommunication',
	},
	HOST_TO_HOST: {
		value: 'h2h',
		name: 'Host-to-Host',
		description: 'Direct secure connection to bank systems',
	},
	API_DIRECT: {
		value: 'api',
		name: 'API Direct',
		description: 'Direct API integration with bank',
	},
	SFTP: {
		value: 'sftp',
		name: 'SFTP',
		description: 'Secure File Transfer Protocol',
	},
	OPEN_BANKING: {
		value: 'openbanking',
		name: 'Open Banking',
		description: 'Open Banking API (PSD2, etc.)',
	},
	EBICS: {
		value: 'ebics',
		name: 'EBICS',
		description: 'Electronic Banking Internet Communication Standard',
	},
	SCREEN_SCRAPING: {
		value: 'scraping',
		name: 'Screen Scraping',
		description: 'Legacy screen scraping (deprecated)',
	},
} as const;

// Bank Statement Formats
export const STATEMENT_FORMATS = {
	BAI2: {
		value: 'bai2',
		name: 'BAI2',
		description: 'Bank Administration Institute format (US standard)',
	},
	MT940: {
		value: 'mt940',
		name: 'MT940',
		description: 'SWIFT MT940 customer statement',
	},
	MT942: {
		value: 'mt942',
		name: 'MT942',
		description: 'SWIFT MT942 interim transaction report',
	},
	CAMT053: {
		value: 'camt053',
		name: 'camt.053',
		description: 'ISO 20022 Bank to Customer Statement',
	},
	CAMT052: {
		value: 'camt052',
		name: 'camt.052',
		description: 'ISO 20022 Bank to Customer Report',
	},
	OFX: {
		value: 'ofx',
		name: 'OFX',
		description: 'Open Financial Exchange',
	},
	QIF: {
		value: 'qif',
		name: 'QIF',
		description: 'Quicken Interchange Format',
	},
	CSV: {
		value: 'csv',
		name: 'CSV',
		description: 'Comma-separated values (bank-specific)',
	},
} as const;

// Bank Transaction Types (BAI2 codes)
export const BAI2_TRANSACTION_CODES = {
	// Credits
	'010': 'Credit - Unknown',
	'015': 'Lockbox Deposit',
	'016': 'Item in Lockbox Deposit',
	'018': 'Lockbox Adjustment Credit',
	'100': 'Credits - Total',
	'108': 'Wire Transfer Credit',
	'115': 'Incoming Money Transfer',
	'116': 'ACH Settlement',
	'118': 'ACH Credit Received',
	'142': 'Book Transfer Credit',
	'165': 'Preauthorized ACH Credit',
	'169': 'ACH Return Item Charge',
	'195': 'Check Deposit',
	'475': 'Check Paid',

	// Debits
	'400': 'Debits - Total',
	'408': 'Wire Transfer Debit',
	'416': 'ACH Debit Settlement',
	'421': 'ACH Debit Return',
	'451': 'Wire Transfer Debit Reversal',
	'452': 'Wire Transfer Credit Reversal',
	'455': 'Outgoing Money Transfer',
	'495': 'Check Paid',
	'501': 'Cash Letter Charge',
	'505': 'Deposited Item Charge',

	// Fees
	'560': 'Account Analysis Fee',
	'561': 'Account Maintenance Fee',
	'566': 'Wire Transfer Fee',
	'890': 'Miscellaneous Fee',
} as const;

// Supported Countries by Region
export const SUPPORTED_REGIONS = {
	NORTH_AMERICA: ['US', 'CA', 'MX'],
	EUROPE: ['GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'CH', 'AT', 'IE', 'PT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'GR', 'LU'],
	ASIA_PACIFIC: ['JP', 'CN', 'HK', 'SG', 'AU', 'NZ', 'KR', 'TW', 'TH', 'MY', 'ID', 'PH', 'VN', 'IN'],
	LATIN_AMERICA: ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO'],
	MIDDLE_EAST: ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'IL', 'EG', 'JO', 'LB'],
	AFRICA: ['ZA', 'NG', 'KE', 'GH', 'EG', 'MA', 'TN'],
} as const;

// Bank Service Categories (AFP standard)
export const AFP_SERVICE_CATEGORIES = {
	ACCOUNT_SERVICES: {
		code: '01',
		name: 'Account Services',
		description: 'Account maintenance and related services',
	},
	PAPER_DEPOSIT: {
		code: '02',
		name: 'Paper Deposited',
		description: 'Check and paper item deposits',
	},
	PAPER_PAID: {
		code: '03',
		name: 'Paper Paid',
		description: 'Check and paper item payments',
	},
	ACH_SERVICES: {
		code: '04',
		name: 'ACH Services',
		description: 'ACH origination and receipt',
	},
	WIRE_TRANSFER: {
		code: '05',
		name: 'Wire Transfer',
		description: 'Domestic and international wires',
	},
	LOCKBOX: {
		code: '06',
		name: 'Lockbox',
		description: 'Lockbox processing services',
	},
	CONTROLLED_DISBURSEMENT: {
		code: '07',
		name: 'Controlled Disbursement',
		description: 'Controlled disbursement services',
	},
	ZERO_BALANCE: {
		code: '08',
		name: 'Zero Balance Accounts',
		description: 'ZBA sweep and management',
	},
	INFORMATION_REPORTING: {
		code: '09',
		name: 'Information Reporting',
		description: 'Balance and transaction reporting',
	},
	POSITIVE_PAY: {
		code: '10',
		name: 'Positive Pay',
		description: 'Fraud prevention services',
	},
	INTERNATIONAL: {
		code: '11',
		name: 'International Services',
		description: 'International banking services',
	},
} as const;

// Helper to get bank by BIC
export function getBankByBic(bic: string): typeof MAJOR_BANKS[keyof typeof MAJOR_BANKS] | undefined {
	return Object.values(MAJOR_BANKS).find(bank => bank.bic === bic);
}

// Helper to get banks by country
export function getBanksByCountry(countryCode: string): Array<typeof MAJOR_BANKS[keyof typeof MAJOR_BANKS]> {
	return Object.values(MAJOR_BANKS).filter(bank => bank.country === countryCode);
}
