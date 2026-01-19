/**
 * n8n-nodes-gtreasury
 * Unit tests for GTreasury main node
 *
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 */

import { GTreasury } from '../../nodes/GTreasury/GTreasury.node';
import { GTreasuryTrigger } from '../../nodes/GTreasury/GTreasuryTrigger.node';
import type { INodeTypeDescription } from 'n8n-workflow';

describe('GTreasury Node', () => {
	let node: GTreasury;
	let description: INodeTypeDescription;

	beforeEach(() => {
		node = new GTreasury();
		description = node.description;
	});

	describe('Node Metadata', () => {
		it('should have correct name', () => {
			expect(description.name).toBe('gTreasury');
		});

		it('should have correct display name', () => {
			expect(description.displayName).toBe('GTreasury');
		});

		it('should have icon defined', () => {
			expect(description.icon).toBeDefined();
		});

		it('should have correct version', () => {
			expect(description.version).toBeGreaterThanOrEqual(1);
		});

		it('should have correct group', () => {
			expect(description.group).toContain('transform');
		});

		it('should require credentials', () => {
			expect(description.credentials).toBeDefined();
			expect(description.credentials?.length).toBeGreaterThan(0);
		});
	});

	describe('Resources', () => {
		it('should have resource property', () => {
			const resourceProp = description.properties.find((p) => p.name === 'resource');
			expect(resourceProp).toBeDefined();
			expect(resourceProp?.type).toBe('options');
		});

		it('should have all expected resources', () => {
			const resourceProp = description.properties.find((p) => p.name === 'resource');
			const resourceOptions = resourceProp?.options as Array<{ value: string }>;
			const resourceValues = resourceOptions?.map((o) => o.value) || [];

			const expectedResources = [
				'cashManagement',
				'bankAccount',
				'payment',
				'bankConnectivity',
				'cashForecasting',
				'investment',
				'debt',
				'fx',
				'intercompany',
				'erpIntegration',
				'bankFeeAnalysis',
				'entity',
				'counterparty',
				'reporting',
				'workflow',
				'userManagement',
				'audit',
				'marketData',
				'riskManagement',
				'gsmartAi',
				'utility',
			];

			expectedResources.forEach((resource) => {
				expect(resourceValues).toContain(resource);
			});
		});

		it('should have 21 resources', () => {
			const resourceProp = description.properties.find((p) => p.name === 'resource');
			const resourceOptions = resourceProp?.options as Array<{ value: string }>;
			expect(resourceOptions?.length).toBe(21);
		});
	});

	describe('Operations', () => {
		it('should have operation properties for each resource', () => {
			const operationProps = description.properties.filter((p) => p.name === 'operation');
			expect(operationProps.length).toBeGreaterThan(0);
		});

		it('should have operations with displayOptions', () => {
			const operationProps = description.properties.filter((p) => p.name === 'operation');
			operationProps.forEach((op) => {
				expect(op.displayOptions).toBeDefined();
			});
		});
	});

	describe('Input/Output', () => {
		it('should have correct input configuration', () => {
			expect(description.inputs).toContain('main');
		});

		it('should have correct output configuration', () => {
			expect(description.outputs).toContain('main');
		});
	});
});

describe('GTreasuryTrigger Node', () => {
	let node: GTreasuryTrigger;
	let description: INodeTypeDescription;

	beforeEach(() => {
		node = new GTreasuryTrigger();
		description = node.description;
	});

	describe('Node Metadata', () => {
		it('should have correct name', () => {
			expect(description.name).toBe('gTreasuryTrigger');
		});

		it('should have correct display name', () => {
			expect(description.displayName).toBe('GTreasury Trigger');
		});

		it('should be a trigger node', () => {
			expect(description.group).toContain('trigger');
		});

		it('should have webhook inputs', () => {
			expect(description.inputs).toEqual([]);
		});

		it('should have main outputs', () => {
			expect(description.outputs).toContain('main');
		});
	});

	describe('Event Types', () => {
		it('should have event property', () => {
			const eventProp = description.properties.find((p) => p.name === 'event');
			expect(eventProp).toBeDefined();
		});

		it('should have multiple event type options', () => {
			const eventProp = description.properties.find((p) => p.name === 'event');
			const options = eventProp?.options as Array<{ value: string }>;
			expect(options?.length).toBeGreaterThan(20);
		});

		it('should include payment events', () => {
			const eventProp = description.properties.find((p) => p.name === 'event');
			const options = eventProp?.options as Array<{ value: string }>;
			const values = options?.map((o) => o.value) || [];

			expect(values).toContain('payment.created');
			expect(values).toContain('payment.approved');
			expect(values).toContain('payment.completed');
		});

		it('should include cash management events', () => {
			const eventProp = description.properties.find((p) => p.name === 'event');
			const options = eventProp?.options as Array<{ value: string }>;
			const values = options?.map((o) => o.value) || [];

			expect(values).toContain('cash.balance_updated');
			expect(values).toContain('cash.transaction_posted');
		});

		it('should include FX events', () => {
			const eventProp = description.properties.find((p) => p.name === 'event');
			const options = eventProp?.options as Array<{ value: string }>;
			const values = options?.map((o) => o.value) || [];

			expect(values).toContain('fx.deal_created');
			expect(values).toContain('fx.deal_executed');
		});

		it('should include workflow events', () => {
			const eventProp = description.properties.find((p) => p.name === 'event');
			const options = eventProp?.options as Array<{ value: string }>;
			const values = options?.map((o) => o.value) || [];

			expect(values).toContain('workflow.approval_required');
			expect(values).toContain('workflow.approval_complete');
		});
	});

	describe('Webhook Methods', () => {
		it('should have webhookMethods defined', () => {
			expect(node.webhookMethods).toBeDefined();
		});

		it('should have checkExists method', () => {
			expect(node.webhookMethods?.default?.checkExists).toBeDefined();
		});

		it('should have create method', () => {
			expect(node.webhookMethods?.default?.create).toBeDefined();
		});

		it('should have delete method', () => {
			expect(node.webhookMethods?.default?.delete).toBeDefined();
		});
	});

	describe('Filters', () => {
		it('should have filter properties', () => {
			const filterProps = description.properties.filter(
				(p) => p.name.includes('Filter') || p.name.includes('filter')
			);
			expect(filterProps.length).toBeGreaterThan(0);
		});
	});
});
