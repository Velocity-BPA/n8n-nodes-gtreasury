# n8n-nodes-gtreasury

> [Velocity BPA Licensing Notice]
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with the GTreasury Treasury Management System. This node provides complete access to GTreasury's enterprise treasury capabilities including cash management, payments, foreign exchange, investments, debt management, cash forecasting, bank connectivity, and ERP integration.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)

## Features

- **21 Resource Categories** covering the complete GTreasury API surface
- **80+ Operations** for comprehensive treasury management automation
- **40+ Webhook Event Types** for real-time event-driven workflows
- **Multi-Authentication Support** (API Key, OAuth 2.0, Session Token)
- **Bank Statement Parsing** (BAI2, MT940, camt.053 formats)
- **ERP Integration** (Workday, NetSuite, Oracle, SAP, Microsoft Dynamics)
- **ClearConnect Gateway** support for bank connectivity

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-gtreasury`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n/custom
npm install n8n-nodes-gtreasury
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-gtreasury.zip
cd n8n-nodes-gtreasury

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-gtreasury

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-gtreasury %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

### GTreasury API Credentials

| Field | Description |
|-------|-------------|
| Base URL | GTreasury API endpoint (e.g., `https://api.gtreasury.com`) |
| Tenant ID | Your GTreasury tenant identifier |
| Auth Method | `apiKey`, `oauth2`, or `sessionToken` |
| API Key | Required for API Key authentication |
| Client ID | Required for OAuth 2.0 |
| Client Secret | Required for OAuth 2.0 |
| Username | Required for Session Token auth |
| Password | Required for Session Token auth |

### GTreasury ClearConnect Credentials

| Field | Description |
|-------|-------------|
| Gateway URL | ClearConnect gateway endpoint |
| Client Certificate | PEM-encoded client certificate |
| Client Key | PEM-encoded private key |
| CA Certificate | Certificate authority (optional) |

## Resources & Operations

### Cash Management
- Get Cash Position, Get Balance, List Transactions
- Create Transaction, Execute ZBA Sweep, Get Pool Balance, Reconcile Account

### Bank Accounts
- Create, Get, Update, Delete, List bank accounts
- Manage Signatories (add, remove, list)

### Bank Connectivity
- Connect/Disconnect banks, Get Connection Status
- Send/Receive Files, Get Real-time Balance
- Parse Statements (BAI2, MT940, camt.053)

### Payments
- Create, Get, Update, Delete, List payments
- Submit, Approve, Reject payments
- Batch Operations (create, submit, get status)

### Cash Forecasting
- Get/Create/Update Forecasts
- Variance Analysis, Import Data, Run Scenarios

### Investments
- Portfolio Management, Holdings, Maturities
- Record Transactions, Calculate Yield, Policy Compliance

### Debt Management
- CRUD Debt Instruments, Record Draws/Payments
- Covenant Compliance, Amortization Schedules

### Foreign Exchange (FX)
- Exposure Management, Deals, Quotes, Trading
- Hedging, Mark-to-Market, Hedge Effectiveness

### Intercompany
- Netting Runs, Invoice Management, Settlement

### ERP Integration
- GL Operations, AP/AR Sync, Field Mapping
- Reconciliation (Workday, NetSuite, Oracle, SAP, Dynamics)

### Bank Fee Analysis
- Fee Summary, Service Charges, Bank Comparison
- Trend Analysis, AFP Import

### Entity Management
- CRUD Entities, Hierarchy Management

### Counterparty Management
- CRUD Counterparties, Credit Ratings, Exposure Management

### Reporting
- Generate Reports, Schedules, Templates
- Dashboards, Export, History

### Workflow Management
- Task Management, Approvals, Reassignment
- Escalation, Rules, Delegations

### User Management
- User CRUD, Roles, Permissions, Groups, Activity Tracking

### Audit
- Audit Trail, Compliance Reports, Data Access Logs
- Retention Policies, Reconciliation Logs

### Market Data
- FX Rates, Interest Rates, Yield Curves
- Commodities, Credit Spreads, Volatility, Subscriptions

### Risk Management
- Exposure Analysis, VaR Calculation, Counterparty Risk
- Stress Testing, Limits, Scenarios, Sensitivity Analysis

### GSmart AI
- Forecasting, Anomaly Detection, Recommendations
- Pattern Analysis, Optimization, Model Training

### Utility
- System Status, Validation (Bank Account, IBAN)
- Currency Conversion, Business Days, SWIFT Lookup

## Trigger Node

The **GTreasury Trigger** node supports 40+ webhook event types:

- **Cash Events**: balance_updated, transaction_created, position_changed
- **Payment Events**: created, approved, rejected, executed, failed
- **FX Events**: deal_created, deal_executed, rate_alert
- **Investment Events**: maturity_approaching, transaction_recorded
- **Debt Events**: payment_due, covenant_breach
- **Bank Events**: statement_received, connection_status_changed
- **Forecast Events**: variance_detected, forecast_updated
- **And many more...**

## Usage Examples

### Get Cash Position
```javascript
// Configure GTreasury node
Resource: Cash Management
Operation: Get Cash Position
Entity ID: "CORP-001"
As Of Date: "2024-01-15"
Include Forecasted: true
```

### Create Payment
```javascript
// Configure GTreasury node
Resource: Payment
Operation: Create Payment
Payment Type: "wire"
Amount: 50000
Currency: "USD"
Beneficiary Account: "123456789"
Value Date: "2024-01-20"
```

### Parse Bank Statement
```javascript
// Configure GTreasury node
Resource: Bank Connectivity
Operation: Parse Statement
Format: "BAI2"
Statement Data: {{ $json.statementContent }}
```

## Error Handling

The node includes comprehensive error handling:

- **Authentication Errors**: Token refresh for OAuth 2.0
- **Rate Limiting**: Automatic retry with backoff
- **Validation Errors**: Detailed field-level error messages
- **Network Errors**: Connection retry logic

## Security Best Practices

1. Store credentials securely using n8n's credential management
2. Use OAuth 2.0 when available for enhanced security
3. Rotate API keys regularly
4. Use minimum required permissions for service accounts
5. Enable audit logging in GTreasury
6. Use ClearConnect with mTLS for bank connectivity

## Development

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Build the project
npm run build

# Watch mode for development
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- **Documentation**: [GTreasury API Docs](https://docs.gtreasury.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-gtreasury/issues)
- **Commercial Support**: licensing@velobpa.com

## Acknowledgments

- [GTreasury](https://gtreasury.com) for their comprehensive treasury management platform
- [n8n](https://n8n.io) for the workflow automation framework
- The n8n community for inspiration and support
