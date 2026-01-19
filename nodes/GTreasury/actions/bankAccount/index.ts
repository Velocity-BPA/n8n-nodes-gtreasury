/**
 * Bank Account Actions
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
		case 'create': {
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.BANK_ACCOUNTS.BASE,
				body,
			);
			break;
		}

		case 'delete': {
			const accountId = this.getNodeParameter('accountId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'DELETE',
				`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${accountId}`,
			);
			break;
		}

		case 'get': {
			const accountId = this.getNodeParameter('accountId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${accountId}`,
			);
			break;
		}

		case 'getMany': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const options = this.getNodeParameter('options', index, {}) as IDataObject;

			const qs: IDataObject = {};
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
				ENDPOINTS.BANK_ACCOUNTS.BASE,
				{},
				qs,
			);
			break;
		}

		case 'update': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${accountId}`,
				body,
			);
			break;
		}

		case 'getSignatories': {
			const accountId = this.getNodeParameter('accountId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${accountId}/signatories`,
			);
			break;
		}

		case 'updateSignatories': {
			const accountId = this.getNodeParameter('accountId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.BANK_ACCOUNTS.BASE}/${accountId}/signatories`,
				additionalFields,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for bank accounts`);
	}

	return responseData;
}
