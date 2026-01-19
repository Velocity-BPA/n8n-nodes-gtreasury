# Contributing to n8n-nodes-gtreasury

Thank you for your interest in contributing to n8n-nodes-gtreasury! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- Git
- A GTreasury sandbox account (for integration testing)

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/n8n-nodes-gtreasury.git
   cd n8n-nodes-gtreasury
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the project**

   ```bash
   npm run build
   ```

4. **Run tests**

   ```bash
   npm test
   ```

### Local Development with n8n

1. **Link the package**

   ```bash
   npm link
   ```

2. **In your n8n installation directory**

   ```bash
   npm link n8n-nodes-gtreasury
   ```

3. **Start n8n**

   ```bash
   n8n start
   ```

## Making Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or updates

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(payment): add support for SEPA payments
fix(fx): correct currency pair parsing for exotic pairs
docs(readme): add webhook configuration examples
```

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code

### Testing

- Write unit tests for new functionality
- Ensure all existing tests pass
- Add integration tests for API interactions (when possible)

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx jest test/unit/nodes.test.ts
```

## Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Run quality checks**

   ```bash
   npm run lint
   npm run typecheck
   npm test
   ```

4. **Push and create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Fill out the PR template**
   - Describe your changes
   - Link related issues
   - Add screenshots if UI changes

### PR Review Criteria

- Code follows project style guidelines
- All tests pass
- No decrease in test coverage
- Documentation updated (if applicable)
- No security vulnerabilities introduced
- License headers present on new files

## Adding New Features

### Adding a New Resource

1. Create the action file in `nodes/GTreasury/actions/[resource]/index.ts`
2. Add resource option to `GTreasury.node.ts`
3. Add operation options with displayOptions
4. Add required parameter definitions
5. Update endpoints in `constants/endpoints.ts`
6. Add unit tests
7. Update README with new operations

### Adding a New Event Type

1. Add event to `GTreasuryTrigger.node.ts` eventType options
2. Update webhook creation to include new event
3. Add filter options if needed
4. Document in README

### Adding Constants

1. Add to appropriate file in `constants/`
2. Export from the constants index
3. Use in node/action files
4. Add tests for new constants

## Documentation

### Code Documentation

- Add JSDoc comments to functions and classes
- Document complex logic with inline comments
- Keep README and CHANGELOG updated

### API Documentation

When adding new operations:
- Document required vs optional parameters
- Provide example payloads
- Note any rate limits or restrictions

## Reporting Issues

### Bug Reports

Include:
- n8n version
- Node package version
- Steps to reproduce
- Expected vs actual behavior
- Error messages/logs

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative approaches considered

## Security

- Never commit credentials or secrets
- Report security vulnerabilities privately
- Follow secure coding practices

## License

By contributing, you agree that your contributions will be licensed under the BSL 1.1 license.

## Questions?

- Open a GitHub Discussion for general questions
- Use Issues for bugs and feature requests
- Email licensing@your-domain.com for licensing questions

Thank you for contributing! 🎉
