/**
 * GTreasury Utility Actions
 * 
 * Copyright (c) 2025 Claude AI Assistant
 * Licensed under the Business Source License 1.1
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';

import { simpleApiRequest } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	operation: string,
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			switch (operation) {
				case 'getSystemStatus': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.SYSTEM.STATUS,
					);
					break;
				}

				case 'getApiUsage': {
					const options = this.getNodeParameter('options', i) as {
						startDate?: string;
						endDate?: string;
						groupBy?: string;
					};

					const params: string[] = [];
					if (options.startDate) params.push(`startDate=${encodeURIComponent(options.startDate)}`);
					if (options.endDate) params.push(`endDate=${encodeURIComponent(options.endDate)}`);
					if (options.groupBy) params.push(`groupBy=${encodeURIComponent(options.groupBy)}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.SYSTEM.API_USAGE}${qs}`,
					);
					break;
				}

				case 'validateBankAccount': {
					const accountNumber = this.getNodeParameter('accountNumber', i) as string;
					const routingNumber = this.getNodeParameter('routingNumber', i) as string;
					const options = this.getNodeParameter('options', i) as {
						country?: string;
						bankCode?: string;
						iban?: string;
						swiftCode?: string;
					};

					const body: Record<string, unknown> = {
						accountNumber,
						routingNumber,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.UTILITY.VALIDATE_BANK_ACCOUNT,
						body,
					);
					break;
				}

				case 'validateIban': {
					const iban = this.getNodeParameter('iban', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.UTILITY.VALIDATE_IBAN,
						{ iban },
					);
					break;
				}

				case 'calculateBusinessDays': {
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const options = this.getNodeParameter('options', i) as {
						calendars?: string[];
						excludeHolidays?: boolean;
					};

					const body: Record<string, unknown> = {
						startDate,
						endDate,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.UTILITY.BUSINESS_DAYS,
						body,
					);
					break;
				}

				case 'getHolidayCalendar': {
					const country = this.getNodeParameter('country', i) as string;
					const year = this.getNodeParameter('year', i) as number;
					const options = this.getNodeParameter('options', i) as {
						region?: string;
						includeWeekends?: boolean;
					};

					const params: string[] = [
						`country=${encodeURIComponent(country)}`,
						`year=${year}`,
					];
					if (options.region) params.push(`region=${encodeURIComponent(options.region)}`);
					if (options.includeWeekends) params.push('includeWeekends=true');

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.UTILITY.HOLIDAYS}${qs}`,
					);
					break;
				}

				case 'convertCurrency': {
					const amount = this.getNodeParameter('amount', i) as number;
					const fromCurrency = this.getNodeParameter('fromCurrency', i) as string;
					const toCurrency = this.getNodeParameter('toCurrency', i) as string;
					const options = this.getNodeParameter('options', i) as {
						date?: string;
						rateSource?: string;
					};

					const body: Record<string, unknown> = {
						amount,
						fromCurrency,
						toCurrency,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.UTILITY.CONVERT_CURRENCY,
						body,
					);
					break;
				}

				case 'lookupSwiftCode': {
					const swiftCode = this.getNodeParameter('swiftCode', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.UTILITY.SWIFT_LOOKUP}?code=${encodeURIComponent(swiftCode)}`,
					);
					break;
				}

				case 'searchBanks': {
					const filters = this.getNodeParameter('filters', i) as {
						name?: string;
						country?: string;
						city?: string;
						swiftCode?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.name) params.push(`name=${encodeURIComponent(filters.name)}`);
					if (filters.country) params.push(`country=${encodeURIComponent(filters.country)}`);
					if (filters.city) params.push(`city=${encodeURIComponent(filters.city)}`);
					if (filters.swiftCode) params.push(`swiftCode=${encodeURIComponent(filters.swiftCode)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.UTILITY.BANK_SEARCH}${qs}`,
					);
					break;
				}

				case 'getCountries': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.UTILITY.COUNTRIES,
					);
					break;
				}

				case 'getCurrencies': {
					const options = this.getNodeParameter('options', i) as {
						activeOnly?: boolean;
						includeCrypto?: boolean;
					};

					const params: string[] = [];
					if (options.activeOnly) params.push('activeOnly=true');
					if (options.includeCrypto) params.push('includeCrypto=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.UTILITY.CURRENCIES}${qs}`,
					);
					break;
				}

				case 'ping': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.SYSTEM.PING,
					);
					break;
				}

				case 'getWebhooks': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.WEBHOOKS.BASE,
					);
					break;
				}

				case 'createWebhook': {
					const url = this.getNodeParameter('webhookUrl', i) as string;
					const events = this.getNodeParameter('events', i) as string[];
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						name?: string;
						secret?: string;
						isActive?: boolean;
						retryPolicy?: Record<string, unknown>;
						headers?: Record<string, string>;
					};

					const body: Record<string, unknown> = {
						url,
						events,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.WEBHOOKS.BASE,
						body,
					);
					break;
				}

				case 'updateWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i) as {
						url?: string;
						events?: string[];
						name?: string;
						isActive?: boolean;
						retryPolicy?: Record<string, unknown>;
					};

					responseData = await simpleApiRequest.call(
						this,
						'PATCH',
						`${ENDPOINTS.WEBHOOKS.BASE}/${webhookId}`,
						updateFields,
					);
					break;
				}

				case 'deleteWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'DELETE',
						`${ENDPOINTS.WEBHOOKS.BASE}/${webhookId}`,
					);
					break;
				}

				case 'testWebhook': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const eventType = this.getNodeParameter('eventType', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.WEBHOOKS.BASE}/${webhookId}/test`,
						{ eventType },
					);
					break;
				}

				case 'getWebhookLogs': {
					const webhookId = this.getNodeParameter('webhookId', i) as string;
					const filters = this.getNodeParameter('filters', i) as {
						startDate?: string;
						endDate?: string;
						status?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
					if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
					if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.WEBHOOKS.BASE}/${webhookId}/logs${qs}`,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for utility resource`);
			}

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);

		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
