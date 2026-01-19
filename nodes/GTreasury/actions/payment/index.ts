/**
 * Payment Actions
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
			const amount = this.getNodeParameter('amount', index) as number;
			const currency = this.getNodeParameter('currency', index, 'USD') as string;
			const paymentDetails = this.getNodeParameter('paymentDetails', index, {}) as IDataObject;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				amount,
				currency,
				...paymentDetails,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.PAYMENTS.BASE,
				body,
			);
			break;
		}

		case 'get': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYMENTS.BASE}/${paymentId}`,
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
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;
			if (filters.search) qs.search = filters.search;
			if (options.limit) qs.limit = options.limit;
			if (options.offset) qs.offset = options.offset;
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.sortOrder) qs.sortOrder = options.sortOrder;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.PAYMENTS.BASE,
				{},
				qs,
			);
			break;
		}

		case 'update': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;
			const paymentDetails = this.getNodeParameter('paymentDetails', index, {}) as IDataObject;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				...paymentDetails,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.PAYMENTS.BASE}/${paymentId}`,
				body,
			);
			break;
		}

		case 'delete': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'DELETE',
				`${ENDPOINTS.PAYMENTS.BASE}/${paymentId}`,
			);
			break;
		}

		case 'approve': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;
			const comment = this.getNodeParameter('comment', index, '') as string;

			const body: IDataObject = {};
			if (comment) body.comment = comment;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENTS.APPROVE}`.replace('{id}', paymentId),
				body,
			);
			break;
		}

		case 'reject': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;
			const rejectionReason = this.getNodeParameter('rejectionReason', index, '') as string;
			const comment = this.getNodeParameter('comment', index, '') as string;

			const body: IDataObject = {};
			if (rejectionReason) body.reason = rejectionReason;
			if (comment) body.comment = comment;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENTS.REJECT}`.replace('{id}', paymentId),
				body,
			);
			break;
		}

		case 'submit': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENTS.SUBMIT}`.replace('{id}', paymentId),
			);
			break;
		}

		case 'getStatus': {
			const paymentId = this.getNodeParameter('paymentId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYMENTS.STATUS}`.replace('{id}', paymentId),
			);
			break;
		}

		case 'createBatch': {
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.PAYMENTS.BATCHES,
				additionalFields,
			);
			break;
		}

		case 'releaseBatch': {
			const batchId = this.getNodeParameter('batchId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYMENTS.BATCHES}/${batchId}/release`,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for payments`);
	}

	return responseData;
}
