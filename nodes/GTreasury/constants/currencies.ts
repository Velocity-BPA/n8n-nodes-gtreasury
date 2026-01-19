/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Currency Constants for GTreasury
 *
 * ISO 4217 currency codes and related treasury information.
 * Used throughout cash management, FX, and payment operations.
 */

// Major Trading Currencies
export const MAJOR_CURRENCIES = {
	USD: { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
	EUR: { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
	GBP: { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
	JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0 },
	CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2 },
	AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2 },
	CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', decimals: 2 },
	NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2 },
	CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2 },
	HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', decimals: 2 },
	SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2 },
} as const;

// Complete Currency List (ISO 4217)
export const ALL_CURRENCIES = {
	// A
	AED: { code: 'AED', name: 'UAE Dirham', decimals: 2 },
	AFN: { code: 'AFN', name: 'Afghan Afghani', decimals: 2 },
	ALL: { code: 'ALL', name: 'Albanian Lek', decimals: 2 },
	AMD: { code: 'AMD', name: 'Armenian Dram', decimals: 2 },
	ANG: { code: 'ANG', name: 'Netherlands Antillean Guilder', decimals: 2 },
	AOA: { code: 'AOA', name: 'Angolan Kwanza', decimals: 2 },
	ARS: { code: 'ARS', name: 'Argentine Peso', decimals: 2 },
	AUD: { code: 'AUD', name: 'Australian Dollar', decimals: 2 },
	AWG: { code: 'AWG', name: 'Aruban Florin', decimals: 2 },
	AZN: { code: 'AZN', name: 'Azerbaijani Manat', decimals: 2 },

	// B
	BAM: { code: 'BAM', name: 'Bosnia-Herzegovina Mark', decimals: 2 },
	BBD: { code: 'BBD', name: 'Barbadian Dollar', decimals: 2 },
	BDT: { code: 'BDT', name: 'Bangladeshi Taka', decimals: 2 },
	BGN: { code: 'BGN', name: 'Bulgarian Lev', decimals: 2 },
	BHD: { code: 'BHD', name: 'Bahraini Dinar', decimals: 3 },
	BIF: { code: 'BIF', name: 'Burundian Franc', decimals: 0 },
	BMD: { code: 'BMD', name: 'Bermudian Dollar', decimals: 2 },
	BND: { code: 'BND', name: 'Brunei Dollar', decimals: 2 },
	BOB: { code: 'BOB', name: 'Bolivian Boliviano', decimals: 2 },
	BRL: { code: 'BRL', name: 'Brazilian Real', decimals: 2 },
	BSD: { code: 'BSD', name: 'Bahamian Dollar', decimals: 2 },
	BTN: { code: 'BTN', name: 'Bhutanese Ngultrum', decimals: 2 },
	BWP: { code: 'BWP', name: 'Botswanan Pula', decimals: 2 },
	BYN: { code: 'BYN', name: 'Belarusian Ruble', decimals: 2 },
	BZD: { code: 'BZD', name: 'Belize Dollar', decimals: 2 },

	// C
	CAD: { code: 'CAD', name: 'Canadian Dollar', decimals: 2 },
	CDF: { code: 'CDF', name: 'Congolese Franc', decimals: 2 },
	CHF: { code: 'CHF', name: 'Swiss Franc', decimals: 2 },
	CLP: { code: 'CLP', name: 'Chilean Peso', decimals: 0 },
	CNY: { code: 'CNY', name: 'Chinese Yuan', decimals: 2 },
	COP: { code: 'COP', name: 'Colombian Peso', decimals: 2 },
	CRC: { code: 'CRC', name: 'Costa Rican Colón', decimals: 2 },
	CUP: { code: 'CUP', name: 'Cuban Peso', decimals: 2 },
	CVE: { code: 'CVE', name: 'Cape Verdean Escudo', decimals: 2 },
	CZK: { code: 'CZK', name: 'Czech Koruna', decimals: 2 },

	// D
	DJF: { code: 'DJF', name: 'Djiboutian Franc', decimals: 0 },
	DKK: { code: 'DKK', name: 'Danish Krone', decimals: 2 },
	DOP: { code: 'DOP', name: 'Dominican Peso', decimals: 2 },
	DZD: { code: 'DZD', name: 'Algerian Dinar', decimals: 2 },

	// E
	EGP: { code: 'EGP', name: 'Egyptian Pound', decimals: 2 },
	ERN: { code: 'ERN', name: 'Eritrean Nakfa', decimals: 2 },
	ETB: { code: 'ETB', name: 'Ethiopian Birr', decimals: 2 },
	EUR: { code: 'EUR', name: 'Euro', decimals: 2 },

	// F
	FJD: { code: 'FJD', name: 'Fijian Dollar', decimals: 2 },
	FKP: { code: 'FKP', name: 'Falkland Islands Pound', decimals: 2 },

	// G
	GBP: { code: 'GBP', name: 'British Pound', decimals: 2 },
	GEL: { code: 'GEL', name: 'Georgian Lari', decimals: 2 },
	GHS: { code: 'GHS', name: 'Ghanaian Cedi', decimals: 2 },
	GIP: { code: 'GIP', name: 'Gibraltar Pound', decimals: 2 },
	GMD: { code: 'GMD', name: 'Gambian Dalasi', decimals: 2 },
	GNF: { code: 'GNF', name: 'Guinean Franc', decimals: 0 },
	GTQ: { code: 'GTQ', name: 'Guatemalan Quetzal', decimals: 2 },
	GYD: { code: 'GYD', name: 'Guyanaese Dollar', decimals: 2 },

	// H
	HKD: { code: 'HKD', name: 'Hong Kong Dollar', decimals: 2 },
	HNL: { code: 'HNL', name: 'Honduran Lempira', decimals: 2 },
	HRK: { code: 'HRK', name: 'Croatian Kuna', decimals: 2 },
	HTG: { code: 'HTG', name: 'Haitian Gourde', decimals: 2 },
	HUF: { code: 'HUF', name: 'Hungarian Forint', decimals: 2 },

	// I
	IDR: { code: 'IDR', name: 'Indonesian Rupiah', decimals: 2 },
	ILS: { code: 'ILS', name: 'Israeli New Shekel', decimals: 2 },
	INR: { code: 'INR', name: 'Indian Rupee', decimals: 2 },
	IQD: { code: 'IQD', name: 'Iraqi Dinar', decimals: 3 },
	IRR: { code: 'IRR', name: 'Iranian Rial', decimals: 2 },
	ISK: { code: 'ISK', name: 'Icelandic Króna', decimals: 0 },

	// J
	JMD: { code: 'JMD', name: 'Jamaican Dollar', decimals: 2 },
	JOD: { code: 'JOD', name: 'Jordanian Dinar', decimals: 3 },
	JPY: { code: 'JPY', name: 'Japanese Yen', decimals: 0 },

	// K
	KES: { code: 'KES', name: 'Kenyan Shilling', decimals: 2 },
	KGS: { code: 'KGS', name: 'Kyrgystani Som', decimals: 2 },
	KHR: { code: 'KHR', name: 'Cambodian Riel', decimals: 2 },
	KMF: { code: 'KMF', name: 'Comorian Franc', decimals: 0 },
	KRW: { code: 'KRW', name: 'South Korean Won', decimals: 0 },
	KWD: { code: 'KWD', name: 'Kuwaiti Dinar', decimals: 3 },
	KYD: { code: 'KYD', name: 'Cayman Islands Dollar', decimals: 2 },
	KZT: { code: 'KZT', name: 'Kazakhstani Tenge', decimals: 2 },

	// L
	LAK: { code: 'LAK', name: 'Laotian Kip', decimals: 2 },
	LBP: { code: 'LBP', name: 'Lebanese Pound', decimals: 2 },
	LKR: { code: 'LKR', name: 'Sri Lankan Rupee', decimals: 2 },
	LRD: { code: 'LRD', name: 'Liberian Dollar', decimals: 2 },
	LSL: { code: 'LSL', name: 'Lesotho Loti', decimals: 2 },
	LYD: { code: 'LYD', name: 'Libyan Dinar', decimals: 3 },

	// M
	MAD: { code: 'MAD', name: 'Moroccan Dirham', decimals: 2 },
	MDL: { code: 'MDL', name: 'Moldovan Leu', decimals: 2 },
	MGA: { code: 'MGA', name: 'Malagasy Ariary', decimals: 2 },
	MKD: { code: 'MKD', name: 'Macedonian Denar', decimals: 2 },
	MMK: { code: 'MMK', name: 'Myanma Kyat', decimals: 2 },
	MNT: { code: 'MNT', name: 'Mongolian Tugrik', decimals: 2 },
	MOP: { code: 'MOP', name: 'Macanese Pataca', decimals: 2 },
	MRU: { code: 'MRU', name: 'Mauritanian Ouguiya', decimals: 2 },
	MUR: { code: 'MUR', name: 'Mauritian Rupee', decimals: 2 },
	MVR: { code: 'MVR', name: 'Maldivian Rufiyaa', decimals: 2 },
	MWK: { code: 'MWK', name: 'Malawian Kwacha', decimals: 2 },
	MXN: { code: 'MXN', name: 'Mexican Peso', decimals: 2 },
	MYR: { code: 'MYR', name: 'Malaysian Ringgit', decimals: 2 },
	MZN: { code: 'MZN', name: 'Mozambican Metical', decimals: 2 },

	// N
	NAD: { code: 'NAD', name: 'Namibian Dollar', decimals: 2 },
	NGN: { code: 'NGN', name: 'Nigerian Naira', decimals: 2 },
	NIO: { code: 'NIO', name: 'Nicaraguan Córdoba', decimals: 2 },
	NOK: { code: 'NOK', name: 'Norwegian Krone', decimals: 2 },
	NPR: { code: 'NPR', name: 'Nepalese Rupee', decimals: 2 },
	NZD: { code: 'NZD', name: 'New Zealand Dollar', decimals: 2 },

	// O
	OMR: { code: 'OMR', name: 'Omani Rial', decimals: 3 },

	// P
	PAB: { code: 'PAB', name: 'Panamanian Balboa', decimals: 2 },
	PEN: { code: 'PEN', name: 'Peruvian Sol', decimals: 2 },
	PGK: { code: 'PGK', name: 'Papua New Guinean Kina', decimals: 2 },
	PHP: { code: 'PHP', name: 'Philippine Peso', decimals: 2 },
	PKR: { code: 'PKR', name: 'Pakistani Rupee', decimals: 2 },
	PLN: { code: 'PLN', name: 'Polish Zloty', decimals: 2 },
	PYG: { code: 'PYG', name: 'Paraguayan Guarani', decimals: 0 },

	// Q
	QAR: { code: 'QAR', name: 'Qatari Rial', decimals: 2 },

	// R
	RON: { code: 'RON', name: 'Romanian Leu', decimals: 2 },
	RSD: { code: 'RSD', name: 'Serbian Dinar', decimals: 2 },
	RUB: { code: 'RUB', name: 'Russian Ruble', decimals: 2 },
	RWF: { code: 'RWF', name: 'Rwandan Franc', decimals: 0 },

	// S
	SAR: { code: 'SAR', name: 'Saudi Riyal', decimals: 2 },
	SBD: { code: 'SBD', name: 'Solomon Islands Dollar', decimals: 2 },
	SCR: { code: 'SCR', name: 'Seychellois Rupee', decimals: 2 },
	SDG: { code: 'SDG', name: 'Sudanese Pound', decimals: 2 },
	SEK: { code: 'SEK', name: 'Swedish Krona', decimals: 2 },
	SGD: { code: 'SGD', name: 'Singapore Dollar', decimals: 2 },
	SHP: { code: 'SHP', name: 'Saint Helena Pound', decimals: 2 },
	SLL: { code: 'SLL', name: 'Sierra Leonean Leone', decimals: 2 },
	SOS: { code: 'SOS', name: 'Somali Shilling', decimals: 2 },
	SRD: { code: 'SRD', name: 'Surinamese Dollar', decimals: 2 },
	SSP: { code: 'SSP', name: 'South Sudanese Pound', decimals: 2 },
	STN: { code: 'STN', name: 'São Tomé and Príncipe Dobra', decimals: 2 },
	SYP: { code: 'SYP', name: 'Syrian Pound', decimals: 2 },
	SZL: { code: 'SZL', name: 'Swazi Lilangeni', decimals: 2 },

	// T
	THB: { code: 'THB', name: 'Thai Baht', decimals: 2 },
	TJS: { code: 'TJS', name: 'Tajikistani Somoni', decimals: 2 },
	TMT: { code: 'TMT', name: 'Turkmenistani Manat', decimals: 2 },
	TND: { code: 'TND', name: 'Tunisian Dinar', decimals: 3 },
	TOP: { code: 'TOP', name: 'Tongan Paʻanga', decimals: 2 },
	TRY: { code: 'TRY', name: 'Turkish Lira', decimals: 2 },
	TTD: { code: 'TTD', name: 'Trinidad and Tobago Dollar', decimals: 2 },
	TWD: { code: 'TWD', name: 'New Taiwan Dollar', decimals: 2 },
	TZS: { code: 'TZS', name: 'Tanzanian Shilling', decimals: 2 },

	// U
	UAH: { code: 'UAH', name: 'Ukrainian Hryvnia', decimals: 2 },
	UGX: { code: 'UGX', name: 'Ugandan Shilling', decimals: 0 },
	USD: { code: 'USD', name: 'US Dollar', decimals: 2 },
	UYU: { code: 'UYU', name: 'Uruguayan Peso', decimals: 2 },
	UZS: { code: 'UZS', name: 'Uzbekistan Som', decimals: 2 },

	// V
	VES: { code: 'VES', name: 'Venezuelan Bolívar', decimals: 2 },
	VND: { code: 'VND', name: 'Vietnamese Dong', decimals: 0 },
	VUV: { code: 'VUV', name: 'Vanuatu Vatu', decimals: 0 },

	// W
	WST: { code: 'WST', name: 'Samoan Tala', decimals: 2 },

	// X
	XAF: { code: 'XAF', name: 'CFA Franc BEAC', decimals: 0 },
	XCD: { code: 'XCD', name: 'East Caribbean Dollar', decimals: 2 },
	XOF: { code: 'XOF', name: 'CFA Franc BCEAO', decimals: 0 },
	XPF: { code: 'XPF', name: 'CFP Franc', decimals: 0 },

	// Y
	YER: { code: 'YER', name: 'Yemeni Rial', decimals: 2 },

	// Z
	ZAR: { code: 'ZAR', name: 'South African Rand', decimals: 2 },
	ZMW: { code: 'ZMW', name: 'Zambian Kwacha', decimals: 2 },
	ZWL: { code: 'ZWL', name: 'Zimbabwean Dollar', decimals: 2 },
} as const;

// Currency pairs commonly traded
export const MAJOR_CURRENCY_PAIRS = [
	'EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF',
	'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP',
	'EUR/JPY', 'GBP/JPY', 'EUR/CHF', 'AUD/JPY',
	'CAD/JPY', 'EUR/AUD', 'GBP/CHF', 'USD/CNY',
	'USD/HKD', 'USD/SGD', 'EUR/CNY', 'GBP/CNY',
] as const;

// Helper to get currency by code
export function getCurrency(code: string): typeof ALL_CURRENCIES[keyof typeof ALL_CURRENCIES] | undefined {
	return ALL_CURRENCIES[code as keyof typeof ALL_CURRENCIES];
}

// Helper to format amount with currency
export function formatCurrencyAmount(amount: number, currencyCode: string): string {
	const currency = getCurrency(currencyCode);
	if (!currency) return amount.toString();
	return amount.toFixed(currency.decimals);
}
