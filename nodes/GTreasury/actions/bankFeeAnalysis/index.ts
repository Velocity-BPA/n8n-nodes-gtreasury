/**
 * Bank Fee Analysis Actions
 *
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { simpleApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[] = {};

	switch (operation) {
		case 'getFeeSummary': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.BANK_FEES.SUMMARY,
				{},
				qs,
			);
			break;
		}

		case 'importStatement': {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;

			const items = this.getInputData();
			const binaryData = items[index].binary;

			if (!binaryData || !binaryData[binaryPropertyName]) {
				throw new Error(`No binary data found in property "${binaryPropertyName}"`);
			}

			const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
			const fileName = binaryData[binaryPropertyName].fileName || 'fee_statement.txt';
			const mimeType = binaryData[binaryPropertyName].mimeType || 'text/plain';

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.BANK_FEES.IMPORT,
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
						format: 'AFP',
					},
				},
			);
			break;
		}

		case 'analyzeFees': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const body: IDataObject = {};
			if (filters.entityId) body.entityId = filters.entityId;
			if (filters.dateFrom) body.dateFrom = filters.dateFrom;
			if (filters.dateTo) body.dateTo = filters.dateTo;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.BANK_FEES.analysis,
				body,
			);
			break;
		}

		case 'getServiceCharges': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.BANK_FEES.byService,
				{},
				qs,
			);
			break;
		}

		case 'compareBanks': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.BANK_FEES.COMPARE,
				{},
				qs,
			);
			break;
		}

		case 'getTrendAnalysis': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.BANK_FEES.TRENDS,
				{},
				qs,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for bank fee analysis`);
	}

	return responseData;
}
