/**
 * FX (Foreign Exchange) Actions
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
		case 'getExposure': {
			const currency = this.getNodeParameter('currency', index, '') as string;
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (currency) qs.currency = currency;
			if (filters.entityId) qs.entityId = filters.entityId;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.FX.EXPOSURE,
				{},
				qs,
			);
			break;
		}

		case 'listDeals': {
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
				ENDPOINTS.FX.DEALS,
				{},
				qs,
			);
			break;
		}

		case 'createDeal': {
			const amount = this.getNodeParameter('amount', index) as number;
			const currencyPair = this.getNodeParameter('currencyPair', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const [buyCurrency, sellCurrency] = currencyPair.split('/');

			const body: IDataObject = {
				amount,
				buyCurrency,
				sellCurrency,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.FX.DEALS,
				body,
			);
			break;
		}

		case 'updateDeal': {
			const dealId = this.getNodeParameter('dealId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.FX.DEALS}/${dealId}`,
				additionalFields,
			);
			break;
		}

		case 'getQuote': {
			const currencyPair = this.getNodeParameter('currencyPair', index) as string;
			const amount = this.getNodeParameter('amount', index, 0) as number;

			const [buyCurrency, sellCurrency] = currencyPair.split('/');

			const qs: IDataObject = {
				buyCurrency,
				sellCurrency,
			};
			if (amount > 0) qs.amount = amount;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.FX.rates,
				{},
				qs,
			);
			break;
		}

		case 'executeTrade': {
			const dealId = this.getNodeParameter('dealId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const currencyPair = this.getNodeParameter('currencyPair', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const [buyCurrency, sellCurrency] = currencyPair.split('/');

			const body: IDataObject = {
				dealId,
				amount,
				buyCurrency,
				sellCurrency,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.FX.deals,
				body,
			);
			break;
		}

		case 'getHedgePosition': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.currency) qs.currency = filters.currency;
			if (filters.entityId) qs.entityId = filters.entityId;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.FX.HEDGE,
				{},
				qs,
			);
			break;
		}

		case 'calculateMtm': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.currency) qs.currency = filters.currency;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.FX.MTM,
				{},
				qs,
			);
			break;
		}

		case 'getHedgeEffectiveness': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.entityId) qs.entityId = filters.entityId;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.FX.HEDGE,
				{},
				qs,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for FX`);
	}

	return responseData;
}
