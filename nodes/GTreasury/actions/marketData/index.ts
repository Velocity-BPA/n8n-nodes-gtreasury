/**
 * GTreasury Market Data Actions
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
				case 'getExchangeRates': {
					const baseCurrency = this.getNodeParameter('baseCurrency', i) as string;
					const options = this.getNodeParameter('options', i) as {
						targetCurrencies?: string[];
						date?: string;
						source?: string;
					};

					const params: string[] = [`base=${encodeURIComponent(baseCurrency)}`];
					if (options.targetCurrencies && options.targetCurrencies.length > 0) {
						params.push(`targets=${options.targetCurrencies.join(',')}`);
					}
					if (options.date) params.push(`date=${encodeURIComponent(options.date)}`);
					if (options.source) params.push(`source=${encodeURIComponent(options.source)}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.FX_RATES}${qs}`,
					);
					break;
				}

				case 'getHistoricalRates': {
					const baseCurrency = this.getNodeParameter('baseCurrency', i) as string;
					const targetCurrency = this.getNodeParameter('targetCurrency', i) as string;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;
					const options = this.getNodeParameter('options', i) as {
						frequency?: string;
						source?: string;
					};

					const params: string[] = [
						`base=${encodeURIComponent(baseCurrency)}`,
						`target=${encodeURIComponent(targetCurrency)}`,
						`startDate=${encodeURIComponent(startDate)}`,
						`endDate=${encodeURIComponent(endDate)}`,
					];
					if (options.frequency) params.push(`frequency=${encodeURIComponent(options.frequency)}`);
					if (options.source) params.push(`source=${encodeURIComponent(options.source)}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.FX_RATES}/historical${qs}`,
					);
					break;
				}

				case 'getInterestRates': {
					const rateType = this.getNodeParameter('rateType', i) as string;
					const options = this.getNodeParameter('options', i) as {
						currency?: string;
						tenor?: string;
						date?: string;
						source?: string;
					};

					const params: string[] = [`type=${encodeURIComponent(rateType)}`];
					if (options.currency) params.push(`currency=${encodeURIComponent(options.currency)}`);
					if (options.tenor) params.push(`tenor=${encodeURIComponent(options.tenor)}`);
					if (options.date) params.push(`date=${encodeURIComponent(options.date)}`);
					if (options.source) params.push(`source=${encodeURIComponent(options.source)}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.INTEREST_RATES}${qs}`,
					);
					break;
				}

				case 'getYieldCurve': {
					const currency = this.getNodeParameter('currency', i) as string;
					const options = this.getNodeParameter('options', i) as {
						curveType?: string;
						date?: string;
						tenors?: string[];
					};

					const params: string[] = [`currency=${encodeURIComponent(currency)}`];
					if (options.curveType) params.push(`curveType=${encodeURIComponent(options.curveType)}`);
					if (options.date) params.push(`date=${encodeURIComponent(options.date)}`);
					if (options.tenors && options.tenors.length > 0) {
						params.push(`tenors=${options.tenors.join(',')}`);
					}

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.YIELD_CURVES}${qs}`,
					);
					break;
				}

				case 'getCommodityPrices': {
					const commodity = this.getNodeParameter('commodity', i) as string;
					const options = this.getNodeParameter('options', i) as {
						date?: string;
						unit?: string;
						source?: string;
					};

					const params: string[] = [`commodity=${encodeURIComponent(commodity)}`];
					if (options.date) params.push(`date=${encodeURIComponent(options.date)}`);
					if (options.unit) params.push(`unit=${encodeURIComponent(options.unit)}`);
					if (options.source) params.push(`source=${encodeURIComponent(options.source)}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.COMMODITIES}${qs}`,
					);
					break;
				}

				case 'getCreditSpreads': {
					const options = this.getNodeParameter('options', i) as {
						rating?: string;
						sector?: string;
						tenor?: string;
						date?: string;
					};

					const params: string[] = [];
					if (options.rating) params.push(`rating=${encodeURIComponent(options.rating)}`);
					if (options.sector) params.push(`sector=${encodeURIComponent(options.sector)}`);
					if (options.tenor) params.push(`tenor=${encodeURIComponent(options.tenor)}`);
					if (options.date) params.push(`date=${encodeURIComponent(options.date)}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.CREDIT_SPREADS}${qs}`,
					);
					break;
				}

				case 'getForwardRates': {
					const baseCurrency = this.getNodeParameter('baseCurrency', i) as string;
					const targetCurrency = this.getNodeParameter('targetCurrency', i) as string;
					const options = this.getNodeParameter('options', i) as {
						tenors?: string[];
						date?: string;
						source?: string;
					};

					const params: string[] = [
						`base=${encodeURIComponent(baseCurrency)}`,
						`target=${encodeURIComponent(targetCurrency)}`,
					];
					if (options.tenors && options.tenors.length > 0) {
						params.push(`tenors=${options.tenors.join(',')}`);
					}
					if (options.date) params.push(`date=${encodeURIComponent(options.date)}`);
					if (options.source) params.push(`source=${encodeURIComponent(options.source)}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.FORWARD_RATES}${qs}`,
					);
					break;
				}

				case 'getVolatility': {
					const currencyPair = this.getNodeParameter('currencyPair', i) as string;
					const options = this.getNodeParameter('options', i) as {
						tenors?: string[];
						delta?: string;
						date?: string;
					};

					const [base, target] = currencyPair.split('/');
					const params: string[] = [
						`base=${encodeURIComponent(base)}`,
						`target=${encodeURIComponent(target)}`,
					];
					if (options.tenors && options.tenors.length > 0) {
						params.push(`tenors=${options.tenors.join(',')}`);
					}
					if (options.delta) params.push(`delta=${encodeURIComponent(options.delta)}`);
					if (options.date) params.push(`date=${encodeURIComponent(options.date)}`);

					const qs = `?${params.join('&')}`;
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.MARKET_DATA.VOLATILITY}${qs}`,
					);
					break;
				}

				case 'subscribeToRates': {
					const subscription = this.getNodeParameter('subscription', i) as {
						dataType: string;
						instruments: string[];
						frequency: string;
						webhookUrl?: string;
						email?: string;
					};

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.MARKET_DATA.SUBSCRIPTIONS,
						subscription,
					);
					break;
				}

				case 'getSubscriptions': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.MARKET_DATA.SUBSCRIPTIONS,
					);
					break;
				}

				case 'deleteSubscription': {
					const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'DELETE',
						`${ENDPOINTS.MARKET_DATA.SUBSCRIPTIONS}/${subscriptionId}`,
					);
					break;
				}

				case 'getDataSources': {
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						ENDPOINTS.MARKET_DATA.SOURCES,
					);
					break;
				}

				case 'setPreferredSource': {
					const dataType = this.getNodeParameter('dataType', i) as string;
					const sourceId = this.getNodeParameter('sourceId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'PUT',
						`${ENDPOINTS.MARKET_DATA.SOURCES}/preferred`,
						{ dataType, sourceId },
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for marketData resource`);
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
