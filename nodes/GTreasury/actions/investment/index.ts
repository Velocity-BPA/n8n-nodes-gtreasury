/**
 * Investment Actions
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
		case 'getPortfolio': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.currency) qs.currency = filters.currency;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.INVESTMENT.PORTFOLIO,
				{},
				qs,
			);
			break;
		}

		case 'listInvestments': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const options = this.getNodeParameter('options', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.status) qs.status = filters.status;
			if (filters.currency) qs.currency = filters.currency;
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;
			if (options.limit) qs.limit = options.limit;
			if (options.offset) qs.offset = options.offset;
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.sortOrder) qs.sortOrder = options.sortOrder;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.INVESTMENT.BASE,
				{},
				qs,
			);
			break;
		}

		case 'createInvestment': {
			const amount = this.getNodeParameter('amount', index) as number;
			const currency = this.getNodeParameter('currency', index, 'USD') as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				amount,
				currency,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.INVESTMENT.BASE,
				body,
			);
			break;
		}

		case 'updateInvestment': {
			const investmentId = this.getNodeParameter('investmentId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.INVESTMENT.BASE}/${investmentId}`,
				additionalFields,
			);
			break;
		}

		case 'getMaturities': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;
			if (filters.entityId) qs.entityId = filters.entityId;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.INVESTMENT.MATURITIES,
				{},
				qs,
			);
			break;
		}

		case 'calculateYield': {
			const investmentId = this.getNodeParameter('investmentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.INVESTMENT.BASE}/${investmentId}/yield`,
			);
			break;
		}

		case 'getPolicyCompliance': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.entityId) qs.entityId = filters.entityId;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.INVESTMENT.POLICY,
				{},
				qs,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for investments`);
	}

	return responseData;
}
