/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';

/**
 * Bank Statement Parser Utilities for GTreasury
 *
 * Parses various bank statement formats:
 * - BAI2 (Bank Administration Institute)
 * - MT940 (SWIFT Customer Statement)
 * - MT942 (SWIFT Interim Transaction Report)
 * - camt.053 (ISO 20022 Bank to Customer Statement)
 */

export interface IParsedStatement {
	format: string;
	accountNumber: string;
	accountName?: string;
	currency: string;
	statementDate: string;
	periodStart: string;
	periodEnd: string;
	openingBalance: number;
	closingBalance: number;
	transactions: IParsedTransaction[];
	rawData?: string;
}

export interface IParsedTransaction {
	date: string;
	valueDate: string;
	amount: number;
	type: 'credit' | 'debit';
	transactionCode?: string;
	reference?: string;
	bankReference?: string;
	description: string;
	counterparty?: string;
	additionalInfo?: IDataObject;
}

/**
 * Parse BAI2 format bank statement
 *
 * BAI2 is the Bank Administration Institute standard format
 * commonly used by US banks for cash management reporting.
 */
export function parseBAI2(content: string): IParsedStatement[] {
	const statements: IParsedStatement[] = [];
	const lines = content.split(/\r?\n/);

	let currentStatement: Partial<IParsedStatement> | null = null;
	let currentAccount: IDataObject | null = null;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;

		const parts = line.split(',');
		const recordType = parts[0];

		switch (recordType) {
			case '01': // File Header
				// Format: 01,sender,receiver,file_creation_date,file_creation_time,file_id,record_length,block_size,version
				break;

			case '02': // Group Header
				// Format: 02,originator,group_status,as_of_date,as_of_time,currency_code,as_of_date_modifier
				break;

			case '03': // Account Identifier
				// Format: 03,account_number,currency,summary_type,amount,item_count,funds_type...
				if (currentStatement) {
					statements.push(currentStatement as IParsedStatement);
				}
				currentStatement = {
					format: 'bai2',
					accountNumber: parts[1] || '',
					currency: parts[2] || 'USD',
					transactions: [],
				};
				// Parse summary information
				if (parts.length > 3) {
					const summaryType = parts[3];
					const amount = parseFloat(parts[4] || '0') / 100;
					if (summaryType === '010' || summaryType === '015') {
						currentStatement.openingBalance = amount;
					} else if (summaryType === '040' || summaryType === '045') {
						currentStatement.closingBalance = amount;
					}
				}
				break;

			case '16': // Transaction Detail
				// Format: 16,type_code,amount,funds_type,bank_ref,customer_ref,text
				if (currentStatement) {
					const typeCode = parts[1];
					const amount = parseFloat(parts[2] || '0') / 100;
					const isCredit = isBAI2CreditCode(typeCode);

					const transaction: IParsedTransaction = {
						date: currentStatement.statementDate || new Date().toISOString().split('T')[0],
						valueDate: currentStatement.statementDate || new Date().toISOString().split('T')[0],
						amount: Math.abs(amount),
						type: isCredit ? 'credit' : 'debit',
						transactionCode: typeCode,
						bankReference: parts[4] || undefined,
						reference: parts[5] || undefined,
						description: parts.slice(6).join(',') || getBAI2CodeDescription(typeCode),
					};

					currentStatement.transactions!.push(transaction);
				}
				break;

			case '49': // Account Trailer
				// Format: 49,account_control_total,number_of_records
				break;

			case '98': // Group Trailer
				// Format: 98,group_control_total,number_of_accounts,number_of_records
				break;

			case '99': // File Trailer
				// Format: 99,file_control_total,number_of_groups,number_of_records
				if (currentStatement) {
					statements.push(currentStatement as IParsedStatement);
					currentStatement = null;
				}
				break;
		}
	}

	if (currentStatement) {
		statements.push(currentStatement as IParsedStatement);
	}

	return statements;
}

/**
 * Check if BAI2 code is a credit
 */
