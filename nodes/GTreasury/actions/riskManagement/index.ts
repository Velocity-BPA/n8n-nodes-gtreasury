/**
 * GTreasury Risk Management Actions
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
				case 'calculateVaR': {
					const portfolioId = this.getNodeParameter('portfolioId', i) as string;
					const parameters = this.getNodeParameter('parameters', i) as {
						confidenceLevel?: number;
						horizon?: number;
						method?: string;
						historicalPeriod?: number;
						scenarios?: number;
						asOfDate?: string;
					};

					const body: Record<string, unknown> = {
						portfolioId,
					};

					Object.entries(parameters).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.RISK.VAR,
						body,
					);
					break;
				}

				case 'runStressTest': {
					const portfolioId = this.getNodeParameter('portfolioId', i) as string;
					const scenarioId = this.getNodeParameter('scenarioId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						asOfDate?: string;
						includeBreakdown?: boolean;
					};

					const body: Record<string, unknown> = {
						portfolioId,
						scenarioId,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.RISK.STRESS_TEST,
						body,
					);
					break;
				}

				case 'getScenarios': {
					const filters = this.getNodeParameter('filters', i) as {
						type?: string;
						category?: string;
						isCustom?: boolean;
					};

					const params: string[] = [];
					if (filters.type) params.push(`type=${encodeURIComponent(filters.type)}`);
					if (filters.category) params.push(`category=${encodeURIComponent(filters.category)}`);
					if (filters.isCustom !== undefined) params.push(`isCustom=${filters.isCustom}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.SCENARIOS}${qs}`,
					);
					break;
				}

				case 'createScenario': {
					const name = this.getNodeParameter('scenarioName', i) as string;
					const shocks = this.getNodeParameter('shocks', i) as Array<{
						riskFactor: string;
						shockType: string;
						shockValue: number;
					}>;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						description?: string;
						category?: string;
						isActive?: boolean;
					};

					const body: Record<string, unknown> = {
						name,
						shocks,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.RISK.SCENARIOS,
						body,
					);
					break;
				}

				case 'getSensitivity': {
					const portfolioId = this.getNodeParameter('portfolioId', i) as string;
					const riskFactor = this.getNodeParameter('riskFactor', i) as string;
					const options = this.getNodeParameter('options', i) as {
						shockRange?: number;
						shockSteps?: number;
						asOfDate?: string;
					};

					const params: string[] = [
						`portfolioId=${encodeURIComponent(portfolioId)}`,
						`riskFactor=${encodeURIComponent(riskFactor)}`,
					];
					if (options.shockRange) params.push(`shockRange=${options.shockRange}`);
					if (options.shockSteps) params.push(`shockSteps=${options.shockSteps}`);
					if (options.asOfDate) params.push(`asOfDate=${encodeURIComponent(options.asOfDate)}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.SENSITIVITY}${qs}`,
					);
					break;
				}

				case 'getExposureSummary': {
					const options = this.getNodeParameter('options', i) as {
						entityId?: string;
						exposureType?: string;
						groupBy?: string;
						asOfDate?: string;
					};

					const params: string[] = [];
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.exposureType) params.push(`exposureType=${encodeURIComponent(options.exposureType)}`);
					if (options.groupBy) params.push(`groupBy=${encodeURIComponent(options.groupBy)}`);
					if (options.asOfDate) params.push(`asOfDate=${encodeURIComponent(options.asOfDate)}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.EXPOSURE}${qs}`,
					);
					break;
				}

				case 'getLimitUtilization': {
					const options = this.getNodeParameter('options', i) as {
						limitType?: string;
						entityId?: string;
						counterpartyId?: string;
						breachedOnly?: boolean;
					};

					const params: string[] = [];
					if (options.limitType) params.push(`limitType=${encodeURIComponent(options.limitType)}`);
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.counterpartyId) params.push(`counterpartyId=${encodeURIComponent(options.counterpartyId)}`);
					if (options.breachedOnly) params.push('breachedOnly=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.LIMITS}${qs}`,
					);
					break;
				}

				case 'setLimit': {
					const limitType = this.getNodeParameter('limitType', i) as string;
					const limitValue = this.getNodeParameter('limitValue', i) as number;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						entityId?: string;
						counterpartyId?: string;
						currency?: string;
						warningThreshold?: number;
						effectiveDate?: string;
						expirationDate?: string;
						approvedBy?: string;
						notes?: string;
					};

					const body: Record<string, unknown> = {
						limitType,
						limitValue,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.RISK.LIMITS,
						body,
					);
					break;
				}

				case 'getHedgeEffectiveness': {
					const hedgeId = this.getNodeParameter('hedgeId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						method?: string;
						startDate?: string;
						endDate?: string;
						includeDetails?: boolean;
					};

					const params: string[] = [];
					if (options.method) params.push(`method=${encodeURIComponent(options.method)}`);
					if (options.startDate) params.push(`startDate=${encodeURIComponent(options.startDate)}`);
					if (options.endDate) params.push(`endDate=${encodeURIComponent(options.endDate)}`);
					if (options.includeDetails) params.push('includeDetails=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.HEDGE_EFFECTIVENESS}/${hedgeId}${qs}`,
					);
					break;
				}

				case 'getPolicyCompliance': {
					const options = this.getNodeParameter('options', i) as {
						policyType?: string;
						entityId?: string;
						asOfDate?: string;
						includeBreaches?: boolean;
					};

					const params: string[] = [];
					if (options.policyType) params.push(`policyType=${encodeURIComponent(options.policyType)}`);
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.asOfDate) params.push(`asOfDate=${encodeURIComponent(options.asOfDate)}`);
					if (options.includeBreaches) params.push('includeBreaches=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.POLICY_COMPLIANCE}${qs}`,
					);
					break;
				}

				case 'getRiskDashboard': {
					const options = this.getNodeParameter('options', i) as {
						entityId?: string;
						asOfDate?: string;
					};

					const params: string[] = [];
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.asOfDate) params.push(`asOfDate=${encodeURIComponent(options.asOfDate)}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.DASHBOARD}${qs}`,
					);
					break;
				}

				case 'getCounterpartyRisk': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						includeExposure?: boolean;
						includeLimits?: boolean;
						includeHistory?: boolean;
						asOfDate?: string;
					};

					const params: string[] = [];
					if (options.includeExposure) params.push('includeExposure=true');
					if (options.includeLimits) params.push('includeLimits=true');
					if (options.includeHistory) params.push('includeHistory=true');
					if (options.asOfDate) params.push(`asOfDate=${encodeURIComponent(options.asOfDate)}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.RISK.COUNTERPARTY}/${counterpartyId}${qs}`,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for riskManagement resource`);
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
