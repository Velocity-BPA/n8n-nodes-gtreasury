/**
 * Debt Actions
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
		case 'listDebtInstruments': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const options = this.getNodeParameter('options', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.status) qs.status = filters.status;
			if (filters.currency) qs.currency = filters.currency;
			if (filters.entityId) qs.entityId = filters.entityId;
			if (options.limit) qs.limit = options.limit;
			if (options.offset) qs.offset = options.offset;
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.sortOrder) qs.sortOrder = options.sortOrder;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.DEBT.BASE,
				{},
				qs,
			);
			break;
		}

		case 'getDebtInstrument': {
			const debtInstrumentId = this.getNodeParameter('debtInstrumentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.DEBT.BASE}/${debtInstrumentId}`,
			);
			break;
		}

		case 'createDebtInstrument': {
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
				ENDPOINTS.DEBT.BASE,
				body,
			);
			break;
		}

		case 'updateDebtInstrument': {
			const debtInstrumentId = this.getNodeParameter('debtInstrumentId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.DEBT.BASE}/${debtInstrumentId}`,
				additionalFields,
			);
			break;
		}

		case 'recordDraw': {
			const debtInstrumentId = this.getNodeParameter('debtInstrumentId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				amount,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.DEBT.DRAWS}`.replace('{id}', debtInstrumentId),
				body,
			);
			break;
		}

		case 'recordPayment': {
			const debtInstrumentId = this.getNodeParameter('debtInstrumentId', index) as string;
			const amount = this.getNodeParameter('amount', index) as number;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				amount,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.DEBT.PAYMENTS}`.replace('{id}', debtInstrumentId),
				body,
			);
			break;
		}

		case 'getCovenants': {
			const debtInstrumentId = this.getNodeParameter('debtInstrumentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.DEBT.COVENANTS}`.replace('{id}', debtInstrumentId),
			);
			break;
		}

		case 'checkCovenantCompliance': {
			const debtInstrumentId = this.getNodeParameter('debtInstrumentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.DEBT.BASE}/${debtInstrumentId}/covenant-check`,
			);
			break;
		}

		case 'getAmortizationSchedule': {
			const debtInstrumentId = this.getNodeParameter('debtInstrumentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.DEBT.AMORTIZATION}`.replace('{id}', debtInstrumentId),
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for debt`);
	}

	return responseData;
}
