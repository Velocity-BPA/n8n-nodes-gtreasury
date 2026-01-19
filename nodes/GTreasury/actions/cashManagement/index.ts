/**
 * Cash Management Actions
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
		case 'getCashPosition': {
			const entityId = this.getNodeParameter('entityId', index, '') as string;
			const currency = this.getNodeParameter('currency', index, '') as string;
			
			const qs: IDataObject = {};
			if (entityId) qs.entityId = entityId;
			if (currency) qs.currency = currency;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.CASH.POSITION,
				{},
				qs,
			);
			break;
		}

		case 'getBalance': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			
			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.CASH.BALANCES}/${accountId}`,
			);
			break;
		}

		case 'listTransactions': {
			const startDate = this.getNodeParameter('startDate', index, '') as string;
			const endDate = this.getNodeParameter('endDate', index, '') as string;
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const options = this.getNodeParameter('options', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (startDate) qs.startDate = startDate;
			if (endDate) qs.endDate = endDate;
			if (filters.status) qs.status = filters.status;
			if (filters.currency) qs.currency = filters.currency;
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.search) qs.search = filters.search;
			if (options.limit) qs.limit = options.limit;
			if (options.offset) qs.offset = options.offset;
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.sortOrder) qs.sortOrder = options.sortOrder;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.CASH.TRANSACTIONS,
				{},
				qs,
			);
			break;
		}

		case 'createTransaction': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const currency = this.getNodeParameter('currency', index, 'USD') as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				accountId,
				amount,
				currency,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.CASH.TRANSACTIONS,
				body,
			);
			break;
		}

		case 'executeZbaSweep': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			
			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.CASH.zba}/${accountId}/sweep`,
			);
			break;
		}

		case 'getPoolBalance': {
			const entityId = this.getNodeParameter('entityId', index, '') as string;
			
			const qs: IDataObject = {};
			if (entityId) qs.entityId = entityId;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.CASH.pooling,
				{},
				qs,
			);
			break;
		}

		case 'reconcileAccount': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const startDate = this.getNodeParameter('startDate', index, '') as string;
			const endDate = this.getNodeParameter('endDate', index, '') as string;

			const body: IDataObject = {
				accountId,
			};
			if (startDate) body.startDate = startDate;
			if (endDate) body.endDate = endDate;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.CASH.RECONCILIATION,
				body,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for cash management`);
	}

	return responseData;
}
