/**
 * Entity Actions
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

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.ENTITY.BASE,
				additionalFields,
			);
			break;
		}

		case 'delete': {
			const entityId = this.getNodeParameter('entityId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'DELETE',
				`${ENDPOINTS.ENTITY.BASE}/${entityId}`,
			);
			break;
		}

		case 'get': {
			const entityId = this.getNodeParameter('entityId', index) as string;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.ENTITY.BASE}/${entityId}`,
			);
			break;
		}

		case 'getMany': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const options = this.getNodeParameter('options', index, {}) as IDataObject;

			const qs: IDataObject = {};
			if (filters.status) qs.status = filters.status;
			if (filters.search) qs.search = filters.search;
			if (options.limit) qs.limit = options.limit;
			if (options.offset) qs.offset = options.offset;
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.sortOrder) qs.sortOrder = options.sortOrder;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.ENTITY.BASE,
				{},
				qs,
			);
			break;
		}

		case 'update': {
			const entityId = this.getNodeParameter('entityId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.ENTITY.BASE}/${entityId}`,
				additionalFields,
			);
			break;
		}

		case 'getHierarchy': {
			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.ENTITY.HIERARCHY,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for entities`);
	}

	return responseData;
}
