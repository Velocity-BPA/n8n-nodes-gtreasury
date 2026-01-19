/**
 * GTreasury Workflow Actions
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
				case 'getPendingApprovals': {
					const filters = this.getNodeParameter('filters', i) as {
						type?: string;
						priority?: string;
						assignedTo?: string;
						olderThan?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (filters.type) params.push(`type=${encodeURIComponent(filters.type)}`);
					if (filters.priority) params.push(`priority=${encodeURIComponent(filters.priority)}`);
					if (filters.assignedTo) params.push(`assignedTo=${encodeURIComponent(filters.assignedTo)}`);
					if (filters.olderThan) params.push(`olderThan=${encodeURIComponent(filters.olderThan)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.WORKFLOWS.APPROVALS}${qs}`,
					);
					break;
				}

				case 'approve': {
					const approvalId = this.getNodeParameter('approvalId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						comments?: string;
						conditions?: string;
					};

					const body: Record<string, unknown> = {
						action: 'approve',
					};

					if (additionalFields.comments) body.comments = additionalFields.comments;
					if (additionalFields.conditions) body.conditions = additionalFields.conditions;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.WORKFLOWS.APPROVALS}/${approvalId}/action`,
						body,
					);
					break;
				}

				case 'reject': {
					const approvalId = this.getNodeParameter('approvalId', i) as string;
					const reason = this.getNodeParameter('reason', i) as string;

					const body: Record<string, unknown> = {
						action: 'reject',
						reason,
					};

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.WORKFLOWS.APPROVALS}/${approvalId}/action`,
						body,
					);
					break;
				}

				case 'delegate': {
					const approvalId = this.getNodeParameter('approvalId', i) as string;
					const delegateTo = this.getNodeParameter('delegateTo', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						reason?: string;
						expiresAt?: string;
					};

					const body: Record<string, unknown> = {
						action: 'delegate',
						delegateTo,
					};

					if (additionalFields.reason) body.reason = additionalFields.reason;
					if (additionalFields.expiresAt) body.expiresAt = additionalFields.expiresAt;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.WORKFLOWS.APPROVALS}/${approvalId}/action`,
						body,
					);
					break;
				}

				case 'getWorkflowStatus': {
					const objectType = this.getNodeParameter('objectType', i) as string;
					const objectId = this.getNodeParameter('objectId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.WORKFLOWS.BASE}/${objectType}/${objectId}/status`,
					);
					break;
				}

				case 'getWorkflowHistory': {
					const objectType = this.getNodeParameter('objectType', i) as string;
					const objectId = this.getNodeParameter('objectId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.WORKFLOWS.BASE}/${objectType}/${objectId}/history`,
					);
					break;
				}

				case 'createRule': {
					const name = this.getNodeParameter('ruleName', i) as string;
					const objectType = this.getNodeParameter('objectType', i) as string;
					const conditions = this.getNodeParameter('conditions', i) as Array<{
						field: string;
						operator: string;
						value: unknown;
					}>;
					const approvers = this.getNodeParameter('approvers', i) as Array<{
						userId: string;
						level: number;
						required: boolean;
					}>;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						description?: string;
						priority?: number;
						entityId?: string;
						escalationHours?: number;
						escalateTo?: string;
						autoApprove?: boolean;
						autoApproveConditions?: Record<string, unknown>;
						notifyOnSubmit?: string[];
						notifyOnComplete?: string[];
						isActive?: boolean;
					};

					const body: Record<string, unknown> = {
						name,
						objectType,
						conditions,
						approvers,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.WORKFLOWS.RULES,
						body,
					);
					break;
				}

				case 'getRules': {
					const filters = this.getNodeParameter('filters', i) as {
						objectType?: string;
						isActive?: boolean;
					};

					const params: string[] = [];
					if (filters.objectType) params.push(`objectType=${encodeURIComponent(filters.objectType)}`);
					if (filters.isActive !== undefined) params.push(`isActive=${filters.isActive}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.WORKFLOWS.RULES}${qs}`,
					);
					break;
				}

				case 'updateRule': {
					const ruleId = this.getNodeParameter('ruleId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i) as {
						name?: string;
						conditions?: Array<{
							field: string;
							operator: string;
							value: unknown;
						}>;
						approvers?: Array<{
							userId: string;
							level: number;
							required: boolean;
						}>;
						priority?: number;
						escalationHours?: number;
						escalateTo?: string;
						isActive?: boolean;
					};

					responseData = await simpleApiRequest.call(
						this,
						'PATCH',
						`${ENDPOINTS.WORKFLOWS.RULES}/${ruleId}`,
						updateFields,
					);
					break;
				}

				case 'deleteRule': {
					const ruleId = this.getNodeParameter('ruleId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'DELETE',
						`${ENDPOINTS.WORKFLOWS.RULES}/${ruleId}`,
					);
					break;
				}

				case 'setDelegation': {
					const userId = this.getNodeParameter('userId', i) as string;
					const delegateTo = this.getNodeParameter('delegateTo', i) as string;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						objectTypes?: string[];
						maxAmount?: number;
						currency?: string;
						reason?: string;
					};

					const body: Record<string, unknown> = {
						userId,
						delegateTo,
						startDate,
						endDate,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.WORKFLOWS.DELEGATIONS,
						body,
					);
					break;
				}

				case 'getDelegations': {
					const filters = this.getNodeParameter('filters', i) as {
						userId?: string;
						activeOnly?: boolean;
					};

					const params: string[] = [];
					if (filters.userId) params.push(`userId=${encodeURIComponent(filters.userId)}`);
					if (filters.activeOnly) params.push('activeOnly=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.WORKFLOWS.DELEGATIONS}${qs}`,
					);
					break;
				}

				case 'revokeDelegation': {
					const delegationId = this.getNodeParameter('delegationId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'DELETE',
						`${ENDPOINTS.WORKFLOWS.DELEGATIONS}/${delegationId}`,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for workflow resource`);
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
