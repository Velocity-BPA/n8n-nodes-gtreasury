/**
 * Cash Forecasting Actions
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
		case 'getForecast': {
			const forecastId = this.getNodeParameter('forecastId', index) as string;
			const startDate = this.getNodeParameter('startDate', index, '') as string;
			const endDate = this.getNodeParameter('endDate', index, '') as string;

			const qs: IDataObject = {};
			if (startDate) qs.startDate = startDate;
			if (endDate) qs.endDate = endDate;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FORECASTING.BASE}/${forecastId}`,
				{},
				qs,
			);
			break;
		}

		case 'createForecast': {
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.FORECASTING.BASE,
				additionalFields,
			);
			break;
		}

		case 'updateForecast': {
			const forecastId = this.getNodeParameter('forecastId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'PUT',
				`${ENDPOINTS.FORECASTING.BASE}/${forecastId}`,
				additionalFields,
			);
			break;
		}

		case 'getVariance': {
			const forecastId = this.getNodeParameter('forecastId', index) as string;
			const startDate = this.getNodeParameter('startDate', index, '') as string;
			const endDate = this.getNodeParameter('endDate', index, '') as string;

			const qs: IDataObject = {};
			if (startDate) qs.startDate = startDate;
			if (endDate) qs.endDate = endDate;

			responseData = await simpleApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FORECASTING.VARIANCE}`.replace('{id}', forecastId),
				{},
				qs,
			);
			break;
		}

		case 'importForecastData': {
			const binaryPropertyName = this.getNodeParameter('binaryPropertyName', index, 'data') as string;
			const forecastId = this.getNodeParameter('forecastId', index, '') as string;

			const items = this.getInputData();
			const binaryData = items[index].binary;

			if (!binaryData || !binaryData[binaryPropertyName]) {
				throw new Error(`No binary data found in property "${binaryPropertyName}"`);
			}

			const buffer = await this.helpers.getBinaryDataBuffer(index, binaryPropertyName);
			const fileName = binaryData[binaryPropertyName].fileName || 'forecast_data.csv';
			const mimeType = binaryData[binaryPropertyName].mimeType || 'text/csv';

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				ENDPOINTS.FORECASTING.IMPORT,
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
						forecastId,
					},
				},
			);
			break;
		}

		case 'getCategories': {
			responseData = await simpleApiRequest.call(
				this,
				'GET',
				ENDPOINTS.FORECASTING.CATEGORIES,
			);
			break;
		}

		case 'runScenario': {
			const forecastId = this.getNodeParameter('forecastId', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

			responseData = await simpleApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.FORECASTING.SCENARIOS}`.replace('{id}', forecastId),
				additionalFields,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for cash forecasting`);
	}

	return responseData;
}
