/**
 * GTreasury GSmart AI Actions
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
				case 'getForecastInsights': {
					const options = this.getNodeParameter('options', i) as {
						entityId?: string;
						horizon?: number;
						confidenceLevel?: number;
						includeDrivers?: boolean;
						includeRecommendations?: boolean;
					};

					const params: string[] = [];
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.horizon) params.push(`horizon=${options.horizon}`);
					if (options.confidenceLevel) params.push(`confidenceLevel=${options.confidenceLevel}`);
					if (options.includeDrivers) params.push('includeDrivers=true');
					if (options.includeRecommendations) params.push('includeRecommendations=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.GSMART_AI.forecast}${qs}`,
					);
					break;
				}

				case 'getAnomalyDetection': {
					const options = this.getNodeParameter('options', i) as {
						dataType?: string;
						entityId?: string;
						startDate?: string;
						endDate?: string;
						sensitivity?: string;
						limit?: number;
					};

					const params: string[] = [];
					if (options.dataType) params.push(`dataType=${encodeURIComponent(options.dataType)}`);
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.startDate) params.push(`startDate=${encodeURIComponent(options.startDate)}`);
					if (options.endDate) params.push(`endDate=${encodeURIComponent(options.endDate)}`);
					if (options.sensitivity) params.push(`sensitivity=${encodeURIComponent(options.sensitivity)}`);
					if (options.limit) params.push(`limit=${options.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.GSMART_AI.ANOMALIES}${qs}`,
					);
					break;
				}

				case 'getRecommendations': {
					const category = this.getNodeParameter('category', i) as string;
					const options = this.getNodeParameter('options', i) as {
						entityId?: string;
						priority?: string;
						includeAnalysis?: boolean;
						limit?: number;
					};

					const params: string[] = [`category=${encodeURIComponent(category)}`];
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.priority) params.push(`priority=${encodeURIComponent(options.priority)}`);
					if (options.includeAnalysis) params.push('includeAnalysis=true');
					if (options.limit) params.push(`limit=${options.limit}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.GSMART_AI.RECOMMENDATIONS}${qs}`,
					);
					break;
				}

				case 'analyzeTransaction': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						analysisType?: string[];
						compareToHistory?: boolean;
						suggestCategories?: boolean;
					};

					const body: Record<string, unknown> = {
						transactionId,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.GSMART_AI.patternAnalysis,
						body,
					);
					break;
				}

				case 'categorizeTransactions': {
					const transactionIds = this.getNodeParameter('transactionIds', i) as string[];
					const options = this.getNodeParameter('options', i) as {
						applyAutomatically?: boolean;
						confidenceThreshold?: number;
						useCustomRules?: boolean;
					};

					const body: Record<string, unknown> = {
						transactionIds,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.GSMART_AI.patternAnalysis,
						body,
					);
					break;
				}

				case 'getCashOptimization': {
					const options = this.getNodeParameter('options', i) as {
						entityId?: string;
						optimizationType?: string;
						constraints?: Record<string, unknown>;
						horizon?: number;
					};

					const body: Record<string, unknown> = {};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.GSMART_AI.OPTIMIZATION,
						body,
					);
					break;
				}

				case 'predictPaymentTiming': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						invoiceIds?: string[];
						includeConfidence?: boolean;
						includeFactors?: boolean;
					};

					const body: Record<string, unknown> = {
						counterpartyId,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.GSMART_AI.recommendations,
						body,
					);
					break;
				}

				case 'getWorkingCapitalInsights': {
					const options = this.getNodeParameter('options', i) as {
						entityId?: string;
						includeProjections?: boolean;
						includeBenchmarks?: boolean;
						includeRecommendations?: boolean;
					};

					const params: string[] = [];
					if (options.entityId) params.push(`entityId=${encodeURIComponent(options.entityId)}`);
					if (options.includeProjections) params.push('includeProjections=true');
					if (options.includeBenchmarks) params.push('includeBenchmarks=true');
					if (options.includeRecommendations) params.push('includeRecommendations=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.GSMART_AI.insights}${qs}`,
					);
					break;
				}

				case 'getBankFeeOptimization': {
					const options = this.getNodeParameter('options', i) as {
						bankId?: string;
						accountIds?: string[];
						analysisDepth?: string;
					};

					const body: Record<string, unknown> = {};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.GSMART_AI.OPTIMIZATION,
						body,
					);
					break;
				}

				case 'getRiskAlerts': {
					const options = this.getNodeParameter('options', i) as {
						riskType?: string;
						severity?: string;
						acknowledged?: boolean;
						limit?: number;
					};

					const params: string[] = [];
					if (options.riskType) params.push(`riskType=${encodeURIComponent(options.riskType)}`);
					if (options.severity) params.push(`severity=${encodeURIComponent(options.severity)}`);
					if (options.acknowledged !== undefined) params.push(`acknowledged=${options.acknowledged}`);
					if (options.limit) params.push(`limit=${options.limit}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.GSMART_AI.anomalyDetection}${qs}`,
					);
					break;
				}

				case 'acknowledgeAlert': {
					const alertId = this.getNodeParameter('alertId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						notes?: string;
						action?: string;
					};

					const body: Record<string, unknown> = {
						acknowledged: true,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.GSMART_AI.anomalyDetection}/${alertId}/acknowledge`,
						body,
					);
					break;
				}

				case 'trainModel': {
					const modelType = this.getNodeParameter('modelType', i) as string;
					const options = this.getNodeParameter('options', i) as {
						trainingPeriod?: number;
						entityId?: string;
						features?: string[];
						validateSplit?: number;
					};

					const body: Record<string, unknown> = {
						modelType,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.GSMART_AI.TRAIN,
						body,
					);
					break;
				}

				case 'getModelStatus': {
					const modelType = this.getNodeParameter('modelType', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.GSMART_AI.modelStatus}?modelType=${encodeURIComponent(modelType)}`,
					);
					break;
				}

				case 'chat': {
					const message = this.getNodeParameter('message', i) as string;
					const options = this.getNodeParameter('options', i) as {
						context?: string;
						includeData?: boolean;
						conversationId?: string;
					};

					const body: Record<string, unknown> = {
						message,
					};

					Object.entries(options).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.GSMART_AI.insights,
						body,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for gsmartAi resource`);
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
