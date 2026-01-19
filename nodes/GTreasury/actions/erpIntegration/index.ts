/**
 * ERP Integration Actions
 *
 * Copyright (c) 2025 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { simpleApiRequest } from '../../transport/apiClient';
import { postGlEntry, syncApData as syncAp, syncArData as syncAr, getSyncStatus as getStatus } from '../../transport/erpConnectors';
import { ENDPOINTS } from '../../constants/endpoints';

export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	let responseData: IDataObject | IDataObject[] = {};
	const erpSystem = this.getNodeParameter('erpSystem', index, 'WORKDAY') as string;

	switch (operation) {
		case 'postGlEntry': {
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const entryData: IDataObject = {
				erpSystem,
				...additionalFields,
			};

			responseData = await postGlEntry.call(this, erpSystem, entryData);
			break;
		}

		case 'getGlEntries': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;
			const options = this.getNodeParameter('options', index, {}) as IDataObject;

			const qs: IDataObject = {
				erpSystem,
			};
			if (filters.status) qs.status = filters.status;
			if (filters.entityId) qs.entityId = filters.entityId;
			if (filters.dateFrom) qs.dateFrom = filters.dateFrom;
			if (filters.dateTo) qs.dateTo = filters.dateTo;
			if (options.limit) qs.limit = options.limit;
			if (options.offset) qs.offset = options.offset;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.ERP.GL_ENTRIES,
				{},
				qs,
			);
			break;
		}

		case 'syncApData': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const options: IDataObject = {
				erpSystem,
			};
			if (filters.entityId) options.entityId = filters.entityId;
			if (filters.dateFrom) options.dateFrom = filters.dateFrom;
			if (filters.dateTo) options.dateTo = filters.dateTo;

			responseData = await syncAp.call(this, erpSystem, options);
			break;
		}

		case 'syncArData': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const options: IDataObject = {
				erpSystem,
			};
			if (filters.entityId) options.entityId = filters.entityId;
			if (filters.dateFrom) options.dateFrom = filters.dateFrom;
			if (filters.dateTo) options.dateTo = filters.dateTo;

			responseData = await syncAr.call(this, erpSystem, options);
			break;
		}

		case 'getSyncStatus': {
			responseData = await getStatus.call(this, erpSystem);
			break;
		}

		case 'mapAccounts': {
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			const body: IDataObject = {
				erpSystem,
				...additionalFields,
			};

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.ERP.MAPPING,
				body,
			);
			break;
		}

		case 'runReconciliation': {
			const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

			const body: IDataObject = {
				erpSystem,
			};
			if (filters.entityId) body.entityId = filters.entityId;
			if (filters.dateFrom) body.dateFrom = filters.dateFrom;
			if (filters.dateTo) body.dateTo = filters.dateTo;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.ERP.RECONCILIATION,
				body,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for ERP integration`);
	}

	return responseData;
}
