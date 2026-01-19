/**
 * GTreasury User Management Actions
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
				case 'create': {
					const email = this.getNodeParameter('email', i) as string;
					const firstName = this.getNodeParameter('firstName', i) as string;
					const lastName = this.getNodeParameter('lastName', i) as string;
					const roleId = this.getNodeParameter('roleId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						title?: string;
						department?: string;
						phone?: string;
						entityIds?: string[];
						timezone?: string;
						locale?: string;
						sendWelcomeEmail?: boolean;
						expiresAt?: string;
						mfaRequired?: boolean;
						ipWhitelist?: string[];
					};

					const body: Record<string, unknown> = {
						email,
						firstName,
						lastName,
						roleId,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.USERS.BASE,
						body,
					);
					break;
				}

				case 'get': {
					const userId = this.getNodeParameter('userId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						includePermissions?: boolean;
						includeActivity?: boolean;
					};

					const params: string[] = [];
					if (options.includePermissions) params.push('includePermissions=true');
					if (options.includeActivity) params.push('includeActivity=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.USERS.BASE}/${userId}${qs}`,
					);
					break;
				}

				case 'getMany': {
					const filters = this.getNodeParameter('filters', i) as {
						roleId?: string;
						entityId?: string;
						status?: string;
						search?: string;
						limit?: number;
						offset?: number;
					};

					const params: string[] = [];
					if (filters.roleId) params.push(`roleId=${encodeURIComponent(filters.roleId)}`);
					if (filters.entityId) params.push(`entityId=${encodeURIComponent(filters.entityId)}`);
					if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
					if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);
					if (filters.offset) params.push(`offset=${filters.offset}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.USERS.BASE}${qs}`,
					);
					break;
				}

				case 'update': {
					const userId = this.getNodeParameter('userId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i) as {
						firstName?: string;
						lastName?: string;
						title?: string;
						department?: string;
						phone?: string;
						roleId?: string;
						entityIds?: string[];
						timezone?: string;
						locale?: string;
						status?: string;
					};

					responseData = await simpleApiRequest.call(
						this,
						'PATCH',
						`${ENDPOINTS.USERS.BASE}/${userId}`,
						updateFields,
					);
					break;
				}

				case 'delete': {
					const userId = this.getNodeParameter('userId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						reassignTo?: string;
						hardDelete?: boolean;
					};

					const params: string[] = [];
					if (options.reassignTo) params.push(`reassignTo=${encodeURIComponent(options.reassignTo)}`);
					if (options.hardDelete) params.push('hardDelete=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'DELETE',
						`${ENDPOINTS.USERS.BASE}/${userId}${qs}`,
					);
					break;
				}

				case 'activate': {
					const userId = this.getNodeParameter('userId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.USERS.BASE}/${userId}/activate`,
					);
					break;
				}

				case 'deactivate': {
					const userId = this.getNodeParameter('userId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						reason?: string;
						reassignTo?: string;
					};

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.USERS.BASE}/${userId}/deactivate`,
						additionalFields,
					);
					break;
				}

				case 'resetPassword': {
					const userId = this.getNodeParameter('userId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						sendEmail?: boolean;
						forceChange?: boolean;
					};

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.USERS.BASE}/${userId}/reset-password`,
						options,
					);
					break;
				}

				case 'getRoles': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.USERS.ROLES,
					);
					break;
				}

				case 'createRole': {
					const name = this.getNodeParameter('roleName', i) as string;
					const permissions = this.getNodeParameter('permissions', i) as string[];
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						description?: string;
						inheritsFrom?: string;
						entityRestricted?: boolean;
						maxApprovalAmount?: number;
						maxApprovalCurrency?: string;
					};

					const body: Record<string, unknown> = {
						name,
						permissions,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.USERS.ROLES,
						body,
					);
					break;
				}

				case 'updateRole': {
					const roleId = this.getNodeParameter('roleId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i) as {
						name?: string;
						description?: string;
						permissions?: string[];
						maxApprovalAmount?: number;
						maxApprovalCurrency?: string;
					};

					responseData = await simpleApiRequest.call(
						this,
						'PATCH',
						`${ENDPOINTS.USERS.ROLES}/${roleId}`,
						updateFields,
					);
					break;
				}

				case 'getPermissions': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.USERS.PERMISSIONS,
					);
					break;
				}

				case 'assignEntityAccess': {
					const userId = this.getNodeParameter('userId', i) as string;
					const entityIds = this.getNodeParameter('entityIds', i) as string[];
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						accessLevel?: string;
						includeSubEntities?: boolean;
					};

					const body: Record<string, unknown> = {
						entityIds,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.USERS.BASE}/${userId}/entity-access`,
						body,
					);
					break;
				}

				case 'getUserActivity': {
					const userId = this.getNodeParameter('userId', i) as string;
					const filters = this.getNodeParameter('filters', i) as {
						startDate?: string;
						endDate?: string;
						activityType?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.startDate) params.push(`startDate=${encodeURIComponent(filters.startDate)}`);
					if (filters.endDate) params.push(`endDate=${encodeURIComponent(filters.endDate)}`);
					if (filters.activityType) params.push(`activityType=${encodeURIComponent(filters.activityType)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.USERS.BASE}/${userId}/activity${qs}`,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for userManagement resource`);
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