function isBAI2CreditCode(code: string): boolean {
	const creditCodes = [
		'010', '015', '016', '018', '100', '108', '115', '116', '118',
		'142', '165', '169', '195', '200', '201', '202', '206', '207',
		'208', '212', '213', '214', '215', '216', '218', '221', '222',
		'224', '226', '227', '229', '230', '231', '232', '233', '234',
		'235', '236', '237', '238', '239', '240', '241', '242', '243',
	];
	return creditCodes.includes(code);
}

/**
 * Get description for BAI2 transaction code
 */
function getBAI2CodeDescription(code: string): string {
	const descriptions: Record<string, string> = {
		'010': 'Credit - Unknown',
		'015': 'Lockbox Deposit',
		'016': 'Item in Lockbox Deposit',
		'108': 'Wire Transfer Credit',
		'115': 'Incoming Money Transfer',
		'116': 'ACH Settlement',
		'118': 'ACH Credit Received',
		'142': 'Book Transfer Credit',
		'165': 'Preauthorized ACH Credit',
		'195': 'Check Deposit',
		'400': 'Debit - Unknown',
		'408': 'Wire Transfer Debit',
		'416': 'ACH Debit Settlement',
		'421': 'ACH Debit Return',
		'455': 'Outgoing Money Transfer',
		'495': 'Check Paid',
		'560': 'Account Analysis Fee',
		'561': 'Account Maintenance Fee',
		'566': 'Wire Transfer Fee',
		'890': 'Miscellaneous Fee',
	};
	return descriptions[code] || `Transaction Code: ${code}`;
}

/**
 * Parse MT940 format bank statement
 *
 * MT940 is the SWIFT standard for customer statements.
 * Used internationally for end-of-day account reporting.
 */
export function parseMT940(content: string): IParsedStatement[] {
	const statements: IParsedStatement[] = [];
	const statementBlocks = content.split(/(?=:20:)/);

	for (const block of statementBlocks) {
		if (!block.trim()) continue;

		const statement: Partial<IParsedStatement> = {
			format: 'mt940',
			transactions: [],
		};

		// Parse fields
		const fields = extractMT940Fields(block);

		// Account identification (:25:)
		if (fields['25']) {
			const accountParts = fields['25'].split('/');
			statement.accountNumber = accountParts[accountParts.length - 1] || fields['25'];
		}

		// Statement number (:28C:)
		// Statement sequence number

		// Opening balance (:60F: or :60M:)
		if (fields['60F'] || fields['60M']) {
			const balance = parseMT940Balance(fields['60F'] || fields['60M']);
			statement.openingBalance = balance.amount;
			statement.currency = balance.currency;
			statement.periodStart = balance.date;
		}

		// Statement lines (:61:) and information (:86:)
		const transactionMatches = block.matchAll(/:61:([^\n]+)(?:\n:86:([^\n]+(?:\n(?!:)[^\n]+)*))?/g);
		for (const match of transactionMatches) {
			const transaction = parseMT940Transaction(match[1], match[2] || '');
			if (transaction) {
				statement.transactions!.push(transaction);
			}
		}

		// Closing balance (:62F: or :62M:)
		if (fields['62F'] || fields['62M']) {
			const balance = parseMT940Balance(fields['62F'] || fields['62M']);
			statement.closingBalance = balance.amount;
			statement.periodEnd = balance.date;
		}

		if (statement.accountNumber) {
			statements.push(statement as IParsedStatement);
		}
	}

	return statements;
}

/**
 * Extract MT940 fields from message block
 */
function extractMT940Fields(block: string): Record<string, string> {
	const fields: Record<string, string> = {};
	const regex = /:(\d{2}[A-Z]?):([^:]+?)(?=:\d{2}|$)/gs;

	let match;
	while ((match = regex.exec(block)) !== null) {
		fields[match[1]] = match[2].trim();
	}

	return fields;
}

/**
 * Parse MT940 balance field
 */
