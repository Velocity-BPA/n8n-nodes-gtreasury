# n8n-nodes-gtreasury

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with GTreasury's treasury management platform. It offers 6 resources including Cash Position, Account, Payment, Foreign Exchange, Entity, and Counterparty management, enabling comprehensive treasury operations automation within your n8n workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Treasury](https://img.shields.io/badge/Treasury-Management-green)
![Cash Management](https://img.shields.io/badge/Cash-Management-orange)
![Payments](https://img.shields.io/badge/Payments-Processing-purple)

## Features

- **Cash Position Management** - Monitor and track cash positions across multiple accounts and entities
- **Account Operations** - Create, update, and manage treasury accounts with full CRUD capabilities
- **Payment Processing** - Execute and track payments with comprehensive status monitoring
- **Foreign Exchange** - Handle FX transactions, rates, and currency conversions
- **Entity Management** - Manage corporate entities and organizational structures
- **Counterparty Operations** - Maintain counterparty relationships and transaction histories
- **Real-time Data Sync** - Keep treasury data synchronized across systems
- **Bulk Operations** - Process multiple transactions efficiently with batch operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-gtreasury`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-gtreasury
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-gtreasury.git
cd n8n-nodes-gtreasury
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-gtreasury
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your GTreasury API key for authentication | Yes |
| Server URL | GTreasury server endpoint URL | Yes |
| Environment | Production or sandbox environment | Yes |

## Resources & Operations

### 1. Cash Position

| Operation | Description |
|-----------|-------------|
| Get | Retrieve cash position details by ID |
| Get All | List all cash positions with optional filtering |
| Create | Create a new cash position record |
| Update | Update existing cash position information |
| Delete | Remove a cash position record |

### 2. Account

| Operation | Description |
|-----------|-------------|
| Get | Retrieve account details by ID |
| Get All | List all accounts with optional filtering |
| Create | Create a new treasury account |
| Update | Update existing account information |
| Delete | Remove an account record |
| Get Balance | Retrieve current account balance |

### 3. Payment

| Operation | Description |
|-----------|-------------|
| Get | Retrieve payment details by ID |
| Get All | List all payments with optional filtering |
| Create | Create a new payment transaction |
| Update | Update existing payment information |
| Delete | Cancel or remove a payment |
| Submit | Submit payment for processing |
| Get Status | Check payment processing status |

### 4. Foreign Exchange

| Operation | Description |
|-----------|-------------|
| Get | Retrieve FX transaction details by ID |
| Get All | List all FX transactions with optional filtering |
| Create | Create a new FX transaction |
| Update | Update existing FX transaction |
| Delete | Remove an FX transaction |
| Get Rates | Retrieve current exchange rates |
| Calculate | Calculate FX conversion amounts |

### 5. Entity

| Operation | Description |
|-----------|-------------|
| Get | Retrieve entity details by ID |
| Get All | List all entities with optional filtering |
| Create | Create a new entity record |
| Update | Update existing entity information |
| Delete | Remove an entity record |

### 6. Counterparty

| Operation | Description |
|-----------|-------------|
| Get | Retrieve counterparty details by ID |
| Get All | List all counterparties with optional filtering |
| Create | Create a new counterparty record |
| Update | Update existing counterparty information |
| Delete | Remove a counterparty record |
| Get Transactions | Retrieve transaction history for counterparty |

## Usage Examples

```javascript
// Get cash positions for a specific entity
{
  "resource": "cashPosition",
  "operation": "getAll",
  "filters": {
    "entityId": "ENT001",
    "currency": "USD",
    "asOfDate": "2024-01-15"
  }
}
```

```javascript
// Create a new payment transaction
{
  "resource": "payment",
  "operation": "create",
  "paymentData": {
    "amount": 50000.00,
    "currency": "USD",
    "fromAccount": "ACC001",
    "toAccount": "ACC002",
    "counterpartyId": "CP001",
    "valueDate": "2024-01-20",
    "reference": "INV-2024-001"
  }
}
```

```javascript
// Get current FX rates for currency pair
{
  "resource": "foreignExchange",
  "operation": "getRates",
  "parameters": {
    "baseCurrency": "USD",
    "targetCurrency": "EUR",
    "rateType": "spot"
  }
}
```

```javascript
// Update counterparty information
{
  "resource": "counterparty",
  "operation": "update",
  "counterpartyId": "CP001",
  "updateData": {
    "name": "Updated Counterparty Name",
    "status": "active",
    "paymentTerms": "NET30"
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Insufficient Permissions | User lacks permissions for requested operation | Contact administrator to grant required permissions |
| Record Not Found | Requested resource ID does not exist | Verify the ID exists and is accessible |
| Validation Error | Required fields missing or invalid data format | Check required fields and data types |
| Rate Limit Exceeded | Too many requests sent to API | Implement delay between requests |
| Server Error | GTreasury service temporarily unavailable | Retry request after brief delay |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-gtreasury/issues)
- **GTreasury Documentation**: [GTreasury API Documentation](https://www.gtreasury.com/developers)