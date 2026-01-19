/**
 * GTreasury Trigger Node for n8n
 * Real-time event monitoring for treasury events
 *
 * Copyright (c) 2025 Velocity BPA
 *
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://mariadb.com/bsl11/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Change Date: 2029-01-01
 * Change License: Apache License, Version 2.0
 */

import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

import { gTreasuryApiRequest } from './transport/apiClient';

export class GTreasuryTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GTreasury Trigger',
		name: 'gTreasuryTrigger',
		icon: 'file:gtreasury.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers on GTreasury events in real-time',
		defaults: {
			name: 'GTreasury Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'gTreasuryApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				required: true,
				options: [
					// Payment Events
					{
						name: 'Payment Created',
						value: 'payment.created',
						description: 'Triggers when a new payment is created',
					},
					{
						name: 'Payment Approved',
						value: 'payment.approved',
						description: 'Triggers when a payment is approved',
					},
					{
						name: 'Payment Rejected',
						value: 'payment.rejected',
						description: 'Triggers when a payment is rejected',
					},
					{
						name: 'Payment Submitted',
						value: 'payment.submitted',
						description: 'Triggers when a payment is submitted to bank',
					},
					{
						name: 'Payment Status Changed',
						value: 'payment.status_changed',
						description: 'Triggers when payment status changes',
					},
					{
						name: 'Payment Failed',
						value: 'payment.failed',
						description: 'Triggers when a payment fails',
					},
					{
						name: 'Payment Completed',
						value: 'payment.completed',
						description: 'Triggers when a payment completes successfully',
					},
					// Cash Management Events
					{
						name: 'Balance Updated',
						value: 'cash.balance_updated',
						description: 'Triggers when account balance is updated',
					},
					{
						name: 'Transaction Posted',
						value: 'cash.transaction_posted',
						description: 'Triggers when a transaction is posted',
					},
					{
						name: 'Statement Received',
						value: 'cash.statement_received',
						description: 'Triggers when a bank statement is received',
					},
					{
						name: 'Reconciliation Complete',
						value: 'cash.reconciliation_complete',
						description: 'Triggers when reconciliation completes',
					},
					{
						name: 'ZBA Sweep Executed',
						value: 'cash.zba_sweep_executed',
						description: 'Triggers when ZBA sweep is executed',
					},
					// Workflow Events
					{
						name: 'Approval Required',
						value: 'workflow.approval_required',
						description: 'Triggers when an item needs approval',
					},
					{
						name: 'Approval Complete',
						value: 'workflow.approval_complete',
						description: 'Triggers when approval workflow completes',
					},
					{
						name: 'Item Reassigned',
						value: 'workflow.item_reassigned',
						description: 'Triggers when workflow item is reassigned',
					},
					// FX Events
					{
						name: 'FX Deal Created',
						value: 'fx.deal_created',
						description: 'Triggers when FX deal is created',
					},
					{
						name: 'FX Deal Executed',
						value: 'fx.deal_executed',
						description: 'Triggers when FX trade is executed',
					},
					{
						name: 'FX Deal Settled',
						value: 'fx.deal_settled',
						description: 'Triggers when FX deal settles',
					},
					{
						name: 'Hedge Maturity',
						value: 'fx.hedge_maturity',
						description: 'Triggers before hedge maturity date',
					},
					// Investment Events
					{
						name: 'Investment Created',
						value: 'investment.created',
						description: 'Triggers when investment is created',
					},
					{
						name: 'Investment Maturity',
						value: 'investment.maturity',
						description: 'Triggers before investment maturity',
					},
					{
						name: 'Investment Rate Alert',
						value: 'investment.rate_alert',
						description: 'Triggers on rate alert',
					},
					// Debt Events
					{
						name: 'Debt Payment Due',
						value: 'debt.payment_due',
						description: 'Triggers before debt payment due date',
					},
					{
						name: 'Covenant Breach Alert',
						value: 'debt.covenant_breach',
						description: 'Triggers on covenant breach or near-breach',
					},
					{
						name: 'Draw Recorded',
						value: 'debt.draw_recorded',
						description: 'Triggers when debt draw is recorded',
					},
					// Forecast Events
					{
						name: 'Forecast Variance Alert',
						value: 'forecast.variance_alert',
						description: 'Triggers on significant variance',
					},
					{
						name: 'Forecast Updated',
						value: 'forecast.updated',
						description: 'Triggers when forecast is updated',
					},
					// Intercompany Events
					{
						name: 'Netting Cycle Created',
						value: 'intercompany.netting_created',
						description: 'Triggers when netting cycle is created',
					},
					{
						name: 'Settlement Due',
						value: 'intercompany.settlement_due',
						description: 'Triggers before settlement due date',
					},
					{
						name: 'Settlement Complete',
						value: 'intercompany.settlement_complete',
						description: 'Triggers when settlement completes',
					},
					// Bank Connectivity Events
					{
						name: 'Connection Status Changed',
						value: 'bank.connection_status_changed',
						description: 'Triggers when bank connection status changes',
					},
					{
						name: 'File Received',
						value: 'bank.file_received',
						description: 'Triggers when file is received from bank',
					},
					{
						name: 'File Sent',
						value: 'bank.file_sent',
						description: 'Triggers when file is sent to bank',
					},
					{
						name: 'Real-Time Balance Alert',
						value: 'bank.balance_alert',
						description: 'Triggers on real-time balance threshold',
					},
					// ERP Events
					{
						name: 'GL Entry Posted',
						value: 'erp.gl_posted',
						description: 'Triggers when GL entry is posted',
					},
					{
						name: 'Sync Completed',
						value: 'erp.sync_completed',
						description: 'Triggers when ERP sync completes',
					},
					{
						name: 'Sync Failed',
						value: 'erp.sync_failed',
						description: 'Triggers when ERP sync fails',
					},
					// Risk Events
					{
						name: 'Risk Threshold Exceeded',
						value: 'risk.threshold_exceeded',
						description: 'Triggers when risk threshold is exceeded',
					},
					{
						name: 'Counterparty Alert',
						value: 'risk.counterparty_alert',
						description: 'Triggers on counterparty risk alert',
					},
					// GSmart AI Events
					{
						name: 'Anomaly Detected',
						value: 'ai.anomaly_detected',
						description: 'Triggers when AI detects anomaly',
					},
					{
						name: 'Recommendation Generated',
						value: 'ai.recommendation',
						description: 'Triggers when AI generates recommendation',
					},
					{
						name: 'Insight Available',
						value: 'ai.insight_available',
						description: 'Triggers when new AI insight is available',
					},
					// System Events
					{
						name: 'Report Ready',
						value: 'system.report_ready',
						description: 'Triggers when scheduled report is ready',
					},
					{
						name: 'User Login',
						value: 'system.user_login',
						description: 'Triggers on user login',
					},
					{
						name: 'System Alert',
						value: 'system.alert',
						description: 'Triggers on system alert',
					},
				],
				default: 'payment.created',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Entity IDs',
						name: 'entityIds',
						type: 'string',
						default: '',
						description: 'Comma-separated entity IDs to filter events',
					},
					{
						displayName: 'Account IDs',
						name: 'accountIds',
						type: 'string',
						default: '',
						description: 'Comma-separated account IDs to filter events',
					},
					{
						displayName: 'Currency',
						name: 'currency',
						type: 'string',
						default: '',
						description: 'Filter by currency code',
					},
					{
						displayName: 'Minimum Amount',
						name: 'minAmount',
						type: 'number',
						default: 0,
						description: 'Minimum amount threshold',
					},
					{
						displayName: 'Payment Types',
						name: 'paymentTypes',
						type: 'string',
						default: '',
						description: 'Comma-separated payment types (ACH, WIRE, etc.)',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: '',
						description: 'Filter by status',
					},
					{
						displayName: 'Bank IDs',
						name: 'bankIds',
						type: 'string',
						default: '',
						description: 'Comma-separated bank IDs',
					},
					{
						displayName: 'User IDs',
						name: 'userIds',
						type: 'string',
						default: '',
						description: 'Comma-separated user IDs',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Full Details',
						name: 'includeFullDetails',
						type: 'boolean',
						default: true,
						description: 'Whether to include full object details in webhook payload',
					},
					{
						displayName: 'Include Related Data',
						name: 'includeRelatedData',
						type: 'boolean',
						default: false,
						description: 'Whether to include related entities in payload',
					},
					{
						displayName: 'Retry on Failure',
						name: 'retryOnFailure',
						type: 'boolean',
						default: true,
						description: 'Whether GTreasury should retry webhook on delivery failure',
					},
					{
						displayName: 'Max Retries',
						name: 'maxRetries',
						type: 'number',
						default: 3,
						description: 'Maximum number of retry attempts',
					},
					{
						displayName: 'Secret Token',
						name: 'secretToken',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Secret token for webhook signature verification',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				try {
					const webhooks = await gTreasuryApiRequest.call(
						this,
						'GET',
						'/webhooks',
						{},
						{ url: webhookUrl, event },
					);

					if (Array.isArray(webhooks) && webhooks.length > 0) {
						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookId = webhooks[0].id;
						return true;
					}
				} catch (error) {
					// Webhook doesn't exist
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const filters = this.getNodeParameter('filters', {}) as IDataObject;
				const options = this.getNodeParameter('options', {}) as IDataObject;

				const body: IDataObject = {
					url: webhookUrl,
					event,
					active: true,
				};

				// Add filters
				if (filters.entityIds) {
					body.entityIds = (filters.entityIds as string).split(',').map(id => id.trim());
				}
				if (filters.accountIds) {
					body.accountIds = (filters.accountIds as string).split(',').map(id => id.trim());
				}
				if (filters.currency) {
					body.currency = filters.currency;
				}
				if (filters.minAmount) {
					body.minAmount = filters.minAmount;
				}
				if (filters.paymentTypes) {
					body.paymentTypes = (filters.paymentTypes as string).split(',').map(t => t.trim());
				}
				if (filters.status) {
					body.status = filters.status;
				}
				if (filters.bankIds) {
					body.bankIds = (filters.bankIds as string).split(',').map(id => id.trim());
				}
				if (filters.userIds) {
					body.userIds = (filters.userIds as string).split(',').map(id => id.trim());
				}

				// Add options
				if (options.includeFullDetails !== undefined) {
					body.includeFullDetails = options.includeFullDetails;
				}
				if (options.includeRelatedData !== undefined) {
					body.includeRelatedData = options.includeRelatedData;
				}
				if (options.retryOnFailure !== undefined) {
					body.retryOnFailure = options.retryOnFailure;
				}
				if (options.maxRetries !== undefined) {
					body.maxRetries = options.maxRetries;
				}
				if (options.secretToken) {
					body.secretToken = options.secretToken;
				}

				try {
					const webhook = await gTreasuryApiRequest.call(
						this,
						'POST',
						'/webhooks',
						body,
					);

					if (webhook.id) {
						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookId = webhook.id;
						return true;
					}
				} catch (error) {
					throw error;
				}

				return false;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId as string;

				if (!webhookId) {
					return true;
				}

				try {
					await gTreasuryApiRequest.call(
						this,
						'DELETE',
						`/webhooks/${webhookId}`,
					);
				} catch (error) {
					// Webhook might already be deleted
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData();
		const headers = this.getHeaderData();
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Verify webhook signature if secret is configured
		if (options.secretToken) {
			const signature = headers['x-gtreasury-signature'] as string;
			if (signature) {
				// Signature verification would be done here
				// Using HMAC-SHA256 of body with secret token
				const crypto = require('crypto');
				const expectedSignature = crypto
					.createHmac('sha256', options.secretToken as string)
					.update(JSON.stringify(body))
					.digest('hex');

				if (signature !== `sha256=${expectedSignature}`) {
					return {
						webhookResponse: {
							status: 401,
							body: { error: 'Invalid signature' },
						},
					};
				}
			}
		}

		// Parse the webhook payload
		const event = body.event as string;
		const timestamp = body.timestamp as string;
		const data = body.data as IDataObject;

		// Build the output data
		const outputData: IDataObject = {
			event,
			timestamp,
			webhookId: body.webhookId,
			deliveryId: body.deliveryId,
			...data,
		};

		// Add metadata
		if (body.metadata) {
			outputData.metadata = body.metadata;
		}

		// Add related data if present
		if (body.relatedData) {
			outputData.relatedData = body.relatedData;
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray([outputData]),
			],
		};
	}
}