function parseMT940Balance(balanceField: string): { amount: number; currency: string; date: string } {
	// Format: C/D + YYMMDD + Currency + Amount
	// e.g., C230615USD1234,56
	const isCredit = balanceField.startsWith('C');
	const dateStr = balanceField.substring(1, 7);
	const currencyAndAmount = balanceField.substring(7);
	const currency = currencyAndAmount.substring(0, 3);
	const amountStr = currencyAndAmount.substring(3).replace(',', '.');
	const amount = parseFloat(amountStr) * (isCredit ? 1 : -1);

	// Convert YYMMDD to ISO date
	const year = parseInt(dateStr.substring(0, 2)) + 2000;
	const month = dateStr.substring(2, 4);
	const day = dateStr.substring(4, 6);
	const date = `${year}-${month}-${day}`;

	return { amount, currency, date };
}

/**
 * Parse MT940 transaction line
 */
function parseMT940Transaction(line61: string, info86: string): IParsedTransaction | null {
	try {
		// :61: Format: YYMMDD[MMDD]CD[amount]N[type][reference]//[bank_ref]
		const dateStr = line61.substring(0, 6);
		const year = parseInt(dateStr.substring(0, 2)) + 2000;
		const month = dateStr.substring(2, 4);
		const day = dateStr.substring(4, 6);
		const date = `${year}-${month}-${day}`;

		// Parse the rest
		let remaining = line61.substring(6);

		// Optional value date
		let valueDate = date;
		if (/^\d{4}/.test(remaining)) {
			const valueDateStr = remaining.substring(0, 4);
			valueDate = `${year}-${valueDateStr.substring(0, 2)}-${valueDateStr.substring(2, 4)}`;
			remaining = remaining.substring(4);
		}

		// Credit/Debit indicator
		const cdMatch = remaining.match(/^([CD]R?)/);
		if (!cdMatch) return null;
		const isCredit = cdMatch[1].startsWith('C');
		remaining = remaining.substring(cdMatch[1].length);

		// Third character of currency (optional)
		if (/^[A-Z]/.test(remaining)) {
			remaining = remaining.substring(1);
		}

		// Amount
		const amountMatch = remaining.match(/^(\d+[,.]?\d*)/);
		if (!amountMatch) return null;
		const amount = parseFloat(amountMatch[1].replace(',', '.'));
		remaining = remaining.substring(amountMatch[1].length);

		// Transaction type
		const typeMatch = remaining.match(/^N(\w{3})/);
		const transactionCode = typeMatch ? typeMatch[1] : undefined;

		// Reference
		const refMatch = remaining.match(/\/\/(.+)/);
		const bankReference = refMatch ? refMatch[1] : undefined;

		return {
			date,
			valueDate,
			amount,
			type: isCredit ? 'credit' : 'debit',
			transactionCode,
			bankReference,
			reference: undefined,
			description: info86.replace(/\n/g, ' ').trim() || 'Transaction',
		};
	} catch {
		return null;
	}
}

/**
 * Parse camt.053 (ISO 20022) format
 *
 * camt.053 is the ISO 20022 Bank to Customer Statement message.
 * Used for end-of-day account statements with rich transaction data.
 */
