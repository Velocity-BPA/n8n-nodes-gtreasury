/**
 * GTreasury Reporting Actions
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
				case 'generate': {
					const reportType = this.getNodeParameter('reportType', i) as string;
					const parameters = this.getNodeParameter('parameters', i) as {
						startDate?: string;
						endDate?: string;
						asOfDate?: string;
						entityId?: string;
						accountIds?: string[];
						currencies?: string[];
						groupBy?: string;
						includeSubEntities?: boolean;
						consolidate?: boolean;
						comparison?: string;
					};

					const body: Record<string, unknown> = {
						reportType,
					};

					if (parameters.startDate) body.startDate = parameters.startDate;
					if (parameters.endDate) body.endDate = parameters.endDate;
					if (parameters.asOfDate) body.asOfDate = parameters.asOfDate;
					if (parameters.entityId) body.entityId = parameters.entityId;
					if (parameters.accountIds && parameters.accountIds.length > 0) {
						body.accountIds = parameters.accountIds;
					}
					if (parameters.currencies && parameters.currencies.length > 0) {
						body.currencies = parameters.currencies;
					}
					if (parameters.groupBy) body.groupBy = parameters.groupBy;
					if (parameters.includeSubEntities !== undefined) {
						body.includeSubEntities = parameters.includeSubEntities;
					}
					if (parameters.consolidate !== undefined) body.consolidate = parameters.consolidate;
					if (parameters.comparison) body.COMPARE = parameters.comparison;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.REPORTS.GENERATE,
						body,
					);
					break;
				}

				case 'getStatus': {
					const reportId = this.getNodeParameter('reportId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.REPORTS.BASE}/${reportId}/status`,
					);
					break;
				}

				case 'download': {
					const reportId = this.getNodeParameter('reportId', i) as string;
					const format = this.getNodeParameter('format', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.REPORTS.BASE}/${reportId}/download?format=${format}`,
						{},
						{},
						{ encoding: null, resolveWithFullResponse: true },
					);

					const binaryData = await this.helpers.prepareBinaryData(
						Buffer.from(responseData.body as string, 'binary'),
						`report_${reportId}.${format}`,
					);

					returnData.push({
						json: { reportId, format, downloaded: true },
						binary: { data: binaryData },
						pairedItem: { item: i },
					});
					continue;
				}

				case 'schedule': {
					const reportType = this.getNodeParameter('reportType', i) as string;
					const scheduleName = this.getNodeParameter('scheduleName', i) as string;
					const frequency = this.getNodeParameter('frequency', i) as string;
					const parameters = this.getNodeParameter('parameters', i) as {
						time?: string;
						dayOfWeek?: number;
						dayOfMonth?: number;
						timezone?: string;
						recipients?: string[];
						format?: string;
						entityId?: string;
						accountIds?: string[];
						includeSubEntities?: boolean;
					};

					const body: Record<string, unknown> = {
						reportType,
						scheduleName,
						frequency,
					};

					Object.entries(parameters).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.REPORTS.SCHEDULES,
						body,
					);
					break;
				}

				case 'getSchedules': {
					const filters = this.getNodeParameter('filters', i) as {
						reportType?: string;
						status?: string;
					};

					const params: string[] = [];
					if (filters.reportType) params.push(`reportType=${encodeURIComponent(filters.reportType)}`);
					if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.REPORTS.SCHEDULES}${qs}`,
					);
					break;
				}

				case 'deleteSchedule': {
					const scheduleId = this.getNodeParameter('scheduleId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'DELETE',
						`${ENDPOINTS.REPORTS.SCHEDULES}/${scheduleId}`,
					);
					break;
				}

				case 'listTemplates': {
					const filters = this.getNodeParameter('filters', i) as {
						category?: string;
						search?: string;
					};

					const params: string[] = [];
					if (filters.category) params.push(`category=${encodeURIComponent(filters.category)}`);
					if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.REPORTS.TEMPLATES}${qs}`,
					);
					break;
				}

				case 'createDashboard': {
					const name = this.getNodeParameter('dashboardName', i) as string;
					const widgets = this.getNodeParameter('widgets', i) as Array<{
						type: string;
						title: string;
						config: Record<string, unknown>;
						position: { x: number; y: number; width: number; height: number };
					}>;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						description?: string;
						isDefault?: boolean;
						refreshInterval?: number;
						sharedWith?: string[];
					};

					const body: Record<string, unknown> = {
						name,
						widgets,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.REPORTS.DASHBOARDS,
						body,
					);
					break;
				}

				case 'getDashboard': {
					const dashboardId = this.getNodeParameter('dashboardId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.REPORTS.DASHBOARDS}/${dashboardId}`,
					);
					break;
				}

				case 'exportData': {
					const dataType = this.getNodeParameter('dataType', i) as string;
					const format = this.getNodeParameter('format', i) as string;
					const parameters = this.getNodeParameter('parameters', i) as {
						startDate?: string;
						endDate?: string;
						entityId?: string;
						filters?: Record<string, unknown>;
					};

					const body: Record<string, unknown> = {
						dataType,
						format,
					};

					Object.entries(parameters).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.REPORTS.EXPORT,
						body,
					);
					break;
				}

				case 'getReportHistory': {
					const filters = this.getNodeParameter('filters', i) as {
						reportType?: string;
						startDate?: string;
						endDate?: string;
						status?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.reportType) params.push(`reportType=${encodeURIComponent(filters.reportType)}`);
					if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
					if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
					if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.REPORTS.HISTORY}${qs}`,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for reporting resource`);
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
