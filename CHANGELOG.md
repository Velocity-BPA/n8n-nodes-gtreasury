# Changelog

All notable changes to n8n-nodes-gtreasury will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

#### Core Infrastructure
- GTreasury API credentials with OAuth2 authentication
- GTreasury ClearConnect credentials for bank connectivity
- Comprehensive API client with token refresh and error handling
- ClearConnect client for secure bank communications
- ERP connector framework for multi-system integration

#### GTreasury Node (21 Resources)
- **Cash Management**: Cash position, balances, transactions, ZBA sweeps, pooling, reconciliation
- **Bank Accounts**: Full CRUD operations, signatory management
- **Payments**: Create, approve, reject, submit payments; batch operations
- **Bank Connectivity**: ClearConnect integration, statement download/parsing (BAI2, MT940, camt.053)
- **Cash Forecasting**: Forecasts, variance analysis, scenario modeling
- **Investment Management**: Portfolio tracking, yield calculations, compliance monitoring
- **Debt Management**: Debt instruments, draws, payments, covenant tracking
- **FX (Foreign Exchange)**: Exposure monitoring, deal management, hedging, MTM calculations
- **Intercompany**: Netting cycles, invoice matching, settlements
- **ERP Integration**: GL posting, AP/AR sync, account mapping, reconciliation
- **Bank Fee Analysis**: Fee tracking, bank comparison, trend analysis, AFP import
- **Entity Management**: Entity hierarchy and configuration
- **Counterparty Management**: Credit limits, ratings, exposure tracking
- **Reporting**: Report generation, scheduling, export
- **Workflow**: Task management, approvals, escalation
- **User Management**: User CRUD, role assignment, permissions
- **Audit**: Audit logs, change history, access reporting
- **Market Data**: Exchange rates, interest rates, yield curves
- **Risk Management**: VaR, stress testing, limit monitoring
- **GSmart AI**: AI-powered forecasting, anomaly detection, recommendations
- **Utilities**: System status, data validation, currency conversion

#### GTreasury Trigger Node
- Webhook-based event triggers
- 40+ event types across all functional areas
- Event filtering by entity, account, currency, amount, status, bank, user
- HMAC-SHA256 signature verification
- Configurable retry logic

#### Supporting Features
- Comprehensive constants for banks, currencies, payment types, ERP systems
- Statement parser utility for BAI2, MT940, camt.053 formats
- Authentication utilities with token management
- Full TypeScript support with type definitions

#### Documentation & Licensing
- Comprehensive README with usage examples
- BSL 1.1 license with commercial licensing options
- Licensing FAQ and commercial license documentation
- Complete API documentation

### Technical Details
- n8n API version 1 compatibility
- Node.js 18+ required
- TypeScript 5.4+ for development
- Jest test framework with unit and integration tests
- ESLint configuration for code quality

## [Unreleased]

### Planned
- Additional statement format support (CAMT.052, SWIFT MT942)
- Enhanced AI/ML model training capabilities
- Real-time market data streaming
- Advanced reporting templates
- Multi-tenant support improvements

---

## Version History

| Version | Release Date | n8n Compatibility | Notes |
|---------|--------------|-------------------|-------|
| 1.0.0   | 2024-01-15   | 1.0.0+           | Initial release |

## License Conversion Schedule

Under BSL 1.1, versions convert to Apache 2.0 after 4 years:

| Version | BSL 1.1 Until | Apache 2.0 From |
|---------|---------------|-----------------|
| 1.0.0   | 2028-01-15    | 2028-01-16      |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Support

- Issues: [GitHub Issues](https://github.com/your-org/n8n-nodes-gtreasury/issues)
- Discussions: [GitHub Discussions](https://github.com/your-org/n8n-nodes-gtreasury/discussions)
- Commercial: licensing@your-domain.com