export async function parseCAMT053(xmlContent: string): Promise<IParsedStatement[]> {
	const xml2js = require('xml2js');
	const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

	const result = await parser.parseStringPromise(xmlContent);
	const statements: IParsedStatement[] = [];

	// Navigate to statements
	const document = result.Document || result;
	const bankToCustomerStatement = document.BkToCstmrStmt || document['BkToCstmrStmt'];

	if (!bankToCustomerStatement) return statements;

	const stmts = Array.isArray(bankToCustomerStatement.Stmt)
		? bankToCustomerStatement.Stmt
		: [bankToCustomerStatement.Stmt];

	for (const stmt of stmts) {
		if (!stmt) continue;

		const statement: IParsedStatement = {
			format: 'camt053',
			accountNumber: stmt.Acct?.Id?.IBAN || stmt.Acct?.Id?.Othr?.Id || '',
			accountName: stmt.Acct?.Nm || undefined,
			currency: stmt.Acct?.Ccy || 'USD',
			statementDate: stmt.CreDtTm || new Date().toISOString(),
			periodStart: stmt.FrToDt?.FrDtTm || stmt.CreDtTm || '',
			periodEnd: stmt.FrToDt?.ToDtTm || stmt.CreDtTm || '',
			openingBalance: 0,
			closingBalance: 0,
			transactions: [],
		};

		// Parse balances
		const balances = Array.isArray(stmt.Bal) ? stmt.Bal : [stmt.Bal];
		for (const bal of balances) {
			if (!bal) continue;
			const amount = parseFloat(bal.Amt?._ || bal.Amt || '0');
			const isCredit = bal.CdtDbtInd === 'CRDT';
			const balanceAmount = isCredit ? amount : -amount;

			if (bal.Tp?.CdOrPrtry?.Cd === 'OPBD' || bal.Tp?.CdOrPrtry === 'OPBD') {
				statement.openingBalance = balanceAmount;
			} else if (bal.Tp?.CdOrPrtry?.Cd === 'CLBD' || bal.Tp?.CdOrPrtry === 'CLBD') {
				statement.closingBalance = balanceAmount;
			}
		}

		// Parse transactions
		const entries = Array.isArray(stmt.Ntry) ? stmt.Ntry : stmt.Ntry ? [stmt.Ntry] : [];
		for (const entry of entries) {
			const amount = parseFloat(entry.Amt?._ || entry.Amt || '0');
			const isCredit = entry.CdtDbtInd === 'CRDT';

			const transaction: IParsedTransaction = {
				date: entry.BookgDt?.Dt || entry.BookgDt?.DtTm || statement.statementDate,
				valueDate: entry.ValDt?.Dt || entry.ValDt?.DtTm || entry.BookgDt?.Dt || '',
				amount,
				type: isCredit ? 'credit' : 'debit',
				transactionCode: entry.BkTxCd?.Domn?.Cd || entry.BkTxCd?.Prtry?.Cd,
				reference: entry.AcctSvcrRef || entry.NtryRef,
				bankReference: entry.AcctSvcrRef,
				description: entry.AddtlNtryInf || entry.NtryDtls?.TxDtls?.RmtInf?.Ustrd || 'Transaction',
				counterparty: extractCAMT053Counterparty(entry),
				additionalInfo: {
					status: entry.Sts,
					chargeBearer: entry.Chrgs?.TtlChrgsAndTaxAmt,
				},
			};

			statement.transactions.push(transaction);
		}

		statements.push(statement);
	}

	return statements;
}

/**
 * Extract counterparty from camt.053 entry
 */
function extractCAMT053Counterparty(entry: IDataObject): string | undefined {
	const txDtls = (entry.NtryDtls as IDataObject)?.TxDtls as IDataObject;
	if (!txDtls) return undefined;

	const rltdPties = txDtls.RltdPties as IDataObject;
	if (!rltdPties) return undefined;

	// Try creditor, then debtor
	const party = (rltdPties.Cdtr as IDataObject) || (rltdPties.Dbtr as IDataObject);
	if (!party) return undefined;

	return (party.Nm as string) || ((party.Id as IDataObject)?.OrgId as IDataObject)?.Nm as string;
}

/**
 * Detect statement format from content
 */
export function detectStatementFormat(content: string): 'bai2' | 'mt940' | 'camt053' | 'unknown' {
	const trimmed = content.trim();

	// BAI2 starts with "01," (file header)
	if (trimmed.startsWith('01,')) {
		return 'bai2';
	}

	// MT940 contains :20: reference field
	if (trimmed.includes(':20:') && (trimmed.includes(':60') || trimmed.includes(':61:'))) {
		return 'mt940';
	}

	// camt.053 is XML with specific namespace
	if (trimmed.includes('<Document') && trimmed.includes('camt.053')) {
		return 'camt053';
	}

	return 'unknown';
}

/**
 * Parse statement automatically based on detected format
 */
export async function parseStatement(content: string): Promise<IParsedStatement[]> {
	const format = detectStatementFormat(content);

	switch (format) {
		case 'bai2':
			return parseBAI2(content);
		case 'mt940':
			return parseMT940(content);
		case 'camt053':
			return parseCAMT053(content);
		default:
			throw new Error('Unknown statement format');
	}
}
