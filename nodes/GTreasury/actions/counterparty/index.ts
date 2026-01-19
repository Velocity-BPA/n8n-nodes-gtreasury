/**
 * GTreasury Counterparty Actions
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
					const name = this.getNodeParameter('name', i) as string;
					const type = this.getNodeParameter('counterpartyType', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						legalName?: string;
						taxId?: string;
						country?: string;
						address?: string;
						city?: string;
						state?: string;
						postalCode?: string;
						contactName?: string;
						contactEmail?: string;
						contactPhone?: string;
						bankName?: string;
						bankAccountNumber?: string;
						bankRoutingNumber?: string;
						swiftCode?: string;
						iban?: string;
						creditRating?: string;
						creditLimit?: number;
						paymentTerms?: string;
						status?: string;
					};

					const body: Record<string, unknown> = {
						name,
						type,
					};

					if (additionalFields.legalName) body.legalName = additionalFields.legalName;
					if (additionalFields.taxId) body.taxId = additionalFields.taxId;
					if (additionalFields.country) body.country = additionalFields.country;
					if (additionalFields.address) body.address = additionalFields.address;
					if (additionalFields.city) body.city = additionalFields.city;
					if (additionalFields.state) body.state = additionalFields.state;
					if (additionalFields.postalCode) body.postalCode = additionalFields.postalCode;
					if (additionalFields.contactName) body.contactName = additionalFields.contactName;
					if (additionalFields.contactEmail) body.contactEmail = additionalFields.contactEmail;
					if (additionalFields.contactPhone) body.contactPhone = additionalFields.contactPhone;
					if (additionalFields.bankName) body.bankName = additionalFields.bankName;
					if (additionalFields.bankAccountNumber) body.bankAccountNumber = additionalFields.bankAccountNumber;
					if (additionalFields.bankRoutingNumber) body.bankRoutingNumber = additionalFields.bankRoutingNumber;
					if (additionalFields.swiftCode) body.swiftCode = additionalFields.swiftCode;
					if (additionalFields.iban) body.iban = additionalFields.iban;
					if (additionalFields.creditRating) body.creditRating = additionalFields.creditRating;
					if (additionalFields.creditLimit) body.creditLimit = additionalFields.creditLimit;
					if (additionalFields.paymentTerms) body.paymentTerms = additionalFields.paymentTerms;
					if (additionalFields.status) body.status = additionalFields.status;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						ENDPOINTS.COUNTERPARTY.BASE,
						body,
					);
					break;
				}

				case 'get': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						includeContacts?: boolean;
						includeBankAccounts?: boolean;
						includeTransactionHistory?: boolean;
					};

					let qs = '';
					const params: string[] = [];
					if (options.includeContacts) params.push('includeContacts=true');
					if (options.includeBankAccounts) params.push('includeBankAccounts=true');
					if (options.includeTransactionHistory) params.push('includeTransactionHistory=true');
					if (params.length > 0) qs = `?${params.join('&')}`;

					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.COUNTERPARTY.BASE}/${counterpartyId}${qs}`,
					);
					break;
				}

				case 'getMany': {
					const filters = this.getNodeParameter('filters', i) as {
						type?: string;
						country?: string;
						status?: string;
						search?: string;
						hasActiveDeal?: boolean;
						creditRatingMin?: string;
						limit?: number;
						offset?: number;
					};

					const params: string[] = [];
					if (filters.type) params.push(`type=${encodeURIComponent(filters.type)}`);
					if (filters.country) params.push(`country=${encodeURIComponent(filters.country)}`);
					if (filters.status) params.push(`status=${encodeURIComponent(filters.status)}`);
					if (filters.search) params.push(`search=${encodeURIComponent(filters.search)}`);
					if (filters.hasActiveDeal !== undefined) params.push(`hasActiveDeal=${filters.hasActiveDeal}`);
					if (filters.creditRatingMin) params.push(`creditRatingMin=${encodeURIComponent(filters.creditRatingMin)}`);
					if (filters.limit) params.push(`limit=${filters.limit}`);
					if (filters.offset) params.push(`offset=${filters.offset}`);

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.COUNTERPARTY.BASE}${qs}`,
					);
					break;
				}

				case 'update': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i) as {
						name?: string;
						legalName?: string;
						taxId?: string;
						country?: string;
						address?: string;
						city?: string;
						state?: string;
						postalCode?: string;
						contactName?: string;
						contactEmail?: string;
						contactPhone?: string;
						creditRating?: string;
						creditLimit?: number;
						paymentTerms?: string;
						status?: string;
					};

					responseData = await simpleApiRequest.call(
						this,
						'PATCH',
						`${ENDPOINTS.COUNTERPARTY.BASE}/${counterpartyId}`,
						updateFields,
					);
					break;
				}

				case 'delete': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;

					responseData = await simpleApiRequest.call(
						this,
						'DELETE',
						`${ENDPOINTS.COUNTERPARTY.BASE}/${counterpartyId}`,
					);
					break;
				}

				case 'getExposure': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						asOfDate?: string;
						includePotentialExposure?: boolean;
						byInstrumentType?: boolean;
						byCurrency?: boolean;
					};

					const params: string[] = [];
					if (options.asOfDate) params.push(`asOfDate=${encodeURIComponent(options.asOfDate)}`);
					if (options.includePotentialExposure) params.push('includePotentialExposure=true');
					if (options.byInstrumentType) params.push('byInstrumentType=true');
					if (options.byCurrency) params.push('byCurrency=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.COUNTERPARTY.BASE}/${counterpartyId}/exposure${qs}`,
					);
					break;
				}

				case 'setLimit': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const limitType = this.getNodeParameter('limitType', i) as string;
					const amount = this.getNodeParameter('amount', i) as number;
					const currency = this.getNodeParameter('currency', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						effectiveDate?: string;
						expirationDate?: string;
						approvedBy?: string;
						notes?: string;
					};

					const body: Record<string, unknown> = {
						limitType,
						amount,
						currency,
					};

					if (additionalFields.effectiveDate) body.effectiveDate = additionalFields.effectiveDate;
					if (additionalFields.expirationDate) body.expirationDate = additionalFields.expirationDate;
					if (additionalFields.approvedBy) body.approvedBy = additionalFields.approvedBy;
					if (additionalFields.notes) body.notes = additionalFields.notes;

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.COUNTERPARTY.BASE}/${counterpartyId}/limits`,
						body,
					);
					break;
				}

				case 'getLimits': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const options = this.getNodeParameter('options', i) as {
						limitType?: string;
						activeOnly?: boolean;
					};

					const params: string[] = [];
					if (options.limitType) params.push(`limitType=${encodeURIComponent(options.limitType)}`);
					if (options.activeOnly) params.push('activeOnly=true');

					const qs = params.length > 0 ? `?${params.join('&')}` : '';
					responseData = await simpleApiRequest.call(
						this,
						'GET',
						`${ENDPOINTS.COUNTERPARTY.BASE}/${counterpartyId}/limits${qs}`,
					);
					break;
				}

				case 'addBankAccount': {
					const counterpartyId = this.getNodeParameter('counterpartyId', i) as string;
					const bankName = this.getNodeParameter('bankName', i) as string;
					const accountNumber = this.getNodeParameter('accountNumber', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						accountName?: string;
						routingNumber?: string;
						swiftCode?: string;
						iban?: string;
						currency?: string;
						country?: string;
						bankAddress?: string;
						isPrimary?: boolean;
						paymentMethods?: string[];
					};

					const body: Record<string, unknown> = {
						bankName,
						accountNumber,
					};

					Object.entries(additionalFields).forEach(([key, value]) => {
						if (value !== undefined) body[key] = value;
					});

					responseData = await simpleApiRequest.call(
						this,
						'POST',
						`${ENDPOINTS.COUNTERPARTY.BASE}/${counterpartyId}/bank-accounts`,
						body,
					);
					break;
				}

				default:
					throw new Error(`Operation "${operation}" is not supported for counterparty resource`);
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
