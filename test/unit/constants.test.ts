/**
 * n8n-nodes-gtreasury
 * Unit tests for constants
 *
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import { ENDPOINTS } from '../../nodes/GTreasury/constants/endpoints';
import { MAJOR_BANKS, BANK_CONNECTION_TYPES, STATEMENT_FORMATS, getBankByBic, getBanksByCountry } from '../../nodes/GTreasury/constants/banks';
import { MAJOR_CURRENCIES, ALL_CURRENCIES, MAJOR_CURRENCY_PAIRS, getCurrency, formatCurrencyAmount } from '../../nodes/GTreasury/constants/currencies';
import { PAYMENT_TYPES, PAYMENT_STATUSES, getPaymentType, isInstantPayment, getSettlementDays } from '../../nodes/GTreasury/constants/paymentTypes';
import { ERP_SYSTEMS, ERP_INTEGRATION_TYPES, getErpSystem, supportsRealTimeIntegration } from '../../nodes/GTreasury/constants/erpSystems';

describe('Endpoints Constants', () => {
	describe('Cash Management Endpoints', () => {
		it('should have cash position endpoint', () => {
			expect(ENDPOINTS.CASH.POSITION).toBeDefined();
			expect(typeof ENDPOINTS.CASH.POSITION).toBe('string');
		});

		it('should have transactions endpoint', () => {
			expect(ENDPOINTS.CASH.TRANSACTIONS).toBeDefined();
		});

		it('should have balances endpoint', () => {
			expect(ENDPOINTS.CASH.BALANCES).toBeDefined();
		});
	});

	describe('Payment Endpoints', () => {
		it('should have payments base endpoint', () => {
			expect(ENDPOINTS.PAYMENTS.BASE).toBeDefined();
		});

		it('should have batch endpoint', () => {
			expect(ENDPOINTS.PAYMENTS.BATCH).toBeDefined();
		});

		it('should have approval endpoint', () => {
			expect(ENDPOINTS.PAYMENTS.APPROVE).toBeDefined();
		});
	});

	describe('Bank Account Endpoints', () => {
		it('should have bank accounts endpoint', () => {
			expect(ENDPOINTS.BANK_ACCOUNTS.BASE).toBeDefined();
		});

		it('should have signatories endpoint', () => {
			expect(ENDPOINTS.BANK_ACCOUNTS.SIGNATORIES).toBeDefined();
		});
	});

	describe('FX Endpoints', () => {
		it('should have FX endpoints', () => {
			expect(ENDPOINTS.FX).toBeDefined();
			expect(ENDPOINTS.FX.DEALS).toBeDefined();
			expect(ENDPOINTS.FX.EXPOSURE).toBeDefined();
		});
	});

	describe('Other Endpoints', () => {
		it('should have investment endpoints', () => {
			expect(ENDPOINTS.INVESTMENT).toBeDefined();
		});

		it('should have debt endpoints', () => {
			expect(ENDPOINTS.DEBT).toBeDefined();
		});

		it('should have reporting endpoints', () => {
			expect(ENDPOINTS.REPORTING).toBeDefined();
		});

		it('should have webhook endpoints', () => {
			expect(ENDPOINTS.WEBHOOK).toBeDefined();
		});
	});
});

describe('Banks Constants', () => {
	it('should have major banks defined', () => {
		expect(MAJOR_BANKS).toBeDefined();
		expect(Object.keys(MAJOR_BANKS).length).toBeGreaterThan(0);
	});

	it('should have major US banks', () => {
		expect(MAJOR_BANKS.JPMORGAN_CHASE).toBeDefined();
		expect(MAJOR_BANKS.BANK_OF_AMERICA).toBeDefined();
		expect(MAJOR_BANKS.WELLS_FARGO).toBeDefined();
		expect(MAJOR_BANKS.CITIBANK).toBeDefined();
	});

	it('should have bank BIC codes', () => {
		expect(MAJOR_BANKS.JPMORGAN_CHASE.bic).toBe('CHASUS33');
		expect(MAJOR_BANKS.BANK_OF_AMERICA.bic).toBe('BOFAUS3N');
	});

	it('should have bank connection types', () => {
		expect(BANK_CONNECTION_TYPES).toBeDefined();
		expect(BANK_CONNECTION_TYPES.SWIFT).toBeDefined();
		expect(BANK_CONNECTION_TYPES.HOST_TO_HOST).toBeDefined();
	});

	it('should have statement formats', () => {
		expect(STATEMENT_FORMATS).toBeDefined();
		expect(STATEMENT_FORMATS.BAI2).toBeDefined();
		expect(STATEMENT_FORMATS.MT940).toBeDefined();
	});

	it('should find bank by BIC code', () => {
		const bank = getBankByBic('CHASUS33');
		expect(bank?.name).toBe('JPMorgan Chase');
	});

	it('should find banks by country', () => {
		const usBanks = getBanksByCountry('US');
		expect(usBanks.length).toBeGreaterThan(0);
		expect(usBanks.some(b => b.name === 'JPMorgan Chase')).toBe(true);
	});
});

describe('Currencies Constants', () => {
	it('should have major currencies defined', () => {
		expect(MAJOR_CURRENCIES).toBeDefined();
		expect(MAJOR_CURRENCIES.USD).toBeDefined();
		expect(MAJOR_CURRENCIES.EUR).toBeDefined();
		expect(MAJOR_CURRENCIES.GBP).toBeDefined();
	});

	it('should have all currencies with proper structure', () => {
		expect(ALL_CURRENCIES).toBeDefined();
		expect(ALL_CURRENCIES.USD.code).toBe('USD');
		expect(ALL_CURRENCIES.USD.name).toBe('US Dollar');
		expect(ALL_CURRENCIES.USD.decimals).toBe(2);
	});

	it('should have major currency pairs', () => {
		expect(Array.isArray(MAJOR_CURRENCY_PAIRS)).toBe(true);
		expect(MAJOR_CURRENCY_PAIRS).toContain('EUR/USD');
		expect(MAJOR_CURRENCY_PAIRS).toContain('USD/JPY');
	});

	it('should get currency by code', () => {
		const currency = getCurrency('USD');
		expect(currency?.name).toBe('US Dollar');
		expect(currency?.code).toBe('USD');
	});

	it('should format currency amounts', () => {
		const formatted = formatCurrencyAmount(1234.56, 'USD');
		expect(formatted).toContain('1234');
	});

	it('should handle JPY with zero decimals', () => {
		expect(ALL_CURRENCIES.JPY.decimals).toBe(0);
	});
});

describe('Payment Types Constants', () => {
	it('should have payment types defined', () => {
		expect(PAYMENT_TYPES).toBeDefined();
		expect(Object.keys(PAYMENT_TYPES).length).toBeGreaterThan(0);
	});

	it('should have common payment types', () => {
		expect(PAYMENT_TYPES.ACH_CREDIT).toBeDefined();
		expect(PAYMENT_TYPES.WIRE_DOMESTIC).toBeDefined();
		expect(PAYMENT_TYPES.CHECK).toBeDefined();
	});

	it('should have real-time payment types', () => {
		expect(PAYMENT_TYPES.RTP).toBeDefined();
		expect(PAYMENT_TYPES.FEDNOW).toBeDefined();
	});

	it('should have payment type details', () => {
		expect(PAYMENT_TYPES.ACH_CREDIT.value).toBe('ach_credit');
		expect(PAYMENT_TYPES.ACH_CREDIT.name).toBe('ACH Credit');
		expect(PAYMENT_TYPES.ACH_CREDIT.settlementDays).toBeDefined();
	});

	it('should have payment statuses', () => {
		expect(PAYMENT_STATUSES).toBeDefined();
	});

	it('should get payment type info', () => {
		const achInfo = getPaymentType('ach_credit');
		expect(achInfo).toBeDefined();
	});

	it('should identify instant payments', () => {
		expect(isInstantPayment('rtp')).toBe(true);
		expect(isInstantPayment('fednow')).toBe(true);
	});

	it('should get settlement days', () => {
		expect(getSettlementDays('ach_credit')).toBeDefined();
	});
});

describe('ERP Systems Constants', () => {
	it('should have ERP systems defined', () => {
		expect(ERP_SYSTEMS).toBeDefined();
		expect(Object.keys(ERP_SYSTEMS).length).toBeGreaterThan(0);
	});

	it('should have major ERP systems', () => {
		expect(ERP_SYSTEMS.SAP_S4HANA).toBeDefined();
		expect(ERP_SYSTEMS.ORACLE_CLOUD).toBeDefined();
		expect(ERP_SYSTEMS.WORKDAY).toBeDefined();
		expect(ERP_SYSTEMS.NETSUITE).toBeDefined();
	});

	it('should have ERP integration types', () => {
		expect(ERP_INTEGRATION_TYPES).toBeDefined();
	});

	it('should get ERP system by value', () => {
		const sap = getErpSystem('sap_s4hana');
		expect(sap).toBeDefined();
		expect(sap?.name).toContain('SAP');
	});

	it('should have display names for ERP systems', () => {
		expect(ERP_SYSTEMS.SAP_S4HANA.name).toBeDefined();
		expect(typeof ERP_SYSTEMS.SAP_S4HANA.name).toBe('string');
	});

	it('should check real-time integration support', () => {
		const result = supportsRealTimeIntegration('workday');
		expect(typeof result).toBe('boolean');
	});
});
