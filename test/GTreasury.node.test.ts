/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { GTreasury } from '../nodes/GTreasury/GTreasury.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('GTreasury Node', () => {
  let node: GTreasury;

  beforeAll(() => {
    node = new GTreasury();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('GTreasury');
      expect(node.description.name).toBe('gtreasury');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Cash Position Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://api.gtreasury.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  describe('getAllCashPositions', () => {
    it('should retrieve all cash positions successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAllCashPositions')
        .mockReturnValueOnce('entity123')
        .mockReturnValueOnce('account456')
        .mockReturnValueOnce('2024-01-15T00:00:00.000Z')
        .mockReturnValueOnce('USD');

      const mockResponse = { data: [{ id: 1, amount: 1000, currency: 'USD' }] };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCashPositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.gtreasury.com/v1/cash-positions?entity_id=entity123&account_id=account456&date=2024-01-15&currency=USD',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getCashPosition', () => {
    it('should retrieve specific cash position successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCashPosition')
        .mockReturnValueOnce('pos123');

      const mockResponse = { id: 'pos123', amount: 5000, currency: 'EUR' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCashPositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.gtreasury.com/v1/cash-positions/pos123',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('createCashPosition', () => {
    it('should create cash position successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCashPosition')
        .mockReturnValueOnce('account789')
        .mockReturnValueOnce(15000)
        .mockReturnValueOnce('GBP')
        .mockReturnValueOnce('2024-02-01T00:00:00.000Z')
        .mockReturnValueOnce('entity456');

      const mockResponse = { id: 'new123', amount: 15000, currency: 'GBP' };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCashPositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.gtreasury.com/v1/cash-positions',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
        },
        body: {
          account_id: 'account789',
          amount: 15000,
          currency: 'GBP',
          date: '2024-02-01',
          entity_id: 'entity456',
        },
        json: true,
      });
      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors properly', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllCashPositions');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCashPositionOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Account Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.gtreasury.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllAccounts', () => {
		it('should retrieve all accounts successfully', async () => {
			const mockResponse = { accounts: [{ id: '1', name: 'Test Account' }] };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllAccounts');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('entity1');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('checking');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('active');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('bank1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.gtreasury.com/v1/accounts',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				qs: {
					entity_id: 'entity1',
					account_type: 'checking',
					status: 'active',
					bank_id: 'bank1',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle errors when retrieving accounts fails', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllAccounts');
			mockExecuteFunctions.getNodeParameter.mockReturnValue('');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAccount', () => {
		it('should get specific account successfully', async () => {
			const mockResponse = { id: '123', name: 'Test Account' };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccount');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.gtreasury.com/v1/accounts/123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('createAccount', () => {
		it('should create account successfully', async () => {
			const mockResponse = { id: '123', account_number: '1234567890' };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createAccount');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('1234567890');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('bank1');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('USD');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('checking');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('entity1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.gtreasury.com/v1/accounts',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					account_number: '1234567890',
					bank_id: 'bank1',
					currency: 'USD',
					account_type: 'checking',
					entity_id: 'entity1',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateAccount', () => {
		it('should update account successfully', async () => {
			const mockResponse = { id: '123', account_name: 'Updated Account' };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('updateAccount');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('123');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('Updated Account');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('active');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('savings');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://api.gtreasury.com/v1/accounts/123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					account_name: 'Updated Account',
					status: 'active',
					account_type: 'savings',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteAccount', () => {
		it('should delete account successfully', async () => {
			const mockResponse = { success: true };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('deleteAccount');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('123');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://api.gtreasury.com/v1/accounts/123',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAccountBalances', () => {
		it('should get account balances successfully', async () => {
			const mockResponse = { balances: [{ date: '2023-01-01', amount: 1000 }] };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccountBalances');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('123');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('2023-01-01T00:00:00Z');
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('2023-01-31T23:59:59Z');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.gtreasury.com/v1/accounts/123/balances',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				qs: {
					start_date: '2023-01-01',
					end_date: '2023-01-31',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});

describe('Payment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.gtreasury.com/v1',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get all payments successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllPayments')
      .mockReturnValueOnce('pending')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ payments: [{ id: 1, amount: 1000 }] });

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.payments).toBeDefined();
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.gtreasury.com/v1/payments?status=pending',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should get specific payment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPayment')
      .mockReturnValueOnce('payment-123');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'payment-123', amount: 1000 });

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('payment-123');
  });

  it('should create payment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPayment')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce('USD')
      .mockReturnValueOnce('payee-123')
      .mockReturnValueOnce('wire')
      .mockReturnValueOnce('2023-12-01')
      .mockReturnValueOnce('Test payment');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ id: 'new-payment-id', status: 'pending' });

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.id).toBe('new-payment-id');
  });

  it('should approve payment successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('approvePayment')
      .mockReturnValueOnce('payment-123')
      .mockReturnValueOnce('approver-456');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'approved' });

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.status).toBe('approved');
  });

  it('should handle errors gracefully when continue on fail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPayment');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error when continue on fail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPayment');
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    await expect(executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('Foreign Exchange Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://api.gtreasury.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getAllFxTransactions', () => {
		it('should retrieve all FX transactions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllFxTransactions')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('EUR')
				.mockReturnValueOnce('2023-12-01')
				.mockReturnValueOnce('executed');

			const mockResponse = {
				transactions: [
					{ id: '1', base_currency: 'USD', target_currency: 'EUR', amount: 1000, status: 'executed' },
				],
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.gtreasury.com/v1/fx-transactions?base_currency=USD&target_currency=EUR&transaction_date=2023-12-01&status=executed',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle API error gracefully', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllFxTransactions');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getFxTransaction', () => {
		it('should get specific FX transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getFxTransaction')
				.mockReturnValueOnce('123');

			const mockResponse = {
				id: '123',
				base_currency: 'USD',
				target_currency: 'EUR',
				amount: 1000,
				status: 'executed',
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('createFxTransaction', () => {
		it('should create FX transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createFxTransaction')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('EUR')
				.mockReturnValueOnce(1000)
				.mockReturnValueOnce(1.2)
				.mockReturnValueOnce('2023-12-15T00:00:00.000Z');

			const mockResponse = {
				id: '456',
				base_currency: 'USD',
				target_currency: 'EUR',
				amount: 1000,
				rate: 1.2,
				settlement_date: '2023-12-15',
				status: 'pending',
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json).toEqual(mockResponse);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.gtreasury.com/v1/fx-transactions',
				headers: {
					'Authorization': 'Bearer test-token',
					'Content-Type': 'application/json',
				},
				body: {
					base_currency: 'USD',
					target_currency: 'EUR',
					amount: 1000,
					rate: 1.2,
					settlement_date: '2023-12-15',
				},
				json: true,
			});
		});
	});

	describe('updateFxTransaction', () => {
		it('should update FX transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateFxTransaction')
				.mockReturnValueOnce('123')
				.mockReturnValueOnce(1500)
				.mockReturnValueOnce(1.25)
				.mockReturnValueOnce('2023-12-20T00:00:00.000Z');

			const mockResponse = {
				id: '123',
				amount: 1500,
				rate: 1.25,
				settlement_date: '2023-12-20',
				status: 'updated',
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('deleteFxTransaction', () => {
		it('should delete FX transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteFxTransaction')
				.mockReturnValueOnce('123');

			const mockResponse = { message: 'Transaction cancelled successfully' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getCurrentFxRates', () => {
		it('should get current FX rates successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCurrentFxRates')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('EUR,GBP,JPY')
				.mockReturnValueOnce('spot');

			const mockResponse = {
				rates: [
					{ currency: 'EUR', rate: 1.2 },
					{ currency: 'GBP', rate: 1.35 },
					{ currency: 'JPY', rate: 110.5 },
				],
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getHistoricalFxRates', () => {
		it('should get historical FX rates successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getHistoricalFxRates')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce('EUR')
				.mockReturnValueOnce('2023-12-01T00:00:00.000Z')
				.mockReturnValueOnce('2023-12-07T00:00:00.000Z');

			const mockResponse = {
				rates: [
					{ date: '2023-12-01', rate: 1.2 },
					{ date: '2023-12-02', rate: 1.21 },
				],
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeForeignExchangeOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('Entity Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.gtreasury.com/v1',
        tenantId: 'test-tenant'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('should get all entities successfully', async () => {
    const mockResponse = { entities: [{ id: '1', name: 'Entity 1' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllEntities')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('corporation')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce('US');

    const result = await executeEntityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get specific entity successfully', async () => {
    const mockResponse = { id: '1', name: 'Entity 1' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getEntity')
      .mockReturnValueOnce('1');

    const result = await executeEntityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should create entity successfully', async () => {
    const mockResponse = { id: '123', name: 'New Entity' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createEntity')
      .mockReturnValueOnce('New Entity')
      .mockReturnValueOnce('corporation')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('US')
      .mockReturnValueOnce('USD');

    const result = await executeEntityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllEntities');

    const result = await executeEntityOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Counterparty Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://api.gtreasury.com/v1',
        tenantId: 'test-tenant',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should get all counterparties successfully', async () => {
    const mockResponse = { counterparties: [{ id: '1', name: 'Test Bank' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAllCounterparties')
      .mockReturnValueOnce('bank')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce('US')
      .mockReturnValueOnce('USD');

    const result = await executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.gtreasury.com/v1/counterparties?counterparty_type=bank&status=active&country=US&currency=USD',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      json: true,
    });
  });

  it('should get a specific counterparty successfully', async () => {
    const mockResponse = { id: '123', name: 'Test Bank', type: 'bank' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCounterparty')
      .mockReturnValueOnce('123');

    const result = await executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.gtreasury.com/v1/counterparties/123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      json: true,
    });
  });

  it('should create a counterparty successfully', async () => {
    const mockResponse = { id: '456', name: 'New Bank', status: 'created' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCounterparty')
      .mockReturnValueOnce('New Bank')
      .mockReturnValueOnce('bank')
      .mockReturnValueOnce('US')
      .mockReturnValueOnce({ email: 'test@bank.com' });

    const result = await executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.gtreasury.com/v1/counterparties',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      body: {
        name: 'New Bank',
        counterparty_type: 'bank',
        country: 'US',
        contact_info: { email: 'test@bank.com' },
      },
      json: true,
    });
  });

  it('should update a counterparty successfully', async () => {
    const mockResponse = { id: '123', name: 'Updated Bank', status: 'active' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateCounterparty')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('Updated Bank')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce({ email: 'updated@bank.com' });

    const result = await executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.gtreasury.com/v1/counterparties/123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      body: {
        name: 'Updated Bank',
        status: 'active',
        contact_info: { email: 'updated@bank.com' },
      },
      json: true,
    });
  });

  it('should delete a counterparty successfully', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(null);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteCounterparty')
      .mockReturnValueOnce('123');

    const result = await executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual({ success: true, message: 'Counterparty deleted successfully' });
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.gtreasury.com/v1/counterparties/123',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      json: true,
    });
  });

  it('should get counterparty limits successfully', async () => {
    const mockResponse = { limits: [{ type: 'credit', amount: 1000000 }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCounterpartyLimits')
      .mockReturnValueOnce('123')
      .mockReturnValueOnce('credit');

    const result = await executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.gtreasury.com/v1/counterparties/123/limits?limit_type=credit',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'X-Tenant-ID': 'test-tenant',
      },
      json: true,
    });
  });

  it('should handle errors with continueOnFail enabled', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllCounterparties');

    const result = await executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  it('should throw errors with continueOnFail disabled', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllCounterparties');

    await expect(
      executeCounterpartyOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });
});
});
