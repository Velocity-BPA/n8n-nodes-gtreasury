/**
 * GTreasury Audit Actions
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
				case 'getAuditLog': {
					const filters = this.getNodeParameter('filters', i) as {
						startDate?: string;
						endDate?: string;
						userId?: string;
						objectType?: string;
						objectId?: string;
						action?: string;
						entityId?: string;
						ipAddress?: string;
						status?: string;
						limit?: number;
						offset?: number;
					};

					const params: string[] = [];
					if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
					if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
					if (filters.userId) params.push(`userId=${encodeURIComponent(filters.userId)}`);
					if (filters.objectType) params.push(`objectType=${encodeURIComponent(filters.objectType)}`);
					if (filters.objectId) params.push(`objectId=${encodeURIComponent(filters.objectId)}`);
					if (filters.action) params.push(`action=${encodeURIComponent(filters.action)}`);
					if (filters.entityId) params.push(`entityId=${encodeURIComponent(filters.entityId)}`);
					if (filters.ipAddress) params.push(`ipAddress=${encodeURIComponent(filters.ipAddress)}`);
					if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);
					if (filters.offset) params.push(`offset=${filters.offset}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.AUDIT.RECONCILIATION}${qs}`,
					);
					break;
				}

				case 'getAuditEntry': {
					const auditId = this.getNodeParameter('auditId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						includeChanges?: boolean;
						includePreviousValues?: boolean;
					};

					const params: string[] = [];
					if (options.includeChanges) params.push('includeChanges=true');
					if (options.includePreviousValues) params.push('includePreviousValues=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.AUDIT.RECONCILIATION}/${auditId}${qs}`,
					);
					break;
				}

				case 'getObjectHistory': {
					const objectType = this.getNodeParameter('objectType', i) as string;
					const objectId = this.getNodeParameter('objectId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						startDate?: string;
						endDate?: string;
						includeChanges?: boolean;
						limit?: number;
					};

					const params: string[] = [];
					if (options.startDate) params.push(`startDate=${encodeURIComponent(options.startDate)}`);
					if (options.endDate) params.push(`endDate=${encodeURIComponent(options.endDate)}`);
					if (options.includeChanges) params.push('includeChanges=true');
					if (options.limit) params.push(`limit=${options.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.AUDIT.BASE}/${objectType}/${objectId}/history${qs}`,
					);
					break;
				}

				case 'getLoginHistory': {
					const filters = this.getNodeParameter('filters', i) as {
						userId?: string;
						startDate?: string;
						endDate?: string;
						status?: string;
						ipAddress?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.userId) params.push(`userId=${encodeURIComponent(filters.userId)}`);
					if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
					if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
					if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
					if (filters.ipAddress) params.push(`ipAddress=${encodeURIComponent(filters.ipAddress)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.AUDIT.RECONCILIATION}${qs}`,
					);
					break;
				}

				case 'getSecurityEvents': {
					const filters = this.getNodeParameter('filters', i) as {
						startDate?: string;
						endDate?: string;
						eventType?: string;
						severity?: string;
						userId?: string;
						resolved?: boolean;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
					if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
					if (filters.eventType) params.push(`eventType=${encodeURIComponent(filters.eventType)}`);
					if (filters.severity) params.push(`severity=${encodeURIComponent(filters.severity)}`);
					if (filters.userId) params.push(`userId=${encodeURIComponent(filters.userId)}`);
					if (filters.resolved !== undefined) params.push(`resolved=${filters.resolved}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.AUDIT.RECONCILIATION}${qs}`,
					);
					break;
				}

				case 'getComplianceReport': {
					const reportType = this.getNodeParameter('complianceReportType', i) as string;
					const parameters = this.getNodeParameter('parameters', i) as {
						startDate?: string;
						endDate?: string;
						entityId?: string;
						format?: string;
						includeEvidence?: boolean;
					};

					const body: Record<string, unknown> = {
						reportType,
					};

					Object.entries(parameters).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.AUDIT.COMPLIANCE,
						body,
					);
					break;
				}

				case 'getDataAccessLog': {
					const filters = this.getNodeParameter('filters', i) as {
						startDate?: string;
						endDate?: string;
						userId?: string;
						dataType?: string;
						accessType?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
					if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
					if (filters.userId) params.push(`userId=${encodeURIComponent(filters.userId)}`);
					if (filters.dataType) params.push(`dataType=${encodeURIComponent(filters.dataType)}`);
					if (filters.accessType) params.push(`accessType=${encodeURIComponent(filters.accessType)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.AUDIT.dataChanges}${qs}`,
					);
					break;
				}

				case 'exportAuditLog': {
					const filters = this.getNodeParameter('filters', i) as {
						startDate: string;
						endDate: string;
						format: string;
						objectTypes?: string[];
						actions?: string[];
						userIds?: string[];
					};

					const body: Record<string, unknown> = {
						startDate: filters.startDate,
						endDate: filters.endDate,
						format: filters.format,
					};

					if (filters.objectTypes && filters.objectTypes.length > 0) {
						body.objectTypes = filters.objectTypes;
					}
					if (filters.actions && filters.actions.length > 0) {
						body.actions = filters.actions;
					}
					if (filters.userIds && filters.userIds.length > 0) {
						body.userIds = filters.userIds;
					}

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.AUDIT.EXPORT,
						body,
					);
					break;
				}

				case 'getRetentionPolicy': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.AUDIT.RECONCILIATION,
					);
					break;
				}

				case 'updateRetentionPolicy': {
					const policy = this.getNodeParameter('policy', i) as {
						auditLogRetentionDays: number;
						loginHistoryRetentionDays: number;
						securityEventRetentionDays: number;
						archiveEnabled?: boolean;
						archiveLocation?: string;
					};

					responseData = await simpleApiRequest.call(
						this,
						'PUT',
						ENDPOINTS.AUDIT.RECONCILIATION,
						policy,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for audit resource`);
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
