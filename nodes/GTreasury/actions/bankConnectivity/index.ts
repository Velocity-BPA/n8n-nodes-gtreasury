/**
 * Bank Connectivity Actions (ClearConnect Gateway)
 *
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { simpleApiRequest } from '../../transport/apiClient';
import { getRealTimeBalance, downloadStatement as downloadBankStatement, testBankConnection } from '../../transport/clearConnectClient';
import { parseBAI2, parseMT940, parseCAMT053, detectStatementFormat } from '../../utils/statementParser';
import { ENDPOINTS } from '../../constants/endpoints';

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getConnectionStatus': {
			const connectionId = this.getNodeParameter('connectionId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.BANK_CONNECTIVITY.CONNECTIONS}/${connectionId}/status`,
			);
			break;
		}

		case 'listConnections': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const options = this.getNodeParameter('options', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.status) qs.status = filters.status;
			if (filters.bankIds) qs.bankIds = filters.bankIds;
			if (options.limit) qs.limit = options.limit;
			if (options.offset) qs.offset = options.offset;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.BANK_CONNECTIVITY.CONNECTIONS,
				{},
				qs,
			);
			break;
		}

		case 'testConnection': {
			const connectionId = this.getNodeParameter('connectionId', index) as string;

			responseData = await testBankConnection.call(this, connectionId);
			break;
		}

		case 'downloadStatement': {
			const connectionId = this.getNodeParameter('connectionId', index) as string;
			const statementFormat = this.getNodeParameter('statementFormat', index, 'AUTO') as string;
			const startDate = this.getNodeParameter('startDate', index, '') as string;
			const endDate = this.getNodeParameter('endDate', index, '') as string;

			const options: IDataObject = {};
			if (statementFormat !== 'AUTO') options.format = statementFormat;
			if (startDate) options.startDate = startDate;
			if (endDate) options.endDate = endDate;

			responseData = await downloadBankStatement.call(this, connectionId, options);
			break;
		}

		case 'parseStatement': {
			const statementData = this.getNodeParameter('statementData', index) as string;
			const statementFormat = this.getNodeParameter('statementFormat', index, 'AUTO') as string;

			let format = statementFormat;
			if (format === 'AUTO') {
				format = detectStatementFormat(statementData);
			}

			switch (format) {
				case 'BAI2':
					responseData = parseBAI2(statementData) as unknown as IDataObject[];
					break;
				case 'MT940':
					responseData = parseMT940(statementData) as unknown as IDataObject[];
					break;
				case 'CAMT053':
					responseData = parseCAMT053(statementData) as unknown as IDataObject[];
					break;
				default:
					throw new Error(`Unknown statement format: ${format}`);
			}
			break;
		}

		case 'getRealTimeBalance': {
			const connectionId = this.getNodeParameter('connectionId', index) as string;

			responseData = await getRealTimeBalance.call(this, connectionId);
			break;
		}

		case 'sendPaymentFile': {
			const connectionId = this.getNodeParameter('connectionId', index) as string;
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;

			const items = this.getInputData();
			const binaryData = items[index].binary;

			if (!binaryData || !binaryData[binaryPropertyName]) {
				throw new Error(`No binary data found in property "${binaryPropertyName}"`);
			}

			const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
			const fileName = binaryData[binaryPropertyName].fileName || 'payment_file.txt';
			const mimeType = binaryData[binaryPropertyName].mimeType || 'text/plain';

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.BANK_CONNECTIVITY.CONNECTIONS}/${connectionId}/files`,
				{},
				{},
				{
					formData: {
						file: {
							value: buffer,
							options: {
								filename: fileName,
								contentType: mimeType,
							},
						},
						type: 'PAYMENT',
					},
				},
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for bank connectivity`);
	}

	return responseData;
}
